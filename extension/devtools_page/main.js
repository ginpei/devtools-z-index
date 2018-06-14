/* globals browser */

(() => {
  function sendMessage (type) {
    browser.runtime.sendMessage({ type });
  }

  function createSidebarPane (title) {
    return new Promise((resolve) => {
      browser.devtools.panels.elements.createSidebarPane(title, resolve);
    });
  }

  async function start () {
    const pane = await createSidebarPane('z-index');
    pane.setPage('/devtools_page/panes/z-index.html');

    pane.onShown.addListener(() => sendMessage('updateTable'));
    pane.onHidden.addListener(() => sendMessage('clearTable'));

    browser.devtools.panels.elements.onSelectionChanged.addListener(() => {
      sendMessage('updateTable');
    });
  }

  start();
})();
