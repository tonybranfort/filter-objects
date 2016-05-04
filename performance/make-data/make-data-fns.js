/*jslint node: true */
'use strict'; 

var faker = require('faker'); 
var fos = require('../../lib/index.js'); 

var _ = fos._;

function cloneObject(obj, dotKeys) {
  // create a new object copying over properies & their values from obj
  // dotKeys is an array of strings of properties to be copied in dot notation
  // if not included, all properties are created & their values copies
  dotKeys = dotKeys ? dotKeys : fos.getObjectProperties(obj); 
  var returnObj = {};
  for (var i = dotKeys.length - 1; i >= 0; i--) {
    setObjectPropValue(returnObj, dotKeys[i], getPropValue(obj,dotKeys[i])); 
  }
  return returnObj; 
}

function makeObjectFromDotKeys(dotKeys, value) {
  // make an object using a string in dot notation (dotKeys = eg; 'prop1.color')
  //   and assign value to it
  // dotKeys can be an array of strings or a single string
  // if value is a function, it will be called for the value
  value = value ? value : function() {return '';}; //default to empty string for value
  var valueFn = _.isFunction(value) ? value : function(){return value;}; 
  if(_.isString(dotKeys)) {
    dotKeys = [dotKeys]; 
  } else if(!_.isArray(dotKeys)) {
    throw 'dotKeys must be a string or array for makeObjectFromDotKeys';
  }

  var obj = {}; 
  dotKeys.forEach(function(dotKey) {
    setObjectPropValue(obj, dotKey, valueFn());
  });
  return obj; 
}

function makeObject(objectTemplate, nbr) {
  nbr = nbr ? nbr : 1; 

  if (nbr > 1) {
    var tObjs = []; 
   
    for (var i = nbr - 1; i >= 0; i--) {
      tObjs[i] = objectPropertyMap(objectTemplate); 
    }
    return tObjs;   
  } else {
    return objectPropertyMap(objectTemplate); 
  }

}

function randomReplaceWith(thisValue, thatValue, pct) {
  // return isRand(pct) === true ? value : replaceWith(); 
  // attempts to return thisValue 'pct' of  the time or thatValue (1-pct) of time
  var returnVal; 
  if (isRand(pct)) {
    //return thisValue or thisValue() if a function
    returnVal = _.isFunction(thisValue) ? thisValue() : thisValue; 
  } else {
    returnVal = _.isFunction(thatValue) ? thatValue() : thatValue; 
  }
  return returnVal;
}

function getRandomKey(obj, nbrKeys) {
  // returns one random property from obj as a string in dot notation
  nbrKeys = nbrKeys ? nbrKeys : 1; 
  //  if nbrKeys is > 1, returns array of unique random keys from object
  // if nbrKeys > # of object keys, returns all of object keys
  var keys = fos.getObjectProperties(obj); 
  var keysToReturn = []; 
  for (var i = 0; i < nbrKeys && keys.length > 0; i++) {
    var n = getRandomInt(0,keys.length-1);
    keysToReturn.push(keys[n]);
    keys.splice(n,1);   //remove the key to keep returnKeys unique
  }
  return nbrKeys === 1 ? keysToReturn[0] : keysToReturn; // return string if requesting only 1 key 
}

function getPropValue(obj, dotKey) {
  //return value of property given key in dot notation (dotKey; eg; "prop1.color")
  var currPropRef = obj;
  var propExists; 
  var keys = dotKey.split('.');
  var currKey = keys[0];  

  for (var i = 0; i < keys.length && currPropRef.hasOwnProperty(keys[i]); i++) {
    currPropRef = currPropRef[keys[i]]; 
  }

  return currPropRef; 
}

var replaceRandomProperties = function(obj, nbrProps, replaceWithFn) {
  // replace object (obj) random properties (nbrProps) with result of 
  //   replaceWithFn() 
  replaceWithFn = replaceWithFn ? 
      replaceWithFn : function() {return getRandomChars(3,20);}; 
  var keys = getRandomKey(obj, nbrProps);
  for (var i = nbrProps - 1; i >= 0; i--) {
    obj = setObjectPropValue(obj, keys[i], replaceWithFn()); 
  }
  return obj; 
}; 

var setObjectPropValue = function(obj, dotKey, newValue) {
  // replace an object property value given that property in 
  //   dot notation (keyDot - eg "prop1.color") with newValue
  // Any keys that don't exist in the chain will be created in the object
  var keys = dotKey.split('.'); 
  var currProp = obj; 
  for (var i = 0; i < keys.length; i++) {
    if(i < keys.length - 1) {
      // create an empty object literal if it doesn't exist for this key
      currProp[keys[i]] = currProp.hasOwnProperty(keys[i]) ? 
          currProp[keys[i]] : {}; 
      currProp = currProp[keys[i]];
    } else {
      currProp[keys[i]] = newValue; 
    }
  }
  return obj; 
};

