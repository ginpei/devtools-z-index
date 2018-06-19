/* globals browser, chrome, ZRankingTableUI */

(() => {
  const tableUi = new ZRankingTableUI();

  function executeScript (code) {
    return new Promise((resolve, reject) => {
      chrome.devtools.inspectedWindow.eval(code, (result, status) => {
        if (status && status.isException) {
          reject(new Error(status.value));
        }
        resolve(result);
      });
    });
  }

  function getRanking () {
    const src = `
      (() => {
        const data = Array.from(document.querySelectorAll('*'))
          .map((el) => ({
            classNames: Array.from(el.classList),
            id: el.id,
            tagName: el.tagName,
            zIndex: getComputedStyle(el).zIndex,
          }))
          .filter(({ zIndex }) => !isNaN(zIndex))
          .sort((r1, r2) => r2.zIndex - r1.zIndex);
        return data;
      })();
    `;
    return executeScript(src);
  }

  async function updateTable () {
    const ranking = await getRanking();
    tableUi.updateTable({ ranking });
  }

  function selectElement (selector) {
    const code = `inspect(document.querySelector('${selector}'));`;
    executeScript(code);
  }

  function start () {
    const elTable = document.querySelector('#rankingTable-body');
    tableUi.start({ elTable });
    tableUi.onSelect = (selector) => {
      selectElement(selector);
    };

    browser.runtime.onMessage.addListener(({ type }) => {
      if (type === 'updateTable') {
        updateTable();
      } else if (type === 'clearTable') {
        tableUi.clearTable();
      }
    });

    document.addEventListener('click', (event) => {
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
