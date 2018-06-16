/* globals browser */

(() => {
  function sendMessage (type) {
    browser.runtime.sendMessage({ type });
  }

  async function createSidebarPane (title) {
    const htmlPath = '/devtools_page/panes/z-index.html';

    let pane;

    const sidebarAvailable = navigator.userAgent.match(' Chrome/');
    if (sidebarAvailable) {
      pane = await new Promise((resolve) => {
        // seems polyfill does not support this?
        browser.devtools.panels.elements.createSidebarPane(title, resolve);
      });
      // Chrome has `setPage()` 🙂
      pane.setPage(htmlPath);
    } else {
      // Firefox does not have `setPage()` so... 😢
      pane = browser.devtools.panels.create(title, '', htmlPath);
    }

    return pane;
  }

  async function start () {
    const pane = await createSidebarPane('z-index');
    pane.onShown.addListener(() => sendMessage('updateTable'));
    pane.onHidden.addListener(() => sendMessage('clearTable'));
    browser.devtools.panels.elements.onSelectionChanged.addListener(() => {
      sendMessage('updateTable');
    });
  }

  start();
})();
