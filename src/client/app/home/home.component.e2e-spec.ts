describe('Home', () => {

  beforeEach( () => {
    browser.get('/');
  });

  it('should have an image', () => {
    expect(element(by.css('sd-home .home__img')).isPresent()).toEqual(true);
  });

});
