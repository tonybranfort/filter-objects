// var fs = require('fs');
// var fos = require('fos');
var fos = require('../lib/index.js');
var should = require('should');
// var profiler = require('v8-profiler');

var memoryUsage = [];

var matchFn = fos.makeMatchFn(['prop1']);

var customFn = function(pObjProp, tObjProp, cb) {
  return cb(true); 
}; 

var customFnMatchFn = fos.makeMatchFn(['prop1'], {propMatchFn: customFn});

function doesMatch(doesIt) {
  return; 
}

function snapMemoryUsage() {
  memoryUsage.push(process.memoryUsage());
}

function runMatchBatch() {
  for (var i = 10000 - 1; i >= 0; i--) {
    var tObj = {prop1: Math.random()};
    var pObj = {prop1: Math.random()}; 

    matchFn(pObj, tObj, doesMatch);

    tObj = null; 
    pObj = null; 
  }
}

function runSimpleMatchBatch() {
  for (var i = 10000 - 1; i >= 0; i--) {
    var tObj = {prop1: Math.random()};
    var pObj = {prop1: Math.random()}; 

    fos.matches(pObj, tObj, doesMatch);

    tObj = null; 
    pObj = null; 
  }
}

function runGetPropFnsBatch() {
  for (var i = 10000 - 1; i >= 0; i--) {

    fos.getPropMatchFns(['prop1','prop1.table']);

    tObj = null; 
    pObj = null; 
  }

}

function runCustomFnMatchBatch() {
  for (var i = 10000 - 1; i >= 0; i--) {
    var tObj = {prop1: Math.random()};
    var pObj = {prop1: Math.random()}; 

    customFnMatchFn(pObj, tObj, doesMatch);

    tObj = null; 
    pObj = null; 
  }

}

function runBatches(n) {
  snapMemoryUsage(); 
  for (var i = n - 1; i >= 0; i--) {
    runMatchBatch() ; 
    // runGetPropFnsBatch() ; 
    // runCustomFnMatchBatch() ; 
  }
  snapMemoryUsage();


}

runBatches(100);

console.log('Number of snaps: ');
console.log(memoryUsage.length);
console.log('Initial snap: ');
console.log(memoryUsage[0]);
console.log('Latest snap: ');
console.log(memoryUsage[memoryUsage.length-1]);
console.log('X times increase in heap');
console.log(memoryUsage[memoryUsage.length-1].heapUsed / 
  memoryUsage[0].heapUsed);

var hui = memoryUsage[0].heapUsed; 

// memoryUsage = null; 
// matchFn = null; 

global.gc();

setInterval(function() {
    console.log('After gc()');
    console.log(process.memoryUsage());
    console.log(process.memoryUsage().heapUsed / hui); 
    runBatches(100);
    }, 10000);



// describe('matchFn',function(){

//   it('should not have increasing memory usage',function(done){
//     runBatches(50);
//     // heapUsed should not have increased by more than 30%
//     var heapUsedMax = memoryUsage[0].heapUsed * 1.3; 
//     // pause for any memory cleanup
//     console.log('pause...')
//     setTimeout(snapMemoryUsage, 30000);
//     console.log(memoryUsage[memoryUsage.length-1].heapUsed / 
//       memoryUsage[0].heapUsed);

//     memoryUsage[memoryUsage.length-1].heapUsed.should.be.below(heapUsedMax); 
//     done(); 
//   }); 
// }); 


// saveHeapSnapshot(); 
// var snap1 = profiler.takeSnapshot();


// var snap2 = profiler.takeSnapshot();
// console.log(snap2.compare(snap1));

// snap1.export(function(error, result) {
//   fs.writeFileSync('performance/mem-data/snap1.json', result);
//   snapshot1.delete();
// });

// snap2.export(function(error, result) {
//   fs.writeFileSync('performance/mem-data/snap2.json', result);
//   snapshot1.delete();
// });

// saveHeapSnapshot();
// var snap = profiler.takeSnapshot('profile');
// saveHeapSnapshot(snap, 'performance/mem-data');

function saveHeapSnapshot(snapshot, datadir) {
    console.log('saveHeapSnapshot()');
    datadir = datadir ? datadir :  'performance/mem-data';
    snapshot = snapshot ? snapshot : profiler.takeSnapshot('profile');
    console.log('snap taken');
    var buffer = '';
    var stamp = Date.now();
    snapshot.serialize(
        function iterator(data, length) {
            buffer += data;
        }, function complete() {

            var name = stamp + '.heapsnapshot';
            fs.writeFile(datadir + '/' + name , buffer, function () {
                console.log('Heap snapshot written to ' + name);
            });
        }
    );
}


// Tested
//   * getPropMatchFns alone - no memory leak
//   * remove if statement from beg of matches() fn; same memory leak
//   * 
