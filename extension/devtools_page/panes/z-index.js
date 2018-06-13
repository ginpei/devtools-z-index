/* globals chrome */

(() => {
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

    return new Promise(async (resolve, reject) => {
      chrome.devtools.inspectedWindow.eval(src, (result) => {
        if (result) {
          resolve(result);
        } else {
          reject(new Error('Failed to get ranking'));
        }
      });
    });
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
        const tagName = buildElementTitleHtml(row.tagName.toLowerCase(), 'tagName');
        const id = buildElementTitleHtml(row.id, 'id', '#');
        const classes = buildElementTitleHtml(row.classNames.join('.'), 'classes', '.');
        const html = `
            <tr>
              <td class="rankingTableItem-zIndex">${row.zIndex}</td>
              <td class="rankingTableItem-element">${tagName}${id}${classes}</td>
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

  function start () {
    document.querySelector('#update').onclick = () => {
      updateTable();
    };

    updateTable();
  }

  start();
})();

