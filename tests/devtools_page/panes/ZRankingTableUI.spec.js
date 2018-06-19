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

  describe('ZRankingTableUI.buildRanking()', () => {
    let elFrame;
    let d;
    let ranking;

    beforeEach(() => {
      elFrame = document.createElement('iframe');
      elFrame.style.position = 'absolute';
      elFrame.style.left = '-9999px';
      elFrame.src = 'about:blank';
      document.body.appendChild(elFrame);
      d = elFrame.contentWindow.document;

      const elStyle = document.createElement('style');
      elStyle.innerHTML = `
        #by-id { z-index: 1; }
        .by-class { z-index: 1; }
        x-by-tag-name { z-index: 1; }
        .auto-z-index { z-index: auto; }
        .zero-z-index { z-index: 0; }
        .minus-z-index { z-index: -1; }
        .lower-z-index { z-index: -10; }
        .high-z-index { z-index: 2; }
        .higher-z-index { z-index: 10; }
      `;
      d.head.appendChild(elStyle);

      d.body.innerHTML = `
        <div id="by-id"></div>

        <div style="z-index: 1"></div>

        <div class="no-styles"></div>
        <x-by-tag-name></x-by-tag-name>
        <div class="auto-z-index"></div>
        <div class="zero-z-index"></div>
        <div class="minus-z-index"></div>
        <div class="lower-z-index"></div>
        <div class="high-z-index"></div>
        <div class="higher-z-index"></div>

        <div class="no-styles"></div>
        <x-by-tag-name></x-by-tag-name>
        <div class="auto-z-index"></div>
        <div class="zero-z-index"></div>
        <div class="minus-z-index"></div>
        <div class="lower-z-index"></div>
        <div class="high-z-index"></div>
        <div class="higher-z-index"></div>
      `;

      ranking = ZRankingTableUI.buildRanking(d);
    });

    afterEach(() => {
      document.body.removeChild(elFrame);
    });

    it('gather elements ignoring "auto" and default', () => {
      expect(ranking).to.have.lengthOf(14);
    });

    it('includes 0', () => {
      expect(ranking[8]).to.eql({
        tagName: 'div',
        id: '',
        classNames: ['zero-z-index'],
        zIndex: 0,
      });
    });

    it('sorts by number, not as string', () => {
      expect(ranking[0]).to.eql({
        tagName: 'div',
        id: '',
        classNames: ['higher-z-index'],
        zIndex: 10,
      });
      expect(ranking[2]).to.eql({
        tagName: 'div',
        id: '',
        classNames: ['high-z-index'],
        zIndex: 2,
      });
    });

    it('sorts minus', () => {
      expect(ranking[10]).to.eql({
        tagName: 'div',
        id: '',
        classNames: ['minus-z-index'],
        zIndex: -1,
      });
      expect(ranking[12]).to.eql({
        tagName: 'div',
        id: '',
        classNames: ['lower-z-index'],
        zIndex: -10,
      });
    });
  });
});
