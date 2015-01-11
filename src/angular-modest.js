!(function(angular){
  'use strict';

  var $modestErr = angular.$$minErr('modest');

  var modestHelpers = angular.module('modest.helpers',[]);

  var modest = angular.module('modest',['modest.helpers']);

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
          return function(params,payload){
            if( !angular.isString(params) && !angular.isNumber(params) ){
              params = mergeParams(params);
            }
            httpConfig.url = ResourceHelpers.parameterizeUntilParams(_url, params);
            httpConfig.method = method;
            if( payload ) {
              if( 'get'===httpConfig.method ){
                httpConfig.params = ResourceHelpers.getQueryParameters(_url,payload);
              } else {
                httpConfig.data = payload;
              }
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


  modestHelpers.service('ResourceHelpers',[function(){
    var self = this;

    self.parameterize = function(url,params){
      params = params || {}
      return url.replace(/:([^/]*)/gi, function(match, group){
        return params[group] || match;
      });
    };

    self.parameterizeUntilParams = function(url,params){
      params = params || {}
      url = limitUrlUntilProvidedParams(url,params);
      return self.parameterize(url, params);
    };

    self.getQueryParameters = function(url,params){
      var queryParameters = {};
      if( angular.isString(params) || angular.isNumber(params) || !params ){
        return queryParameters;
      }
      var paramsAsArray = Object.keys(params);
      angular.forEach(paramsAsArray, function(param){
        if( !url.match(new RegExp(':'+param)) ){
          queryParameters[param] = params[param];
        }
      });
      return queryParameters;
    };


    function limitUrlUntilProvidedParams(url,params){
      var availableParams = url.match(/:([^/]*)/gi);

      if( !availableParams || availableParams.length == 0 ){
        var indexOfColon = url.indexOf(':');
        var end = indexOfColon>0 ? indexOfColon : url.length;
        return url.substr(0,end);
      }

      availableParams = availableParams.map(function(p){
        return p.substr(1);
      });

      var paramsToReplace = [];

      angular.forEach(availableParams, function(availableParam){
        if( params[availableParam] !== undefined ) {
          paramsToReplace.push(availableParam);
        }
      });

      if( 0 === paramsToReplace.length ){
        var indexOfColon = url.indexOf(':');
        if( availableParams.length > 0 ){
          url = url.substring(0, indexOfColon+availableParams[0].length+1);
          var replacement = '';
          if( params[availableParams[0]] ){
            replacement = params[availableParams[0]];
          } else if( angular.isNumber(params) || angular.isString(params) ) {
            replacement = params;
          }
          return url.replace(new RegExp(':'+availableParams[0]), replacement);
        }
        return url.substring(0,indexOfColon);
      }

      var limitedUrl = '';

      var prevParamToReplace = '';

      angular.forEach(paramsToReplace,function(paramToReplace){
        paramToReplace = ':'+paramToReplace;
        var start = url.indexOf(prevParamToReplace)+prevParamToReplace.length;
        var end = url.indexOf(paramToReplace)+paramToReplace.length;
        limitedUrl += url.substr(start, end);
        prevParamToReplace = paramToReplace;
      });

      return limitedUrl;
    }
  }]);
})(angular,undefined);