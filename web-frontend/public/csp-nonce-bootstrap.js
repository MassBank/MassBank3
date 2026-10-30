(() => {
  const nonce = document.querySelector('meta[name="csp-nonce"]')?.content;
  if (!nonce) {
    throw new Error('Missing CSP nonce.');
  }

  const createElement = document.createElement.bind(document);
  document.createElement = (tagName, options) => {
    const element = createElement(tagName, options);
    if (tagName.toLowerCase() === 'style' || tagName.toLowerCase() === 'script') {
      element.setAttribute('nonce', nonce);
    }
    return element;
  };
})();
