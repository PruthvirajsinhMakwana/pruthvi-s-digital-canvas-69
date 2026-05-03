import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

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

    const systemPrompt = `You are an expert blog editor and SEO writer. Take the user's raw blog content and return a polished, well-structured HTML version optimized for readability and SEO.

STRICT RULES:
- Output ONLY clean semantic HTML (no markdown, no <html>/<body>/<head> wrappers, no code fences).
- Preserve the original meaning, facts, language, and tone. Do NOT invent new facts.
- Fix grammar, spelling, spacing, and punctuation.
- Structure with proper heading hierarchy: a single <h1> for the main title (only if not already provided), then <h2> for major sections, <h3> for sub-sections.
- Break long paragraphs into shorter, scannable ones (2-4 sentences each).
- Use <strong> to highlight key terms, important phrases, and takeaways.
- Use <em> for emphasis where natural.
- Convert lists into <ul>/<ol> with <li> items where appropriate.
- Where the content compares items, lists specs, features, or step-by-step data, AUTOMATICALLY create well-formatted <table> elements with <thead>, <tbody>, <tr>, <th>, <td>. Tables MUST have meaningful headers.
- Use <blockquote> for notable quotes or callouts.
- Add a short conclusion section if missing.
- Allowed tags only: h1, h2, h3, h4, p, br, hr, strong, em, u, s, ul, ol, li, blockquote, code, pre, table, thead, tbody, tr, th, td, mark, a.
- Do NOT include <script>, <style>, inline event handlers, or external images.`;

    const userPrompt = `Title: ${title || "(untitled)"}\n\nRaw content:\n${content}\n\nReturn the optimized HTML only.`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
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
    // Strip accidental code fences
    optimized = optimized.trim().replace(/^```(?:html)?\s*/i, "").replace(/\s*```$/i, "").trim();

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
