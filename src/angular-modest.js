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

      self.getDefaultParams = function(){
        return _defaultParams;
      };

      self.getResourceUrl = function(){
        return _resourceUrl;
      };

      self.getResourceFor = function(params){
        return new Resource(url,params);
      };


      ['get','post','put','delete','head','patch'].forEach(function(method){
        var httpConfig = {};

        self[method] = (function(method){
          return function(params){
            if( !angular.isString(params) && !angular.isNumber(params) ){
              params = mergeParams(params);
            }
            httpConfig.url = ResourceHelpers.parameterizeUntilParams(_url, params);
            httpConfig.method = method;
            if( 'get'===httpConfig.method ){
              httpConfig.params = ResourceHelpers.getQueryParameters(_url,params);
            } else {
              httpConfig.data = params;
            }
            return $http(httpConfig);
          }
        })(method);
      });


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