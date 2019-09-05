/* globals chrome, ZRankingTableUI */

(() => {
  const tableUi = new ZRankingTableUI();

  /**
   * @param {string} code
   */
  function executeScript (code) {
    return new Promise((resolve, reject) => {
      // @ts-ignore
      chrome.devtools.inspectedWindow.eval(code, (result, status) => {
        if (status && status.isException) {
          reject(new Error(status.value));
        }
        resolve(result);
      });
    });
  }

  /**
   * @returns {Promise<ZIndexRecord[]>}
   */
  function getRanking () {
    const code = `(${ZRankingTableUI.buildRanking.toString()})()`;
    return executeScript(code);
  }

  async function updateTable () {
    const ranking = await getRanking();
    tableUi.updateTable({ ranking });
  }

  async function clearTable () {
    tableUi.updateTable({});
  }

  function initColorScheme () {
    const paramPairs = window.location.search.slice(1).split('&');
    const themeNameParam = paramPairs.find((v) => v.startsWith('themeName='));
    if (!themeNameParam) {
      return;
    }

    const themeName = themeNameParam.split('=')[1];
    document.documentElement.dataset.themeName = themeName;
  }

  /**
   * @param {string} selector
   */
  function selectElement (selector) {
    const code = `inspect(document.querySelector('${selector}'));`;
    executeScript(code);
  }

  function start () {
    initColorScheme();

    /** @type {HTMLTableElement} */
    const elTable = (document.querySelector('#rankingTable-body'));
    tableUi.start({ elTable });
    tableUi.onSelect = (selector) => {
      selectElement(selector);
    };

    browser.runtime.onMessage.addListener(({ type }) => {
      if (type === 'updateTable') {
        updateTable();
      } else if (type === 'clearTable') {
        clearTable();
      }
    });

    document.addEventListener('click', (event) => {
      if (!event.target || !(event.target instanceof HTMLElement)) {
        return;
      }

      const elLink = event.target.closest('a');
      if (elLink) {
        event.preventDefault();
        const url = elLink.href;
        window.open(url);
      }
    });

    updateTable();
  }

  start();
})();
