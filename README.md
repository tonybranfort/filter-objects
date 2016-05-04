# filter-objects.js
[![Build Status via Travis CI](https://travis-ci.org/tonybranfort/filter-objects.svg?branch=master)](https://travis-ci.org/tonybranfort/filter-objects)
[![Coverage Status](https://coveralls.io/repos/github/tonybranfort/filter-objects/badge.svg?branch=master)](https://coveralls.io/github/tonybranfort/filter-objects?branch=master)

###Filters an array of objects and supports: 
* Defining filter properties & options prior to filter call for better performance
* Deep object property testing
* Simple 'pattern object' approach eg: `filter({fido: color: 'black'},arrayOfPetObjs)`
* Filter with regular expressions - on either the searching object or objects in the array
* Filter options and functions can be defined for each object property being tested
* Custom filter functions
* Variables in the pattern objects

Install with `npm install filter-objects'.
 
## Examples

```javascript
// find which pets have 4 paws
var fos = require('filter-objects');

var pets = [
  { name: 'fido',
    paws: {color: 'gray', count: 3}, 
  },
  { name: 'rover',
    paws: {color: 'white', count: 4}, 
  },
  ];

fos.filter({paws:{count: 4}}, pets);  
//[{ name: 'rover', paws: {color: 'white', count: 4}]; 

```

Filter an array of objects with better performance.  Calling makeFilterFn to create your filter first embeds as much as the logic as possible into the returned filter function so that it doesn't need to be performed at the time of the actual filter call.  
```javascript
var filter = fos.makeFilterFn(['paws.count']); 

filter({paws:{count: 4}}, pets);  
//[{ name: 'rover', paws: {color: 'white', count: 4}]; 
```

Filter by regular expression - on either the pattern object or target objects (the array of objects being filtered). 
```javascript
var options = {regExpMatch: true};
var props = ["tail.color"]; 
var filter = fos.makeFilterFn(props,options);

var pObj = {tail: {color: /gr.y/}}; 
var tObjs = [
    {type: "dog", paws: {count: 4}, tail: {count: 1, color: "black"}},
    {type: "rabbit", paws: {count: 3}, tail: {count: 1, color: "white"}},
    {type: "cat", paws: {count: 4}, tail: {color: "gray"}},
    {type: "lizard", paws: {count: 0}, tail: {color: "grey"}},]; 

filter(pObj, tObjs);
// [{type: "cat", paws: {count: 4}, tail: {color: "gray"}},
//  {type: "lizard", paws: {count: 0}, tail: {color: "grey"}}]

// OR filter reversing the reg exp match where the reg exp is on the 
// target objects and being tested against the pattern object. 

var options = {regExpMatch: true, regExpReverse: true};
var props = ["tail.color"]; 
var filter = fos.makeFilterFn(props,options);

var pObj = {tail: {color: 'gray'}}; 
var tObjs = [
    {type: "dog", paws: {count: 4}, tail: {count: 1, color: "black"}},
    {type: "rabbit", paws: {count: 3}, tail: {count: 1, color: "white"}},
    {type: "cat", paws: {count: 4}, tail: {color: "gray"}},
    {type: "lizard", paws: {count: 0}, tail: {color: /gr.y/}},]; 

filter(pObj, tObjs);
//  [{type: "cat", paws: {count: 4}, tail: {color: "gray"}},
//   {type: "lizard", paws: {count: 0}, tail: {color: /gr.y/}}]

```

See [`performance`](#performance) section for performance info. 

Tested on latest versions of Node 0.10, 0.12, 4 and 5. 

## API
### Match and Filter Functions
* [`filter`](#filter) 
* [`makeFilterFn`](#makeFilterFn)  
* [`matches`](#matches) 
* [`makeMatchFn`](#makeMatchFn)  

### [Options](#options)
* [`regExpMatch`](#regExpMatch) (Plus several related reg exp options)
* [`matchIfPObjPropMissing`](#matchIfPObjPropMissing)
* [`matchIfTObjPropMissing`](#matchIfPObjPropMissing)
* [`variablesAllowed`](#variablesAllowed)
* [`propMatchFn`](#propMatchFn)

<a name="filter"></a>
### filter(pObj, tObjs)
Returns a new array of `tObjs` that match the `pObj` based on default [Options](#options) if called directly or the `propsToTest` and `options` parameters if this function was created  with `makeFilterFn`. Call `makeFilterFn` to create this function for better performance.  

__Arguments__
* [`pObj`](#pObj)
* `tObjs` - An array of [`tObj`](#tObj) objects

__Examples__
```javascript
// find which pets have gray paws regardeless if 'gray' or 'grey'

var fos = require('filter-objects');

var pets = [
  { name: 'fido',
    paws: {color: 'gray', count: 3}, 
  },
  { name: 'rover',
    paws: {color: 'white', count: 4}, 
  },
  ];

// create the pattern object
var pObj = {paws:{color: /gr[a,e]y/}};  

// select properties and options to test
var propsToTest = ['paws.color'];
var options = {regExpMatch: true}; 

// create the filter function
var filter = fos.makeFilterFn(propsToTest, options);

// filter
filter(pObj, pets);  
// [ { name: 'fido', paws: { color: 'gray', count: 3 } } ] 
```

<a name="makeFilterFn"></a>
### makeFilterFn(propsToTest, options)
Creates and returns a [`filter`](#filter) function that is configured to test the properties included in `propsToTest` using `options` to determine how properties are tested for a match between `pObj` and `tObjs`.

__Arguments__
* [`propsToTest`](#propsToTest)
* [`options`](#options) _optional_ Applies to each property in `propsToTest` unless `options` values are included for properties in `propsToTest`.  `options` precedence is (1) `propsToTest` `options` values if set (2) `options` as included here as a parameter, otherwise (3) `options` default values. 

__Examples__
See `filter`.


<a name="matches"></a>
### matches(pObj, tObj)
Tests pattern object against one object.  Returns `true` if properties identified to be tested between `pObj` and `tObj` match; otherwise returns `false`.

Which properties are tested and if they match is determined by whether `matches` is called directly or created via the [`makeMatchFn`](#makeMatchFn). 

If `matches` is created via `makeMatchFn` then the [`propsToTest`](#propsToTest) and [`options`](#options) parameters determine which properties are tested for match and how the properties are tested for match.  Calling the resulting `matches` function created via `makeMatchFn` also provides better performance than calling `matches` directly.

If `matches` function is called directly without creating it via `makeMatchFn`, every property in the `pObj` object is tested for a match and all `options` values are default.  `Options` cannot be modified if calling `matches` directly.

__Arguments__
* [`pObj`](#pObj)
* [`tObj`](#tObj)

__Examples__
```javascript
// test if fido's tail color is gray
var fos = require('filter-objects');

var fido ={ 
    tail: {color: 'gray', count: 1},
    body: {color: 'black'},
    housetrained: true};

var pObj = {tail: {color: 'gray'}};

fos.matches(pObj, fido);  //true
});

// Or, create the matches function to include option 
//      such as regular expression matches. 

// select the properties to be tested and the options
var propsToTest = ['tail.color']; 
var options = {regExpMatch:true}; 

// create the custom match function
var matchFn = fos.makeMatchFn(propsToTest, options);

// include the regular expression in the 'pattern object'
var pObj = {tail:{color: /gr.y/}};  

// test it
matchFn(pObj, fido);  // true

```

<a name="makeMatchFn"></a>
### makeMatchFn(propsToTest, options)
Creates and returns a [`matches`](#matches) function that is configured to test the properties included in `propsToTest` and `options` to determine how properties are tested for a match.  This created function will run faster than calling the `matches` function directly and allows for greater control, via `propsToTest` and `options`, of which properties are tested and how.  

__Arguments__
* [`propsToTest`](#propsToTest)
* [`options`](#options) - _optional_ Applies to each property in `propsToTest` unless `options` values are included for properties in `propsToTest`.  `options` precedence is (1) `propsToTest` `options` values if set (2) `options` as included here as a parameter, otherwise (3) `options` default values.   

__Examples__
```javascript
// test if fido has a gray tail regardless if grey or gray
var fos = require('filter-objects');

var fido ={ tail: {color: 'gray', count: 1}};

// select the properties to be tested and the options
var propsToTest = ['tail.color']; 
var options = {regExpMatch:true}; 

// create the match function
var matchFn = fos.makeMatchFn(propsToTest, options);

// include the regular expression in the 'pattern object'
var pObj = {tail:{color: /gr.y/}};  

// test it
matchFn(pObj, fido);  // true
});
```

It would give the same result to set the `options` in `propsToTest`
```javascript
var propsToTest = {'tail.color':{regExpMatch:true}}; 

