export function prepareDocumentationHtml(html: string, pageUrl: string) {
  const parsedHtml = new DOMParser().parseFromString(html, 'text/html');
  parsedHtml.querySelectorAll('script, base').forEach((element) => {
    element.remove();
  });

  parsedHtml.querySelectorAll<HTMLElement>('[href], [src], [poster]').forEach(
    (element) => {
      for (const attribute of ['href', 'src', 'poster']) {
        const value = element.getAttribute(attribute);
        if (!value || value.startsWith('#')) {
          continue;
        }

        try {
          const url = new URL(value, pageUrl);
          if (url.protocol === 'javascript:') {
            element.removeAttribute(attribute);
          } else {
            element.setAttribute(attribute, url.href);
          }
        } catch {
          element.removeAttribute(attribute);
        }
      }
    },
  );

  const nonce = document.querySelector<HTMLMetaElement>(
    'meta[name="csp-nonce"]',
  )?.content;
  if (!nonce) {
    throw new Error('Missing CSP nonce for documentation content.');
  }

  const stylesheetLinks = Array.from(
    parsedHtml.querySelectorAll<HTMLLinkElement>('link[rel~="stylesheet"]'),
  );
  stylesheetLinks.forEach((element) => element.remove());

  const headStyles = Array.from(parsedHtml.head.querySelectorAll('style'));
  headStyles.forEach((element) => {
    element.setAttribute('nonce', nonce);
    element.remove();
  });

  return [
    ...stylesheetLinks.map((element) => element.outerHTML),
    ...headStyles.map((element) => element.outerHTML),
    parsedHtml.body.innerHTML,
  ].join('\n');
}
