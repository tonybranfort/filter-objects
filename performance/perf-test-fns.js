var getEnv = require('./get-env.js'); 
var fs = require('fs'); 
var fos = require('../lib/index.js');
var jStat = require('jstat').jStat;
var perfTests = require('./perf-tests.js');

var PERF_RESULTS_FILE = './performance/perf-test-results.json'; 
var DATA_FOLDER = './performance/data/'; 
var PERF_RESULTS_DIR = './performance/results/';
var package_file = './package.json';

var testFns = {
  testMatchSimple : function(pObjs, tObjs) {
    var nTests = 0;   // number of tests executed
    var nProps = fos.getObjectProperties(pObjs[0]).length;  // number of properties to be matched in each test 
    var nObjs = 1; // nObjs tested in each test; non-filter so = 1

    var nMatchTest = 0; 
    var results = {}; 
    testTimes = []; 
    console.log('   > Testing...');
    var begTime = process.hrtime();
    for (var i = tObjs.length - 1; i >= 0; i--) {
      var t = process.hrtime();
      var m = fos.matches(pObjs[i], tObjs[i]);
      onTest(m); 
    }

    results.testTime = getTestTime(begTime); 
    results.perMatchMsStats = getStats(testTimes); 
    results.matchPercent = nMatchTest / testTimes.length * 100; 
    results.nMatchObjsPercent = results.matchPercent;// =s because not a filter
    results.nMatchTest = nMatchTest;
    results.nMatchObjs = nMatchTest;   // =s # of tests because not a filter

    results.nTests = nTests; 
    results.nProps = nProps; 
    results.nObjs  = nObjs; 

    console.log('   < Done.  Match ' + results.matchPercent + '%'); 

    return results; 

    function onTest(doesMatch) {
      var testTime = getTestTime(t);
      nTests++; 
      testTimes.push(testTime.totalMs); 
      nMatchTest = doesMatch === true ? nMatchTest+1 : nMatchTest; 
      return; 
    }
  },
  testMatch : function(pObjs, tObjs, props) {
    var nTests = 0;   // number of tests executed
    var nProps = props ?  
      Object.keys(props).length : fos.getObjectProperties(pObjs[0]).length;   
    var nObjs = 1; // nObjs tested in each test; non-filter so = 1
    var nMatchTest = 0; 
    var results = {}; 
    testTimes = []; 
    console.log('   > Testing...');
    var begTime = process.hrtime();
    for (var i = tObjs.length - 1; i >= 0; i--) {
      var ps = props ? props : fos.getObjectProperties(pObjs[i]);
      var f = fos.makeMatchFn(ps);
      var t = process.hrtime();
      var m = f(pObjs[i], tObjs[i]);
      onTest(m); 
    }

    results.testTime = getTestTime(begTime); 
    results.perMatchMsStats = getStats(testTimes); 
    results.matchPercent = nMatchTest / testTimes.length * 100; 
    results.nMatchObjsPercent = results.matchPercent;// =s because not a filter
    results.nMatchTest = nMatchTest;
    results.nMatchObjs = nMatchTest;   // =s # of tests because not a filter

    results.nTests = nTests; 
    results.nProps = nProps; 
    results.nObjs  = nObjs; 

    console.log('   < Done.  Match ' + results.matchPercent + '%'); 

    return results; 

    function onTest(doesMatch) {
      var testTime = getTestTime(t);
      nTests++; 
      testTimes.push(testTime.totalMs); 
      nMatchTest = doesMatch === true ? nMatchTest+1 : nMatchTest; 
      return; 
    }
  },
  testFilter : function(pObjs, tObjs, props, options) {
    var nTests = 0;   // number of tests executed
    // number of properties to be matched in each test 
    //  note that Object.keys(props).length works whether props is an array or obj
    var nProps = props ?  
      Object.keys(props).length : fos.getObjectProperties(pObjs[0]).length;   
    var nObjs = tObjs.length;  // nObjs tested in each test 
    var nMatchTest = 0;    // count of how many tests had at least one filtered object
    var nMatchObjs = 0;      // total number of filtered objects matched (returned) across all tests

    var results = {}; 
    testTimes = []; 
    console.log('   > Testing...');
    var begTime = process.hrtime();
    for (var i = pObjs.length - 1; i >= 0; i--) {
      var ps = props ? props : fos.getObjectProperties(pObjs[i]);
      var f = fos.makeFilterFn(ps, options);
      var t = process.hrtime();
      var fObjs = f(pObjs[i], tObjs);
      onTest(fObjs); 
    }

    results.testTime = getTestTime(begTime); 
    results.perMatchMsStats = getStats(testTimes, nProps); 
    results.nMatchTest = nMatchTest; 
    results.nMatchObjs = nMatchObjs; 

    results.nTests = nTests; 
    results.nProps = nProps; 
    results.nObjs  = nObjs; 

    results.matchPercent = nMatchTest / testTimes.length * 100; 
    results.nMatchObjsPercent = 
        nMatchObjs / (testTimes.length * tObjs.length) * 100;

    console.log('   < Done.  Match ' + results.matchPercent + '%'); 


    return results; 

    function onTest(filteredObjs) {
      var testTime = getTestTime(t);
      nTests++; 
      testTimes.push(testTime.totalMs); 
      nMatchTest = filteredObjs && filteredObjs.length > 0  ? 
          nMatchTest +1 : nMatchTest; 
      nMatchObjs = filteredObjs ? nMatchObjs + filteredObjs.length : nMatchObjs;

      return; 
    }
  },
  filterJsArray : function(pObjs, tObjs, props, options) {
    var nTests = 0;   // number of tests executed
    var nObjs = tObjs.length;  // nObjs tested in each test 
    var nMatchTest = 0;    // count of how many tests had at least one filtered object
    var nMatchObjs = 0;      // total number of filtered objects matched (returned) across all tests

    var nProps = 1; 

    var results = {}; 
    testTimes = []; 
    console.log('   > Testing...');
    var begTime = process.hrtime();
    for (var i = pObjs.length - 1; i >= 0; i--) {
      var f;
      if(props[0] === 'xCIyyA.NUeUFIa.YwYa.boVGzmWj') {
        f = getK4dFilter(pObjs[i]);
      } else if (props[0] === 'ABpwoNN') {
        f = getK1dFilter(pObjs[i]);
      }

      var t = process.hrtime();
      var fObjs = tObjs.filter(f);
      onTest(fObjs);
    }

    results.testTime = getTestTime(begTime); 
    results.perMatchMsStats = getStats(testTimes, nProps); 
    results.nMatchTest = nMatchTest; 
    results.nMatchObjs = nMatchObjs; 

    results.nTests = nTests; 
    results.nProps = nProps; 
    results.nObjs  = nObjs; 

    results.matchPercent = nMatchTest / testTimes.length * 100; 
    results.nMatchObjsPercent = 
        nMatchObjs / (testTimes.length * tObjs.length) * 100;

    console.log('   < Done.  Match ' + results.matchPercent + '%'); 


    return results; 

    function getK4dFilter(pObj) {
      return function ftr(tObj) {
        var matches = pObj.xCIyyA.NUeUFIa.YwYa.boVGzmWj === 
          tObj.xCIyyA.NUeUFIa.YwYa.boVGzmWj;
        return matches; 
      };
    }

    function getK1dFilter(pObj) {
      return function ftr(tObj) {
        var matches = pObj.ABpwoNN === tObj.ABpwoNN;
        return matches; 
      };
    }

    function onTest(filteredObjs) {
      var testTime = getTestTime(t);
      nTests++; 
      testTimes.push(testTime.totalMs); 
      nMatchTest = filteredObjs && filteredObjs.length > 0  ? 
          nMatchTest +1 : nMatchTest; 
      nMatchObjs = filteredObjs ? nMatchObjs + filteredObjs.length : nMatchObjs;

      return; 
    }
  }


};

