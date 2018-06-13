/* globals browser */

(() => {
  function createSidebarPane (title) {
    return new Promise((resolve) => {
      browser.devtools.panels.elements.createSidebarPane(title, resolve);
    });
  }

  async function start () {
    const pane = await createSidebarPane('z-index');
    pane.setPage('/devtools_page/z-index.html');
  }

  start();
})();