var matchFn = fos.makeMatchFn(propsToTest);  // options not included here

matchFn(pObj, fido) // true;

```


### <a name="pObj" />pObj 
__"pattern object"__.  Any object that is passed into a [`matches`](#matches) or [`filter`](#filter) function as the first parameter.  It is used to test if it matches the [target object](#tObj)(`tObj`). 

```javascript
var fos = require('filter-objects');

// the target object here is fido
var fido ={ 
    paws: {color: 'grey', count: 3}, 
    tail: {color: 'gray', count: 1},
    body: {color: 'black'},
    housetrained: true};

// the pattern object
var pObj = {tail: {color: 'gray'}};

fos.matches(pObj, fido);  //true
```

### <a name="tObj" />tObj 
__"target object"__.  Any object that is passed into a [`matches`](#matches) or [`filter`](#filter) (as an array) function as the second parameter.  The target object or objects is/are the object(s) that is/are being tested against the pattern object to determine if it matches.  See notes and example  under [`pObj`](#pObj). 

### <a name="propsToTest" />propsToTest 
An array or object that contains property names and their assigned [`options`](#options) values, if any.  Property names are strings and are in dot notation if nested; eg "tail.color" to identify the property in `{tail: {color: black}}`. 

Can take one of the following forms: 
* an array of strings which are the property names to be tested.  `options` values cannot be specified for individual properties with this form.  Example: 
  ```javascript

  ['name', 'tail.color', 'housetrained']
  ```

* an array of objects, one for each property to be tested, each containing a 'name' property assigned to the property name to be tested, and option property key/values (optional). Example: 
  ```javascript
  // test using default options for housetrained; tail.color using reg exp match
  [{name: 'housetrained'}, {name: 'tail.color', regExpMatch: true}]
  ```

* an array of combination of the above 2 (strings and objects). Example: 
  ```javascript
  ['housetrained', {name: 'tail.color', regExpMatch: true}]
  ```

* an object with property names as keys and `options` objects as the values. Example: 
  ```javascript
  // test using default options for housetrained; tail.color using reg exp match
  {'housetrained':{}, 'tail.color': {regExpMatch: true}}
  ```

### <a name="options" />options
An object used to set the option values for match and filter functions.  

```javascript
//options properties & their default values
var options = {
  regExpMatch: false,        // match on regular expression in `pObj` 
  regExpReverse: false,      // reg exp on the *`tObj`* and tests against the pObj
  regExpIgnoreCase: false,   // ignore case on reg exp match (str only) 
  regExpAnchorStart: false,  // append "^" to beg of str for reg exp (str only)
  regExpAnchorEnd: false,    // append "$" to end of str for reg exp (str only)

  matchIfPObjPropMissing: false,  // matches if `pObj` property doesn't exist
  matchIfTObjPropMissing: false,  // matches if `tObj` property doesn't exist

  variablesAllowed: false,  // replace var names with var values in `pObj` props 
  getVariables: undefined,  // function to call to get object of var names/vals
  variablesStartStr: '~',   // beg str in pObj prop value to find the var name  
  variablesEndStr: null,    // end str in pObj prop value to find the var name

  propMatchFn: null         // function to call instead of std match function
}; 
```

##### <a name="regExpMatch" />regExpMatch
Property on the [`options`](#options) object that if equal to `true`, fos filter and matches functions will use the `pObj` property value as a regular expression to test against the `tObj` property.  If the pattern object property value is a string, the string will be converted to a javascript regular expression.  
  - valid values: `true`,`false`
  - default: `false`

Example: 
```javascript
// test if fido has a gray tail regardless if grey or gray
var fos = require('filter-objects');

