const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { content, title } = await req.json();
    if (!content || typeof content !== "string") {
      return new Response(JSON.stringify({ error: "content is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `You are an expert blog editor, SEO specialist, and content designer. Transform the user's raw blog content into a beautifully structured, highly readable, SEO-optimized HTML article.

STRICT OUTPUT RULES:
- Output ONLY clean semantic HTML. No markdown, no code fences, no <html>/<body>/<head> wrappers.
- Preserve original meaning, facts, language, and tone. Do NOT invent new facts.
- Fix grammar, spelling, spacing, capitalization, and punctuation.

STRUCTURE & FORMATTING:
- Use a single <h1> only if the article has no title; otherwise start with <h2> for major sections.
- Use <h2> for main sections and <h3> for sub-sections. Maintain a clean hierarchy.
- Add an introduction paragraph at the top and a clear "Conclusion" or "Key Takeaways" section at the end.
- Break long paragraphs into short, scannable ones (2-4 sentences each). Add proper spacing between elements.
- Convert any series of items, steps, tips, pros/cons, or features into <ul> or <ol> with <li> bullet/numbered points. Be generous with bullet points wherever they improve readability.
- Where the content compares items, lists specs, features, pricing, timelines, or step-by-step data, AUTOMATICALLY create well-formatted <table> elements with <thead>, <tbody>, <tr>, <th>, <td> and meaningful headers.
- Use <strong> to highlight key terms, important phrases, stats, and takeaways throughout.
- Use <em> for subtle emphasis where natural.
- Use <blockquote> for notable quotes, tips, or callouts.
- Use <hr> sparingly to separate major sections when helpful.

SEO:
- Ensure headings are keyword-rich but natural.
- Keep paragraphs concise for readability.
- Add descriptive anchor text for any links.

ALLOWED TAGS ONLY: h1, h2, h3, h4, p, br, hr, strong, em, u, s, ul, ol, li, blockquote, code, pre, table, thead, tbody, tr, th, td, mark, a.
DO NOT include <script>, <style>, inline event handlers, or external images.`;

    const userPrompt = `Title: ${title || "(untitled)"}\n\nRaw content (may include HTML):\n${content}\n\nReturn ONLY the optimized HTML.`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!resp.ok) {
      const txt = await resp.text();
      console.error("AI gateway error", resp.status, txt);
      if (resp.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (resp.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Add credits in Settings → Workspace → Usage." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await resp.json();
    let optimized: string = data?.choices?.[0]?.message?.content ?? "";
    optimized = optimized.trim()
      .replace(/^```(?:html)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    return new Response(JSON.stringify({ content: optimized }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("optimize-blog-content error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
