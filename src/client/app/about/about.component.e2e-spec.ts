describe('About', () => {

  beforeEach( () => {
    browser.get('/about');
  });

  it('should have correct heading', () => {
    expect(element(by.css('sd-about h1')).getText()).toEqual('TURNING OLD PHONES INTO FOREST GUARDIANS');
  });

});
