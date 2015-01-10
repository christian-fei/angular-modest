!(function(angular){
  'use strict';
  var modestHelpers = angular.module('modest.helpers',[]);

  modestHelpers.service('ResourceHelpers',[function(){
    var self = this;
    self.parameterize = function(url,params){
      params = params || {}
      url = self.limitUrlUntilProvidedParams(url,params);
      return url.replace(/:([^/]*)/gi, function(match, group){
        return params[group] || match;
      });
    }
    self.limitUrlUntilProvidedParams = function(url,params){
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
        return url.substring(0,url.indexOf(':'));
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