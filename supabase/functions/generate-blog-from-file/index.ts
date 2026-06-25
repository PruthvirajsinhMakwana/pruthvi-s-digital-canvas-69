const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SYSTEM_PROMPT = `You are an elite blog writer, editor, and SEO specialist. Read the user's uploaded source material (PDF, image, or plain text) and transform it into a complete, professionally formatted, publication-ready blog article.

Return ONLY a JSON object with EXACTLY this shape (no markdown fences, no commentary):
{
  "title": string,            // catchy, SEO-friendly, <= 70 chars, includes the primary keyword
  "slug": string,             // lowercase-kebab-case, <= 60 chars, derived from title
  "excerpt": string,          // 1-2 sentence hook, 120-200 chars
  "tags": string[],           // 5-8 relevant lowercase tags
  "meta_title": string,       // <= 60 chars, includes primary keyword
  "meta_description": string, // 140-160 chars, compelling, includes primary keyword
  "meta_keywords": string,    // 6-10 comma separated keywords
  "content": string           // FULL HTML body (see rules below) — MINIMUM 800 words
}

EVERY FIELD IS REQUIRED. Never return empty strings. If the source is thin, EXPAND with general industry knowledge but stay on-topic and accurate.

CONTENT (HTML) RULES — be GENEROUS with structure, spacing, and formatting:
- Output clean semantic HTML only. NO <html>/<body>/<head>, NO markdown, NO code fences, NO inline styles.
- Open with a strong 2-3 sentence introduction <p> that hooks the reader and states what they'll learn.
- Follow with a "Table of Contents" <h2> + <ul> of anchor-style bullet links to the main <h2> sections (plain text, no <a> hrefs needed).
- Use <h2> for main sections (5-8 of them) and <h3> for sub-sections. Build a clear, scannable hierarchy.
- Keep paragraphs SHORT (2-4 sentences). Insert a blank line between every block element for breathing room.
- Use <ul>/<ol> + <li> liberally for steps, tips, features, pros/cons, checklists, key points.
- Bold key terms, stats, names, and takeaways with <strong> in EVERY section.
- Use <em> for subtle emphasis. Use <mark> to highlight 1-2 critical insights per section.
- Use <blockquote> for notable quotes, callouts, or "💡 Pro Tip" / "⚠️ Warning" boxes.
- AUTOMATICALLY build at least ONE polished comparison <table> with <thead>/<tbody>/<tr>/<th>/<td> when the topic involves comparisons, specs, pricing, timelines, pros/cons, or feature lists. Give it a meaningful caption-style <h3> heading above.
- Use <hr> to visually separate the intro, body, and conclusion.
- Include a "Key Takeaways" <h2> near the end with 4-6 <ul> bullets summarizing the article.
- End with a "Conclusion" <h2> paragraph + a clear call-to-action paragraph inviting the reader to engage.
- Preserve facts, numbers, and names from the source. Do NOT invent data. Fix grammar, spelling, spacing.
- ALLOWED TAGS: h2,h3,h4,p,br,hr,strong,em,u,s,ul,ol,li,blockquote,code,pre,table,thead,tbody,tr,th,td,mark,a.
- DO NOT include <script>, <style>, inline event handlers, <img>, or <iframe>.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { fileData, mimeType, fileName, extraInstructions } = await req.json();
    if (!fileData || !mimeType) {
      return new Response(JSON.stringify({ error: "fileData and mimeType are required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const userParts: any[] = [
      {
        type: "text",
        text: `Source file: ${fileName || "(unnamed)"}\n${extraInstructions ? `Additional instructions: ${extraInstructions}\n` : ""}\nAnalyze the attached content thoroughly and produce the JSON blog object as specified.`,
      },
    ];

    if (mimeType.startsWith("image/")) {
      userParts.push({
        type: "image_url",
        image_url: { url: `data:${mimeType};base64,${fileData}` },
      });
    } else if (mimeType === "text/plain" || mimeType === "text/markdown") {
      // Decode plain text and inline it
      const decoded = atob(fileData);
      userParts[0].text += `\n\n--- FILE CONTENT ---\n${decoded}\n--- END ---`;
    } else {
      // PDF and other documents
      userParts.push({
        type: "file",
        file: {
          filename: fileName || "source.pdf",
          file_data: `data:${mimeType};base64,${fileData}`,
        },
      });
    }

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userParts },
        ],
        response_format: { type: "json_object" },
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
      return new Response(JSON.stringify({ error: `AI gateway error: ${txt}` }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await resp.json();
    let raw: string = data?.choices?.[0]?.message?.content ?? "";
    raw = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      console.error("JSON parse failed", raw.slice(0, 500));
      return new Response(JSON.stringify({ error: "AI returned invalid JSON" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Derive sensible fallbacks so the editor never gets empty SEO fields
    const stripHtml = (s: string) => String(s || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const slugify = (s: string) => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
    const title = String(parsed.title || fileName?.replace(/\.[^.]+$/, "") || "Untitled Blog Post").trim();
    const contentText = stripHtml(parsed.content || "");
    const firstSentence = contentText.split(/(?<=[.!?])\s/)[0] || contentText.slice(0, 180);

    parsed.title = title;
    parsed.slug = parsed.slug ? slugify(parsed.slug) : slugify(title);
    parsed.excerpt = parsed.excerpt?.trim() || firstSentence.slice(0, 200);
    parsed.meta_title = (parsed.meta_title?.trim() || title).slice(0, 60);
    parsed.meta_description = (parsed.meta_description?.trim() || parsed.excerpt).slice(0, 160);
    parsed.tags = Array.isArray(parsed.tags) && parsed.tags.length
      ? parsed.tags.map((t: string) => String(t).toLowerCase().trim()).filter(Boolean).slice(0, 10)
      : title.toLowerCase().split(/\s+/).filter((w) => w.length > 3).slice(0, 6);
    parsed.meta_keywords = parsed.meta_keywords?.trim() || parsed.tags.join(", ");
    parsed.content = String(parsed.content || `<p>${contentText || "No content extracted."}</p>`);

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-blog-from-file error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
