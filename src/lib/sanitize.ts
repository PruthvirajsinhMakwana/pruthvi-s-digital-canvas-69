import DOMPurify from 'dompurify';

const YOUTUBE_HOSTS = ['www.youtube.com', 'youtube.com', 'www.youtube-nocookie.com', 'youtube-nocookie.com'];

let hookInstalled = false;

const installHooks = () => {
  if (hookInstalled || typeof window === 'undefined') return;
  hookInstalled = true;

  // Only allow iframes that point at YouTube embeds. Everything else is dropped.
  DOMPurify.addHook('uponSanitizeElement', (node: any, data) => {
    if (data.tagName !== 'iframe') return;
    const src = node.getAttribute?.('src') || '';
    try {
      const url = new URL(src, 'https://pruthvirajsinh.in');
      if (url.protocol !== 'https:' || !YOUTUBE_HOSTS.includes(url.hostname) || !url.pathname.startsWith('/embed/')) {
        node.parentNode?.removeChild(node);
      }
    } catch {
      node.parentNode?.removeChild(node);
    }
  });

  // Harden every external link.
  DOMPurify.addHook('afterSanitizeAttributes', (node: any) => {
    if (node.tagName === 'A' && node.getAttribute('href')) {
      const href = node.getAttribute('href') as string;
      const isExternal = /^https?:\/\//i.test(href) && !href.includes('pruthvirajsinh.in');
      if (isExternal || node.getAttribute('target') === '_blank') {
        node.setAttribute('target', '_blank');
        const rel = new Set((node.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
        rel.add('noopener');
        rel.add('noreferrer');
        node.setAttribute('rel', Array.from(rel).join(' '));
      }
    }
    if (node.tagName === 'IMG') {
      if (!node.getAttribute('loading')) node.setAttribute('loading', 'lazy');
      if (!node.getAttribute('decoding')) node.setAttribute('decoding', 'async');
      if (!node.getAttribute('alt')) node.setAttribute('alt', '');
    }
  });
};

const ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'br', 'hr',
  'strong', 'b', 'em', 'i', 'u', 's', 'sub', 'sup', 'small',
  'a',
  'ul', 'ol', 'li',
  'blockquote', 'cite',
  'code', 'pre',
  'img', 'figure', 'figcaption', 'picture', 'source',
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'colgroup', 'col',
  'div', 'span', 'mark', 'section', 'aside', 'details', 'summary',
  'iframe',
];

const ALLOWED_ATTR = [
  'href', 'src', 'srcset', 'sizes', 'alt', 'title',
  'class', 'id', 'style',
  'target', 'rel', 'download',
  'width', 'height', 'loading', 'decoding', 'fetchpriority',
  'colspan', 'rowspan', 'colwidth', 'scope',
  'allow', 'allowfullscreen', 'frameborder', 'referrerpolicy',
  'data-type', 'data-variant', 'data-align', 'data-label', 'data-cta', 'data-track', 'data-toc',
];

/**
 * Sanitizes blog HTML. Strips scripts, event handlers and unsafe embeds while
 * preserving the semantic blocks the blog editor produces.
 */
export const sanitizeHtml = (dirty: string): string => {
  if (!dirty) return '';
  installHooks();
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    ADD_ATTR: ['target', 'rel'],
    FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'textarea', 'button', 'link', 'meta', 'style', 'base'],
    FORBID_ATTR: [
      'onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur', 'onsubmit',
      'onanimationend', 'onanimationstart', 'formaction', 'srcdoc',
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
  });
};

/** Plain text extraction used for word counts and excerpts. */
export const htmlToText = (html: string): string =>
  (html || '')
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
