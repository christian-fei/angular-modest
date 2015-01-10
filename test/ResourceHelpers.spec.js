describe('sample', function() {
  var ResourceHelpers;

  /* helpers */
  var userResourceUrl = '/users/:userId';
  var user1ResourceUrl = '/users/1';
  var userAndBooksResourceUrl = '/users/:userId/books/:bookId';
  var user1Book1ResourceUrl = '/users/1/books/1';

  beforeEach(module('modestHelpers'));

  beforeEach(inject(function(_ResourceHelpers_){
    ResourceHelpers = _ResourceHelpers_;
  }));

  it('should parameterize an url with the provided parameters', function () {
    var url = ResourceHelpers.parameterize(userResourceUrl,{userId:1});
    expect( url ).to.equal( user1ResourceUrl );
  });

  it('should parameterize and url only until the provided parameters and cut the rest of the url', function () {
    var url = ResourceHelpers.parameterize(userAndBooksResourceUrl,{userId:1});
    expect( url ).to.equal( user1ResourceUrl );    
  });

  it('should parameterize until the nested resource', function () {
    var url = ResourceHelpers.parameterize(userAndBooksResourceUrl,{userId:1,bookId:1});
    expect( url ).to.equal( user1Book1ResourceUrl );
  });
});