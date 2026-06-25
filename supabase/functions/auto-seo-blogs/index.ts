import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );
  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')!;

  // Posts updated in last 24h OR with missing meta
  const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('id,title,slug,content,excerpt,tags,meta_title,meta_description,meta_keywords,updated_at')
    .eq('status', 'published')
    .or(`updated_at.gte.${since},meta_description.is.null,meta_title.is.null`)
    .limit(20);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }

  const results: any[] = [];
  for (const p of posts || []) {
    try {
      const prompt = `You are an SEO expert. Generate optimized SEO metadata for this blog post. Return STRICT JSON only with keys: meta_title (max 60 chars, keyword-rich), meta_description (max 155 chars, compelling), meta_keywords (comma-separated 8-12 keywords), tags (array of 5-8 short tags).

Title: ${p.title}
Excerpt: ${p.excerpt || ''}
Content (truncated): ${(p.content || '').replace(/<[^>]+>/g, ' ').slice(0, 2500)}`;

      const aiRes = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'system', content: 'Return only valid minified JSON. No markdown.' },
            { role: 'user', content: prompt },
          ],
        }),
      });
      if (!aiRes.ok) throw new Error(`AI ${aiRes.status}`);
      const ai = await aiRes.json();
      let text = ai.choices?.[0]?.message?.content?.trim() || '{}';
      text = text.replace(/^```json\s*|\s*```$/g, '');
      const meta = JSON.parse(text);

      await supabase
        .from('blog_posts')
        .update({
          meta_title: meta.meta_title?.slice(0, 60) || p.meta_title,
          meta_description: meta.meta_description?.slice(0, 160) || p.meta_description,
          meta_keywords: meta.meta_keywords || p.meta_keywords,
          tags: Array.isArray(meta.tags) && meta.tags.length ? meta.tags : p.tags,
        })
        .eq('id', p.id);

      results.push({ id: p.id, slug: p.slug, status: 'optimized' });
    } catch (e) {
      results.push({ id: p.id, slug: p.slug, status: 'error', error: String(e) });
    }
  }

  // Log run
  const log = {
    ran_at: new Date().toISOString(),
    processed: results.length,
    success: results.filter((r) => r.status === 'optimized').length,
    results,
  };
  await supabase
    .from('site_settings')
    .upsert({ key: 'auto_seo_log', value: log }, { onConflict: 'key' });

  return new Response(JSON.stringify(log), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
