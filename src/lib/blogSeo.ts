import { htmlToText } from './sanitize';
import { extractFaqs, wordCount } from './blogUtils';

export interface SeoCheck {
  id: string;
  label: string;
  status: 'good' | 'warn' | 'bad';
  message: string;
  weight: number;
}

export interface SeoInput {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  seoTitle: string;
  metaDescription: string;
  focusKeyword: string;
  secondaryKeywords: string[];
  featuredImage: string;
  canonicalUrl: string;
  robotsIndex: boolean;
}

export interface SeoReport {
  score: number;
  checks: SeoCheck[];
  words: number;
  keywordDensity: number;
  intent: string;
  internalLinks: number;
  externalLinks: number;
  images: number;
  imagesWithAlt: number;
}

const check = (
  id: string,
  label: string,
  weight: number,
  status: SeoCheck['status'],
  message: string,
): SeoCheck => ({ id, label, weight, status, message });

const countOccurrences = (text: string, phrase: string) => {
  if (!phrase) return 0;
  const escaped = phrase.trim().toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (!escaped) return 0;
  return (text.toLowerCase().match(new RegExp(escaped, 'g')) || []).length;
};

const detectIntent = (title: string, keyword: string): string => {
  const t = `${title} ${keyword}`.toLowerCase();
  if (/\b(buy|price|cost|hire|pricing|package|near me)\b/.test(t)) return 'Commercial / transactional';
  if (/\b(how|guide|tutorial|what|why|tips|checklist|steps)\b/.test(t)) return 'Informational';
  if (/\b(best|top|vs|compare|review|alternatives)\b/.test(t)) return 'Commercial investigation';
  return 'Informational';
};

