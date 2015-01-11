!(function(angular){
  'use strict';
  var modestHelpers = angular.module('modest.helpers',[]);

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
          return url.replace(new RegExp(':'+availableParams[0]), params);
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
  }])
})(angular,undefined);