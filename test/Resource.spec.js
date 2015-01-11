describe('Resource', function() {
  var Resource;

  var $httpBackend;

  /* helpers */
  var userResourceUrl = '/users/:userId';
  var user1ResourceUrl = '/users/1';
  var user1ResourceMatch = /\/users\/1\/?$/;
  var usersResourceUrl = '/users/';
  var usersResourceMatch = /\/users\/?$/;
  var userBooksResourceUrl = '/users/:userId/books/:bookId';
  var user1Book1ResourceMatch = /\/users\/1\/books\/1\/?$/;
  var userBookSomethingResourceUrl = '/users/:userId/books/:bookId/something/:somethingId';
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
    $httpBackend.expectGET(usersResourceMatch).respond(200,dummyUser)
    var user = new Resource( usersResourceUrl, {} );
    user.get();
    $httpBackend.flush();
  });

  it('should get a single resource when passed in the id', function () {
    $httpBackend.expectGET( user1ResourceMatch ).respond(200,dummyUser)
    var user = new Resource( userResourceUrl, {} );
    user.get({userId:1});
    $httpBackend.flush();
  });

  it('should get a single resource and not nested if only parameter for first resource is passed in', function () {
    $httpBackend.expectGET( user1ResourceMatch ).respond(200,dummyUser)
    var user = new Resource( userBooksResourceUrl, {} );
    user.get({userId:1});
    $httpBackend.flush();
  });

  it('should get the nested resource until the defined parameters', function () {
    $httpBackend.expectGET( user1Book1ResourceMatch ).respond(200,dummyBook)
    var userBooks = new Resource( userBooksResourceUrl, {} );
    userBooks.get({userId:1,bookId:1});
    $httpBackend.flush();
  });

  it('should fallback to defaultParameters when parameters during operation are not passed in', function () {
    $httpBackend.expectGET( user1ResourceMatch ).respond(200,dummyUser)
    var user = new Resource( userBooksResourceUrl, {userId:1} );
    user.get();
    $httpBackend.flush();
  });

  describe('nested Resource', function () {
    it('should have a property of type Resource if unresolved nested resource is available', function () {
      var user1 = new Resource( userBooksResourceUrl, {userId:1} );
      expect(user1).to.have.property('books');
      expect(user1.books).to.be.an.instanceof(Resource);
    });
    it('should get a single nested resource when passed in the id', function () {
      var user1 = new Resource( userBooksResourceUrl, {userId:1} );

      $httpBackend.expectGET( user1Book1ResourceMatch ).respond(200,dummyBook)
      user1.get({bookId:1});
      $httpBackend.flush();
      
      $httpBackend.expectGET( user1Book1ResourceMatch ).respond(200,dummyBook)
      user1.books.get({bookId:1});
      $httpBackend.flush();

      $httpBackend.expectGET( user1Book1ResourceMatch ).respond(200,dummyBook)
      user1.books.get(1);
      $httpBackend.flush();
    });

    it('should have properties for each nested resource', function () {
      var user1Book1 = new Resource( userBookSomethingResourceUrl, {userId:1,bookId:1} );
      expect(user1Book1).to.have.property('something');
      expect(user1Book1.something).to.be.an.instanceof(Resource);
    });
  });

});
