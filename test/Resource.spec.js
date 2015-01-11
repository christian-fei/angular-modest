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
  var dummyBook = { name:'Moby Dick', author:'Herman Melville' };

  beforeEach(module('modest'));

  beforeEach(inject(function(_Resource_,_$httpBackend_){
    Resource = _Resource_;
    $httpBackend = _$httpBackend_;

    $httpBackend.whenGET(/\/users\/\d\/?$/).respond(200,dummyUser);
  }));


  it('should save the resourceUrl with which the Resource has been instanciated', function () {
    var user = new Resource( userResourceUrl );
    expect( user.getResourceUrl() ).to.equal( userResourceUrl );

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
    $httpBackend.expectGET( userAndBooksResourcePath ).respond(200,dummyBook)
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

  describe('nested Resource', function () {
    it('should have a property of type Resource if unresolved nested resource is available', function () {
      var user1 = new Resource( userAndBooksResourceUrl, {userId:1} );
      expect(user1).to.have.property('books');
      expect(user1.books).to.be.an.instanceof(Resource);
    });
    it('should get a single nested resource when passed in the id', function () {
      var user1 = new Resource( userAndBooksResourceUrl, {userId:1} );

      $httpBackend.expectGET( userAndBooksResourcePath ).respond(200,dummyBook)
      user1.get({bookId:1});
      $httpBackend.flush();
      
      $httpBackend.expectGET( userAndBooksResourcePath ).respond(200,dummyBook)
      user1.books.get({bookId:1});
      $httpBackend.flush();
    });
  });

});
