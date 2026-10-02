/**
 * Helper to prepare and normalize custom HTML for landings.
 * Fixes CDN loading, mixed content (HTTP -> HTTPS), protocol-relative URLs,
 * removes rogue <base> tags that break anchor links, and enables smooth in-page navigation.
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

  // 2. Remove any <base> tags that may redirect fragment/anchor links to the website root (e.g. /dashboard or /login)
  html = html.replace(/<base\s+[^>]*>/gi, '');

  // 3. Normalize protocol-relative URLs (//cdn... -> https://cdn...)
  // Inside srcDoc iframes, protocol-relative '//' can resolve to 'about://' and fail
  html = html.replace(/(src|href)=["']\/\/([a-zA-Z0-9_\-\.]+)/gi, '$1="https://$2');

  // 4. Upgrade insecure http:// CDN URLs to https:// to prevent Mixed Content blocking on HTTPS
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

  // Fix common mistake where bootstrap css is loaded inside a <script> tag
  html = html.replace(/<script([^>]*?)src=["']([^"']*?)bootstrap\.bundle\.min\.css["']([^>]*?)><\/script>/gi, '<script$1src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"$3></script>');

  // 5. Replace {{DYNAMIC_FORM}} placeholder
  const placeholder = options.formPlaceholderHtml || '';
  const hasEmbeddedForm = /<form\b[^>]*id=["']?(?:trivaliForm|customForm|contactForm|leadForm|registroForm)/i.test(html) ||
    (/<form\b/i.test(html) && !html.includes('{{DYNAMIC_FORM'));

  if (html.includes('{{DYNAMIC_FORM') || /\{\{DYNAMIC_FORM[^}]*\}\}/i.test(html)) {
    html = html.replace(/\{\{DYNAMIC_FORM[^}]*\}\}/gi, placeholder);
  } else if (placeholder && !hasEmbeddedForm && !html.includes('id="react-dynamic-form-container"')) {
    // If there is a form placeholder and user didn't specify {{DYNAMIC_FORM}} and page does not have its own form, append it gracefully
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

  // 7. In-page anchor navigation script:
  // Intercepts anchor links (e.g. href="#seccion-compra", href="#formulario") so they scroll
  // smoothly inside the document/parent window instead of navigating away.
  const anchorScript = `
    <script id="landing-anchor-scroll-helper">
      (function() {
        document.addEventListener('click', function(e) {
          var a = e.target.closest('a');
          if (!a) return;
          var href = a.getAttribute('href');
          if (!href) return;

          // 1. Handle in-page fragment / anchor links (e.g. #seccion-compra)
          if (href.startsWith('#') && href.length > 1) {
            e.preventDefault();
            var targetId = href.substring(1);
            var targetEl = document.getElementById(targetId) || 
                           document.querySelector('[name="' + (window.CSS && CSS.escape ? CSS.escape(targetId) : targetId) + '"]');

            // Fallback: check if the link intended the dynamic form
            if (!targetEl && (targetId.includes('form') || targetId.includes('compra') || targetId.includes('lead') || targetId.includes('registro') || targetId.includes('contacto'))) {
              targetEl = document.getElementById('react-dynamic-form-container') || document.querySelector('form');
            }

            if (targetEl) {
              if (window.parent && window.parent !== window) {
                try {
                  var iframe = window.frameElement;
                  var parentScrollY = window.parent.pageYOffset || window.parent.document.documentElement.scrollTop || 0;
                  var iframeTop = iframe ? (iframe.getBoundingClientRect().top + parentScrollY) : 0;
                  var targetRect = targetEl.getBoundingClientRect();
                  var absoluteTargetTop = iframeTop + targetRect.top;

                  window.parent.scrollTo({
                    top: Math.max(0, absoluteTargetTop - 25),
                    behavior: 'smooth'
                  });

                  if (window.parent.history && window.parent.history.pushState) {
                    window.parent.history.pushState(null, '', href);
                  }
                } catch (err) {
                  targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              } else {
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }
          } else if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('whatsapp:') || href.startsWith('https://wa.me')) {
            // Ensure external links open cleanly in a new window/tab
            if (!a.getAttribute('target')) {
              a.setAttribute('target', '_blank');
              a.setAttribute('rel', 'noopener noreferrer');
            }
          }
        }, true);
      })();

      // Automatic initialization runner and form lead binder
      (function() {
        var retries = 0;
        function runScripts() {
          if (typeof window.AOS !== 'undefined' && window.AOS.init && !window.__aos_inited && !window.AOS.__is_shim) {
            window.__aos_inited = true;
            try {
              window.AOS.init({ once: true, offset: 50, duration: 800, easing: 'ease-out-cubic' });
            } catch (err) {}
          }
          if (typeof window.initTrivaliScripts === 'function' && !window.__trivali_inited) {
            window.__trivali_inited = true;
            try {
              window.initTrivaliScripts();
            } catch (err) {}
          }

          // Always guarantee first hero slide text is visible
          var firstSlideText = document.querySelector('.hero-swiper .swiper-slide .slide-text') || document.querySelector('.slide-text');
          if (firstSlideText && (firstSlideText.style.opacity === '0' || firstSlideText.classList.contains('opacity-0'))) {
            firstSlideText.style.opacity = '1';
            firstSlideText.style.transform = 'translateY(0)';
          }

          // Ensure data-aos elements are animated and visible
          document.querySelectorAll('[data-aos]').forEach(function(el) {
            el.classList.add('aos-animate');
            el.style.opacity = '1';
            el.style.transform = 'none';
          });

          if (retries < 30) {
            retries++;
            setTimeout(runScripts, 150);
          }
        }
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
          runScripts();
        } else {
          document.addEventListener('DOMContentLoaded', runScripts);
        }
        window.addEventListener('load', runScripts);

        // Auto-bind custom embedded forms to capture leads into TEDELPA CRM
        function bindForms() {
          var embeddedForms = document.querySelectorAll('form:not(#dynamicLandingForm)');
          embeddedForms.forEach(function(f) {
            if (f.__tedelpa_bound) return;
            f.__tedelpa_bound = true;

            var inputs = f.querySelectorAll('input:not([type="submit"]):not([type="button"])');
            inputs.forEach(function(inp) {
              if (!inp.getAttribute('name')) {
                var placeholder = (inp.getAttribute('placeholder') || '').toLowerCase();
                var label = (inp.closest('div') ? inp.closest('div').querySelector('label') : null);
                var labelText = (label ? label.textContent : '').toLowerCase();
                var type = (inp.getAttribute('type') || '').toLowerCase();

                if (type === 'email' || placeholder.includes('correo') || placeholder.includes('email') || labelText.includes('correo') || labelText.includes('email')) {
                  inp.setAttribute('name', 'email');
                } else if (type === 'tel' || placeholder.includes('tel') || placeholder.includes('whatsapp') || labelText.includes('tel') || labelText.includes('whatsapp')) {
                  inp.setAttribute('name', 'phone');
                } else if (placeholder.includes('perez') || placeholder.includes('apellido') || labelText.includes('apellido')) {
                  inp.setAttribute('name', 'last_name');
                } else if (placeholder.includes('juan') || placeholder.includes('nombre') || labelText.includes('nombre')) {
                  inp.setAttribute('name', 'first_name');
                }
              }
            });

            f.addEventListener('submit', function() {
              try {
                var formData = new FormData(f);
                var urlParams = new URLSearchParams(window.location.search);
                var rawId = urlParams.get('id') || '';
                if (rawId) {
                  formData.append('landing_id', rawId);
                  formData.append('landing_slug', rawId);
                }
                var fn = formData.get('first_name') || '';
                var ln = formData.get('last_name') || '';
                if (!formData.get('name') && (fn || ln)) {
                  formData.append('name', (fn + ' ' + ln).trim());
                }

                fetch('/landing/lead', {
                  method: 'POST',
                  body: formData,
                  headers: { 'X-Requested-With': 'XMLHttpRequest' }
                }).catch(function() {});
              } catch(e) {}
            }, true);
          });
        }

        if (document.readyState === 'complete' || document.readyState === 'interactive') {
          bindForms();
        } else {
          document.addEventListener('DOMContentLoaded', bindForms);
        }
        window.addEventListener('load', bindForms);
      })();
    </script>
  `;

  const headInjections = `${formStyles}
    <style id="landing-animation-safety">
      [data-aos] {
        opacity: 1 !important;
        transform: none !important;
        transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) !important;
      }
      [data-aos].aos-animate {
        opacity: 1 !important;
        transform: none !important;
      }
    </style>
    <script id="landing-lib-safeguard">
      // Safeguard for inline scripts calling AOS before CDN finishes loading
      if (!window.AOS) {
        window.AOS = {
          __is_shim: true,
          init: function() {},
          refresh: function() {},
          refreshHard: function() {}
        };
      }
    </script>
  `;

  if (isFullDoc) {
    let result = html;
    if (result.includes('</head>')) {
      result = result.replace('</head>', `${headInjections}</head>`);
    } else if (result.includes('<head>')) {
      result = result.replace('<head>', `<head>${headInjections}`);
    } else if (result.includes('<html')) {
      result = result.replace(/(<html[^>]*>)/i, `$1<head>${headInjections}</head>`);
    }

    if (result.includes('</body>')) {
      result = result.replace('</body>', `${anchorScript}</body>`);
    } else {
      result += anchorScript;
    }
    return result;
  } else {
    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${formStyles}
  <style>
    html { color-scheme: light; }
    body { margin: 0; padding: 0; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
  </style>
</head>
<body>
  ${html}
  ${anchorScript}
</body>
</html>`;
  }
}
