!(function(angular){
  'use strict';

  var $modestErr = angular.$$minErr('modest');

  var modestHelpers = angular.module('modest.helpers',[]);

  var modest = angular.module('modest',['modest.helpers']);

  modest.factory('Resource',['$http','ResourceHelpers',function($http,ResourceHelpers){
    var Resource = function(url,defaultParams,parent){
      var self = this;
      var _parent = parent;
      var _defaultParams = defaultParams || {};
      var _url = url;
      var _resourceUrl = ResourceHelpers.parameterize(_url,_defaultParams);

      self._id = Math.random()*1000;
      self.$request = null;

      self.getResourceUrl = getResourceUrl;

      self.getResourceFor = getResourceFor;

      populateNestedResource(_defaultParams);

      ['get','post','put','delete','head','patch'].forEach(createRequestMethodFor);



      /* PUBLIC */
      function getResourceUrl(){
        return _resourceUrl;
      };

      function getResourceFor(params){
        return new Resource(_resourceUrl,params);
      };

      
      /* PRIVATE */
      function populateNestedResource(defaultParams){
        if( isRootResource() )return;

        var nestedResourceMatches = _resourceUrl.match(/\w+\/(\w+)\/:[^/]*/);
        var resources = _resourceUrl.match(/:[^\d|^\/]+/gi);
        if( nestedResourceMatches ){
          var nestedResource = nestedResourceMatches[1];
          if( self instanceof NestedResource ){ // TODO: use parent._id instead?
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
          self.$request = $http(httpConfig);
          return self.$request;
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


    Resource.prototype.toJSON = function() {
      var data = angular.extend({}, this);
      for(var prop in data){
        if( typeof this[prop] === 'function' )
          delete data[prop];
      }
      delete data._id;
      delete data.$request;
      delete data.$resolved;
      return data;
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

    self.parameterize = parameterize;

    self.parameterizeUntilParams = parameterizeUntilParams;

    self.getQueryParameters = getQueryParameters;

    self.getAvailableParams = getAvailableParams;

    self.limitUntilParams = limitUntilParams;




    /* PUBLIC */
    function parameterize(url,params){
      params = params || {}
      return url.replace(paramGroups, function(match, group){
        return params[group] || match;
      });
    };

    function parameterizeUntilParams(url,params){
      params = params || {}
      url = self.limitUntilParams(url,params);
      return self.parameterize(url, params);
    };
    
    function getQueryParameters(url,params){
      var queryParameters = {};
      var paramsAsArray = Object.keys(params);
      angular.forEach(paramsAsArray, function(param){
        if( !url.match(new RegExp(':'+param)) ){
          queryParameters[param] = params[param];
        }
      });
      return queryParameters;
    }

    function getAvailableParams(url,params){
      var availableParams = url.match(paramGroups);
      if( availableParams ){
        return availableParams
                .filter(filterPortAndProtocol)
                .map(mapToParamsWithoutColon);
      }
      return null;
    }
    
    function limitUntilParams(url,params){
      var availableParams = self.getAvailableParams(url,params);
      if( !availableParams ){
        return url;
      }

      var paramsToReplace = getParamsToReplace(params,availableParams);

      if( 0 === paramsToReplace.length ){
        var indexOfColon = url.search(paramRegExp);
        url = url.substring(0, indexOfColon+availableParams[0].length+1);
        var replacement = getReplacementForParams(params,availableParams[0]);
        return url.replace(new RegExp(':'+availableParams[0]), replacement);
      }

      return limitWithParams(url,paramsToReplace);
    }


    /* PRIVATE */
    function limitWithParams(url,paramsToReplace){
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

    function getParamsToReplace(params,availableParams){
      var paramsToReplace = [];
      angular.forEach(availableParams, function(availableParam){
        if( params[availableParam] !== undefined ) {
          paramsToReplace.push(availableParam);
        }
      });
      return paramsToReplace;
    }

    function getReplacementForParams(params,availableParam){
      if( angular.isNumber(params) || angular.isString(params) ) {
        return params;
      }
      return params[availableParam] || '';
    }
  }]);
})(angular,undefined);