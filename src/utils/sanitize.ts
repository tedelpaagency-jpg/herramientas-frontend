/**
 * Sanitiza contenido HTML para evitar ataques XSS (scripts, event handlers, javascript: URIs).
 * Preserva etiquetas seguras de texto enriquecido (párrafos, títulos, listas, negrita, enlaces, tablas, etc.).
 */
export function sanitizeHtml(html: string | null | undefined): string {
  if (!html) return '';

  if (typeof window === 'undefined') {
    // SSR Fallback básico
    return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Listas de etiquetas permitidas
    const allowedTags = new Set([
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr',
      'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'sub', 'sup',
      'ul', 'ol', 'li', 'dl', 'dt', 'dd',
      'blockquote', 'pre', 'code',
      'a', 'img', 'span', 'div',
      'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
    ]);

    const elements = doc.body.querySelectorAll('*');
    elements.forEach((el) => {
      const tagName = el.tagName.toLowerCase();
      
      if (!allowedTags.has(tagName)) {
        if (['script', 'style', 'iframe', 'object', 'embed', 'form'].includes(tagName)) {
          el.remove();
        } else {
          el.replaceWith(...Array.from(el.childNodes));
        }
        return;
      }

      // Limpiar atributos no seguros (on*, javascript:, etc.)
      const attrs = Array.from(el.attributes);
      attrs.forEach((attr) => {
        const name = attr.name.toLowerCase();
        const val = attr.value.toLowerCase().trim();

        if (name.startsWith('on')) {
          el.removeAttribute(attr.name);
        } else if ((name === 'href' || name === 'src') && val.startsWith('javascript:')) {
          el.removeAttribute(attr.name);
        }
      });

      if (tagName === 'a' && el.hasAttribute('href')) {
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener noreferrer');
      }
    });

    return doc.body.innerHTML;
  } catch (err) {
    return html;
  }
}