var fido ={ 
    paws: {color: 'grey', count: 3}, 
    tail: {color: 'gray', count: 1},
    body: {color: 'black'},
    housetrained: true};

// select the properties to be tested and the options
var propsToTest = ['tail.color']; 
var options = {regExpMatch:true}; 

// include the regular expression in the 'pattern object'
var pObj = {tail:{color: /gr[a,e]y/}};  

// create the match function
var matchFn = fos.makeMatchFn(propsToTest, options);

// test it
matchFn(pObj, fido);  // true
```

##### <a name="regExpReverse" />regExpReverse
Property on the [`options`](#options) object that reverses the regular expression test so that the *`tObj`* is a regular expression that will be tested against the *`pObj`* property.  
Like all of the regExp options, this option is _only_ considered if `regExpMatch` = `true`.

```
var options = {regExpMatch: true, regExpReverse: true};
var props = ["tail.color"]; 
var filter = fos.makeFilterFn(props,options);

var pObj = {tail: {color: 'gray'}}; 
var tObjs = [
    {type: "dog", paws: {count: 4}, tail: {count: 1, color: "black"}},
    {type: "rabbit", paws: {count: 3}, tail: {count: 1, color: "white"}},
    {type: "cat", paws: {count: 4}, tail: {color: "gray"}},
    {type: "lizard", paws: {count: 0}, tail: {color: /gr.y/}},]; 

