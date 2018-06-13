/* globals browser */

(() => {
  function createSidebarPane (title) {
    return new Promise((resolve) => {
      browser.devtools.panels.elements.createSidebarPane(title, resolve);
    });
  }

  async function start () {
    const pane = await createSidebarPane('z-index');
    pane.setPage('/devtools_page/panes/z-index.html');
    pane.onShown.addListener((w) => {
      const event = new CustomEvent('pane-shown');
      w.dispatchEvent(event);
    });
    pane.onHidden.addListener((w) => {
      const event = new CustomEvent('pane-hidden');
      w.dispatchEvent(event);
    });
  }

  start();
})();
