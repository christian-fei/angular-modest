!(function(angular){
  'use strict';
  var modest = angular.module('modest',['modest.helpers']);

  modest.factory('Resource',['$http','ResourceHelpers',function($http,ResourceHelpers){
    var Resource = function(url,paramDefaults,actions,nestedResources){
      var self = this;
      var _paramDefaults = paramDefaults || {};
      var _url = url;
      var _resourceUrl = ResourceHelpers.parameterize(_url,_paramDefaults);

      self.getResourceUrl = function(){
        return _resourceUrl;
      };

      self.get = function(params){
        params = mergeWithDefaultParams(params);
        var requestUrl = ResourceHelpers.parameterize(_url, params);
        return $http.get(requestUrl);
      };

      function mergeWithDefaultParams(params){
        return angular.extend(params || {},_paramDefaults);
      }
    };

    return Resource;
  }]);
})(angular,undefined);