function runTest(testConfig, resultsFileName) {
  // resultsFileName = PERF_RESULTS_DIR + resultsFileName; 
  // resultsFileName = resultsFileName; 
  var test = initTestObject(testConfig); 
  console.log('  ' + test.testName); 
  console.log('   > Reading data files...');

  var tObjTestFileObj = getJsonFileAsObj(DATA_FOLDER + testConfig.tObj.fileName); 
  var pObjTestFileObj = getJsonFileAsObj(DATA_FOLDER + testConfig.pObj.fileName); 

  var tObjs = tObjTestFileObj.objects;
  var pObjs = pObjTestFileObj.objects;

  console.log('   < Data files read and parsed.'); 

  test.tObj.template = tObjTestFileObj.template; 
  test.pObj.template = pObjTestFileObj.template; 

  test.pObj.count = pObjs.length; 
  test.tObj.count = tObjs.length; 
  test.pObj.sample = pObjs[0]; 
  test.tObj.sample = tObjs[0]; 

  test.results = testFns[testConfig.testFn](
        pObjs, tObjs, testConfig.props, testConfig.options); 
  writeTestResult(test, resultsFileName); 
}

function initTestObject(testConfig) {
  var test = {}; 
  var id = Date.now(); 
  var d = new Date(id); 
  test.id = id; 
  test.testName = testConfig.testName; 
  test.date = new Date(); 
  test.testConfig = testConfig;
  test.pObj = {}; 
  test.tObj = {};  
  test.env = getEnv.getEnv(); 

  test.packageInfo = getPackageInfo();   
  return test; 
}

