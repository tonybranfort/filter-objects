var pf = require('./perf-test-fns.js');
var fs = require('fs');

var PERF_RESULTS_DIR = './performance/results/';

var filenames = fs.readdirSync(PERF_RESULTS_DIR); 

filenames.forEach(function(fn) {
  var newName = fn.replace('linux_v2.0.0_','linux_aws-t2.micro_v2.0.0_');
  if(fn !== newName) {
    // console.log(fn + '     =>\n');
    console.log(newName);
    fs.renameSync(PERF_RESULTS_DIR + fn, PERF_RESULTS_DIR + newName); 
  }
});
