import { htmlToText } from './sanitize';

export const SITE_URL = 'https://pruthvirajsinh.in';

export const slugify = (value: string): string =>
  (value || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 90)
    .replace(/^-|-$/g, '');

export const wordCount = (html: string): number => {
  const text = htmlToText(html);
  return text ? text.split(/\s+/).length : 0;
};

export const readingTime = (html: string): number => Math.max(1, Math.ceil(wordCount(html) / 200));

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

/** Extracts H2/H3 headings and injects stable ids so the TOC can link to them. */
export const buildToc = (html: string): { html: string; toc: TocItem[] } => {
  if (!html) return { html: '', toc: [] };
  const toc: TocItem[] = [];
  const used = new Set<string>();

  const out = html.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi, (_m, level: string, attrs: string, inner: string) => {
    const text = htmlToText(inner);
    if (!text) return _m;
    let id = slugify(text) || `section-${toc.length + 1}`;
    while (used.has(id)) id = `${id}-${toc.length + 1}`;
    used.add(id);
    toc.push({ id, text, level: Number(level) });
    const cleaned = attrs.replace(/\sid="[^"]*"/i, '');
    return `<h${level}${cleaned} id="${id}">${inner}</h${level}>`;
  });

  return { html: out, toc };
};

export const extractFaqs = (html: string): { question: string; answer: string }[] => {
  if (!html) return [];
  const faqs: { question: string; answer: string }[] = [];
  const regex = /<details[^>]*>[\s\S]*?<summary[^>]*>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/gi;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(html))) {
    const question = htmlToText(m[1]);
    const answer = htmlToText(m[2]);
    if (question && answer) faqs.push({ question, answer });
  }
  return faqs;
};

export const excerptFrom = (html: string, length = 160): string => {
  const text = htmlToText(html);
  if (text.length <= length) return text;
  return `${text.slice(0, length).replace(/\s+\S*$/, '')}…`;
};

export const STATUSES = ['draft', 'scheduled', 'published', 'archived'] as const;
export type BlogStatus = (typeof STATUSES)[number];
