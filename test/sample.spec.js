describe('sample', function() {
  var Resource;

  /* helpers */
  var userResourceUrl = '/user/:userId';
  var user1ResourceUrl = '/user/1';

  beforeEach(module('modest'));

  beforeEach(inject(function(_Resource_){
    Resource = _Resource_;
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
});