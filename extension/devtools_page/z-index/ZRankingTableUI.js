// eslint-disable-next-line no-unused-vars

/** @type {ZIndexRecord[]} */
const emptyZIndexRecordArray = [];

class ZRankingTableUI {
  constructor () {
    /** @type {HTMLTableElement | null} */
    this.elTable = null;

    /** @type {NonNullable<typeof HTMLElement.prototype.onclick>} */
    this._onClickListener = (event) => {
      if (!event.target || !(event.target instanceof HTMLElement)) {
        return;
      }

      const elSelector = event.target.closest('[data-selector]');
      if (elSelector) {
        const selector = elSelector.getAttribute('data-selector') || '';
        if (typeof this.onSelect === 'function') {
          this.onSelect(selector);
        }
      }
    };

    /** @type {((selector: string) => void) | null} */
    this.onSelect = null;
  }

  /**
   * @param {{ elTable: HTMLTableElement }} options
   */
  start ({ elTable }) {
    this.elTable = elTable;
    this.elTable.addEventListener('click', this._onClickListener);
  }

  stop () {
    if (this.elTable) {
      this.elTable.removeEventListener('click', this._onClickListener);
      this.elTable = null;
    }
  }

  /**
   * @param {{ ranking?: ZIndexRecord[] }} options
   */
  async updateTable ({ ranking = emptyZIndexRecordArray }) {
    if (!this.elTable) {
      return;
    }

    const html = ranking
      .map((row) => this._buildTableRowHtml(row))
      .join('');
    this.elTable.innerHTML = html;
  }

  /**
   * @param {ZIndexRecord} row
   */
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

  /**
   * @param {string} text
   * @param {string} type
   */
  _buildElementTitleHtml (text, type, prefix = '') {
    if (text) {
      return `<span class="rankingTableItem-${type}">${prefix}${text}</span>`;
    }
    return '';
  }
}

ZRankingTableUI.buildRanking = (d = document) => {
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
