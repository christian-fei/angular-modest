var coberturaBadger = require('istanbul-cobertura-badger');
var path = require('path');

var coberturaFile = "coverage/cobertura.txt";
var destinationPath = process.env.PWD

coberturaBadger(coberturaFile, destinationPath, function() {
  console.log("Badge created at " + destinationPath + "/coverage.svg");
});