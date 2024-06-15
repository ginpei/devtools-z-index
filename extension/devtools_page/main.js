(() => {
  /**
   * @param {'updateTable' | 'clearTable'} type
   */
  function sendMessage (type) {
    browser.runtime.sendMessage({ type });
  }

  /**
   * @param {string} title
   * @param {string} themeName
   */
  async function createSidebarPane (title, themeName) {
    const baseHtmlPath = '/devtools_page/z-index/index.html';
    const htmlPath = `${baseHtmlPath}?themeName=${themeName}`;

    let pane;

    const sidebarAvailable = navigator.userAgent.match(' Chrome/');
    if (sidebarAvailable) {
      pane = await browser.devtools.panels.elements.createSidebarPane(title);
      // Chrome has `setPage()` 🙂
      pane.setPage(htmlPath);
    } else {
      // Firefox does not have `setPage()` so... 😢
      pane = browser.devtools.panels.create(title, '', htmlPath);
    }

    return pane;
  }

  async function start () {
    const { themeName } = browser.devtools.panels;

    const pane = await createSidebarPane('z-index', themeName);
    pane.onShown.addListener(() => sendMessage('updateTable'));
    pane.onHidden.addListener(() => sendMessage('clearTable'));
    browser.devtools.panels.elements.onSelectionChanged.addListener(() => {
      sendMessage('updateTable');
    });
  }

  start();
})();