function getStats(nbrsArray) {
  // returns an object of stats given an array of numbers
    var jObj = jStat(nbrsArray); 
    var q = jObj.quantiles([0.1, 0.25, 0.5, 0.75, 0.90, 0.95, 0.99]);

    var stats = {};

    stats.q10 = q[0]; 
    stats.q25 = q[1]; 
    stats.q50 = q[2]; 
    stats.q75 = q[3]; 
    stats.q90 = q[4]; 
    stats.q95 = q[5]; 
    stats.q99 = q[6]; 

    stats.max = jObj.max();
    stats.min = jObj.min();
    stats.stdev = jObj.stdev();
    stats.mean = jObj.mean(); 

    return stats; 
}


function getTestTime(time) {
  // 1 second = 1,000 Millisecond (ms)
  // 1 Millisecond = 1,000,000 nanoseconds (ns)
  // hrtime() = [seconds, nanoseconds]
  // https://nodejs.org/api/process.html#process_process_hrtime
  var testTime = {} ;
  testTime.hrtimeDiff = process.hrtime(time); 
  testTime.totalMs = 
      testTime.hrtimeDiff[0] * 1000 + 
      testTime.hrtimeDiff[1] / 1e6; 
  // testTime.hrtimeDiff = JSON.stringify(testTime.hrtimeDiff);

  return testTime; 
}

function writeTestResult(test, fileName) {
  var perfResults = []; 
  if(fs.existsSync(PERF_RESULTS_DIR + fileName)) {
    perfResults = getPerfTestResults(fileName);
  } else {
    initializeResultsFile(fileName); 
  }
  perfResults.push(test);  
  fs.writeFileSync(
      PERF_RESULTS_DIR + fileName, 
      JSON.stringify(perfResults, null, ' ') 
  ); 
}

function writeSummarizedTestResult(resultsFileName) {
  var summary = getSummarizedTestResult(resultsFileName); 

  var fileOut = 
      PERF_RESULTS_DIR + 
      resultsFileName.replace('.json', '') +  
      '_SUMMARY.txt';

  fs.writeFileSync(fileOut,summary); 

  return summary; 

}

function sortByTestName(a,b) {
  if(a.testName < b.testName) {
    return -1;
  }
  if(a.testName > b.testName) {
    return 1;
  }
  return 0;
}