function makeRandomObject(nbrOfProps, maxDepth, makeValueFn) {
  nbrOfProps = nbrOfProps ? nbrOfProps : 10; 
  maxDepth = _.isUndefined(maxDepth) ? 3 : maxDepth; 
  makeValueFn = makeValueFn ? makeValueFn : 
    function() {
      return getRandomMakeDataFn()(); 
    };

  var ro = {}; 
  var subPct = 1 - 1/maxDepth; //chance need to create sub-property
  // var subPct = 0.5; //chance need to create sub-property

  var currProp = ro; 
  var currDepth = 0; 
  for (var i = nbrOfProps - 1; i >= 0; i--) {
    var propName = getRandomChars(4,8, true); 
    if(isRand(subPct) && currDepth < maxDepth-1) {
      var propName2 = getRandomChars(4,8, true);
      currProp[propName] = {}; 
      currProp[propName][propName2] = makeValueFn(); 
      currDepth++;  
      if (isRand(1-subPct) && currDepth < maxDepth) {
        // set current property & current key to new object
        currProp = currProp[propName]; 
      } 
    } else {
      currProp[propName] = makeValueFn();
      currProp = ro; 
      currDepth = 0; 
    }
  }

  return ro; 
}

function getRandomMakeDataFn(fnArray) {
  // return a random function that will create some data
  var defaultFnArray = [
    faker.name.firstName,
    faker.name.lastName,
    faker.name.jobTitle,
    faker.name.jobDescriptor,
    faker.name.jobArea,
    faker.address.zipCode,
    faker.address.city,
    faker.address.streetName,
    faker.address.secondaryAddress,
    faker.address.county,
    faker.address.country,
    faker.address.state,
    faker.address.latitude,
    faker.company.companyName,
    faker.company.catchPhrase,
    faker.company.bs,
    faker.company.bsBuzz,
    faker.finance.account,
    faker.finance.amount,
    faker.finance.currencyCode,
    faker.finance.currencySymbol,
    faker.internet.email,
    faker.internet.protocol,
    faker.internet.url,
    faker.internet.domainName,
    faker.internet.ip,
    faker.internet.color,
    // faker.internet.password,
    faker.phone.phoneNumber,
    faker.date.past,
    faker.date.future,
    faker.date.weekday
  ];

  fnArray = fnArray ? fnArray : defaultFnArray; 

  return fnArray[getRandomInt(0,fnArray.length-1)];
}

function getRandomChars(minLen, maxLen, alphaOnly) {
  minLen = minLen ? minLen : 1; 
  maxLen = maxLen ? maxLen : 10; 
  alphaOnly = alphaOnly ? alphaOnly : false; 

  var nbrOfChars = getRandomInt(minLen, maxLen);  
  var charsList = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"; 
  var len = alphaOnly && alphaOnly === true ? 
      charsList.length - 10 : charsList.length; 
  var chars = ""; 
  for (var i = nbrOfChars - 1; i >= 0; i--) {
    var rndmIndex = getRandomInt(0,len); 
    var charAtRndmIndex = charsList.charAt(rndmIndex); 
    chars = chars + charAtRndmIndex; 
  }
  return chars; 
}

function getPhoneRegEx() {
  //returns reg ex object that tests if a phone format 
  //http://stackoverflow.com/questions/123559/a-comprehensive-regex-for-phone-number-validation#123681
   return /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/;
}


function getParagraph(strMin, strMax, strCountMin, strCountMax) {
  // returns a "paragraph" - one string that is a bunch of random 
  // strings seperated by spaces
  var paragraph = ''; 
  var strCount = getRandomInt(strCountMin, strCountMax); 
  for (var i = strCount - 1; i >= 0; i--) {
    paragraph = getRandomChars(strMin, strMax) + ' ' + paragraph; 
  }

  return paragraph; 
}

function getRandomInt(min, max) {
  //return a random integer between min & max
  min = _.isUndefined(min) ? 0 : min; 
  max = _.isUndefined(max) ? 100 : max ; 
  var randomInt =  Math.floor(Math.random() * (max - min +1)) + min;
  return randomInt; 
}

function isRand(pct) {
  // returns true or false to shoot for probability at pct
  // eg; if pct = .9, should return true 90% of the time
  pct = pct > 1 ? pct / 100 : pct; 
  var r = Math.random(); 
  var match = r < pct ? true : false; 
  return match;  
}


function objectPropertyMap(fromObj, toObj) {
  // creates a new function replacing those properties that have a
  // function as the value with the result of calling that function

  toObj = _.isObjectLiteral(toObj) ? toObj : {} ;  

  var props = Object.keys(fromObj); 

  for (var i = 0; i <= props.length -1; i++) {
    if(_.isObjectLiteral(fromObj[props[i]])) {
      toObj[props[i]] = toObj.hasOwnProperty(props[i]) ?  toObj[props[i]] : {}; 
      objectPropertyMap(fromObj[props[i]], toObj[props[i]]); 
    } else {
      // set property to result of fromObj function if it is a function
      toObj[props[i]] = _.isFunction(fromObj[props[i]]) ? 
          fromObj[props[i]]() : 
          fromObj[props[i]]; 
    }
  }

  return toObj; 
}


module.exports = {
  makeObject : makeObject,
  objectPropertyMap : objectPropertyMap,
  getRandomChars : getRandomChars,
  randomReplaceWith: randomReplaceWith,
  getRandomInt: getRandomInt,
  getParagraph: getParagraph,
  getPhoneRegEx: getPhoneRegEx,
  makeRandomObject : makeRandomObject,
  setObjectPropValue : setObjectPropValue,
  replaceRandomProperties : replaceRandomProperties,
  makeObjectFromDotKeys : makeObjectFromDotKeys,
  getRandomKey : getRandomKey,
  getPropValue : getPropValue,
  getRandomMakeDataFn : getRandomMakeDataFn,
  cloneObject : cloneObject,
  isRand : isRand,
  _ : _, 
};

