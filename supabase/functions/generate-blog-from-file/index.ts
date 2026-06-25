const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SYSTEM_PROMPT = `You are an elite blog writer, editor, and SEO specialist. Read the user's uploaded source material (which may be a PDF, image, or plain text) and transform it into a complete, professionally formatted, publication-ready blog article.

Return ONLY a JSON object with EXACTLY this shape (no markdown fences, no commentary):
{
  "title": string,            // catchy, SEO-friendly, <= 70 chars
  "slug": string,             // lowercase-kebab-case, <= 60 chars
  "excerpt": string,          // 1-2 sentence hook, <= 200 chars
  "tags": string[],           // 4-8 relevant lowercase tags
  "meta_title": string,       // <= 60 chars
  "meta_description": string, // <= 160 chars
  "meta_keywords": string,    // comma separated
  "content": string           // FULL HTML body (see rules below)
}

CONTENT (HTML) RULES — be GENEROUS with structure and formatting:
- Output clean semantic HTML. NO <html>/<body>/<head>, NO markdown, NO code fences.
- Start with a strong introduction <p> that hooks the reader.
- Use <h2> for main sections, <h3> for sub-sections. Build a clear, scannable hierarchy.
- Break content into SHORT paragraphs (2-4 sentences). Add plenty of whitespace.
- Use <ul>/<ol> + <li> liberally for steps, tips, features, pros/cons, key points.
- Use <strong> on key terms, stats, names, and takeaways throughout EVERY section.
- Use <em> for subtle emphasis. Use <mark> to highlight critical insights.
- Use <blockquote> for notable quotes, callouts, or "Pro Tip" boxes.
- Whenever the source compares items, lists specs/features/pricing/timelines, or has step-by-step data, AUTOMATICALLY build a polished <table> with <thead>/<tbody>/<tr>/<th>/<td> and meaningful headers.
- Add a "Key Takeaways" <h2> section near the end with a bulleted summary.
- End with a "Conclusion" <h2> and a clear call-to-action paragraph.
- Use <hr> to separate major sections where it improves readability.
- Preserve facts, numbers, names from the source. Do NOT invent data. Fix grammar, spelling, spacing.
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
        model: "google/gemini-2.5-flash",
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
