describe('sample', function() {
  var Say;

  beforeEach(module('modest'));

  beforeEach(function() {
    inject(function(_Say_){
      Say = _Say_;
    })
  });

  it('should say Grazie', function () {
    expect(Say.thanks('it')).to.equal('Grazie');
  });
  it('should say Thanks', function () {
    expect(Say.thanks()).to.equal('Thanks');
  });
});