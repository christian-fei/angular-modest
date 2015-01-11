describe('ResourceHelpers', function() {
  var ResourceHelpers;

  /* helpers */
  var userResourceUrl = '/users/:userId';
  var usersUrl = '/users/';
  var user1ResourceUrl = '/users/1';
  var usersResourceUrl = '/users/';
  var userAndBooksResourceUrl = '/users/:userId/books/:bookId';
  var user1Book1ResourceUrl = '/users/1/books/1';
  var user1BooksResourceUrl = '/users/1/books/:bookId';

  beforeEach(module('modest.helpers'));

  beforeEach(inject(function(_ResourceHelpers_){
    ResourceHelpers = _ResourceHelpers_;
  }));

  it('should parameterize an url with the provided parameters', function () {
    var url = ResourceHelpers.parameterize(userResourceUrl,{userId:1});
    expect( url ).to.equal( user1ResourceUrl );
  });

  it('should return the unparameterized url if no parameters are passed in', function () {
    var url = ResourceHelpers.parameterize(userResourceUrl,{});
    expect( url ).to.equal( userResourceUrl );
  });

  it('should parameterize an url only until the provided parameters and cut the rest of the url', function () {
    var url = ResourceHelpers.parameterize(userAndBooksResourceUrl,{userId:1});
    expect( url ).to.equal( user1BooksResourceUrl );    
  });

  it('should parameterize until the nested resource', function () {
    var url = ResourceHelpers.parameterize(userAndBooksResourceUrl,{userId:1,bookId:1});
    expect( url ).to.equal( user1Book1ResourceUrl );
  });

  it('should parametrize an url if passed in a number', function () {
    var url = ResourceHelpers.parameterizeUntilParams(userResourceUrl,1);
    expect( url ).to.equal( user1ResourceUrl );        
  });

  it('should return the query parameters, the ones that do not match the url template', function () {
    var parameters = {userId:1,foo:'bar'};
    var queryParameters = ResourceHelpers.getQueryParameters(userResourceUrl,parameters);
    expect(queryParameters).to.deep.equal({foo:'bar'});
  });

});