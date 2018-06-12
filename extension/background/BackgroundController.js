/* globals browser */

// eslint-disable-next-line no-unused-vars
class BackgroundController {
  constructor () {
    this._XXX = 'XXX';
  }

  start () {
    browser.runtime.onMessage.addListener(message => this.receiveMessage(message));
  }

  receiveMessage ({ type, data }) {
    if (type === 'XXX') {
      this.data = data; // TODO do something here instead
    } else {
      console.warn('type', type);
      throw new Error('Unknown message');
    }
  }

  async sendMessage (type, data = {}) {
    const result = await browser.tabs.sendMessage({ type, data });
    return result;
  }
}
