!(function(angular){
  'use strict';
  var modest = angular.module('modest',['modest.helpers']);

  modest.factory('Resource',['$http','ResourceHelpers',function($http,ResourceHelpers){
    var Resource = function(url,defaultParams,isNested){
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
        return $http.get(requestUrl);
      };

      function populateNestedResource(url,defaultParams){
        //very ugly hack to stop recursion, have to think about it
        if( isNested )return;

        var nestedResourceMatches = url.match(/\w+\/(\w+)\/:[^/]*/);
        if( nestedResourceMatches ){
          var nestedResource = nestedResourceMatches[1];
          if( !self[nestedResource] ){
            self[nestedResource] = new Resource(url,defaultParams,true);
          }
        }
      }

      function mergeWithDefaultParams(params){
        return angular.extend(params || {},_defaultParams);
      }
    };

    return Resource;
  }]);
})(angular,undefined);