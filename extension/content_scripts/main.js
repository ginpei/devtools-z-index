/* globals browser */

(async () => {
  async function sendMessage (type, data = {}) {
    if (!type) {
      throw new Error('Type is required');
    }

    const result = await browser.runtime.sendMessage({ type, data });
    return result;
  }

  function receiveMessage ({ type, data }) {
    if (type === 'XXX') {
      this.data = data; // TODO do something here instead
    } else {
      console.warn('type', type);
      throw new Error('Unknown message');
    }
  }

  async function init () {
    browser.runtime.onMessage.addListener(message => receiveMessage(message));

    // reset
    const elOld = document.querySelector('#XXX');
    if (elOld) {
      elOld.parentElement.removeChild(elOld);
    }

    // insert
    const el = document.createElement('div');
    el.id = 'XXX';
    document.body.appendChild(el);

    window.addEventListener('unload', () => {
      sendMessage('close');
    });
  }

  init();
})();
