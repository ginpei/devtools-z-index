// eslint-disable-next-line no-unused-vars
class ZRankingTableUI {
  constructor () {
    this.onClickListener = (event) => {
      const elSelector = event.target.closest('[data-selector]');
      if (elSelector) {
        const selector = elSelector.getAttribute('data-selector');
        if (typeof this.onSelect === 'function') {
          this.onSelect(selector);
        }
      }
    };
  }

  start ({ elTable }) {
    this.elTable = elTable;
    this.elTable.addEventListener('click', this.onClickListener);
  }

  stop () {
    this.elTable.removeEventListener('click', this.onClickListener);
    this.elTable = null;
  }

  async updateTable ({ ranking }) {
    const html = this.buildTableContentHtml(ranking);
    this.elTable.innerHTML = html;
  }

  buildTableContentHtml (ranking) {
    return ranking
      .map((row) => this.buildTableRowHtml(row))
      .join('');
  }

  buildTableRowHtml (row) {
    const selector = [
      row.tagName,
      row.id ? `#${row.id}` : '',
      row.classNames.length > 0 ? `.${row.classNames.join('.')}` : '',
    ].join('');

    const selectorHtml = [
      this.buildElementTitleHtml(row.tagName.toLowerCase(), 'tagName'),
      this.buildElementTitleHtml(row.id, 'id', '#'),
      this.buildElementTitleHtml(row.classNames.join('.'), 'classes', '.'),
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
  }

  buildElementTitleHtml (text, type, prefix = '') {
    if (text) {
      return `<span class="rankingTableItem-${type}">${prefix}${text}</span>`;
    }
    return '';
  }

  clearTable () {
    this.elTable.innerHTML = '';
  }
}