function getSummarizedTestResult(resultsFileName) {
  var fileName = PERF_RESULTS_DIR + resultsFileName; 
  var outStr = '';
  outStr = 'resultsFileName : ' + resultsFileName + '\n';
  var header = 
    'seq  '  +
    '     nT ' + 
    '      nO ' + 
    '      nP ' + 
    '   T-q50 '  +
    '  T-q95 '  + 
    '  T-q99 '  + 
    '  T-max '  + 
    ' T-stdev'  + 
    '  P-q50 '  +
    '  P-q95  '  + 
    '   mT%  ' + 
    '   mO% ' + 
    padRight('  testName',75) + 
    '\n';
  var footer = 
    'seq = sequence (order) in which the test was executed\n' + 
    'T-xxx = time in ms for a test to return true or false\n' + 
    'nT = number of tests; eg match(pObj, tObj) or filter(pObj,tObjs)\n' + 
    'nP = number of properties tested for match in each test \n' +
    'nO = number of objects tested in each test (non-filter = 1, filter > 1)\n'+
    'mT% = match %age using n; ie # of tests that returned true\n' + 
    'P-qxx = time in ms for one property to be tested as \n' +
    '        calculated by T-qxx / nP\n' + 
    'mO% = match %age for all objects tested;equals mT% for non-filter tests\n'
    ;
  outStr = outStr + header; 
  pf = JSON.parse(fs.readFileSync(fileName));
  pf = pf.sort(sortByTestName); 
  pf.forEach(function(test) {
    outStr = outStr + 
        padLeft(test.testConfig.testSeq.toFixed(0), 3) + 
        '  ' + 
        padLeft(test.results.nTests, 7) + 
        '  ' + 
        padLeft(test.results.nObjs, 7) + 
        '  ' + 
        padLeft(test.results.nProps, 7) + 
        '  ' + 
        padLeft(test.results.perMatchMsStats.q50.toFixed(3), 7) + 
        ' ' + 
        padLeft(test.results.perMatchMsStats.q95.toFixed(3), 7) + 
        ' ' + 
        padLeft(test.results.perMatchMsStats.q99.toFixed(3), 7) + 
        ' ' + 
        padLeft(test.results.perMatchMsStats.max.toFixed(3), 7) + 
        ' ' + 
        padLeft(test.results.perMatchMsStats.stdev.toFixed(3), 7) + 
        ' ' + 
        padLeft(  // see ** note
            (test.results.perMatchMsStats.q50 / 
                (test.results.nProps * test.results.nObjs))
            .toFixed(3), 
            7) + 
        ' ' + 
        padLeft(  // see ** note
            (test.results.perMatchMsStats.q95 / 
                (test.results.nProps * test.results.nObjs))
            .toFixed(3), 
            7) + 
        ' ' + 
        padLeft(test.results.matchPercent.toFixed(3), 7) + 
        ' ' + 
        padLeft(test.results.nMatchObjsPercent ? 
            test.results.nMatchObjsPercent.toFixed(3) : '  - ', 7 ) + 
        '   ' + 
        padRight(test.testName, 75)+
        '\n';

  });


  return outStr; 

  // ** Note on average time per property: 
    // return the average time per property for a given test time statistic
    // eg if q95 = 0.100 and there are 10 properties in each test
    //   then P-q95 = 0.100 / 10 = 0.010ms.
    // OR if filtering 100 objects each with 10 properties 
    //   then P-q95 = 0.100 / (100*10) = 0.0001ms
    //   because each test was actually executing 100 * 10 property comparisons
    //   (note that nObjs is the TOTAL nObjs across all tests)  
}


function padLeft(str, totalLen, padStr) {
  // pad string to left to reach totalLen
  return (getSpaces(totalLen, padStr) + str).slice(-totalLen); 
}

function padRight(str, totalLen, padStr) {
  // pad string with spaces to right to reach totalLen
  return (str + getSpaces(totalLen, padStr)).slice(0, totalLen); 
}

function padCenter(str, totalLen, padStr) {
  // pad string such that the str input is in the center
  return getSpaces(Math.round((totalLen-str.length)/2-0.1),padStr) +  // shift to left 1 space if odd #
            str +
            getSpaces(Math.round((totalLen-str.length)/2+0.1),padStr);
}

function getSpaces(nbr, padStr) {
  //http://stackoverflow.com/questions/1877475/repeat-character-n-times
  padStr = padStr ? padStr : ' '; 
  return Array(nbr+1).join(padStr);
}

function getPackageInfo() {
  var pkg = JSON.parse(fs.readFileSync(package_file, 'utf8'));
  return pkg;  
}

function getPackageVersion() {
  return getPackageInfo().version;  
}

function getPerfDataTemplate(testFileName) {
  return require(DATA_FOLDER + testFileName).template; 
}

function getPerfData(testFileName) {
  return require(DATA_FOLDER + testFileName).objects; 
}

function getJsonFileAsObj(fileName) {
  return JSON.parse(fs.readFileSync(fileName)); 
}

function getPerfTestResults(fileName) {
  var perfResults = []; 
  var pf = fs.readFileSync(PERF_RESULTS_DIR + fileName);
  perfResults = JSON.parse(pf); 
  return perfResults; 
}

