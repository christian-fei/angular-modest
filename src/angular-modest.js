!(function(angular){
  'use strict';
  var modest = angular.module('modest',[]);

  modest.factory('Resource',['$http',function($http){
    var Resource = function(url,paramDefaults,actions,nestedResources){
      var self = this;
      var _paramDefaults = paramDefaults||{};
      var _url = parameterize(url,_paramDefaults);

      self.getUrl = function(){
        return _url;
      };

      self.get = function(params){
        $http.get(parameterize(_url,params));
      };

      function parameterize(url,params){
        if( !params || Object.keys(params).length == 0 )return url;
        url = limitUrlUntilProvidedParams(url,params);
        return url.replace(/:([^/]*)/gi, function(match, group){
          return params[group];
        });
      }
      function limitUrlUntilProvidedParams(url,params){
        var availableParams = url.match(/:([^/]*)/gi).map(function(p){
          return p.substr(1);
        })
        var paramsToReplace = [];

        angular.forEach(availableParams, function(availableParam){
          if( params[availableParam] !== undefined ) {
            paramsToReplace.push(availableParam);
          }
        });

        var limitedUrl = '';

        var prevParamToReplace = '';

        angular.forEach(paramsToReplace,function(paramToReplace){
          paramToReplace = ':'+paramToReplace;
          limitedUrl += url.substring(url.indexOf(prevParamToReplace),url.indexOf(paramToReplace)+paramToReplace.length)
          prevParamToReplace = paramToReplace;
        });

        return limitedUrl;
      }
    };

    return Resource;
  }])

})(angular,undefined);