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

  describe('#getResourceUrl', function () {
    it('should preserve the unparameterized url if none are passed', function () {
      var user = new Resource( '/users/:userId' );
      expect( user.getResourceUrl() ).to.equal( '/users/:userId' );
    });
    it('should replace the parameter', function () {
      var user = new Resource( '/users/:userId', {userId:1} );
      expect( user.getResourceUrl() ).to.equal( '/users/1' );
    });
  });

  describe('url', function () {
    it('should make a request to a domain', function () {
      var user = new Resource( 'example.com/users/:userId/books/:bookId', {} );
      $httpBackend.expectGET(/example\.com\/users\/?$/).respond(200,dummyUser);
      user.get();
      $httpBackend.flush();
    });

    it('should make a request to a domain with port', function () {
      var user = new Resource( 'localhost:8080/users/:userId/books/:bookId', {} );
      $httpBackend.expectGET(/localhost:8080\/users\/?$/).respond(200,dummyUser);
      user.get();
      $httpBackend.flush();
    });

    it('should make a request to a domain with port and protocol', function () {
      var user = new Resource( 'http://localhost:8080/users/:userId/books/:bookId', {} );
      $httpBackend.expectGET(/http:\/\/localhost:8080\/users\/?$/).respond(200,dummyUser);
      user.get();
      $httpBackend.flush();
    });

    it('should make a request to a domain with port and protocol and still be able to replace parameters', function () {
      var user = new Resource( 'http://localhost:8080/users/:userId/books/:bookId', {} );
      $httpBackend.expectGET(/http:\/\/localhost:8080\/users\/1\/?$/).respond(200,dummyUser);
      user.get(1);
      $httpBackend.flush();
    });

  });

  describe('resource set', function () {
    afterEach(function () {
      $httpBackend.flush();  
    });
    
    it('should get the resource set when no parameters are provided when performing request', function () {
      var user = new Resource( '/api/users/:userId/books/:bookId', {} );
      $httpBackend.expectGET(/\/users\/?$/).respond(200,dummyUser);
      user.get();
    });

    it('should get the resource set when no parameters are provided in the url', function () {
      var user = new Resource( '/api/users/', {} );
      $httpBackend.expectGET(/\/users\/?$/).respond(200,dummyUser);
      user.get();
    });

    it('should create a resource by POSTing to resource set', function () {
      $httpBackend.expectPOST( /\/api\/users\/?$/, dummyUser).respond(201,dummyUser)
      var user = new Resource( '/api/users/:userId', {} );
      user.post({},dummyUser);
    });
  });

  describe('resource', function () {
    afterEach(function () {
      $httpBackend.flush();  
    });

    it('should get the resource when parameters are provided', function () {
      $httpBackend.expectGET( /\/users\/1\/?$/ ).respond(200,dummyUser)
      var user = new Resource( '/users/:userId', {} );
      user.get({userId:1});
    });

    it('should get the resource with additional queryParameters', function () {
      $httpBackend.expectGET( /\/users\/1\?foo=bar\/?$/ ).respond(200,dummyUser)
      var user = new Resource( '/users/:userId', {} );
      user.get({userId:1},{foo:'bar'});
    });

    it('should get the first resource until the provided parameter', function () {
      var user = new Resource( '/users/:userId/books/:bookId', {} );
      $httpBackend.expectGET( /\/users\/1\/?$/ ).respond(200,dummyUser)
      user.get({userId:1});
      $httpBackend.flush();

      $httpBackend.expectGET( /\/users\/1\/?$/ ).respond(200,dummyUser)
      user.get(1);
    });

    it('should get the resource with fallback to defaultParameters when parameters during operation are not provided', function () {
      $httpBackend.expectGET( /\/users\/1\/?$/ ).respond(200,dummyUser)
      var user = new Resource( '/users/:userId/books/:bookId', {userId:1} );
      user.get();
    });

    it('should get a deeply nested resource ', function () {
      var user1Book1 = new Resource( '/users/:userId/books/:bookId/something/:somethingId', {userId:1,bookId:1} );
      $httpBackend.expectGET( /\/users\/1\/books\/1\/something\/1\/?$/ ).respond(200,dummySomething)
      user1Book1.something.get(1);
    });
  });





  describe('nested Resource', function () {
    it('should get the nested resource until the provided parameters', function () {
      $httpBackend.expectGET( /\/users\/1\/books\/1\/?$/ ).respond(200,dummyBook)
      var userBooks = new Resource( '/users/:userId/books/:bookId', {} );
      userBooks.get({userId:1,bookId:1});
      $httpBackend.flush();

      $httpBackend.expectGET( /\/users\/1\/books\/1\/?$/ ).respond(200,dummyBook)
      userBooks = new Resource( '/users/:userId/books/:bookId', {userId:1} );
      userBooks.get({bookId:1});
      $httpBackend.flush();

      $httpBackend.expectGET( /\/users\/1\/books\/1\/?$/ ).respond(200,dummyBook)
      var user1 = new Resource( '/users/:userId/books/:bookId', {userId:1} );
      user1.books.get({bookId:1});
      $httpBackend.flush();
    });

    it('should have a property of type Resource if unresolved nested resource is available', function () {
      var user1 = new Resource( '/users/:userId/books/:bookId', {userId:1} );
      expect(user1).to.have.property('books');
      expect(user1.books).to.be.an.instanceof(Resource);
      expect(user1.books.getResourceUrl()).to.equal('/users/1/books/:bookId');
    });

    it('should have properties for deeply nested resources until provided parameters', function () {
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
      expect(user1Book1.something.getResourceUrl()).to.equal('/users/1/books/1/something/:somethingId');
    });
  });

  describe('edge-cases', function () {
    it('should ignore parameters not present in the url', function () {
      $httpBackend.expectGET( /\/users\/?$/ ).respond(200,dummyUser)
      var user = new Resource( '/users/:userId/books/:bookId', {} );
      user.get({foo:'bar'});
      $httpBackend.flush();  
    });
  });

});