function getResultsFilenames() {
  // returns an array of the file names in results directory
  var filenames = fs.readdirSync(PERF_RESULTS_DIR)
  .filter(function(filename) {
    return /.*\.json$/.test(filename);
  });
  return filenames;
}

function getAllPerfResults() {
  // returns an array of all test result objects 

  var allResults = []; 

  getResultsFilenames() 
  .forEach(function(filename) {
    var testResults = getPerfTestResults(filename);
    testResults.forEach(function(testObj) {
      testObj.filename = filename;
      //append platform from filename if not in object
      testObj.platform = testObj.hasOwnProperty('platform') ? 
        testObj.platform : getPlatformFromFilename(filename);
      testObj.testType = testObj.hasOwnProperty('testType') ? 
        testObj.testType : getTestTypeFromFilename(filename); 
    } ); 
    Array.prototype.push.apply(allResults, testResults);
  }); 

  return allResults; 
}

function getPlatformFromFilename(filename) {
  var platform = /\_([aws,win].+?)\_/.exec(filename); 
  // returns null if not found otherwise array with result w/o '_'s at [1]
  platform = platform ? platform[1] : null; 
  return platform;
}

function getTestTypeFromFilename(filename) {
  var testType = /^(.+?)\_/.exec(filename); 
  testType = testType ? testType[1] : null; 
  return testType;
}

function initializeResultsFile(fileName) {
  var emptyArray = [];
  fs.writeFileSync(
      PERF_RESULTS_DIR + fileName, 
      JSON.stringify(emptyArray) 
  );
}

function stringify(obj) {
  // stringifies including functions
  return JSON.stringify(obj, function(key, val) {
    if (typeof val === 'function') {
      return val + ''; // implicitly `toString` it
    }
    return val;
  });
}