filter(pObj, tObjs);
//  [{type: "cat", paws: {count: 4}, tail: {color: "gray"}},
//   {type: "lizard", paws: {count: 0}, tail: {color: /gr.y/}}]

```


##### <a name="regExpIgnoreCase" />regExpIgnoreCase
Property on the [`options`](#options) object that if equal to `true` __and__ [`regExpMatch`](#regExpMatch)===`true` __and__ the `pObj` property value is a string, then when the `pObj` value is converted from a string to a regular expression object in `matches` and `filter` functions,  the regular expression is included with the 'i' flag to ignore case on the regular expression match.  This option value is only considered where the `pObj` property value is a string.  If the `pObj` value is a regular expression object, then the ignore case flag can be included on that object; eg "/gray/i".   
  - valid values: `true`,`false`
  - default: `false`
Like all of the regExp options, this option is _only_ considered if `regExpMatch` = `true`.

Example: 
```javascript
// test if fido has a gray tail regardless if grey or Gray
var fos = require('filter-objects');

var fido ={ 
    paws: {color: 'grey', count: 3}, 
    tail: {color: 'Gray', count: 1},
    body: {color: 'black'},
    housetrained: true};

// select the properties to be tested and the options
var propsToTest = ['tail.color']; 
var options = {regExpMatch:true, regExpIgnoreCase: true}; 

// include the regular expression as a string in the pattern object
var pObj = {tail:{color: 'gr[a,e]y'}};  

// create the match function
var matchFn = fos.makeMatchFn(propsToTest, options);

// test it
matchFn(pObj, fido);  // true
// and same approach with `filter`
```

// regExpIgnoreCase does not apply if pObj property is a regular expression
```javascript
var pObj = {tail:{color: /gr[a,e]y/}};  

matchFn(pObj, fido, function(doesMatch){
  console.log(doesMatch);  // false
});

// use the 'i' flag on the regular expression object instead 
var pObj = {tail:{color: /gr[a,e]y/i}};  

matchFn(pObj, fido);  // true
// and same approach with `filter`
```

##### <a name="regExpAnchorStart" />regExpAnchorStart
Property on the [`options`](#options) object that if equal to `true` __and__ [`regExpMatch`](#regExpMatch)===`true` __and__ the `pObj` property value is a string, then when the `pObj` value is converted from a string to a regular expression object in fos matches and filter functions, it includes a '^' prepended to `pObj` string value.  This option value is only considered where the `pObj` is a string.  If the `pObj` property value is a regular expression object, then the ^ can be included in the regular expression; eg, /^gray/.  
  - valid values: `true`,`false`
  - default: `false`

  This option will rarely (ever?) be needed as this can also be achieved with a `pObj` value that is a string by simply including the ^ in the string (without setting `regExpAnchorStart`=true). 
  
  Like all of the regExp options, this option is _only_ considered if `regExpMatch` = `true`.

  These 3 would yield the same result: 

  ```javascript 
var pObj = {tail: {color: '^gray'}}
var options = {regExpMatch: true}
```
  ```javascript 
var pObj = {tail: {color: 'gray'}}
var options = {regExpMatch: true, regExpAnchorStart: true}
```
  ```javascript 
var pObj = {tail: {color: /^gray/}}
var options = {regExpMatch: true}
```

##### <a name="regExpAnchorEnd" />regExpAnchorEnd
Property on the [`options`](#options) object that if equal to `true` __and__ [`regExpMatch`](#regExpMatch)===`true` __and__ the `pObj` property value is a string, then when the `pObj` value is converted from a string to a regular expression object in fos matches and filter functions, it includes a '$' appended to the end of the `pObj` string value.  This option value is only considered where the `pObj` is a string.  If the `pObj` property value is a regular expression object, then the $ can be included in the regular expression; eg, /gray$/.  
  - valid values: `true`,`false`
  - default: `false`

  This option will rarely (ever?) be needed as this can also be achieved with a `pObj` value that is a string by simply including the $ in the string (without setting `regExpAnchorEnd`=true).  

  Like all of the regExp options, this option is _only_ considered if `regExpMatch` = `true`.
  
  These 3 would yield the same result: 

  ```javascript 
