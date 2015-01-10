describe('sample', function() {
  var Resource;

  var $httpBackend;

  /* helpers */
  var userResourceUrl = '/users/:userId';
  var user1ResourceUrl = '/users/1';

  beforeEach(module('modest'));

  beforeEach(inject(function(_Resource_,_$httpBackend_){
    Resource = _Resource_;
    $httpBackend = _$httpBackend_;
  }));
  

  it('should save the resourceUrl with which the Resource has been instanciated', function () {
    var resource = new Resource( userResourceUrl );
    expect( resource.getUrl() ).to.equal( userResourceUrl );

    resource = new Resource( userResourceUrl,{} );
    expect( resource.getUrl() ).to.equal( userResourceUrl );
  });

  it('should parameterize the resourceUrl if default parameters have been passed in', function () {
    var resource = new Resource( userResourceUrl, {userId:1} );
    expect( resource.getUrl() ).to.equal( user1ResourceUrl );
  });

  it('should get a single resource when passed in the id', function () {
    $httpBackend.expectGET(/\/users\/1/).respond(200,{
      name:'Elvis',
      lastName:'Presley'
    })
    var resource = new Resource( userResourceUrl, {} );    
    resource.get({userId:1});

    $httpBackend.flush();
  });
});