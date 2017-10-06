'use strict';

describe('Media E2E Tests:', function () {
  describe('Test media page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/media');
      expect(element.all(by.repeater('media in media')).count()).toEqual(0);
    });
  });
});
