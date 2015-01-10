describe('Resource', function() {
  var Resource;

  var $httpBackend;

  /* helpers */
  var userResourceUrl = '/users/:userId';
  var user1ResourceUrl = '/users/1';
  var user1ResourcePath = /\/users\/1\/?$/;
  var userAndBooksResourceUrl = '/users/:userId/books/:bookId';
  var userAndBooksResourcePath = /\/users\/1\/books\/1\/?$/;
  var usersResourceUrl = '/users/';
  var usersResourcePath = /\/users\/?$/;
  var dummyUser = { name:'Elvis', lastName:'Presley' };

  beforeEach(module('modest'));

  beforeEach(inject(function(_Resource_,_$httpBackend_){
    Resource = _Resource_;
    $httpBackend = _$httpBackend_;

    $httpBackend.whenGET(/\/users\/\d\/?$/).respond(200,dummyUser);
  }));


  it('should save the resourceUrl with which the Resource has been instanciated', function () {
    var user = new Resource( userResourceUrl );
    expect( user.getResourceUrl() ).to.equal( usersResourceUrl );

    user = new Resource( userResourceUrl, {userId:1} );
    expect( user.getResourceUrl() ).to.equal( user1ResourceUrl );
  });

  it('should parameterize the resourceUrl if default parameters have been passed in', function () {
    var user = new Resource( userResourceUrl, {userId:1} );
    expect( user.getResourceUrl() ).to.equal( user1ResourceUrl );
  });

  it('should get the resource set when no parameters are passed in and no defaultParameters are set', function () {
    $httpBackend.expectGET(usersResourcePath).respond(200,dummyUser)
    var user = new Resource( usersResourceUrl, {} );
    user.get();
    $httpBackend.flush();
  });

  it('should get a single resource when passed in the id', function () {
    $httpBackend.expectGET( user1ResourcePath ).respond(200,dummyUser)
    var user = new Resource( userResourceUrl, {} );
    user.get({userId:1});
    $httpBackend.flush();
  });

  it('should get a single resource and not nested if only parameter for first resource is passed in', function () {
    $httpBackend.expectGET( user1ResourcePath ).respond(200,dummyUser)
    var user = new Resource( userAndBooksResourceUrl, {} );
    user.get({userId:1});
    $httpBackend.flush();
  });

  it('should get the nested resource until the defined parameters', function () {
    $httpBackend.expectGET( userAndBooksResourcePath ).respond(200,dummyUser)
    var userBooks = new Resource( userAndBooksResourceUrl, {} );
    userBooks.get({userId:1,bookId:1});
    $httpBackend.flush();
  });

  it('should fallback to defaultParameters when parameters during operation are not passed in', function () {
    $httpBackend.expectGET( user1ResourcePath ).respond(200,dummyUser)
    var user = new Resource( userAndBooksResourceUrl, {userId:1} );
    user.get();
    $httpBackend.flush();
  });

});
