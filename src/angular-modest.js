!(function(angular){
  'use strict';
  var modest = angular.module('modest',['modest.helpers']);

  var $modestErr = angular.$$minErr('modest');


  modest.factory('Resource',['$http','ResourceHelpers',function($http,ResourceHelpers){
    var Resource = function(url,defaultParams,resourceName){
      var self = this;
      var _resourceName = resourceName;
      var _defaultParams = defaultParams || {};
      var _url = url;
      var _resourceUrl = ResourceHelpers.parameterize(_url,_defaultParams);

      populateNestedResource(_resourceUrl,defaultParams)

      self.getResourceUrl = function(){
        return _resourceUrl;
      };

      self.get = function(params){
        params = mergeParams(params);
        var requestUrl = ResourceHelpers.parameterizeUntilParams(_url, params);
        return $http.get(requestUrl);
      };

      function populateNestedResource(url,defaultParams){
        var nestedResourceMatches = url.match(/\w+\/(\w+)\/:[^/]*/);
        if( nestedResourceMatches ){
          var nestedResource = nestedResourceMatches[1];
          if( _resourceName === nestedResource )
            return
          self[nestedResource] = new Resource(url,defaultParams,nestedResource);
        }
      }

      function mergeParams(params){
        return angular.extend(params || {},_defaultParams);
      }
    };

    return Resource;
  }]);
})(angular,undefined);