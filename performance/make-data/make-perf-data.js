/*jslint node: true */
'use strict'; 

var rog = require('./make-data-fns.js');
var fs = require('fs'); 
var faker = require('faker');
var fos = require('../../lib/index.js');

var OUT_DIR = "./performance/data/";

var fixed = {
 dotKeysObjectK100D10 : fos.getObjectProperties(rog.makeRandomObject(100,10)) 
};

var dotKeysStaticObjectK100D10 = rog.makeRandomObject(100,10);

var makeWrapFn = function(fn, p1, p2, p3, p4) {
  return function() {
    return fn(p1, p2, p3, p4); 
  };
};

var randomChars3to10 = function() {
  return rog.getRandomChars(3,10); 
};

var randomChars30to150 = function() {
  return rog.getRandomChars(30,150); 
};

var getParagraph = function() {
  return rog.getParagraph(3,10,5,200);
}; 

var randomMidStr = function(str) {
  //return a random substr from str
  var strStart = rog.getRandomInt(0,str.length -1); 
  var strLen   = rog.getRandomInt(1, str.length - strStart); 
  return str.substr(strStart, strLen);
}; 

var replaceRandomChars = function(str, replStr, nbrChars) {
  // replace a random number of sequential characters in a string with replcStr
  // eg; ('abcdef','.*',3) => 'a.*ef'
  nbrChars = nbrChars ? nbrChars : 1; 
  var n = rog.getRandomInt(0,str.length+1-nbrChars); 
  return str.substr(0, n) + 
      replStr + 
      str.substr(n + nbrChars,str.length- 1);
};

var getInvalidPhone = function() {
  return replaceRandomChars(
      faker.phone.phoneNumber(),
      rog.getRandomChars(2, 2, true),
      2);
};

