import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

const SITE_URL = 'https://pruthvirajsinh.in/';
const SITEMAP_URL = 'https://pruthvirajsinh.in/sitemap.xml';
const GATEWAY = 'https://connector-gateway.lovable.dev/google_search_console';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  const GSC_KEY = Deno.env.get('GOOGLE_SEARCH_CONSOLE_API_KEY');
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const ranAt = new Date().toISOString();
  const result: any = { ran_at: ranAt, sitemap_url: SITEMAP_URL };

  try {
    if (!LOVABLE_API_KEY || !GSC_KEY) {
      throw new Error('Google Search Console connection is not configured');
    }

    // Count URLs in sitemap
    let urlCount = 0;
    try {
      const sr = await fetch(SITEMAP_URL, { cache: 'no-store' });
      const txt = await sr.text();
      urlCount = (txt.match(/<loc>/g) || []).length;
    } catch (_) {}
    result.url_count = urlCount;

    const feedpath = encodeURIComponent(SITEMAP_URL);
    const site = encodeURIComponent(SITE_URL);
    const submitUrl = `${GATEWAY}/webmasters/v3/sites/${site}/sitemaps/${feedpath}`;

    const submitRes = await fetch(submitUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'X-Connection-Api-Key': GSC_KEY,
      },
    });

    result.status = submitRes.status;
    result.success = submitRes.ok;
    if (!submitRes.ok) {
      result.error = (await submitRes.text()).slice(0, 500);
    }

    // Fetch sitemap metadata back from GSC
    try {
      const metaRes = await fetch(submitUrl, {
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          'X-Connection-Api-Key': GSC_KEY,
        },
      });
      if (metaRes.ok) {
        const meta = await metaRes.json();
        result.last_submitted = meta.lastSubmitted;
        result.last_downloaded = meta.lastDownloaded;
        result.is_pending = meta.isPending;
        result.warnings = meta.warnings;
        result.errors = meta.errors;
      }
    } catch (_) {}
  } catch (e: any) {
    result.success = false;
    result.error = String(e?.message || e);
  }

  await supabase
    .from('site_settings')
    .upsert({ key: 'sitemap_submit_log', value: result }, { onConflict: 'key' });

  return new Response(JSON.stringify(result), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  });
});
