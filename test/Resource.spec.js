describe('Resource', function() {
  var Resource
    , $httpBackend;

  var dummyUser = { name:'Elvis', lastName:'Presley' };
  var dummyBook = { name:'Moby Dick', author:'Herman Melville' };
  var dummySomething = { foo:'bar' };

  beforeEach(module('modest'));

  beforeEach(inject(function(_Resource_,_$httpBackend_){
    Resource = _Resource_;
    $httpBackend = _$httpBackend_;

    $httpBackend.whenGET(/\/users\/\d\/?$/).respond(200,dummyUser);
  }));


  it('should save the resourceUrl with which the Resource has been instanciated', function () {
    var user = new Resource( '/users/:userId' );
    expect( user.getResourceUrl() ).to.equal( '/users/:userId' );

    user = new Resource( '/users/:userId', {userId:1} );
    expect( user.getResourceUrl() ).to.equal( '/users/1' );
  });

  it('should get the resource set when no parameters are passed in and no defaultParameters are set', function () {
    $httpBackend.expectGET(/\/users\/?$/).respond(200,dummyUser)
    var user = new Resource( '/users/', {} );
    user.get();
    $httpBackend.flush();
  });

  it('should get a single resource when passed in the id', function () {
    $httpBackend.expectGET( /\/users\/1\/?$/ ).respond(200,dummyUser)
    var user = new Resource( '/users/:userId', {} );
    user.get({userId:1});
    $httpBackend.flush();
  });

  it('should get a single resource with additional queryParameters if properties of the parameters are not present in the url', function () {
    $httpBackend.expectGET( /\/users\/1\?foo=bar\/?$/ ).respond(200,dummyUser)
    var user = new Resource( '/users/:userId', {} );
    user.get({userId:1},{foo:'bar'});
    $httpBackend.flush();    
  });

  it('should get a single resource and not nested if only parameter for first resource is passed in', function () {
    var user = new Resource( '/users/:userId/books/:bookId', {} );
    $httpBackend.expectGET( /\/users\/1\/?$/ ).respond(200,dummyUser)
    user.get({userId:1});
    $httpBackend.flush();

    $httpBackend.expectGET( /\/users\/1\/?$/ ).respond(200,dummyUser)
    user.get(1);
    $httpBackend.flush();
  });

  it('should get the nested resource until the defined parameters', function () {
    $httpBackend.expectGET( /\/users\/1\/books\/1\/?$/ ).respond(200,dummyBook)
    var userBooks = new Resource( '/users/:userId/books/:bookId', {} );
    userBooks.get({userId:1,bookId:1});
    $httpBackend.flush();
  });

  it('should fallback to defaultParameters when parameters during operation are not passed in', function () {
    $httpBackend.expectGET( /\/users\/1\/?$/ ).respond(200,dummyUser)
    var user = new Resource( '/users/:userId/books/:bookId', {userId:1} );
    user.get();
    $httpBackend.flush();
  });

  it('should POST to a resource set', function () {
    $httpBackend.expectPOST( /\/users\/?$/, dummyUser).respond(201,dummyUser)
    var user = new Resource( '/users/:userId', {} );
    user.post({},dummyUser);
    $httpBackend.flush();        
  });

  describe('nested Resource', function () {
    it('should have a property of type Resource if unresolved nested resource is available', function () {
      var user1 = new Resource( '/users/:userId/books/:bookId', {userId:1} );
      expect(user1).to.have.property('books');
      expect(user1.books).to.be.an.instanceof(Resource);
    });
    it('should get a single nested resource', function () {
      var user1 = new Resource( '/users/:userId/books/:bookId', {userId:1} );

      $httpBackend.expectGET( /\/users\/1\/books\/1\/?$/ ).respond(200,dummyBook)
      user1.get({bookId:1});
      $httpBackend.flush();
      
      /* fix mergeParams when performing request */
      // $httpBackend.expectGET( /\/users\/1\/books\/1\/?$/ ).respond(200,dummyBook)
      // user1.books.get({bookId:1});
      // $httpBackend.flush();

      $httpBackend.expectGET( /\/users\/1\/books\/1\/?$/ ).respond(200,dummyBook)
      user1.books.get(1);
      $httpBackend.flush();
    });

    it('should have properties for deeply nested resource', function () {
      var user1Book1 = new Resource( '/users/:userId/books/:bookId/something/:somethingId', {userId:1,bookId:1} );
      expect(user1Book1).to.have.property('something');
      expect(user1Book1.something).to.be.an.instanceof(Resource);
    });

    it('should populate deeply nested resources', function () {
      var user1 = new Resource( '/users/:userId/books/:bookId/something/:somethingId', {userId:1} );
      expect(user1).to.have.property('books');
      var user1Book1 = user1.getResourceFor({bookId:1});
      expect(user1Book1).to.have.property('something');
      expect(user1Book1.something).to.be.an.instanceof(Resource);
    });

    it('should get a deeply nested resource ', function () {
      var user1Book1 = new Resource( '/users/:userId/books/:bookId/something/:somethingId', {userId:1,bookId:1} );
      $httpBackend.expectGET( /\/users\/1\/books\/1\/something\/1\/?$/ ).respond(200,dummySomething)
      user1Book1.something.get(1);
      $httpBackend.flush();
    });
  });

});