var createTestObjectsTemplates = [
  // ----- WORD -----
  {name: 'k1_word_v100',
   template: {prop1: randomChars3to10}, 
   objectCount: 100
   },
  {name: 'k1_word_v100_ditto_m50',
   sourceObjs: 'k1_word_v100',
   template: function(so) {
    return {
        prop1: rog.randomReplaceWith(so.prop1, randomChars3to10, 0.5)
      };  
    },
   },
  {name: 'k1_word_v1k',
   template: {prop1: randomChars3to10}, 
   objectCount: 1000
   },
  {name: 'k1_word_v1k_ditto_m50',
   sourceObjs: 'k1_word_v1k',
   template: function(so) {
    return {
        prop1: rog.randomReplaceWith(so.prop1, randomChars3to10, 0.5)
      };  
    },
   },
  {name: 'k1_word_v10k',
   template: {prop1: randomChars3to10}, 
   objectCount: 10000
   },
  {name: 'k1_word_v10k_ditto_m50',
   sourceObjs: 'k1_word_v10k',
   template: function(so) {
    return {
        prop1: rog.randomReplaceWith(so.prop1, randomChars3to10, 0.5)
      };  
    },
   },
  // {name: 'k1_word_v100k',
  //  template: {prop1: randomChars3to10}, 
  //  objectCount: 100000
  //  },
  // {name: 'k1_word_v100k_ditto_m50',
  //  sourceObjs: 'k1_word_v100k',
  //  template: function(so) {
  //   return {
  //       prop1: rog.randomReplaceWith(so.prop1, randomChars3to10, 0.5)
  //     };  
  //   },
  //  },
  // ----- PHONE -----
  {name: 'k1_phone_v100',
   template: {phone: makeWrapFn
        (rog.randomReplaceWith,faker.phone.phoneNumber,
         getInvalidPhone,
         0.85)  // faker.phone.phoneNumber doesn't provide valid reg match ph # ~30%
      },
   objectCount: 100
  },
  {name: 'k1_phone_v1k',
   template: {phone: makeWrapFn
        (rog.randomReplaceWith,faker.phone.phoneNumber,
         getInvalidPhone,
         0.85)
      },
   objectCount: 1000
   },
  {name: 'k1_phone_v10k',
   template: {phone: makeWrapFn
        (rog.randomReplaceWith,faker.phone.phoneNumber,
         getInvalidPhone,
         0.85)
      },
   objectCount: 10000
   },
  // {name: 'k1_phone_v100k',
  //  template: {phone: makeWrapFn
  //       (rog.randomReplaceWith,faker.phone.phoneNumber,
  //        getInvalidPhone,
  //        0.85)
  //     },
  //  objectCount: 100000
  //  },
  // ---- STRING --
  {name: 'k1_string_v100',
   template: {prop1: randomChars30to150}, 
   objectCount: 100
   },
  {name: 'k1_string_v100_ditto_m50',
   sourceObjs: 'k1_string_v100',
   template: function(so) {
    return {
        prop1: rog.randomReplaceWith(so.prop1, randomChars30to150, 0.5)
      };  
    },
   },
  {name: 'k1_string_v1k',
   template: {prop1: randomChars30to150}, 
   objectCount: 1000
   },
  {name: 'k1_string_v1k_ditto_m50',
   sourceObjs: 'k1_string_v1k',
   template: function(so) {
    return {
        prop1: rog.randomReplaceWith(so.prop1, randomChars30to150, 0.5)
      };  
    },
   },
  {name: 'k1_string_v10k',
   template: {prop1: randomChars30to150}, 
   objectCount: 100000
   },
  {name: 'k1_string_v10k_ditto_m50',
   sourceObjs: 'k1_string_v10k',
   template: function(so) {
    return {
        prop1: rog.randomReplaceWith(so.prop1, randomChars30to150, 0.5)
      };  
    },
   },
  // {name: 'k1_string_v100k',
  //  template: {prop1: randomChars30to150}, 
  //  objectCount: 100000
  //  },
  // {name: 'k1_string_v100k_ditto_m50',
  //  sourceObjs: 'k1_string_v100k',
  //  template: function(so) {
  //   return {
  //       prop1: rog.randomReplaceWith(so.prop1, randomChars30to150, 0.5)
  //     };  
  //   },
  //  },
  // ---- PARAGRAPH --
  {name: 'k1_paragraph_v100',
   template: {prop1: getParagraph}, 
   objectCount: 100
   },
  {name: 'k1_paragraph_v100_ditto_m50',
   sourceObjs: 'k1_paragraph_v100',
   template: function(so) {
    return {
        prop1: rog.randomReplaceWith(so.prop1, getParagraph, 0.5)
      };  
    },
   },
  {name: 'k1_paragraph_v1k',
   template: {prop1: getParagraph}, 
   objectCount: 1000
   },
  {name: 'k1_paragraph_v1k_ditto_m50',
   sourceObjs: 'k1_paragraph_v1k',
   template: function(so) {
    return {
        prop1: rog.randomReplaceWith(so.prop1, getParagraph, 0.5)
      };  
    },
   },
   // (no 100k for paragraph)

   // random object of 100 props, max depth of 10
  {name: 'k100_randObj_v100',
   template: makeWrapFn(rog.makeRandomObject,100,10), 
   objectCount: 100
   },   
  {name: 'k100_randObj_v1k',
   template: makeWrapFn(rog.makeRandomObject,100,10), 
   objectCount: 1000
   },   
  {name: 'k100_randObj_v10k',
   template: makeWrapFn(rog.makeRandomObject,100,10), 
   objectCount: 10000
   },   

   // RegExp - regMidStr
  {name: 'k1_word_v100_regMidStr_m50',
   sourceObjs: 'k1_word_v100',
   template: function(so) {
    return {
        prop1: 
          rog.randomReplaceWith(
                randomMidStr(so.prop1), 
                randomChars3to10(), 
                0.5)
      };  
    },
   },
  {name: 'k1_word_v1k_regMidStr_m50',
   sourceObjs: 'k1_word_v1k',
   template: function(so) {
    return {
        prop1: 
          rog.randomReplaceWith(
                randomMidStr(so.prop1), 
                randomChars3to10(), 
                0.5)
      };  
    },
   },
  {name: 'k1_word_v10k_regMidStr_m50',
   sourceObjs: 'k1_word_v10k',
   template: function(so) {
    return {
        prop1: 
          rog.randomReplaceWith(
                randomMidStr(so.prop1), 
                randomChars3to10(), 
                0.5)
      };  
    },
   },
  // {name: 'k1_word_v100k_regMidStr_m50',
  //  sourceObjs: 'k1_word_v100k',
  //  template: function(so) {
  //   return {
  //       prop1: 
  //         rog.randomReplaceWith(
  //               randomMidStr(so.prop1), 
  //               randomChars3to10(), 
  //               0.5)
  //     };  
  //   },
  //  },
   // RegExp - regDot
  {name: 'k1_word_v100_regDot_m50',
   sourceObjs: 'k1_word_v100',
   template: function(so) {
    return {
        prop1: 
          rog.randomReplaceWith(
                replaceRandomChars(so.prop1,'.',1), 
                randomChars3to10(), 
                0.5)
      };  
    },
   },
  {name: 'k1_word_v1k_regDot_m50',
   sourceObjs: 'k1_word_v1k',
   template: function(so) {
    return {
        prop1: 
          rog.randomReplaceWith(
                replaceRandomChars(so.prop1,'.',1), 
                randomChars3to10(), 
                0.5)
      };  
    },
   },
  {name: 'k1_word_v10k_regDot_m50',
   sourceObjs: 'k1_word_v10k',
   template: function(so) {
    return {
        prop1: 
          rog.randomReplaceWith(
                replaceRandomChars(so.prop1,'.',1), 
                randomChars3to10(), 
                0.5)
      };  
    },
   },
  // {name: 'k1_word_v100k_regDot_m50',
  //  sourceObjs: 'k1_word_v100k',
  //  template: function(so) {
  //   return {
  //       prop1: 
  //         rog.randomReplaceWith(
  //               replaceRandomChars(so.prop1,'.',1), 
  //               randomChars3to10(), 
  //               0.5)
  //     };  
  //   },
  //  },
   // RegExp - regDotStar
  {name: 'k1_word_v100_regDotStar_m50',
   sourceObjs: 'k1_word_v100',
   template: function(so) {
    return {
        prop1: 
          rog.randomReplaceWith(
                replaceRandomChars(
                    so.prop1,
                    '.*',
                    rog.getRandomInt(0,so.prop1.length)), 
                randomChars3to10(), 
                0.5)
      };  
    },
   },
  {name: 'k1_word_v1k_regDotStar_m50',
   sourceObjs: 'k1_word_v1k',
   template: function(so) {
    return {
        prop1: 
          rog.randomReplaceWith(
                replaceRandomChars(
                    so.prop1,
                    '.*',
                    rog.getRandomInt(0,so.prop1.length)), 
                randomChars3to10(), 
                0.5)
      };  
    },
   },
  {name: 'k1_word_v10k_regDotStar_m50',
   sourceObjs: 'k1_word_v10k',
   template: function(so) {
    return {
        prop1: 
          rog.randomReplaceWith(
                replaceRandomChars(
                    so.prop1,
                    '.*',
                    rog.getRandomInt(0,so.prop1.length)), 
                randomChars3to10(), 
                0.5)
      };  
    },
   },
  // {name: 'k1_word_v100k_regDotStar_m50',
  //  sourceObjs: 'k1_word_v100k',
  //  template: function(so) {
  //   return {
  //       prop1: 
  //         rog.randomReplaceWith(
  //               replaceRandomChars(
  //                   so.prop1,
  //                   '.*',
  //                   rog.getRandomInt(0,so.prop1.length)), 
  //               randomChars3to10(), 
  //               0.5)
  //     };  
  //   },
  //  },

   // RegExp - regPhone
  {name: 'k1_phone_v100_regPhone_m50',
   sourceObjs: 'k1_phone_v100',
   template: function(so) {
    return {phone: rog.getPhoneRegEx().source};  
    },
   },
  {name: 'k1_phone_v1k_regPhone_m50',
   sourceObjs: 'k1_phone_v1k',
   template: function(so) {
    return {phone: rog.getPhoneRegEx().source};  
    },
   },
  {name: 'k1_phone_v10k_regPhone_m50',
   sourceObjs: 'k1_phone_v10k',
   template: function(so) {
    return {phone: rog.getPhoneRegEx().source};  
    },
   },
  // {name: 'k1_phone_v100k_regPhone_m50',
  //  sourceObjs: 'k1_phone_v100k',
  //  template: function(so) {
  //   return {phone: rog.getPhoneRegEx().source};  
  //   },
  //  },
   // pattern objects of one random property from target object of 100 props 
  {name: 'k100_randObj_v100_k1_m50',
   sourceObjs: 'k100_randObj_v100',
   template: function(so) {
    var key = rog.getRandomKey(so); 
    var value = rog.randomReplaceWith(
        rog.getPropValue(so, key),
        rog.getRandomMakeDataFn()(),
        0.5
        );
    var obj = rog.makeObjectFromDotKeys(key, value); 
    return obj;  
    },
   },
  {name: 'k100_randObj_v1k_k1_m50',
   sourceObjs: 'k100_randObj_v1k',
   template: function(so) {
    var key = rog.getRandomKey(so); 
    var value = rog.randomReplaceWith(
        rog.getPropValue(so, key),
        rog.getRandomMakeDataFn()(),
        0.5
        );
    var obj = rog.makeObjectFromDotKeys(key, value); 
    return obj;  
    },
   },
  {name: 'k100_randObj_v10k_k1_m50',
   sourceObjs: 'k100_randObj_v10k',
   template: function(so) {
    var key = rog.getRandomKey(so); 
    var value = rog.randomReplaceWith(
        rog.getPropValue(so, key),
        rog.getRandomMakeDataFn()(),
        0.5
        );
    var obj = rog.makeObjectFromDotKeys(key, value); 
    return obj;  
    },
   },
  //  10 random properties from source (target) object, 50% of time
  //    one of those properties doesn't match source
  {name: 'k100_randObj_v100_k10_m50',
   sourceObjs: 'k100_randObj_v100',
   template: function(so) {
    // make an object with 10 identical properties as source object
    // 50% of time, 1 of those properties will be different than source object
    var keys = rog.getRandomKey(so, 10);  // get 10 random keys
    var obj = rog.cloneObject(so, keys); 
    if(rog.isRand(0.5)) {  // 50% of time, 
      rog.replaceRandomProperties(obj,1);  // replace one property with random value
    }
    return obj;  
   }
  },
  {name: 'k100_randObj_v1k_k10_m50',
   sourceObjs: 'k100_randObj_v1k',
   template: function(so) {
    var keys = rog.getRandomKey(so, 10);  // get 10 random keys
    var obj = rog.cloneObject(so, keys); 
    if(rog.isRand(0.5)) {  // 50% of time, 
      rog.replaceRandomProperties(obj,1);  // replace one property with random value
    }
    return obj;  
   }
   },
  {name: 'k100_randObj_v10k_k10_m50',
   sourceObjs: 'k100_randObj_v10k',
   template: function(so) {
    var keys = rog.getRandomKey(so, 10);  // get 10 random keys
    var obj = rog.cloneObject(so, keys); 
    if(rog.isRand(0.5)) {  // 50% of time, 
      rog.replaceRandomProperties(obj,1);  // replace one property with random value
    }
    return obj;  
   }
   },
  // 100 props on target & source - matching 100%
  {name: 'k100_randObj_v100_k100_m100',
   sourceObjs: 'k100_randObj_v100',
   template: function(so) {
    return rog.cloneObject(so); 
   }
  },
  {name: 'k100_randObj_v1k_k100_m100',
   sourceObjs: 'k100_randObj_v1k',
   template: function(so) {
    return rog.cloneObject(so); 
   }
  },
  {name: 'k100_randObj_v10k_k100_m100',
   sourceObjs: 'k100_randObj_v10k',
   template: function(so) {
    return rog.cloneObject(so); 
   }
  },
  {name: 'k100_fixedKey_v100',
   template: function() {
    var dotKeys = fixed.dotKeysObjectK100D10;  
    return function() {
      var ro = rog.makeObjectFromDotKeys(dotKeys);
      return rog.replaceRandomProperties(ro,100); 
    };
   }, 
   objectCount: 100
   },
  {name: 'k100_fixedKey_v1k',
   template: function() {
    var dotKeys = fixed.dotKeysObjectK100D10;  
    return function() {
      var ro = rog.makeObjectFromDotKeys(dotKeys);
      return rog.replaceRandomProperties(ro,100); 
    };
   }, 
   objectCount: 1000
   },
  {name: 'k100_fixedKey_v10k',
   template: function() {
    var dotKeys = fixed.dotKeysObjectK100D10;  
    return function() {
      var ro = rog.makeObjectFromDotKeys(dotKeys);
      return rog.replaceRandomProperties(ro,100); 
    };
   }, 
   objectCount: 10000
   },
  {name: 'k100_fixedKey_k1_charDotStar_v1k',
   sourceObjs: 'k100_fixedKey_v1k',
   template: function(so) {
    var key = rog.getRandomKey(so, 1);
    var value = rog.getRandomChars(1,1) + '.*' + rog.getRandomChars(1,1);
    return rog.makeObjectFromDotKeys(key, value);
   }
  },
];

