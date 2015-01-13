!(function(angular){
  'use strict';

  var $modestErr = angular.$$minErr('modest');

  var modestHelpers = angular.module('modest.helpers',[]);

  var modest = angular.module('modest',['modest.helpers']);

  modest.factory('Resource',['$http','ResourceHelpers',function($http,ResourceHelpers){
    var Resource = function(url,defaultParams,parent){
      var self = this;
      self.id = Math.random()*1000;
      var _parent = parent;
      var _defaultParams = defaultParams || {};
      var _url = url;
      var _resourceUrl = ResourceHelpers.parameterize(_url,_defaultParams);

      self.getResourceUrl = getResourceUrl;

      self.getResourceFor = getResourceFor;

      populateNestedResource(_defaultParams);

      ['get','post','put','delete','head','patch'].forEach(createRequestMethodFor);




      function getResourceUrl(){
        return _resourceUrl;
      };

      function getResourceFor(params){
        return new Resource(_resourceUrl,params);
      };

      function populateNestedResource(defaultParams){
        if( isRootResource() )return;

        var nestedResourceMatches = _resourceUrl.match(/\w+\/(\w+)\/:[^/]*/);
        var resources = _resourceUrl.match(/:[^\d|^\/]+/gi);
        if( nestedResourceMatches ){
          var nestedResource = nestedResourceMatches[1];
          if( self instanceof NestedResource ){ // TODO: use parent.id instead?
            return;
          }
          self[nestedResource] = new NestedResource(_resourceUrl,defaultParams,self);
        }
      }

      function isRootResource(){
        return !parent && Object.keys(_defaultParams).length == 0;
      }

      function createRequestMethodFor(method){
        self[method] = function(params,payload){
          var httpConfig = {};
          params = setParams(params);
          httpConfig.url = ResourceHelpers.parameterizeUntilParams(_url, params);
          httpConfig.method = method;

          httpConfig = setPayload(httpConfig,payload);
          return $http(httpConfig);
        }
      }

      function setParams(params){
        if( !angular.isString(params) && !angular.isNumber(params) ){
          return mergeParams(params);
        }
        return params;
      }

      function setPayload(httpConfig,payload){
        if( payload ) {
          if( httpConfig.method.match(/get/i) ){
            httpConfig.params = ResourceHelpers.getQueryParameters(_url,payload);
          } else {
            httpConfig.data = payload;
          }
        }
        return httpConfig;
      }

      function mergeParams(params){
        return angular.extend(params || {},_defaultParams);
      }

    };

    var NestedResource = function(){ Resource.apply(this,arguments); };

    NestedResource.prototype=Object.create(Resource.prototype);
    NestedResource.prototype.constructor=NestedResource;


    return Resource;
  }]);


  modestHelpers.service('ResourceHelpers',[function(){
    var self = this;

    var paramRegExp = /:[^\d|^\/]/gi;

    var paramGroups = /:([^/]*)/gi;

    self.parameterize = function(url,params){
      params = params || {}
      return url.replace(paramGroups, function(match, group){
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
      var paramsAsArray = Object.keys(params);
      angular.forEach(paramsAsArray, function(param){
        if( !url.match(new RegExp(':'+param)) ){
          queryParameters[param] = params[param];
        }
      });
      return queryParameters;
    };

    function limitUrlUntilProvidedParams(url,params){
      var availableParams = url.match(paramGroups);
      if( !availableParams ) return url;

      var paramsToReplace = [];
      var indexOfColon = url.search(paramRegExp);

      availableParams = availableParams
                          .filter(filterPortAndProtocol)
                          .map(mapToParamsWithoutColon);

      angular.forEach(availableParams, function(availableParam){
        if( params[availableParam] !== undefined ) {
          paramsToReplace.push(availableParam);
        }
      });
      
      if( 0 === paramsToReplace.length ){
        url = url.substring(0, indexOfColon+availableParams[0].length+1);
        var replacement = getReplacementForParams(params,availableParams[0]);
        return url.replace(new RegExp(':'+availableParams[0]), replacement);
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

    function mapToParamsWithoutColon(param){
      return param.substr(1);
    }

    function filterPortAndProtocol(param){
      return param.match(/^:[^\d+|^\/]/);
    }

    function getReplacementForParams(params,availableParam){
      if( angular.isNumber(params) || angular.isString(params) ) {
        return params;
      }
      return params[availableParam] || '';
    }
  }]);
})(angular,undefined);