var pObj = {tail: {color: 'gray$'}}
var options = {regExpMatch: true}
```
  ```javascript 
var pObj = {tail: {color: 'gray'}}
var options = {regExpMatch: true, regExpAnchorEnd: true}
```
  ```javascript 
var pObj = {tail: {color: /gray$/}}
var options = {regExpMatch: true}
```


##### <a name="matchIfTObjPropMissing" />matchIfTObjPropMissing
Property on the [`options`](#options) object that if equal to `true`, `filter` and `matches` functions will return `true` for the given property's match test if the property being tested does not exist on `tObj`. 
  - valid values: `true`,`false`
  - default: `false`

Example: 
```javascript
// find which pets have a role of guarddog and (the breed is chihuahua or 
//     breed is not defined)  

var fos = require('filter-objects');

var pets = [
  {name: 'growler',
   breed: 'chihuahua',
   role: 'guarddog'},
  {name: 'fido',
   breed: 'lab',
   role: 'pet'},
  {name: 'duchy',
   role: 'guarddog'},
  {name: 'bruiser',
   breed: 'chihuahua',
   role: 'cuddler'},
]

// request is the tObj 
var pObj = {role:'guarddog', breed: 'chihuahua'};

// select properties to test; role with default options
var propsToTest = 
    {role: {}, breed: {matchIfTObjPropMissing: true}};

// create the filter function
var filter = fos.makeFilterFn(propsToTest);

// filter
filter(pObj, pets);  
// [ { name: 'growler'...},{name: 'duchy'...} ]

```

##### <a name="matchIfPObjPropMissing" />matchIfPObjPropMissing
Property on the [`options`](#options) object that if equal to `true`, `filter` and `matches` functions will return `true`for the given property's match test if the property being tested does not exist on `pObj`. 
  - valid values: `true`,`false`
  - default: `false`

Example: 

```javascript
// find which pets match a request with a role of guarddog and 
//     (the breed is chihuahua or breed is not defined)  

var fos = require('filter-objects');

// pets are the `pObjs` in this case to match on their regular expressions
var pets = [
  {name: 'growler',
   breed: 'chihuahua',
   path: /.*role=guarddog.*/},
  {name: 'fido',
   breed: 'lab',
   path: /.*role=pet.*/},
  {name: 'duchy',
   path: /.*role=guarddog.*/},
  {name: 'bruiser',
   breed: 'chihuahua',
   path: /.*role=cuddler.*/},
]

// request is the tObj 
var request = {path: '/pets?role=guarddog'}

// select properties and options to test
var propsToTest = 
    {path: {regExpMatch: true, regExpReverse: true}, 
     breed: {matchIfPObjPropMissing: true}};

// create the filter function
var filter = fos.makeFilterFn(propsToTest);

// filter
filter(request, pets);  
  // [ { name: 'growler'...},{name: 'duchy'...} ]
});

var request = {path: '/pets?role=guarddog', breed: 'chihuahua'}
// [ { name: 'growler'...} ]

```


##### <a name="variablesAllowed" />variablesAllowed
Property on the [`options`](#options) object that if equal to `true`, replaces strings that are recognized as variable names in `pObj` property values with their respective variable values from [`getVariables`](#getVariables).  The varible names on the `pObj` property values is matched based on the [`variablesStartStr`](#variablesStartStr) and [`variablesEndStr`](#variablesStartStr). 
  - valid values: `true`,`false`
  - default: `false`

Example: 
```javascript
// match if fido has a grey tail and paws regardless if grey or gray

var fos = require('filter-objects');

var fido ={ 
    paws: {color: 'grey', count: 3}, 
    tail: {color: 'gray', count: 1},
    body: {color: 'black'},
    housetrained: true};

var options =  
    {regExpMatch: true,
     variablesAllowed:true,
     variablesStartStr:"~",
     variablesEndStr: "#",
     getVariables:  function(cb) {
       return cb(null, {grayColor: /gr[a,e]y/}); 
    }};

// variable name is identified between variablesStartStr(~) and variablesEndStr(#)
//   and replaced with that name from getVariables (grayColor => /gr[a,e]y/)
var pObj = {paws:{color: '~grayColor#'},tail:{color:'~grayColor#'}};  

var propsToTest = ['paws.color', 'tail.color'];

var matchFn = fos.makeMatchFn(propsToTest, options);

matchFn(pObj, fido) // true;

// and works the same with `filter` for an array of objects

