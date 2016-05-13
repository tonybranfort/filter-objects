(function() {

  /*jslint node: true */
  'use strict'; 

  // "pObj" => the Pattern object.  
  //           Usually the left object (1st parameter) in function calls
  // "tObj" => the Target object(s). The object that will be tested against. 
  //           Usually the right object (2nd parameter) in function calls
  // eg itMatches({cat: /gr.y/}, {cat: "gray"}) => true
  //                 pObj            tObj

  var _ = {
    isObjClass : function(obj, clas) {
      return Object.prototype.toString.call(obj) === clas;
    },
    isObject: function(obj) {
      // returns true for anything except javascript primitive
      return obj instanceof Object; 
    },
    isObjectLiteral: function(obj) {
      return this.isObjClass(obj, "[object Object]"); 
    },
    isString: function(obj) {
      return this.isObjClass(obj, "[object String]"); 
    },
    isUndefined: function(obj) {
      return this.isObjClass(obj, "[object Undefined]"); 
    },
    isArray: function(obj) {
      return this.isObjClass(obj, "[object Array]"); 
    },
    isRegExp: function(obj) {
      return this.isObjClass(obj, "[object RegExp]"); 
    },
    isNull: function(obj) {
      return this.isObjClass(obj, "[object Null]");
    },
    isFunction: function(obj) {
      return this.isObjClass(obj, "[object Function]");
    }
  }; 

  var optionsDefault = {
    regExpMatch: false,             // if true, reg exp test is performed between tObj & pObj property
    regExpReverse: false,           // if true, reg exp is on the *tObj* and tests against the pObj 
    regExpIgnoreCase: false,        // ignore case upper/lower on reg exp match 
    regExpAnchorStart: false,       // append "^" to beginning of prop value string
    regExpAnchorEnd: false,         // append "$" to end of prop value string

    matchIfPObjPropMissing: false,  // match on this property if doesn't exist
    matchIfTObjPropMissing: false,  // match on this property if doesn't exist

    // variablesAllowed: false,     // DEPRECATED.  Use variablesInPObj &/or variablesInTObj
                                    // If variablesAllowed=true, same as variablesInPObj=true
    variablesInPObj: false,         // substitute variables in prop value in pattern object
    variablesInTObj: false,         // substitute variables in prop value in target object
    getVariablesFn: undefined,      // function to call to get variables 
                                       // eg; function(cb) {return cb(null, {youngDog: "puppy"}); }
    variablesStartStr: '~',          // string in prop value to find the variable name  
    variablesEndStr: null,           // string in prop value to find the variable name

    propMatchFn: null                // function to call instead of standard propMatch function
  }; 

  function getObjectProperties(obj) {
    // returns a list of all properties, all levels, of the object as an 
    // array in dot notation; eg; ["prop1"."cat", "prop1"."dog"]
    var props = []; 
    objectPropertyMap(
        obj, 
        function(err, propName, propValue, propFullPath) {
          props.push(propFullPath); 
        }
    );

    return props; 
  }

  function makeMatchFn(props, options) {

    var propMatchFunctions = getPropMatchFns(props, options); 

    return function(pObj, tObj) {
      return matches(pObj, tObj, propMatchFunctions); 
    };
  }

  function getPropMatchFns(props, options) {
    // returns an array of property match functions using
    //   props array (see getPropDefns) and default property definition
    var propMatchFunctions = []; 

    getPropDefns(props, options)
    .forEach(function(propDefn) {
      makePropMatchFn(propDefn, options, function(err, fn){
        propMatchFunctions.push(fn); 
      });
    });   
    return propMatchFunctions; 
  }

  function matches(pObj, tObj, propMatchFunctions) {
    // propMatchFunctions is an array of functions, typically one for each 
    //    property to be tested for a match. See makeMatchFn and makePropMatchFn.  
    // If all return true it's a match

    propMatchFunctions = propMatchFunctions && _.isArray(propMatchFunctions) ? 
      propMatchFunctions : getPropMatchFns(getObjectProperties(pObj), {}); 

    var doesItMatch = propMatchFunctions.every(
      function(propMatchFunction) {
        return propMatchFunction(pObj, tObj); 
      });

    return doesItMatch; 
  }

  function setOptionsDefault(options, optionsDefault) {
    //if a property doesn't exist on options object, that property is set to 
    //  the value of that property on optionsDefault  
    //Allows an options object to be passed in with only those properties that
    //  are wanted to over-ride the default option properties
    if (options) {
      var optionsDefaultKeys = Object.keys(optionsDefault); 
      // set each property on options to default for those that aren't set; eg, 
      //  options.checkMethod = options.checkMethod || optionsDefault.checkMethod
      for (var i = optionsDefaultKeys.length - 1; i >= 0; i--) {
        options[optionsDefaultKeys[i]] = 
          options.hasOwnProperty(optionsDefaultKeys[i]) ? 
            options[optionsDefaultKeys[i]] :  
            optionsDefault[optionsDefaultKeys[i]]; 
      }
    } else {
      options = optionsDefault; 
    }

    return options; 
  }

  function makePropsStdFormat(props) {
    // props is an array of the properties and optionally their options to be tested 
    //   This convers props to a consistent format: 
    //   [{name: 'propName', optionKey1: optionValue1,...},...]
    //    
    // "props" are the object properties to be compared.
    // The "props" parameter can be 
    //      1.  an array of strings which are the property names
    //      2.  an array of propDefn objects with name as property
    //      3.  an array of objects with name as key and options object as value
    //      4.  an array of combination of abbve 3
    //      5.  an object-literal of property names as the key 
    //             with propDefn objects 
    //    eg: ["myProperty"] 
    //        [{name: "myProperty", regExpMatch: false}]
    //        [{'myProperty':{regExpMatch:false}}]
    //        [{name: "myProperty", regExpMatch: false}, "myOtherProperty"]
    //        {myProperty: {regExpMatch: false}}

    var newProps; 


    // if props is an object-literal, convert to an array of objects
    if(_.isObjectLiteral(props)) {
      var propNames = Object.keys(props); 
      newProps = []; 
      for (var i = propNames.length - 1; i >= 0; i--) {
        // add name to object if doesn't exist
        props[propNames[i]].name = props[propNames[i]].name || propNames[i]; 
        newProps.push(props[propNames[i]]); 
      }
    } else {
      newProps = props; 
    }

    // create consistent format of each item in array so that 
    //   each is an object of form {name: 'yada', regExpMatch:true, ...}
    newProps.forEach(function(prop, idx) {
      if(_.isString(prop)) {
        var propDefn = {}; 
        propDefn.name = prop;
        newProps[idx] = propDefn; 
      } else if(_.isObjectLiteral(prop) && 
          Object.keys(prop).length ===1 &&
          _.isObjectLiteral(prop[Object.keys(prop)[0]])) {
        // then we have format of {'myProperty':{regExpMatch:false}}
        var newProp = prop[Object.keys(prop)[0]];
        newProp.name = Object.keys(prop)[0]; 
        newProps[idx] = newProp; 
      } else if(_.isObjectLiteral(prop) && _.isString(prop.name)) {
        //nothing to do - is in end format
      } else {
        throw new Error("Invalid parameter of properties; must be either an array" + 
          " of poperty names or an object-literal with property names as keys");
      }

    }); 

    return newProps; 

  }

  function getPropDefns(props, options) {
    // getPropDefns to be deprecated for setOptionsOnProps
    return setOptionsOnProps(props, options); 
  }

  function setOptionsOnProps(props, options) {
    // convert props to consistent format and set each prop's options
    //    to options value if it doesn't exist on prop

    props = makePropsStdFormat(props); 

    // assign default values to each prop defn where it isn't already assigned
    // TODO: replace with lodash defaultDeep
    options = setOptionsDefault(options, optionsDefault); 
    props.forEach(function(prop) {
      if(_.isObjectLiteral(prop) && _.isString(prop.name)) {
            prop = setOptionsDefault(prop, options); 
        } else {
          console.log(props); 
          throw new Error("Invalid parameter of properties; must be either an array" + 
            " of poperty names or an object-literal with property names as keys");
        }

    }); 

    return props;   
  }

  function makePropMatchFn(propDefn, options, callback) {
    // this creates and returns the match function for one property; 
    //    that is the match function that is called for this one property 
    //    to determine if it is a match (true) or not (false)

    //  use propDefn.propMatchFn if it is defined in options by user, 
    //    otherwise use the standard match function
    var matchFn = _.isNull(propDefn.propMatchFn) ? 
        makeStandardPropMatchFn(propDefn, options) : 
        propDefn.propMatchFn;  

    function returnFn(pObj, tObj) {

      var pObjPropRefObj = getPropRef(pObj, propDefn.name); 
      var tObjPropRefObj = getPropRef(tObj, propDefn.name); 

      var itMatches = matchFn(pObjPropRefObj, tObjPropRefObj); 

      return itMatches; 
    }

    return callback(null, returnFn); 
  }

  function makeStandardPropMatchFn(propDefn, options) {
    // makes the match function that will be performed for one property
    //   using propDefn to determine what the match function is.
    //   Function created will return true or false when called.

    // preMatchFns are functions, if any, that are to be performed serially
    // before the actual match test is performed; eg, replace variables
    var preMatchFns = [];

    // matchTests is an array of functions; 
    // one for each match test for this property
    var matchTests = [];   

    // variablesAllowed is DEPRECATED.  If used, same as variablesInPObj=true
    propDefn.variablesInPObj = propDefn.variablesAllowed || propDefn.variablesInPObj; 

    if(propDefn.variablesInTObj || propDefn.variablesInPObj) {
      preMatchFns.push(makeReplaceVariableFn()); 
    }

    if(propDefn.regExpMatch) {
      matchTests.push(makeRegExpMatchTestFn()); 
    } else {
      matchTests.push(equalTest); 
    }

    return standardMatchFn; 

    function standardMatchFn(pObjProp, tObjProp) {

      preMatchFns.forEach(function(preMatchFn){
         preMatchFn(pObjProp, tObjProp); 
      }); 

      var propMatches = 
        pObjProp.exists && tObjProp.exists ? 
         matchTests.every(
          function(matchTest) {
            return matchTest(pObjProp, tObjProp); 
          }) : 
        pObjPropMissingTest(pObjProp, tObjProp) && 
        tObjPropMissingTest(pObjProp, tObjProp); 
      return propMatches; 
    }

    function makeRegExpMatchTestFn() {
      var flags = ""; 
      var anchorStart = propDefn.regExpAnchorStart === true ? "^" : ""; 
      var anchorEnd   = propDefn.regExpAnchorEnd === true ? "$" : "";

      var returnFn; 

      flags = propDefn.regExpIgnoreCase === true ? flags.concat("i") : flags; 

      if(!propDefn.regExpReverse) {
        return function(pObjProp, tObjProp) {
          return regExpMatchTestFn(pObjProp, tObjProp); 
        }; 
      } else { 
        return function(pObjProp, tObjProp) {
          return regExpMatchTestFn(tObjProp, pObjProp); // switch parameters / test
        }; 
      }

      function regExpMatchTestFn(regexProp, testProp) {
        // turn into RegExp object if it isn't already
        // NOTE: if RegExp object is passed in, the RegExp is taken as-is 
        //   and these options are IGNORED
        //        regExpIgnoreCase
        //        regExpAnchorStart
        //        regExpAnchorEnd
        var re = _.isRegExp(regexProp.value) ? 
                  regexProp.value : 
                  new RegExp
                    (anchorStart + regexProp.value + anchorEnd, flags);
        return re.test(testProp.value); 
      }  // end of regExpMatchTestFn

    }  // end of makeRegExpMatchTestFn


    function equalTest(pObjProp, tObjProp) {
      return pObjProp.value === tObjProp.value;
    }

    function pObjPropMissingTest(pObjProp, tObjProp) {
      return propDefn.matchIfPObjPropMissing || pObjProp.exists; 
    }

    function tObjPropMissingTest(pObjProp, tObjProp) {
      return propDefn.matchIfTObjPropMissing || tObjProp.exists; 
    }


    function makeReplaceVariableFn() {
      var variablesStartStr = escapeStr(propDefn.variablesStartStr); 
      var variablesEndStr; 
      var variableNameMatchRegExp; 

      if(_.isNull(propDefn.variablesEndStr) ) {
        variableNameMatchRegExp = new RegExp(variablesStartStr + '(\\w*)',"g");   
      } else {
        variablesEndStr = escapeStr(propDefn.variablesEndStr); 
        variableNameMatchRegExp = 
          new RegExp(
            variablesStartStr + 
            '(.*)' +      // parantheses indicate the variable name being extracted
            variablesEndStr,"g");   
      }

      var replacePObjFn = function(pObjProp, tObjProp) {
        propDefn.getVariables(function(err, variables) {
          replaceVariable(pObjProp, variables);
          return; 
        });
      };

      var replaceTObjFn = function(pObjProp, tObjProp) {
        propDefn.getVariables(function(err, variables) {
          replaceVariable(tObjProp, variables);
          return;
        });
      };

      var replaceBothFn = function(pObjProp, tObjProp) {
        propDefn.getVariables(function(err, variables) {
          replaceVariable(pObjProp, variables);
          replaceVariable(tObjProp, variables);
          return;
        });
      };

      if(propDefn.variablesInTObj && propDefn.variablesInPObj) {
        return replaceBothFn; 
      } else if(propDefn.variablesInTObj) {
        return replaceTObjFn; 
      } else {
        return replacePObjFn; 
      }

      function escapeStr(str) {
        // http://stackoverflow.com/questions/3115150/how-to-escape-regular-expression-special-characters-using-javascript
        return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      }

      function replaceVariable(objProp, variables) {

        if(objProp.exists && _.isString(objProp.value)) {
          // if the pObj property value contains one variable name only, 
          //   without any other characters before or after 
          //   (except the variablesStartStr & variablesEndStr)
          //   then simply replace the variable name with the variable value
          //   rather than doing a string replace.   
          // This retains the a variable value that is an object (eg Reg Exp) 
          //  rather than converting it to a string.  
          var varName = 
              objProp.value.replace(new RegExp("^" + variablesStartStr), ""); 
          varName = varName.replace(new RegExp(variablesEndStr + "$"), ""); 
          if (variables.hasOwnProperty(varName)) {
            objProp.value = variables[varName]; 
          } else if (_.isString(objProp.value)) {
            objProp.value = objProp.value
              .replace(variableNameMatchRegExp,getVariableValue);
          }
        }
        return objProp; 

        function getVariableValue(match, variableName) { 
          return variables[variableName]; 
        }

      }  // end of replaceVariable fn
    }  // end of makeReplaceVariableFn

  }

  function getPropRef (obj, propName, callback) {
    // propNameKeys would have already been determined to be a valid
    //   string (converted to Array here) during function creation
    var propNameKeys = propName.split("."); 

    var propRef = obj; 
    var propExists; 
    var i = 0; 
    var len = propNameKeys.length; 
    var propRefObj = {value: null, exists: null};

    // while( //test performed before fn 
    while(_.isObject(propRef) && propRef.hasOwnProperty(propNameKeys[i]) && 
        i < len) {
      propRef = propRef[propNameKeys[i]]; 
      i++; 
     }

    // when test fails (passes through),
    // property exists if made it through all the prop names
    propExists = i === len ? true : false; 
    propRefObj.value = propRef;
    propRefObj.exists = propExists; 
    return propRefObj; 

  }   // end of getPropRef

  function objectPropertyMap(obj, fullPropPath, cb) {
    //executes cb on each obj property regardless of depth
    //fullPropPath is optional 
    //cb is called with 4 parameters
    //  1. error - null if none
    //  2. Property name as a string (lowest level only) (eg; "city")
    //  3. Property value (reference to the property value) 
    //  2. Full property path as a string in dot notation (eg; "client.address.city")
    if(_.isFunction(fullPropPath)) {
      cb = fullPropPath; 
      fullPropPath = ""; 
    }  

    var props = Object.keys(obj); 

    for (var i = 0; i <= props.length -1; i++) {
      var newFullPropPath = 
          fullPropPath === "" ? 
          props[i] : 
          fullPropPath + "." + props[i];
      if(_.isObjectLiteral(obj[props[i]])) {
        objectPropertyMap(obj[props[i]], newFullPropPath,  cb); 
      } else {
        cb(null, props[i], obj[props[i]], newFullPropPath); 
      }
    }
  }

  function makeFilterFn(props, options) {

    var propMatchFns = getPropMatchFns(props, options); 

    return function(pObj, tObjs) {
      return filter(pObj, tObjs, propMatchFns); 
    };
  }

  function filter(pObj, tObjs, propMatchFns) {
    propMatchFns = propMatchFns && _.isArray(propMatchFns) ? 
      propMatchFns : 
      getPropMatchFns(getObjectProperties(pObj), {regExpMatch: true}); 

    return tObjs.filter(
      function(tObj) {
        return matches(
          pObj, 
          tObj, 
          propMatchFns);
      });
  }

  function setNestedPropOptions(propsToTest, propOptions) {
    /* Modifies propsToTest so that options for each property cascade from 
       higher level properties in propOptions to lower level properties.  
       So if propOptions has {query:{regExpMatch:true}} and 
       propsToTest has ['query.filter'] then 
       propsToTest would become {'query.filter': {regExpMatch:true}}
    /* propsToTest must be in form of an array of objects with name key 
         (Call makePropsStdFormat if propsToTest needs to be converted to this form)
       propOptions is literal object with propNames as keys and filter-objects
         options objects as the values
         eg: {query: {regExpMatch: true}}
    */

    var newPtt = {};  

    propsToTest = makePropsStdFormat(propsToTest); 

    propsToTest.forEach(function(prop) {
      // for for options in propOptions by deepest property up to shallowest
      // 'one.two.three'
      var name = prop.name + '.';
      //['one','two','three',''] 
      var levelNames = name.split('.').reverse(); 
      newPtt[prop.name] = {}; 
      levelNames.forEach(function(splitPropName){
        name = name.substring(0,name.lastIndexOf('.' + splitPropName));
        //'one.two.three' then 'one.two' then 'one'
        // set any option properties on newPtt to propOptions property value
        //    if it doesn't exist on newPtt
        if(propOptions.hasOwnProperty(name)) {
          newPtt[prop.name] = setOptionsDefault(prop, propOptions[name]); 
        } 
      });
    }); 

    // not necessary but call makePropsStdFormat to return in consistent format
    //   eg: {'query.filter': {name: 'query.filter', regExpMatch: true}}
    //   becomes [{name:'query.filter': regExpMatch: true}]
    newPtt = makePropsStdFormat(newPtt); 

    return newPtt; 
  }

  var filterObjects = {
    makeMatchFn: makeMatchFn, 
    setOptionsOnProps: setOptionsOnProps,
    getPropDefns: getPropDefns,
    getPropMatchFns: getPropMatchFns, 
    makePropsStdFormat: makePropsStdFormat,
    objectPropertyMap: objectPropertyMap,
    matches: matches, 
    makeFilterFn: makeFilterFn,
    filter: filter,
    getObjectProperties: getObjectProperties,
    setNestedPropOptions: setNestedPropOptions,
    _: _
  };

  var root = this; 
  // thanks async: 
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = filterObjects;
    }
    exports.filterObjects = filterObjects;
  } else {
    root.filterObjects = filterObjects;
  }


})(); 
