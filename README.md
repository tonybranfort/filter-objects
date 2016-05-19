# filter-objects.js
[![Build Status via Travis CI](https://travis-ci.org/tonybranfort/filter-objects.svg?branch=master)](https://travis-ci.org/tonybranfort/filter-objects)
[![Coverage Status](https://coveralls.io/repos/github/tonybranfort/filter-objects/badge.svg?branch=master)](https://coveralls.io/github/tonybranfort/filter-objects?branch=master)

###Use a pattern object to simply filter an array of objects or match on a single object.  

Features: 
* Simple 'pattern object' approach eg: `filter({fido: color: 'black'},arrayOfPetObjs)`
* Deep object property testing
* Can define filter properties & options prior to filter call for better performance
* Filter with regular expressions - on either the pattern object or targe objects 
* Filter options and functions can be defined for each object property being tested
* Custom filter functions
* Variables in the pattern and target objects

Install with: 
* `npm install filter-objects`
* `bower install filter-objects`

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

// Properties to test do not cascade to include nested object properties so
//   `propsToTest=['tail'] would not have the same result.  See propsToTest section.

```

See [`performance`](#performance) section for performance info. 

Tested on latest versions of Node 0.10, 0.12, 4, 5 and 6. 

## API
### Match and Filter Functions
* [`filter`](#filter) 
* [`makeFilterFn`](#makeFilterFn)  
* [`matches`](#matches) 
* [`makeMatchFn`](#makeMatchFn)  

### Helper functions
* [`setOptionsOnProps`](#setOptionsOnProps)
* [`setNestedPropOptions`](#setNestedPropOptions)

### [Options](#options) for `makeFilterFn` and `makeMatchFn`
* [`regExpMatch`](#regExpMatch) (Plus several related reg exp options)
* [`matchIfPObjPropMissing`](#matchIfPObjPropMissing)
* [`matchIfTObjPropMissing`](#matchIfPObjPropMissing)
* [variables](#variables) (`variablesInPObj`, `variablesInTObj`)
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
An array or object that contains property names and their assigned [`options`](#options) values, if any.  Property names are strings and are in dot notation if nested; eg "tail.color" to identify the property in `{tail: {color: black}}`.  Properties to test do __not__ cascade to include nested object properties; see caution note at bottom of this section. 

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

* an array of objects, one for each property to be tested, each with one key which is the property name and an options object as its value. Example: 
  ```javascript
  // test using default options for housetrained; tail.color using reg exp match
  [{'housetrained': {}}, {'tail.color': {regExpMatch: true}}]
  ```

* an array of combination of the above 3 (strings and objects). Example: 
  ```javascript
  ['housetrained', {name: 'tail.color', regExpMatch: true},{'paws':{regExpMatch: false}}]
  ```

* an object with property names as keys and `options` objects as the values. Example: 
  ```javascript
  // test using default options for housetrained; tail.color using reg exp match
  {'housetrained':{}, 'tail.color': {regExpMatch: true}}
  ```

__CAUTION:__ Every nested object property to be tested must be included in `propsToTest` if they are to be tested discretely; ie, properties to be tested are __not__ cascaded into nested objects.  For example: if the target object is `{name: 'fido',paws: {count: 4, color: 'black'}}`, including 'paws' in `propsToTest` does _not_ test paws.count and paws.color.  It simply will test the object {count:4, color: 'black'} using the test properties you have established so if it is a regExp test and the pattern object is {paws:'.\*color.\*'}, it _will_ match because the object is simply converted to a string.  To test the properties in paws, include 'paws.count' and 'paws.color' specifically in `propsToTest`.

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
  matchIfBothPropMissing: false,  // match on this property if BOTH tObj & pObj are missing

  variablesAllowed: false,  // replace var names with var values in `pObj` props 
  variablesInPObj: false,   // substitute variables in prop value in pattern obj
  variablesInTObj: false,   // substitute variables in prop value in target obj
  variables: {},            // object of variables with var names as keys
  variablesStartStr: '~',   // beg str in pObj prop value to find the var name  
  variablesEndStr: null,    // end str in pObj prop value to find the var name

  doNotCheckInherited: false, // do not include inherited properties

  propMatchFn: null         // function to call instead of std match function
}; 
```

##### <a name="regExpMatch" />regExpMatch
Property on the [`options`](#options) object that if equal to `true`, `filter` and `matches` functions will use the `pObj` property value as a regular expression to test against the `tObj` property.  If the pattern object property value is a string, the string will be converted to a javascript regular expression.  
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
Property on the [`options`](#options) object that if equal to `true` __and__ [`regExpMatch`](#regExpMatch)===`true` __and__ the `pObj` property value is a string, then when the `pObj` value is converted from a string to a regular expression object in matches and filter functions, it includes a '^' prepended to `pObj` string value.  This option value is only considered where the `pObj` is a string.  If the `pObj` property value is a regular expression object, then the ^ can be included in the regular expression; eg, /^gray/.  
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
Property on the [`options`](#options) object that if equal to `true` __and__ [`regExpMatch`](#regExpMatch)===`true` __and__ the `pObj` property value is a string, then when the `pObj` value is converted from a string to a regular expression object in matches and filter functions, it includes a '$' appended to the end of the `pObj` string value.  This option value is only considered where the `pObj` is a string.  If the `pObj` property value is a regular expression object, then the $ can be included in the regular expression; eg, /gray$/.  
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

##### <a name="matchIfBothPropMissing" />matchIfBothPropMissing
Property on the [`options`](#options) object that if equal to `true`, `filter` and `matches` functions will return `true`for the given property's match test if the property being tested does not exist on BOTH `pObj` and `tObj`. 
  - valid values: `true`,`false`
  - default: `false`

If `matchIfTObjMissing` &/or `matchIfPObjMissing` is set to `true`, then the match will still return `true` if either the tObj or pObj property is missing, respectively, even if both are not missing. 

Example: 

```javascript
it('should return true if properties missing in both pObj & tObj', 
  function() {
      var options = {
        matchIfBothPropMissing:true, 
        // matchIfTObjPropMissing: false   // default is false
        // matchIfPObjPropMissing: false   // default is false
      }; 
      var props = ["prop1",'prop2.cat.tail'];
      var pObj = {"prop1":"abc","prop2":{"cat":{"nose":"purple"}}};
      var tObj = {"prop1":"abc","prop2":{"cat":{"nose":"brown"}}};
      var f = fos.makeMatchFn(props,options);
      f(pObj, tObj).should.equal(true); 
  });

it('should return false if property exists in either pObj & tObj' + 
   'and matchIf_ObjPropMissing is false', function() {
      var options = {
        matchIfBothPropMissing:true, 
        // matchIfTObjPropMissing: false   // default is false
        // matchIfPObjPropMissing: false   // default is false
      }; 
      var props = ["prop1",'prop2.cat.tail'];
      var pObj = {"prop1":"abc","prop2":{"cat":{"tail":"purple"}}};
      var tObj = {"prop1":"abc","prop2":{"cat":{"nose":"brown"}}};
      var f = fos.makeMatchFn(props,options);
      f(pObj, tObj).should.equal(false);

      pObj = {"prop1":"abc","prop2":{"cat":{"nose":"purple"}}};
      tObj = {"prop1":"abc","prop2":{"cat":{"tail":"brown"}}};
      f(pObj, tObj).should.equal(false);
  });

it('should return true if property exists in either pObj & tObj' + 
   'and matchIf_ObjPropMissing is true', function() {
      var options = {
        matchIfBothPropMissing:true, 
        matchIfTObjPropMissing: true,   
        matchIfPObjPropMissing: true   
      }; 
      var props = ["prop1",'prop2.cat.tail'];
      var pObj = {"prop1":"abc","prop2":{"cat":{"tail":"purple"}}};
      var tObj = {"prop1":"abc","prop2":{"cat":{"nose":"brown"}}};
      var f = fos.makeMatchFn(props,options);
      f(pObj, tObj).should.equal(true);

      pObj = {"prop1":"abc","prop2":{"cat":{"nose":"purple"}}};
      tObj = {"prop1":"abc","prop2":{"cat":{"tail":"brown"}}};
      f(pObj, tObj).should.equal(true);
  });

```


##### <a name="variables" />variables (`variablesInPObj`, `variablesInTObj`)
`variablesInPObj` and `variablesInTObj` are properties on the [`options`](#options) object that if equal to `true`, replaces strings that are recognized as variable names in `pObj` &/or `tObj` property values respectively with their respective variable values from [`variables`](#variables).  The varible names on the property values is matched based on the [`variablesStartStr`](#variablesStartStr) and [`variablesEndStr`](#variablesStartStr). 
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
     variablesInPObj:true, 
     variablesStartStr:"+",
     variablesEndStr: ":",
     variables: {grayColor: /gr[a,e]y/i}
    };


// variable name is identified between variablesStartStr(~) and variablesEndStr(#)
//   and replaced with that name from variables (grayColor => /gr[a,e]y/)
var pObj = {paws:{color: '+grayColor:'}, tail:{color: '+grayColor:'}};  

var propsToTest = ['paws.color','tail.color'];

var matchFn = fos.makeMatchFn(propsToTest, options);

matchFn(pObj, fido) // true;

// Or substitue variables in both pObj and tObj

var options =  {variables:  {youngDog: "puppy", littleCuteUn: "puppy"}};

var props = 
  {"prop1":
    {"variablesInTObj":true,
     "variablesInPObj":true,
     "variablesStartStr":"/:"}};
var pObj = {"prop1":"/:littleCuteUn"};
var tObj = {"prop1":"/:youngDog"};
var f = fos.makeMatchFn(props, options);
f(pObj, tObj);  //true


```

##### <a name="variables" />variables
Property on the [`options`](#options) object that defines the variable names and values.

See [`variablesInPObj`](#variablesInPObj) for an example.

##### <a name="variablesStartStr" />variablesStartStr
Property on the [`options`](#options) object that defines a string which, if [`variablesInPObj`](#variablesInPObj) === `true` or [`variablesInTObj`](#variablesInTObj) === `true`, determines the starting position of a variable name string in a `pObj` property value that will be replaced with the variable value string of the respective variable name obtained from [`variables`](#variables). 

See [`variablesInPObj`](#variablesInPObj) for an example.


##### <a name="variablesEndStr" />variablesEndStr
Property on the [`options`](#options) object that defines a string which, if [`variablesInPObj`](#variablesInPObj) === `true` or [`variablesInTObj`](#variablesInTObj) === `true`, determines the ending position of a variable name string in a `pObj` property value that will be replaced with the variable value string of the respective variable name obtained from [`variables`](#variables). 

See [`variables`](#variables) for examples.

##### <a name="doNotCheckInherited" />doNotCheckInherited
Property on the [`options`](#options) object that if `true` will cause `matches` and `filter` functions to not include inherited properties for matching of pattern &/or target objects.  

  - valid values: `true`,`false`
  - default: `false`

Example: 
```javascript
var props = ["prop1"];
var o = {"prop1":"abc"};
var pObj = Object.create(o); 
var tObj = {"prop1":"abc"};
// doNotCheckInherited is set to true at global level with this call so 
//    all inherited properties will be ignored (considered missing) 
//    on both tObj and pObj. 
// doNotCheckInherited could also be set at the property level on 
//    either or both pObj and tObj like all options.
var f = fos.makeMatchFn(props, {doNotCheckInherited: true});
f(pObj, tObj); // false

// inherited properties are considered missing if doNotCheckInherited
var props = ["prop1"];
var o = {"prop1":"abc"};
var pObj = Object.create(o); 
var tObj = {"prop1":"abc"};
var options = {doNotCheckInherited: true, matchIfPObjPropMissing: true}
var f = fos.makeMatchFn(props, options);
f(pObj, tObj); // true 


```

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

<a name="setOptionsOnProps"></a>
#### setOptionsOnProps(propsToTest, options)
Helper function to modify the [`propsToTest`](#propsToTest) object setting options on each property. `setOptionsOnProps` is called by `makeFilterFn` and `makeMatchFn` so `setOptionsOnProps` does not need to be called prior to those.  `setOptionsOnProps` is exposed to see the options set for each property.  As noted in makeFilterFn and makeMatchFn, `options` precedence is (1) `propsToTest` `options` values if set (2) `options` as included here as a parameter, otherwise (3) `options` default values.  

__Arguments__
* [`propsToTest`](#propsToTest)
* options: Object with any of [`options`](#options) properties.

__Examples__
```javascript
var propsToTest = [
  'method',
  'query.filter',
  {name:'query.limit', regExpMatch: false}];
var options = {regExpMatch: true}; 

var updatedProps = fos.setOptionsOnProps(propsToTest, options); 

console.log(updatedProps); 
/*
[ { name: 'method',
    regExpReverse: false,
    regExpIgnoreCase: false,
    regExpAnchorStart: false,
    regExpAnchorEnd: false,
    matchIfPObjPropMissing: false,
    matchIfTObjPropMissing: false,
    matchIfBothPropMissing: false,
    variables: {},
    variablesInPObj: false,
    variablesInTObj: false,
    variablesStartStr: '~',
    variablesEndStr: null,
    propMatchFn: null,
    regExpMatch: true },
  { name: 'query.filter',
    regExpReverse: false,
    regExpIgnoreCase: false,
    regExpAnchorStart: false,
    regExpAnchorEnd: false,
    matchIfPObjPropMissing: false,
    matchIfTObjPropMissing: false,
    matchIfBothPropMissing: false,
    variables: {},
    variablesInPObj: false,
    variablesInTObj: false,
    variablesStartStr: '~',
    variablesEndStr: null,
    propMatchFn: null,
    regExpMatch: true },
  { name: 'query.limit',
    regExpMatch: false,
    regExpReverse: false,
    regExpIgnoreCase: false,
    regExpAnchorStart: false,
    regExpAnchorEnd: false,
    matchIfPObjPropMissing: false,
    matchIfTObjPropMissing: false,
    matchIfBothPropMissing: false,
    variables: {},
    variablesInPObj: false,
    variablesInTObj: false,
    variablesStartStr: '~',
    variablesEndStr: null,
    propMatchFn: null } ]
*/

// Above can just be informational if needed or can be fed into makeFilterFn or makeMatchFn

var filter = makeFilterFn(updatedProps);

// which would have the same result as this: 
var filter = makeFilterFn(propsToTest, options);


```

<a name="setNestedPropOptions"></a>
#### setNestedPropOptions(propsToTest, propOptions)
Helper function to modify `propsToTest` so that options for each property cascade from higher level properties in `propOptions` to lower level properties. propsToTest can then be used as input to makeFilterFn or makeMatchFn. (Note that only _options_ are cascaded. _Which_ properties is not cascaded.  See [`propsToTest`](#propsToTest)). 

__Arguments__
* [`propsToTest`](#propsToTest)
* propOptions: A literal object with propNames as keys and [`options`](#options) as values.

__Examples__
```javascript
var propsToTest = [
  'method',
  'query',
  'query.filter',
  {name:'query.limit', regExpMatch: false},
  'query.filter.sort'];
var propOptions = {
  'query': {regExpMatch: true},  // cascade this option to all 'query.x' where isn't set on lower levels
  'query.limit': {variablesInTObj: true}
}; 

var updatedProps = fos.setNestedPropOptions(propsToTest, propOptions); 

console.log(updatedProps); 
/*
{ method: {},
  query: { regExpMatch: true },
  'query.filter': { regExpMatch: true },
  'query.limit': { regExpMatch: false, variablesInTObj: true },
  'query.filter.sort': { regExpMatch: true } }
*/

var options = {regExpReverse: true}; 
var filter = makeFilterFn(propsToTest, options);
// filter will test properties in propsToTest with those options 
//   and defaulting to regExpReverse to true across all of them 
//  (so for all props in propsToTest because it isn't set in any of the properties)  
//   Any option that isn't set in propsToTest or options will be set 
//   according to global options default - see options section. 
...

```

<a name="performance"></a>
#### Performance
An overall summary of benchmark performance tests can be found [here](https://github.com/tonybranfort/filter-objects/blob/master/performance/perf-overall-summary.txt).  Details can be found in the performance/results folder of the perf-results branch.

Some general observations from the performance benchmark tests: 
* __Always use `makeFilterFn` to create your filter__ if possible rather than calling `filter` directly.  Running `matches` without `makeMatchFn` (on which `filter` is based) can run about 10 times slower. 
* __95% of response times for `filter` are less than .10 μs and 10 μs per property__ (μs = microsecond = .001 millisecond) on a fresh build smallest available aws Linux server.  This means that if filtering on one property, each filtered object responded within .10 μs and 10 μs 95% of the time.  If filtering on 10 properties, it would have responded within 1 μs and 100 μs per object 95% of the time (10 x).  
* __Depth of properties matters.__  This is true for both hard-coded array filters (using javascript Array.prototype.filter directly) or using filter-objects.  Filtering on bojects with properties going from 1 deep to 4 deep increased the result time anywhere from 0 to almost 6 times with most response times increasing 2-3 times (again, looking at 95th percentile).
* __Still call Array.prototype.filter directly if you can and if performance is paramount.__  filter-objects adds performance overhead to calling Array.prototype.filter directly - as would be expected.  The 95th percentile response time increased from a range of .07-1.24 μs per filter property for calling Array.prototype.filter directly to a range of 1.38-4.33 μs for the same filters with filter-objects (again - using makeFilterFn). 