```

##### <a name="getVariables" />getVariables
Property on the [`options`](#options) object that defines a function which, if [`variablesAllowed`](#variablesAllowed) is `true`, takes a callback which is called with an error (null if no error) and an object of the form : 

```javascript
{variable1Name: `variable1Value`,
  variable2Name: `variable2Value`}
```

See [`variablesAllowed`](#variablesAllowed) for an example.

##### <a name="variablesStartStr" />variablesStartStr
Property on the [`options`](#options) object that defines a string which, if [`variablesAllowed`](#variablesAllowed) === `true`, determines the starting position of a variable name string in a `pObj` property value that will be replaced with the variable value string of the respective variable name obtained from [`getVariables`](#getVariables). 

See [`variablesAllowed`](#variablesAllowed) for an example.


##### <a name="variablesEndStr" />variablesEndStr
Property on the [`options`](#options) object that defines a string which, if [`variablesAllowed`](#variablesAllowed) === `true`, determines the ending position of a variable name string in a `pObj` property value that will be replaced with the variable value string of the respective variable name obtained from [`getVariables`](#getVariables). 

See [`variablesAllowed`](#variablesAllowed) for an example.


##### <a name="propMatchFn" />propMatchFn
Property on the [`options`](#options) object that defines a function to replace the match function between `pObj` and `tObj` properties.   
  - default: `null`

Function is called with 3 parameters for each property being tested: 
* `pObjProp` - an object-literal with these 2 properties: 
    - `value`: the value of the [`pObj`](#pObj) property value
    - `exists`: `true` or `false` depending on whether the property exists on `pObj` 
* `tObjProp` - an object-literal with these 2 properties: 
    - `value`: the value of the [`tObj`](#tObj) property value
    - `exists`: `true` or `false` depending on whether the property exists on `tObj` 

Example: 
```javascript
// find pets with 3 or more paws

var fos = require('filter-objects');

var pets = [
  { name: 'fido',
    paws: {color: 'gray', count: 3}},
  { name: 'rover',
    paws: {color: 'white', count: 4}},
  { name: 'slither',
    paws: {count: 0}},
  ];

var pObj = {paws:{count: 3}};  

//   propMatchFn is called for each property with the 
//      pattern object property value and the target object property value 
var matchFn = function(pObjProp, tObjProp) {
  var hasAtLeast3Paws = tObjProp.exists === true && 
      pObjProp.exists === true && 
      tObjProp.value >= pObjProp.value;
  return hasAtLeast3Paws;  
}; 

var propsToTest = {'paws.count': {propMatchFn: matchFn}}; 

var filter = fos.makeFilterFn(propsToTest);

filter(pObj, pets); 
  //matchedPets = {name: 'fido'..., name:'rover'...}; 

```

<a name="performance"></a>
#### Performance
An overall summary of benchmark performance tests can be found [here](https://github.com/tonybranfort/filter-objects/blob/master/performance/perf-overall-summary.txt).  Details can be found in the performance/results folder of the perf-results branch.

Some general observations from the performance benchmark tests: 
* __Always use `makeFilterFn` to create your filter__ if possible rather than calling `filter` directly.  Running `matches` without `makeMatchFn` (on which `filter` is based) can run about 10 times slower. 
* __95% of response times for `filter` are less than .10 μs and 15 μs per property__ (μs = microsecond = .001 millisecond) on a fresh build smallest available aws Linux server (see note below on Node 5.4).  This means that if filtering on one property, each filtered object responded within .10 μs and 15 μs 95% of the time.  If filtering on 10 properties, it would have responded within 1 μs and 150 μs per object 95% of the time (10 x).  
* __Depth of properties matters.__  This is true for both hard-coded array filters (using javascript Array.prototype.filter directly) or using filter-objects.  Filtering on bojects with properties going from 1 deep and to 4 deep increased the result time anywhere from 0 to almost 6 times with most response times increasing 2-3 times (again, looking at 95th percentile).
* __Still call Array.prototype.filter directly if you can and if performance is paramount.__  filter-objects adds performance overhead to calling Array.prototype.filter directly - as would be expected.  The 95th percentile response time increased from .07-2.1 μs per filter property for calling Array.prototype.filter directly to 1.4 μs to 14 μs for the same filters with filter-objects (again - using makeFilterFn). 
* __Testing on Node 5.4 showed response time spikes__ up to 300 microseconds (95th percentile) per filter property. It clearly stands out when looking at the results summary but no further information if this is just an anomoly in the testing or is actually related to Node 5.4. 




