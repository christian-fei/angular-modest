!(function(angular){
  'use strict';
  var modest = angular.module('modest',[]);

  modest.factory('Resource',['$http',function($http){
    var Resource = function(url,paramDefaults,actions,nestedResources){
      var self = this;
      var _paramDefaults = paramDefaults||{};
      var _url = parameterize(url,_paramDefaults);

      self.getUrl = function(){
        return _url;
      };

      self.get = function(parameters){
        $http.get(parameterize(_url,parameters));
      };

      function parameterize(url,parameters){
        if( !parameters || Object.keys(parameters).length == 0 )return url;
        return url.replace(/:([^/]*)/gi, function(match, group){
          return parameters[group];
        });
      }
    };

    return Resource;
  }])

})(angular,undefined);