// eslint-disable-next-line no-unused-vars
class ZRankingTableUI {
  constructor () {
    this._onClickListener = (event) => {
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
    this.elTable.addEventListener('click', this._onClickListener);
  }

  stop () {
    this.elTable.removeEventListener('click', this._onClickListener);
    this.elTable = null;
  }

  async updateTable ({ ranking = [] }) {
    const html = ranking
      .map((row) => this._buildTableRowHtml(row))
      .join('');
    this.elTable.innerHTML = html;
  }

  _buildTableRowHtml (row) {
    const selector = [
      row.tagName,
      row.id ? `#${row.id}` : '',
      row.classNames.length > 0 ? `.${row.classNames.join('.')}` : '',
    ].join('');

    const selectorHtml = [
      this._buildElementTitleHtml(row.tagName, 'tagName'),
      this._buildElementTitleHtml(row.id, 'id', '#'),
      this._buildElementTitleHtml(row.classNames.join('.'), 'classes', '.'),
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

  _buildElementTitleHtml (text, type, prefix = '') {
    if (text) {
      return `<span class="rankingTableItem-${type}">${prefix}${text}</span>`;
    }
    return '';
  }
}

ZRankingTableUI.finder = (d = document) => {
  const ranking = Array.from(d.querySelectorAll('*'))
    .map((el) => ({
      classNames: Array.from(el.classList),
      id: el.id,
      tagName: el.tagName.toLowerCase(),
      zIndex: Number(getComputedStyle(el).zIndex),
    }))
    .filter(({ zIndex }) => !Number.isNaN(zIndex))
    .sort((r1, r2) => r2.zIndex - r1.zIndex);
  return ranking;
};