export const analyseSeo = (input: SeoInput): SeoReport => {
  const html = input.content || '';
  const text = htmlToText(html);
  const words = wordCount(html);
  const seoTitle = (input.seoTitle || input.title || '').trim();
  const desc = (input.metaDescription || '').trim();
  const keyword = (input.focusKeyword || '').trim();

  const h1s = (html.match(/<h1[\s>]/gi) || []).length;
  const h2s = (html.match(/<h2[\s>]/gi) || []).length;
  const h3s = (html.match(/<h3[\s>]/gi) || []).length;

  const links = Array.from(html.matchAll(/<a[^>]+href="([^"]+)"/gi)).map((m) => m[1]);
  const externalLinks = links.filter((h) => /^https?:\/\//i.test(h) && !h.includes('pruthvirajsinh.in')).length;
  const internalLinks = links.length - externalLinks;

  const imgTags = html.match(/<img[^>]*>/gi) || [];
  const imagesWithAlt = imgTags.filter((t) => /alt="[^"]+"/i.test(t)).length;

  const keywordCount = countOccurrences(text, keyword);
  const keywordDensity = words ? Number(((keywordCount / words) * 100).toFixed(2)) : 0;

  const paragraphs = html.match(/<p[^>]*>[\s\S]*?<\/p>/gi) || [];
  const longParagraphs = paragraphs.filter((p) => htmlToText(p).split(/\s+/).length > 120).length;

  const faqs = extractFaqs(html);
  const hasToc = /data-toc|id="table-of-contents"/i.test(html);

  const checks: SeoCheck[] = [
    keyword
      ? check('focus', 'Focus keyword', 8, 'good', `Focus keyword set: "${keyword}"`)
      : check('focus', 'Focus keyword', 8, 'bad', 'Add a focus keyword to guide the optimisation.'),

    input.secondaryKeywords?.filter(Boolean).length
      ? check('secondary', 'Secondary keywords', 4, 'good', `${input.secondaryKeywords.filter(Boolean).length} secondary keywords added.`)
      : check('secondary', 'Secondary keywords', 4, 'warn', 'Add 2–5 supporting keywords.'),

    seoTitle.length === 0
      ? check('titleLen', 'SEO title length', 8, 'bad', 'SEO title is empty.')
      : seoTitle.length > 60
        ? check('titleLen', 'SEO title length', 8, 'warn', `${seoTitle.length} chars — trim to under 60.`)
        : seoTitle.length < 30
          ? check('titleLen', 'SEO title length', 8, 'warn', `${seoTitle.length} chars — a bit short.`)
          : check('titleLen', 'SEO title length', 8, 'good', `${seoTitle.length} chars — ideal.`),

    keyword && seoTitle.toLowerCase().includes(keyword.toLowerCase())
      ? check('titleKw', 'Keyword in title', 6, 'good', 'Focus keyword appears in the SEO title.')
      : check('titleKw', 'Keyword in title', 6, keyword ? 'warn' : 'bad', 'Work the focus keyword into the title naturally.'),

    desc.length === 0
      ? check('descLen', 'Meta description', 8, 'bad', 'Meta description is empty.')
      : desc.length > 160
        ? check('descLen', 'Meta description', 8, 'warn', `${desc.length} chars — trim to under 160.`)
        : desc.length < 80
          ? check('descLen', 'Meta description', 8, 'warn', `${desc.length} chars — add more detail.`)
          : check('descLen', 'Meta description', 8, 'good', `${desc.length} chars — ideal.`),

    keyword && desc.toLowerCase().includes(keyword.toLowerCase())
      ? check('descKw', 'Keyword in description', 4, 'good', 'Focus keyword appears in the meta description.')
      : check('descKw', 'Keyword in description', 4, 'warn', 'Mention the focus keyword in the meta description.'),

    !input.slug
      ? check('slug', 'URL slug', 6, 'bad', 'Slug is missing.')
      : input.slug.length > 75
        ? check('slug', 'URL slug', 6, 'warn', 'Slug is long — keep it short and readable.')
        : keyword && !input.slug.includes(keyword.toLowerCase().split(/\s+/)[0])
          ? check('slug', 'URL slug', 6, 'warn', 'Consider including the keyword in the slug.')
          : check('slug', 'URL slug', 6, 'good', `/blog/${input.slug}`),

    words < 300
      ? check('length', 'Content length', 8, 'bad', `${words} words — aim for 800+.`)
      : words < 800
        ? check('length', 'Content length', 8, 'warn', `${words} words — 800+ ranks better.`)
        : check('length', 'Content length', 8, 'good', `${words} words.`),

    !keyword
      ? check('density', 'Keyword usage', 6, 'warn', 'Set a focus keyword to measure usage.')
      : keywordCount === 0
        ? check('density', 'Keyword usage', 6, 'bad', 'Focus keyword never appears in the content.')
        : keywordDensity > 2.8
          ? check('density', 'Keyword usage', 6, 'warn', `Density ${keywordDensity}% — possible keyword stuffing.`)
          : keywordDensity < 0.4
            ? check('density', 'Keyword usage', 6, 'warn', `Density ${keywordDensity}% — mention it a few more times.`)
            : check('density', 'Keyword usage', 6, 'good', `Used ${keywordCount}× (${keywordDensity}%).`),

    h1s > 1
      ? check('h1', 'H1 usage', 6, 'bad', `${h1s} H1 tags in the body — the page title is already the H1.`)
      : check('h1', 'H1 usage', 6, 'good', h1s === 1 ? 'One in-body H1 — acceptable.' : 'No duplicate H1 in the body.'),

    h2s === 0
      ? check('headings', 'Heading structure', 6, 'bad', 'No H2 sections — break the article up.')
      : h2s < 3
        ? check('headings', 'Heading structure', 6, 'warn', `${h2s} H2 sections — add a few more.`)
        : check('headings', 'Heading structure', 6, 'good', `${h2s} H2 and ${h3s} H3 sections.`),

    longParagraphs > 0
      ? check('readability', 'Paragraph readability', 5, 'warn', `${longParagraphs} very long paragraph(s) — split them up.`)
      : check('readability', 'Paragraph readability', 5, 'good', 'Paragraph lengths look comfortable.'),

    internalLinks >= 2
      ? check('internal', 'Internal links', 5, 'good', `${internalLinks} internal links.`)
      : check('internal', 'Internal links', 5, internalLinks ? 'warn' : 'bad', 'Add 2–4 internal links to related pages.'),

    externalLinks >= 1
      ? check('external', 'External links', 4, 'good', `${externalLinks} outbound reference(s).`)
      : check('external', 'External links', 4, 'warn', 'Link to at least one authoritative source.'),

    imgTags.length === 0
      ? check('alt', 'Image alt coverage', 5, 'warn', 'No in-content images.')
      : imagesWithAlt === imgTags.length
        ? check('alt', 'Image alt coverage', 5, 'good', `All ${imgTags.length} images have alt text.`)
        : check('alt', 'Image alt coverage', 5, 'bad', `${imgTags.length - imagesWithAlt} image(s) missing alt text.`),

    input.featuredImage
      ? check('featured', 'Featured image', 5, 'good', 'Featured image set.')
      : check('featured', 'Featured image', 5, 'bad', 'Add a featured image for listings and social previews.'),

    faqs.length
      ? check('faq', 'FAQ section', 4, 'good', `${faqs.length} FAQ items — FAQ schema will be emitted.`)
      : check('faq', 'FAQ section', 4, 'warn', 'Add an FAQ block to target question queries.'),

    hasToc
      ? check('toc', 'Table of contents', 3, 'good', 'Table of contents present.')
      : check('toc', 'Table of contents', 3, 'warn', 'Long posts benefit from a table of contents.'),

    input.canonicalUrl
      ? check('canonical', 'Canonical URL', 3, 'good', 'Custom canonical URL set.')
      : check('canonical', 'Canonical URL', 3, 'good', 'Self-referencing canonical will be generated.'),

    input.robotsIndex
      ? check('robots', 'Indexing', 3, 'good', 'Page is indexable.')
      : check('robots', 'Indexing', 3, 'warn', 'Marked noindex — it will not rank.'),

    input.excerpt
      ? check('excerpt', 'Excerpt', 3, 'good', 'Excerpt set for listings.')
      : check('excerpt', 'Excerpt', 3, 'warn', 'Add a short excerpt.'),
  ];

  const total = checks.reduce((s, c) => s + c.weight, 0);
  const earned = checks.reduce((s, c) => s + (c.status === 'good' ? c.weight : c.status === 'warn' ? c.weight * 0.5 : 0), 0);

  return {
    score: Math.round((earned / total) * 100),
    checks,
    words,
    keywordDensity,
    intent: detectIntent(seoTitle, keyword),
    internalLinks,
    externalLinks,
    images: imgTags.length,
    imagesWithAlt,
  };
};
