var coberturaReport = "coverage/cobertura.txt";
var badgeDestinationPath = process.env.PWD;

require('istanbul-cobertura-badger')(coberturaReport, badgeDestinationPath, function() {
  console.log("Badge created at " + badgeDestinationPath + "/coverage.svg");
});