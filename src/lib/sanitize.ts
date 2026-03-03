import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML content to prevent XSS attacks
 * Only allows safe HTML tags and attributes commonly used in blog content
 */
export const sanitizeHtml = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr',
      'strong', 'em', 'u', 's', 'sub', 'sup',
      'a', 
      'ul', 'ol', 'li',
      'blockquote', 
      'code', 'pre',
      'img',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'div', 'span', 'mark'
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title',
      'class', 'id',
      'target', 'rel',
      'width', 'height',
      'style'
    ],
    // Force all links to open in new tab safely
    ADD_ATTR: ['target', 'rel'],
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
  });
};
