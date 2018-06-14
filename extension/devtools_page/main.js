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

  // fore Firefox
  // (Chrome shows z-index/index.html instead)
  function updateTable (pane) {
    const src = `
      Array.from(document.querySelectorAll('*'))
        .reduce((map, el) => {
          const { zIndex } = getComputedStyle(el);
          if (isNaN(zIndex)) {
            return map;
          }

          if (!(zIndex in map)) {
            map[zIndex] = [];
          }
          map[zIndex].push(el);
          return map;
        }, Object.create(null));
    `;
    pane.setExpression(src, 'z-index');
  }

  async function start () {
    const pane = await createSidebarPane('z-index');
    if (pane.setPage) {
      // Chrome has `setPage()` 🙂
      pane.setPage('/devtools_page/panes/z-index.html');

      pane.onShown.addListener(() => sendMessage('updateTable'));
      pane.onHidden.addListener(() => sendMessage('clearTable'));

      browser.devtools.panels.elements.onSelectionChanged.addListener(() => {
        sendMessage('updateTable');
      });
    } else {
      // Firefox does not have `setPage()` so... 😢
      pane.onShown.addListener(() => updateTable(pane));
    }
  }

  start();
})();
