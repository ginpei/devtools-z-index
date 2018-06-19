/* globals sinon, ZRankingTableUI */

describe('ZRankingTableUI', () => {
  const { expect } = chai;

  let tableUi;
  let elTable;

  before(() => {
    elTable = document.createElement('table');
  });

  beforeEach(() => {
    tableUi = new ZRankingTableUI();
    tableUi.start({ elTable });
    tableUi.onSelect = sinon.spy();
  });

  describe('start()', () => {
    beforeEach(() => {
      tableUi.updateTable({
        ranking: [
          {
            tagName: 'div',
            id: 'penguin',
            classNames: ['foo', 'bar', 'boo'],
          },
        ],
      });
      const elSelector = elTable.querySelector('[data-selector]');
      elSelector.dispatchEvent(new Event('click', { bubbles: true }));
    });

    it('start listening to click', () => {
      expect(tableUi.onSelect).to.be.callCount(1);
    });
  });

  describe('stop()', () => {
    beforeEach(() => {
      tableUi.updateTable({
        ranking: [
          {
            tagName: 'div',
            id: 'penguin',
            classNames: ['foo', 'bar', 'boo'],
          },
        ],
      });

      tableUi.stop();

      const elSelector = elTable.querySelector('[data-selector]');
      elSelector.dispatchEvent(new Event('click', { bubbles: true }));
    });

    it('stop listening to click', () => {
      expect(tableUi.onSelect).to.be.callCount(0);
    });
  });

  describe('updateTable', () => {
    beforeEach(() => {
      tableUi.updateTable({
        ranking: [
          {
            tagName: 'div',
            id: 'penguin',
            classNames: ['foo', 'bar', 'boo'],
            zIndex: 999,
          },
          {
            tagName: 'span',
            id: '',
            classNames: ['hello'],
            zIndex: 1,
          },
          {
            tagName: 'marquee',
            id: '',
            classNames: [],
            zIndex: -1,
          },
        ],
      });
    });

    it('renders each row', () => {
      const elRowList = elTable.querySelectorAll('tbody tr');
      expect(elRowList).to.have.lengthOf(3);
    });

    it('renders a selector with ID and classes', () => {
      const elRowList = elTable.querySelectorAll('tbody tr');

      const elZ = elRowList[0].querySelector('.rankingTableItem-zIndex');
      expect(elZ.textContent.trim()).to.eql('999');

      const elElement = elRowList[0].querySelector('.rankingTableItem-element');
      expect(elElement.textContent.trim()).to.eql('div#penguin.foo.bar.boo');
    });

    it('renders a selector with only 1 class', () => {
      const elRowList = elTable.querySelectorAll('tbody tr');

      const elZ = elRowList[1].querySelector('.rankingTableItem-zIndex');
      expect(elZ.textContent.trim()).to.eql('1');

      const elElement = elRowList[1].querySelector('.rankingTableItem-element');
      expect(elElement.textContent.trim()).to.eql('span.hello');
    });

    it('renders a selector without ID and classes', () => {
      const elRowList = elTable.querySelectorAll('tbody tr');

      const elZ = elRowList[2].querySelector('.rankingTableItem-zIndex');
      expect(elZ.textContent.trim()).to.eql('-1');

      const elElement = elRowList[2].querySelector('.rankingTableItem-element');
      expect(elElement.textContent.trim()).to.eql('marquee');
    });

    it('updates rows', () => {
      tableUi.updateTable({
        ranking: [
          {
            tagName: 'x-link',
            id: '',
            classNames: ['extended'],
            zIndex: 0,
          },
        ],
      });
      const elRowList = elTable.querySelectorAll('tbody tr');
      expect(elRowList).to.have.lengthOf(1);

      const el = elRowList[0].querySelector('.rankingTableItem-element');
      expect(el.textContent.trim()).to.eql('x-link.extended');
    });

    it('removes all rows', () => {
      tableUi.updateTable({});
      const elRowList = elTable.querySelectorAll('tbody tr');
      expect(elRowList).to.have.lengthOf(0);
    });
  });
});
