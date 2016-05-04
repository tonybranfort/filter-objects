var pf = require('./perf-test-fns.js');
var fs = require('fs');

pf.writeOverallSummary(pf.getAllPerfResults());

// var PERF_RESULTS_DIR = './performance/results/';

// var filenames = fs.readdirSync(PERF_RESULTS_DIR); 

// filenames.forEach(function(fn) {
//   var newName = fn.replace('linux_v1.0.6_','linux_aws-t2.micro_v1.0.6_');
//   if(fn !== newName) {
//     // console.log(fn + '     =>\n');
//     console.log(newName);
//     fs.renameSync(PERF_RESULTS_DIR + fn, PERF_RESULTS_DIR + newName); 
//   }
// });
