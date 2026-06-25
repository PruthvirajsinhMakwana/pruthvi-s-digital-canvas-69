import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const SITE = 'https://pruthvirajsinh.in/';
const GATEWAY = 'https://connector-gateway.lovable.dev/google_search_console';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  const GSC_KEY = Deno.env.get('GOOGLE_SEARCH_CONSOLE_API_KEY');

  if (!LOVABLE_API_KEY || !GSC_KEY) {
    return new Response(JSON.stringify({ connected: false, error: 'GSC not connected' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  }

  const headers = {
    Authorization: `Bearer ${LOVABLE_API_KEY}`,
    'X-Connection-Api-Key': GSC_KEY,
    'Content-Type': 'application/json',
  };

  try {
    // List sites
    const sitesRes = await fetch(`${GATEWAY}/webmasters/v3/sites`, { headers });
    const sitesData = await sitesRes.json();
    const site = sitesData?.siteEntry?.find((s: any) => s.siteUrl === SITE);

    // Top queries last 7 days
    const end = new Date().toISOString().slice(0, 10);
    const start = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
    const qRes = await fetch(
      `${GATEWAY}/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({ startDate: start, endDate: end, dimensions: ['query'], rowLimit: 10 }),
      },
    );
    const queries = await qRes.json();

    // Inspect homepage
    const inspectRes = await fetch(`${GATEWAY}/v1/urlInspection/index:inspect`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ inspectionUrl: SITE, siteUrl: SITE }),
    });
    const inspect = await inspectRes.json();
    const indexStatus = inspect?.inspectionResult?.indexStatusResult;

    return new Response(
      JSON.stringify({
        connected: true,
        site_verified: !!site,
        permission: site?.permissionLevel || null,
        last_crawl: indexStatus?.lastCrawlTime || null,
        coverage: indexStatus?.coverageState || null,
        verdict: indexStatus?.verdict || null,
        top_queries: (queries?.rows || []).map((r: any) => ({
          query: r.keys?.[0],
          clicks: r.clicks,
          impressions: r.impressions,
          ctr: r.ctr,
          position: r.position,
        })),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (e) {
    return new Response(JSON.stringify({ connected: true, error: String(e) }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  }
});
