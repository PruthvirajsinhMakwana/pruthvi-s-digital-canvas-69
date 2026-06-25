import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const rawPath = typeof body.page_path === "string" ? body.page_path : "/";
    const page_path = rawPath.slice(0, 512);
    const rawReferrer = typeof body.referrer === "string" ? body.referrer : null;
    const referrer = rawReferrer ? rawReferrer.slice(0, 1024) : null;
    const rawVisitor = typeof body.visitor_id === "string" ? body.visitor_id : null;
    // Only accept a UUID-ish visitor_id, else null
    const visitor_ip = rawVisitor && /^[0-9a-f-]{8,64}$/i.test(rawVisitor) ? rawVisitor : null;

    // Server-derived fields — never trusted from the client
    const user_agent = (req.headers.get("user-agent") || "").slice(0, 512) || null;
    const fwd = req.headers.get("x-forwarded-for");
    const real_ip =
      req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-real-ip") ||
      (fwd ? fwd.split(",")[0].trim() : null);

    let country: string | null = null;
    let city: string | null = null;
    let region: string | null = null;
    if (real_ip && real_ip !== "127.0.0.1" && real_ip !== "::1") {
      try {
        const geo = await fetch(
          `http://ip-api.com/json/${real_ip}?fields=status,country,regionName,city`
        );
        const g = await geo.json();
        if (g.status === "success") {
          country = g.country || null;
          city = g.city || null;
          region = g.regionName || null;
        }
      } catch (e) {
        console.error("geo lookup failed", e);
      }
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { error } = await supabase.from("page_views").insert({
      page_path,
      referrer,
      user_agent,
      visitor_ip,
      real_ip,
      country,
      city,
      region,
    });

    if (error) {
      console.error("insert page_view error", error);
      return new Response(JSON.stringify({ ok: false, error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("track-page-view error", e);
    return new Response(JSON.stringify({ ok: false }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