function writeOverallSummary(tests) {
  //create a markdown table of summary results of tests 
  //  where tests is an array of the test results objects such as getAllPerfResults()
  // 
  //                                 P-q50 (µs - .001 ms, .000001 sec)
  //  fos v | platform   | node v |  f1 |  f2 | ms1 | ... |  Test / file name
  // -------|------------|--------|-----|-----|-----|-----|-----------------------
  //  1.0.6 |aws t2.micro| 0.12.7 |  4.3|  5.4| 14.6|  8.7| 2016-01-25_win32_v1.0.7_node-v0.12.3_v100to1k_1453732424103.json
  // ...etc
  // a=filter_k100to100_m100_v100to100
  // b=filter_k10to100_m50_v100to100
  // ..etc
  // f=filter
  // ms = matchSimple
  // m=match
  // rm=regMatch
  // 
  // a text file was decided over : 
  //    - markdown because 'keyhole' to view table in generated html means 
  //      being only able to see a few columns - lots of horiz scrolling
  //    - html in mardown: same problem as # 1
  //    - html - generally only viewable as raw html in github

  var testNames = []; // array of testNames across all tests will be sorted & deduped
  var testNamesRefs = {};  // key/value of testName to its reference; eg 'f1' = 'filter_k1to1_...'
  var rowObjs = []; 

  var padStr = ' ';  // character to pad columns to reach desired widths 
  var colSeperator = '|'; // characater to seperate columns 
  var ALIGN_CENTER = 'c'; 
  var ALIGN_LEFT = 'l';
  var ALIGN_RIGHT = 'r';

  var colWidths = {
    fosv: 8,
    platform: 14,
    nodev: 9,
    t: 6,          //all test result time cols
    filename: 80  
  };

  getAllTestNames(); // go through all tests to get test names
  doTheNeedfulForTestNames(); // sort, dedup, create ref strings   

  tests.sort(overallSummarySort); 

  // tests.forEach(createRowObj); 

  var prevFileName = ''; 
  var rowStr = '';
  var namesIndex = 0; 
  createReportHeader();
  tests.forEach(createPrintRows);
  createReportFooter(); 

  console.log(rowStr);


  function getAllTestNames() {
    tests.forEach(function(test) {
      testNames.push(getTestTestname(test)); 
    });
  }

  
  function overallSummarySort(testA, testB) {
    // sort order 
    //   1. by fos version
    //   2. by platform
    //   3. by node version
    //   4. by filename
    //   5. by testName

    // bp to enclose in braces...but so much easier to read here. 
    // desc sort on fos version
    if (getTestFosVersion(testA) > getTestFosVersion(testB)) return -1; 
    if (getTestFosVersion(testA) < getTestFosVersion(testB)) return 1; 

    if (getTestPlatform(testA) < getTestPlatform(testB)) return -1; 
    if (getTestPlatform(testA) > getTestPlatform(testB)) return 1; 

    if (getTestNodeV(testA) < getTestNodeV(testB)) return -1; 
    if (getTestNodeV(testA) > getTestNodeV(testB)) return 1;

    if (getTestFilename(testA) < getTestFilename(testB)) return -1;
    if (getTestFilename(testA) > getTestFilename(testB)) return 1;

    if (getTestTestname(testA) < getTestTestname(testB)) return -1;
    if (getTestTestname(testA) > getTestTestname(testB)) return 1;

    return 0; 

  }

  function createReportHeader() {
    rowStr = '|';
    addCol(' ', colWidths.fosv);
    addCol(' ', colWidths.platform, ALIGN_CENTER);
    addCol(' ', colWidths.nodev, ALIGN_CENTER);
    addCol(' RESPONSE TIMES: 95th Percentile per property* in milliseconds (.001 microseconds) =>',200,ALIGN_LEFT);
    addCol('\n');
    addCol('fos v', colWidths.fosv, ALIGN_CENTER);
    addCol('platform', colWidths.platform, ALIGN_CENTER);
    addCol('node v', colWidths.nodev, ALIGN_CENTER);
    testNames.forEach(function(testName) {
      addCol(testNamesRefs[testName],colWidths.t, ALIGN_CENTER);
    }); 
    addCol('Filename (test grouping)', colWidths.filename, ALIGN_LEFT);
    addCol('\n');

    addCol(getSpaces(colWidths.fosv,'-'));  //fos v
    addCol(getSpaces(colWidths.platform,'-'));  //platform
    addCol(getSpaces(colWidths.nodev,'-'));  //node v
    testNames.forEach(function(testName) {
      addCol(getSpaces(colWidths.t,'-'));
    }); 
    addCol(getSpaces(colWidths.filename,'-'));  //filename
    addCol('\n');

  }

  function createReportFooter() {
    rowStr = rowStr + '\n';
    rowStr = rowStr + '\n';
    rowStr = rowStr + 'Response times are the 95th percentile ' + 
      '(95% of responses are faster) for all matches or filters \n' + 
      'performed for each test shown divided by the number of properties ' +
      'being checked for a match. \n' + 
      'This allows a consistent way of looking at response times ' + 
      'across all tests regardless if a match was for one property or 1000.\n\n' +
      'For example a match test of 5 properties tested 100 times: \n' + 
      '  If 95 of the tests responded in 20.0 milliseconds or faster, ' +
      '(regardless of whether match was true or false)\n' + 
      '  then the number displayed here would be 4.0 (20.0 / 5 properties.)'; 
    rowStr = rowStr + '\n\n';

    testNames.forEach(function(testName) {
      rowStr = rowStr + testNamesRefs[testName] + ' : ' + testName + '\n';
    });

    rowStr = rowStr + '\n\n';

    testNames.forEach(function(testName) {
      var refs = testName.split('_');
      rowStr = rowStr + testNamesRefs[testName] + ' : ' + testName + '\n';
      refs.forEach(function(ref) {
        rowStr = rowStr + "   " + padRight(ref,11) + ' => ' + testNameRefDescription(ref) + '\n';
      });
    });
  }

  function createPrintRows(test, index, array) {
    // if(getTestFilename(test) === prevFileName) {
      // simply append p value
      // NEED TO TEST TO MAKE SURE test.testName aligns with current col in testNames[]
      ///   ie - if this test group didn't have a given test that's in other test groups
    //   addCol(getTestPq95MillS(test).toFixed(2), colWidths.t, ALIGN_RIGHT);
    // } else {
    if(getTestFilename(test) !== prevFileName) {
      // new row
      namesIndex = 0;
      // end the last row 
      if (prevFileName !== '' ) {
        addCol(prevFileName, colWidths.filename, ALIGN_LEFT);
        addCol('\n');
      } 
      prevFileName = getTestFilename(test); 
      // start new row
      addCol(getTestFosVersion(test),colWidths.fosv, ALIGN_CENTER);
      addCol(getTestPlatform(test), colWidths.platform, ALIGN_CENTER);
      addCol(getTestNodeV(test), colWidths.nodev, ALIGN_CENTER);
    }

    // print the test time if it's next in the testNames list, 
    //   otherwise, this test wasn't performed in this test group, 
    //   so print an empty col
    while(testNames[namesIndex] !== getTestTestname(test)) {
      addCol(' ',colWidths.t);
      namesIndex++;
    }
    addCol(getTestPq95MillS(test).toFixed(2), colWidths.t, ALIGN_RIGHT);

    // increment namesIndex unless we've cycled through all, then reset 
    namesIndex = namesIndex === testNames.length -1 ? 0 : namesIndex + 1;
    //wrap up the very last row
    if (index === array.length-1) {
      addCol(getTestFilename(test), colWidths.filename, ALIGN_LEFT);

    }
  }

  function addCol(addStr, width, align) {
    width = width ? width : addStr.length; 
    align = align ? align : 'c';    // l, c, r 
    var newStr;

    if(align === 'c') {
      newStr = padCenter(addStr, width, padStr);
    }
    if(align === 'l') {
      newStr = padRight(addStr, width, padStr);
    }
    if(align === 'r') {
      newStr = padLeft(addStr, width, padStr);
    }

    rowStr = rowStr + newStr + colSeperator ; 
    return; 

}


  function doTheNeedfulForTestNames() {
    var fn = 1;
    var mn = 1; 
    var msn = 1; 
    var rmn = 1; 
    var afn = 1; 

    testNames = sortAndDedup(testNames); 

    testNames.forEach(assignTestNameRef); 

    function assignTestNameRef(testName) {
      // filter_ : f...
      // match_  : m...
      // matchSimple_ : ms...
      // regMatch_ : rm...
      // eg; f1, f2, f3, ms1, ms2, etc...

      var getRefFns = {
        filter: function() {
          var ref = 'f' + fn; 
          fn++; 
          return ref; 
        }, 
        match: function() {
          var ref = 'm' + mn; 
          mn++; 
          return ref; 
        },
        matchSimple: function() {
          var ref = 'ms' + msn; 
          msn++; 
          return ref; 
        },
        regMatch: function() {
          var ref = 'rm' + rmn; 
          rmn++; 
          return ref; 
        },
        filterJsArray: function() {
          var ref = 'af' + afn;
          afn++; 
          return ref; 
        }
      };

      var testType = getTestTypeFromFilename(testName);  //testName same as filename (w/o json)
      var ref = getRefFns[testType](); 

      testNamesRefs[testName] = ref; 

      return; 
    }

  }

}

