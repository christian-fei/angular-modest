!(function(angular){
  'use strict';
  var modest = angular.module('modest',[]);

  modest.service('Say',function(){
    var self = this;
    this.thanks = function(lang){
      if( lang=='it' ){
        return 'Grazie';
      }
      return 'Thanks';
    }
  })
})(angular,undefined);