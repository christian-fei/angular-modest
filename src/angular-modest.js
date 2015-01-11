!(function(angular){
  'use strict';
  var modest = angular.module('modest',['modest.helpers']);

  modest.factory('Resource',['$http','ResourceHelpers',function($http,ResourceHelpers){
    var Resource = function(url,defaultParams){
      var self = this;
      var _defaultParams = defaultParams || {};
      var _url = url;
      var _resourceUrl = ResourceHelpers.parameterize(_url,_defaultParams);

      populateNestedResource(_resourceUrl,defaultParams)

      self.getResourceUrl = function(){
        return _resourceUrl;
      };

      self.get = function(params){
        params = mergeWithDefaultParams(params);
        var requestUrl = ResourceHelpers.parameterizeUntilParams(_url, params);
        console.log( requestUrl );
        return $http.get(requestUrl);
      };

      function populateNestedResource(url,defaultParams){
        console.log( 'resourceUrl', url );
      }

      function mergeWithDefaultParams(params){
        return angular.extend(params || {},_defaultParams);
      }
    };

    return Resource;
  }]);
})(angular,undefined);