function testNameRefDescription(testNameRef) {
  //testNameRef is a portion of test name between '_' eg; k100to100
  return perfTests.reference.hasOwnProperty(testNameRef) ? 
    perfTests.reference[testNameRef] : null; 
}

function sortAndDedup(a) {
  //http://stackoverflow.com/questions/9229645/remove-duplicates-from-javascript-array
  // for arrays of non-objects
  return a.sort().filter(function(item, pos, ary) {
    return !pos || item != ary[pos - 1];
  });
}

function getTestFosVersion(test) {
  return test.packageInfo.version;
}

function getTestPlatform(test) {
  return test.hasOwnProperty('platform') ? test.platform : '';
}

function getTestNodeV(test) {
  return test.env.process.versions.node; 
}

function getTestFilename(test) {
  return test.hasOwnProperty('filename') ? test.filename : ''; 
}

function getTestTestname(test) {
  return test.testName; 
}

function getTestTestType(test) {
  return test.hasOwnProperty('testType') ? test.testType : '';
}

function getTestPq95(test) {
  return test.results.perMatchMsStats.q95 /
      (test.results.nProps * test.results.nObjs);
}

function getTestPq95MillS(test) {
  // result in millisecond
  return getTestPq95(test)*1000; 
}

module.exports = {
  runTest : runTest,
  initializeResultsFile: initializeResultsFile,
  getSummarizedTestResult: getSummarizedTestResult,
  writeSummarizedTestResult: writeSummarizedTestResult,
  getPackageInfo : getPackageInfo,
  getPackageVersion : getPackageVersion, 
  getResultsFilenames: getResultsFilenames,
  getAllPerfResults : getAllPerfResults,
  writeTestResult: writeTestResult,
  writeOverallSummary : writeOverallSummary
};
