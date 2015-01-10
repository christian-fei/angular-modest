!(function(angular){
  'use strict';
  var modest = angular.module('modest',['modestHelpers']);

  modest.factory('Resource',['$http','ResourceHelpers',function($http,ResourceHelpers){
    var Resource = function(url,paramDefaults,actions,nestedResources){
      var self = this;
      var _paramDefaults = paramDefaults||{};
      var _url = url;
      var _resourceUrl = ResourceHelpers.parameterize(_url,_paramDefaults);

      self.getResourceUrl = function(){
        return _resourceUrl;
      };

      self.get = function(params){
        var requestUrl = ResourceHelpers.parameterize(_resourceUrl,params);
        $http.get(requestUrl);
      };
    };

    return Resource;
  }]);
})(angular,undefined);