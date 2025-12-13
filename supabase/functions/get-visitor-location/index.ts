import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP from headers (Supabase forwards the real IP)
    const forwarded = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const cfConnectingIp = req.headers.get('cf-connecting-ip');
    
    // Use the first available IP
    let clientIp = cfConnectingIp || realIp || (forwarded ? forwarded.split(',')[0].trim() : null);
    
    console.log('IP Detection:', { forwarded, realIp, cfConnectingIp, clientIp });
    
    if (!clientIp || clientIp === '127.0.0.1' || clientIp === '::1') {
      // For local development or if IP not available
      return new Response(JSON.stringify({
        ip: clientIp || 'unknown',
        country: 'Unknown',
        city: 'Unknown',
        region: 'Unknown',
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Use ip-api.com (free, no API key required, 45 requests per minute limit)
    const geoResponse = await fetch(`http://ip-api.com/json/${clientIp}?fields=status,country,regionName,city,query`);
    const geoData = await geoResponse.json();
    
    console.log('Geolocation response:', geoData);

    if (geoData.status === 'success') {
      return new Response(JSON.stringify({
        ip: geoData.query || clientIp,
        country: geoData.country || 'Unknown',
        city: geoData.city || 'Unknown',
        region: geoData.regionName || 'Unknown',
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({
        ip: clientIp,
        country: 'Unknown',
        city: 'Unknown',
        region: 'Unknown',
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error: unknown) {
    console.error('Error in get-visitor-location:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ 
      error: errorMessage,
      ip: 'unknown',
      country: 'Unknown',
      city: 'Unknown',
      region: 'Unknown',
    }), {
      status: 200, // Return 200 with fallback data to not break tracking
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
