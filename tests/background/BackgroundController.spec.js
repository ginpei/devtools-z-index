/* globals BackgroundController */

describe('BackgroundController', () => {
  const { expect } = chai;

  let controller;

  beforeEach(() => {
    controller = new BackgroundController();
  });

  describe('receiveMessage()', () => {
    it('throws error if receives unknown message type', () => {
      expect(() => {
        controller.receiveMessage({ type: 'unknown' });
      }).to.throw();
    });
  });
});
