/**
 * Helper to prepare and normalize custom HTML for landings.
 * Fixes CDN loading, mixed content (HTTP -> HTTPS), protocol-relative URLs,
 * and ensures documents are properly structured without duplicate shells.
 */

export function prepareLandingHtml(
  rawHtml: string,
  options: {
    formPlaceholderHtml?: string;
    injectFormStyles?: boolean;
    customFormClass?: string;
  } = {}
): string {
  if (!rawHtml) return '';

  let html = rawHtml;

  // 1. Decode base64 if prefixed
  if (html.startsWith('base64:')) {
    try {
      html = decodeURIComponent(escape(atob(html.replace(/^base64:/, ''))));
    } catch {
      try {
        html = atob(html.replace(/^base64:/, ''));
      } catch {}
    }
  }

  // 2. Normalize protocol-relative URLs (//cdn... -> https://cdn...)
  // Inside srcDoc iframes, protocol-relative '//' can resolve to 'about://' and fail
  html = html.replace(/(src|href)=["']\/\/([a-zA-Z0-9_\-\.]+)/gi, '$1="https://$2');

  // 3. Upgrade insecure http:// CDN URLs to https:// to prevent Mixed Content blocking on HTTPS
  const cdnDomains = [
    'cdn.jsdelivr.net',
    'cdnjs.cloudflare.com',
    'unpkg.com',
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'code.jquery.com',
    'stackpath.bootstrapcdn.com',
    'maxcdn.bootstrapcdn.com',
    'cdn.tailwindcss.com',
    'use.fontawesome.com',
    'kit.fontawesome.com',
    'cdn.skypack.dev',
    'esm.sh',
    'ajax.googleapis.com',
    'cdn.bootcdn.net',
    'cdnjs.com',
    'getbootstrap.com',
    'cdn.jsdelivr.com'
  ];

  const cdnPattern = new RegExp(`(src|href)=["']http:\\/\\/(${cdnDomains.map(d => d.replace(/\./g, '\\.')).join('|')})`, 'gi');
  html = html.replace(cdnPattern, '$1="https://$2');

  // Also upgrade any other http:// for script and link tags
  html = html.replace(/<(script|link)([^>]*?)(src|href)=["']http:\/\/([^"'>]+)["']/gi, '<$1$2$3="https://$4"');

  // 4. Clean up broken SRI hashes that may fail cross-origin in iframe srcDoc
  // Note: if an integrity hash fails on a CDN script in srcDoc, browsers block the script entirely
  // html = html.replace(/\s+integrity=["'][^"']*["']/gi, '');

  // 5. Replace {{DYNAMIC_FORM}} placeholder
  const placeholder = options.formPlaceholderHtml || '';
  if (html.includes('{{DYNAMIC_FORM') || /\{\{DYNAMIC_FORM[^}]*\}\}/i.test(html)) {
    html = html.replace(/\{\{DYNAMIC_FORM[^}]*\}\}/gi, placeholder);
  } else if (placeholder && !html.includes('id="react-dynamic-form-container"')) {
    // If there is a form placeholder and user didn't specify {{DYNAMIC_FORM}}, append it gracefully before </body> or at the end
    if (html.includes('</body>')) {
      html = html.replace('</body>', `<div class="max-w-2xl mx-auto my-12 px-4">${placeholder}</div></body>`);
    } else {
      html += `<div class="max-w-2xl mx-auto my-12 px-4">${placeholder}</div>`;
    }
  }

  // 6. Check if the HTML is already a complete HTML document
  const isFullDoc = /<!DOCTYPE\s+html/i.test(html) || /<html[\s>]/i.test(html);

  // Form styling header if needed for the dynamic form container
  const formStyles = options.injectFormStyles ? `
    <style id="santun-form-isolation-styles">
      #react-dynamic-form-container form {
        display: flex !important;
        flex-direction: column !important;
        width: 100% !important;
        box-sizing: border-box !important;
      }
      #react-dynamic-form-container label:not([for="termsCheck"]) {
        display: block !important;
        width: 100% !important;
        text-align: left !important;
        float: none !important;
        margin-bottom: 4px !important;
      }
      #react-dynamic-form-container input:not([type="checkbox"]):not([type="radio"]),
      #react-dynamic-form-container select,
      #react-dynamic-form-container textarea {
        display: block !important;
        width: 100% !important;
        box-sizing: border-box !important;
        max-width: 100% !important;
      }
      #react-dynamic-form-container input[type="checkbox"] {
        display: inline-block !important;
        width: 18px !important;
        min-width: 18px !important;
        max-width: 18px !important;
        height: 18px !important;
        min-height: 18px !important;
        max-height: 18px !important;
        margin: 0 6px 0 0 !important;
        flex-shrink: 0 !important;
      }
      #react-dynamic-form-container button {
        box-sizing: border-box !important;
      }
    </style>
  ` : '';

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const baseTag = origin ? `<base href="${origin}/" />` : '';

  if (isFullDoc) {
    if (html.includes('</head>')) {
      return html.replace('</head>', `${baseTag}${formStyles}</head>`);
    } else if (html.includes('<head>')) {
      return html.replace('<head>', `<head>${baseTag}${formStyles}`);
    } else if (html.includes('<html')) {
      return html.replace(/(<html[^>]*>)/i, `$1<head>${baseTag}${formStyles}</head>`);
    }
    return html;
  } else {
    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${baseTag}
  ${formStyles}
  <style>
    html { color-scheme: light; }
    body { margin: 0; padding: 0; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
  </style>
</head>
<body>
  ${html}
</body>
</html>`;
  }
}
