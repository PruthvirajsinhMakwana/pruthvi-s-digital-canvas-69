import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const telegramBotToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    const telegramChatId = Deno.env.get('TELEGRAM_CHAT_ID');

    // Authenticate the user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.log('Missing authorization header');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create client with user's auth token to verify identity
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: userError } = await supabaseAuth.auth.getUser();
    if (userError || !user) {
      console.log('Invalid user:', userError?.message);
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check admin role using service role client
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (roleError || !roleData) {
      console.log('User is not admin:', user.id);
      return new Response(JSON.stringify({ error: 'Forbidden - Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Admin access verified for user:', user.id);

    if (!telegramBotToken || !telegramChatId) {
      console.log('Telegram credentials not configured');
      return new Response(JSON.stringify({ error: 'Telegram not configured' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get current hour stats
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

    // Count views in last hour
    const { count: lastHourViews } = await supabase
      .from('page_views')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', oneHourAgo.toISOString());

    // Count views in previous hour (for comparison)
    const { count: prevHourViews } = await supabase
      .from('page_views')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', twoHoursAgo.toISOString())
      .lt('created_at', oneHourAgo.toISOString());

    // Get today's total
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const { count: todayViews } = await supabase
      .from('page_views')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', todayStart.toISOString());

    // Get unique visitors today
    const { data: uniqueData } = await supabase
      .from('page_views')
      .select('visitor_ip')
      .gte('created_at', todayStart.toISOString())
      .not('visitor_ip', 'is', null);

    const uniqueVisitors = new Set(uniqueData?.map(v => v.visitor_ip)).size;

    // Get unique IPs with location
    const { data: locationData } = await supabase
      .from('page_views')
      .select('real_ip, country, city')
      .gte('created_at', oneHourAgo.toISOString())
      .not('real_ip', 'is', null)
      .neq('real_ip', 'unknown');

    const recentIps = [...new Set(locationData?.map(v => `${v.real_ip} (${v.city || 'Unknown'}, ${v.country || 'Unknown'})`))].slice(0, 5);

    // Check for traffic spike (more than 3x the previous hour or more than 10 in an hour)
    const currentViews = lastHourViews || 0;
    const previousViews = prevHourViews || 0;
    const isSpike = (previousViews > 0 && currentViews >= previousViews * 3) || currentViews >= 10;

    let alertMessage = '';
    
    if (isSpike) {
      alertMessage = `🚨 *Traffic Spike Alert\\!*\n\n`;
      alertMessage += `📈 *Last Hour:* ${currentViews} views\n`;
      alertMessage += `📉 *Previous Hour:* ${previousViews} views\n`;
      alertMessage += `📊 *Today Total:* ${todayViews || 0} views\n`;
      alertMessage += `👥 *Unique Visitors Today:* ${uniqueVisitors}\n\n`;
      
      if (recentIps.length > 0) {
        alertMessage += `🌐 *Recent IPs:*\n`;
        recentIps.forEach(ip => {
          alertMessage += `• ${ip.replace(/[.*+?^${}()|[\]\\-]/g, '\\$&')}\n`;
        });
      }
      
      alertMessage += `\n⏰ *Time:* ${now.toLocaleString()}`;
    }

    // If manual trigger, always send summary
    const { manual } = await req.json().catch(() => ({ manual: false }));
    
    if (manual && !isSpike) {
      alertMessage = `📊 *Traffic Summary*\n\n`;
      alertMessage += `📈 *Last Hour:* ${currentViews} views\n`;
      alertMessage += `📉 *Previous Hour:* ${previousViews} views\n`;
      alertMessage += `📊 *Today Total:* ${todayViews || 0} views\n`;
      alertMessage += `👥 *Unique Visitors Today:* ${uniqueVisitors}\n\n`;
      
      if (recentIps.length > 0) {
        alertMessage += `🌐 *Recent IPs:*\n`;
        recentIps.forEach(ip => {
          alertMessage += `• ${ip.replace(/[.*+?^${}()|[\]\\-]/g, '\\$&')}\n`;
        });
      }
      
      alertMessage += `\n✅ No unusual activity detected\\.`;
      alertMessage += `\n⏰ *Time:* ${now.toLocaleString().replace(/[.*+?^${}()|[\]\\-]/g, '\\$&')}`;
    }

    if (alertMessage) {
      const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
      const telegramResponse = await fetch(telegramUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: alertMessage,
          parse_mode: 'MarkdownV2',
        }),
      });

      const telegramResult = await telegramResponse.json();
      console.log('Telegram response:', telegramResult);

      return new Response(JSON.stringify({ 
        success: true, 
        alertSent: true,
        stats: {
          lastHour: currentViews,
          prevHour: previousViews,
          todayTotal: todayViews,
          uniqueVisitors,
          isSpike,
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      alertSent: false,
      message: 'No alert triggered - traffic is normal',
      stats: {
        lastHour: currentViews,
        prevHour: previousViews,
        todayTotal: todayViews,
        uniqueVisitors,
        isSpike,
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('Error in check-traffic-alerts:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