function makePerfData(templates) {
  templates = templates ? templates : createTestObjectsTemplates; 
  // if string is passed in, assume it is template name to be run
  templates = fos._.isString(templates) ? 
    createTestObjectsTemplates.filter(
        function(template){return template.name === templates;}) : 
    templates; 
  console.log("makePerfData");
  templates.forEach(function(ctoTemplate) {
    console.log('  ' + ctoTemplate.name);
    makeObjs(ctoTemplate); 
  });
}

function makeObjs(ctoTemplate) {
  var testObjects; 
  if (!ctoTemplate.sourceObjs) {
    //create new objects without using source objects 
    //(ie, creating target objects)
    if(fos._.isObjectLiteral(ctoTemplate.template)) {
      testObjects = 
          rog.makeObject(ctoTemplate.template, ctoTemplate.objectCount);
    } 
    if(fos._.isFunction(ctoTemplate.template)) {
      testObjects = []; 
      var f = fos._.isFunction(ctoTemplate.template()) ? 
        ctoTemplate.template() : ctoTemplate.template;  
      for (var i = ctoTemplate.objectCount - 1; i >= 0; i--) {
        var obj = f(); 
        testObjects.push(obj); 
      }
    }

  } 

  if (ctoTemplate.sourceObjs) {
    //create objects using the source objects as input
    //ie, create pattern objects; one for each input object
    testObjects = []; 
    var sourceObjs = 
        JSON.parse(fs.readFileSync(OUT_DIR + ctoTemplate.sourceObjs + ".json"))
        .objects;
    sourceObjs.forEach(function(so) {
      testObjects.push(rog.makeObject(ctoTemplate.template(so)));
    });
  }

  writeExportFile(testObjects, ctoTemplate);

}

function writeExportFile(testObjects, ctoTemplate) {
  var objOut = {}; 
  ctoTemplate.Date = new Date().toString(); 
  ctoTemplate.objects = testObjects;  
  ctoTemplate.template = stringify(ctoTemplate.template);
  var objsStr = JSON.stringify(ctoTemplate); 
  var fileName = OUT_DIR + ctoTemplate.name + '.json'; 

  fs.writeFileSync(fileName, objsStr);
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

module.exports = {
  makePerfData : makePerfData
};
