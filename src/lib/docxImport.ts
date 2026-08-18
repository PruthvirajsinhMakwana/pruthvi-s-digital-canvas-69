import mammoth from 'mammoth';

/** Clean Word cruft out of the HTML mammoth produces. */
export const cleanWordHtml = (html: string): string => {
  const doc = new DOMParser().parseFromString(`<div id="root">${html}</div>`, 'text/html');
  const root = doc.getElementById('root');
  if (!root) return html;

  // Strip inline styles, Word classes, empty spans/fonts
  root.querySelectorAll('*').forEach((el) => {
    el.removeAttribute('style');
    el.removeAttribute('lang');
    const cls = el.getAttribute('class');
    if (cls && /Mso|WordSection|docx/i.test(cls)) el.removeAttribute('class');
    if (/^(SPAN|FONT|O:P)$/i.test(el.tagName)) {
      el.replaceWith(...Array.from(el.childNodes));
    }
  });

  // Drop empty paragraphs / headings
  root.querySelectorAll('p, h1, h2, h3, h4, h5, h6, div').forEach((el) => {
    const text = (el.textContent || '').replace(/\u00a0/g, ' ').trim();
    if (!text && !el.querySelector('img, table, hr')) el.remove();
  });

  // Normalise tables (add thead when the first row looks like a header)
  root.querySelectorAll('table').forEach((table) => {
    table.removeAttribute('width');
    table.removeAttribute('border');
    if (!table.querySelector('thead')) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const cells = Array.from(firstRow.children);
        const looksLikeHeader = cells.length > 1 && cells.every((c) => (c.textContent || '').trim().length < 60);
        if (looksLikeHeader) {
          cells.forEach((cell) => {
            const th = doc.createElement('th');
            th.innerHTML = cell.innerHTML;
            cell.replaceWith(th);
          });
          const thead = doc.createElement('thead');
          thead.appendChild(firstRow);
          table.insertBefore(thead, table.firstChild);
        }
      }
    }
  });

  return root.innerHTML
    .replace(/\u00a0/g, ' ')
    .replace(/(\r?\n\s*){3,}/g, '\n\n')
    .trim();
};

export interface DocxImportResult {
  html: string;
  title: string | null;
  warnings: string[];
}

/** Convert a .docx file into clean, editor-ready HTML. */
export const importDocx = async (file: File): Promise<DocxImportResult> => {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.convertToHtml(
    { arrayBuffer },
    {
      styleMap: [
        "p[style-name='Title'] => h1:fresh",
        "p[style-name='Subtitle'] => p.lead:fresh",
        "p[style-name='Heading 1'] => h2:fresh",
        "p[style-name='Heading 2'] => h3:fresh",
        "p[style-name='Heading 3'] => h4:fresh",
        "p[style-name='Quote'] => blockquote > p:fresh",
        "p[style-name='Intense Quote'] => blockquote > p:fresh",
      ],
    },
  );

  const html = cleanWordHtml(result.value);

  // Use the first heading as a title suggestion
  const probe = new DOMParser().parseFromString(html, 'text/html');
  const firstHeading = probe.querySelector('h1, h2');
  const title = firstHeading?.textContent?.trim() || null;

  return {
    html,
    title,
    warnings: (result.messages || []).map((m: { message: string }) => m.message),
  };
};
