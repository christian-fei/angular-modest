describe('sample', function() {
  var Resource;

  var $httpBackend;

  /* helpers */
  var userResourceUrl = '/users/:userId';
  var user1ResourcePath = /\/users\/1\/?$/;
  var userAndBooksResourceUrl = '/users/:userId/books/:bookId';
  var user1ResourceUrl = '/users/1';
  var dummyUser = { name:'Elvis', lastName:'Presley' };

  beforeEach(module('modest'));

  beforeEach(inject(function(_Resource_,_$httpBackend_){
    Resource = _Resource_;
    $httpBackend = _$httpBackend_;

    $httpBackend.whenGET(/\/users\/\d\/?$/).respond(200,dummyUser);
  }));
  

  it('should save the resourceUrl with which the Resource has been instanciated', function () {
    var user = new Resource( userResourceUrl );
    expect( user.getResourceUrl() ).to.equal( userResourceUrl );

    user = new Resource( userResourceUrl,{} );
    expect( user.getResourceUrl() ).to.equal( userResourceUrl );
  });

  it('should parameterize the resourceUrl if default parameters have been passed in', function () {
    var user = new Resource( userResourceUrl, {userId:1} );
    expect( user.getResourceUrl() ).to.equal( user1ResourceUrl );
  });

  it('should get a single resource when passed in the id', function () {
    $httpBackend.expectGET(user1ResourcePath).respond(200,dummyUser)
    var user = new Resource( userResourceUrl, {} );    
    user.get({userId:1});
    $httpBackend.flush();
  });

  it('should get a single resource and not nested if only parameter for first resource is passed in', function () {
    $httpBackend.expectGET(user1ResourcePath).respond(200,dummyUser)
    var user = new Resource( userAndBooksResourceUrl, {} );    
    user.get({userId:1});
    $httpBackend.flush();
  });

  it('should get the nested resource until the defined parameters', function () {
    $httpBackend.expectGET(/\/users\/1\/books\/1\/?$/).respond(200,dummyUser)
    var userBooks = new Resource( userAndBooksResourceUrl, {} );
    userBooks.get({userId:1,bookId:1});
    $httpBackend.flush();
  });

});