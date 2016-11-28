describe('Home', () => {

  beforeEach( () => {
    browser.get('/');
  });

  it('should have an image', () => {
    expect(element(by.css('sd-home div')).isPresent()).toEqual(true);
  });

});
