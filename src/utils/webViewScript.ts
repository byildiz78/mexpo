export const injectedJavaScript = `
  (function() {
    if (!window.inputHandlersInitialized) {
      window.inputHandlersInitialized = true;

      const activeInputs = new Set();
      let currentInput = null;

      function handleInputFocus(input) {
        currentInput = input;
        activeInputs.add(input);
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'inputFocus',
          id: input.id,
          name: input.name,
          value: input.value,
          type: input.type,
          selectionStart: input.selectionStart,
          selectionEnd: input.selectionEnd
        }));
      }

      function handleInputBlur(input) {
        if (activeInputs.has(input)) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'inputBlur',
            id: input.id,
            name: input.name
          }));
        }
      }

      function handleInputChange(input) {
        if (activeInputs.has(input)) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'inputChange',
            id: input.id,
            name: input.name,
            value: input.value
          }));
        }
      }

      function setupInputElement(input) {
        if (input.dataset.handlerInitialized) return;
        input.dataset.handlerInitialized = 'true';

        input.addEventListener('focus', () => handleInputFocus(input), true);
        input.addEventListener('blur', () => handleInputBlur(input), true);
        input.addEventListener('input', () => handleInputChange(input), true);
        input.addEventListener('keyup', () => handleInputChange(input), true);
      }

      document.querySelectorAll('input, textarea').forEach(setupInputElement);

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              if (node.matches('input, textarea')) {
                setupInputElement(node);
              }
              node.querySelectorAll('input, textarea').forEach(setupInputElement);
            }
          });
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      window.addEventListener('message', function(event) {
        try {
          const message = JSON.parse(event.data);
          if (message.type === 'setValue' && currentInput) {
            currentInput.value = message.value;
            currentInput.dispatchEvent(new Event('input', { bubbles: true }));
            currentInput.dispatchEvent(new Event('change', { bubbles: true }));
          }
        } catch (e) {
          console.error('Error processing message:', e);
        }
      });

      const style = document.createElement('style');
      style.textContent = \`
        input, textarea {
          font-size: 16px !important;
          -webkit-user-select: text !important;
          user-select: text !important;
          -webkit-tap-highlight-color: rgba(0,0,0,0) !important;
        }
      \`;
      document.head.appendChild(style);
    }
    true;
  })();
`;
