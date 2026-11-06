(() => {
  const nonce = document.querySelector('meta[name="csp-nonce"]')?.content;
  if (!nonce) {
    throw new Error('Missing CSP nonce.');
  }

  function addNonce(node) {
    if (!node || typeof node !== 'object') {
      return;
    }

    if (node.nodeType === 1 && node.localName?.toLowerCase() === 'style') {
      node.setAttribute('nonce', nonce);
    }

    node.querySelectorAll?.('style').forEach((element) => {
      element.setAttribute('nonce', nonce);
    });
  }

  for (const method of ['createElement', 'createElementNS']) {
    const original = Document.prototype[method];
    Document.prototype[method] = function (...args) {
      const element = Reflect.apply(original, this, args);
      addNonce(element);
      return element;
    };
  }

  for (const method of ['appendChild', 'insertBefore', 'replaceChild']) {
    const original = Node.prototype[method];
    Node.prototype[method] = function (...args) {
      addNonce(args[0]);
      return Reflect.apply(original, this, args);
    };
  }
})();
