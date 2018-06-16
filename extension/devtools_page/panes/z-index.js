/* globals browser, chrome */

(() => {
  async function executeScript (code) {
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

  function buildElementTitleHtml (text, type, prefix = '') {
    if (text) {
      return `<span class="rankingTableItem-${type}">${prefix}${text}</span>`;
    }
    return '';
  }

  function buildTableContentHtml (ranking) {
    return ranking
      .map((row) => {
        const selector = [
          row.tagName,
          row.id ? `#${row.id}` : '',
          row.classNames.length > 0 ? `.${row.classNames.join('.')}` : '',
        ].join('');

        const selectorHtml = [
          buildElementTitleHtml(row.tagName.toLowerCase(), 'tagName'),
          buildElementTitleHtml(row.id, 'id', '#'),
          buildElementTitleHtml(row.classNames.join('.'), 'classes', '.'),
        ].join('');

        const html = `
            <tr>
              <td class="rankingTableItem-zIndex">${row.zIndex}</td>
              <td class="rankingTableItem-element">
                <span class="rankingTableItem-selector"
                  data-selector="${selector}">${selectorHtml}</span>
              </td>
            </tr>
          `;
        return html;
      })
      .join('');
  }

  async function updateTable () {
    const ranking = await getRanking();
    const html = buildTableContentHtml(ranking);
    const elTable = document.querySelector('#rankingTable-body');
    elTable.innerHTML = html;
  }

  function clearTable () {
    const elTable = document.querySelector('#rankingTable-body');
    elTable.innerHTML = '';
  }

  function selectElement (selector) {
    const code = `inspect(document.querySelector('${selector}'));`;
    executeScript(code);
  }

  function start () {
    browser.runtime.onMessage.addListener(({ type }) => {
      if (type === 'updateTable') {
        updateTable();
      } else if (type === 'clearTable') {
        clearTable();
      }
    });

    const elTable = document.querySelector('#rankingTable-body');
    elTable.addEventListener('click', (event) => {
      const elSelector = event.target.closest('[data-selector]');
      if (elSelector) {
        const selector = elSelector.getAttribute('data-selector');
        selectElement(selector);
      }
    });

    updateTable();
  }

  start();
})();

