var fos = require('../lib/index.js');
var should = require('should');

describe('Create Compare function',function(){

  it('should return property definitions with an object literal',function(){
      fos.getPropDefns({"prop1":{}, "prop2":{regExpMatch:false}})
      .length.should.equal(2);
  }); 

  it('should return property definitions with an array',function(){
      fos.getPropDefns(["propA","propZ"]).length.should.equal(2); 
  }); 

  it('should return property definitions with an array of mix of strings & objects',function(){
      fos.getPropDefns(
        ["propA","propZ", 
         {name: "basket", regExpMatch: false}])
      .length.should.equal(3); 
  }); 

  it('should return property definitions with an array of objects with name as key',
    function(){
      var props = fos.getPropDefns(
        ["propA","propZ", 
         {"basket": {regExpMatch: true}}]); 
      props.length.should.equal(3);
      props[0].name.should.equal('propA'); 
      props[2].regExpMatch.should.equal(true);  
      props[2].name.should.equal('basket'); 
  }); 

  it('should create a function', function() {
    Object.prototype.toString
    .call(fos.makeMatchFn(["prop1","prop2"]))
    .should.equal("[object Function]"); 
  });

});


describe('When the makeMatchFn is used , ', function(){
  describe('For a straight, Non Reg-ex (===) comparison', function(){
    it('it should return true if equal value and equal type', 
      function() {
        var props = ["prop1"];
        var pObj = {"prop1":"abc"};
        var tObj = {"prop1":"abc"};
        var f = fos.makeMatchFn(props);
        f(pObj, tObj).should.equal(true); 
    });
    it('it should return false if equal value and un-equal type', 
      function() {
        var props = ["prop1","prop2"];
        var pObj = {"prop1":123};
        var tObj = {"prop1":"123"};
        var f = fos.makeMatchFn(props);
        f(pObj, tObj).should.equal(false); 
    });
    it('it should return false if partial match', 
      function() {
        var props = ["prop1","prop2"];
        var pObj = {"prop1":"b"};
        var tObj = {"prop1":"abc"};
        var f = fos.makeMatchFn(props);
        f(pObj, tObj).should.equal(false); 
    });
    it('it should return false if un-equal value and equal type', 
      function() {
        var props = ["prop1","prop2"];
        var options = {};
        var pObj = {"prop1":"abc"};
        var tObj = {"prop1":"abcd"};
        var f = fos.makeMatchFn(props);
        f(pObj, tObj).should.equal(false); 
    });
    it('it should return true if === for a Null type', 
      function() {
        var props = ["prop1"];
        var pObj = {"prop1":null};
        var tObj = {"prop1":null};
        var f = fos.makeMatchFn(props);
        f(pObj, tObj).should.equal(true); 
    });
    it('it should return true if === for an Undefined type', 
      function() {
        var imundefined; 
        var props = ["prop1"];
        var pObj = {prop1: imundefined};
        var tObj = {prop1: imundefined};
        var f = fos.makeMatchFn(props);
        f(pObj, tObj).should.equal(true); 
    });
    it('it should return true if === for an Boolean type', 
      function() {
        var props = ["prop1"];
        var pObj = {"prop1":false};
        var tObj = {"prop1":false};
        var f = fos.makeMatchFn(props);
        f(pObj, tObj).should.equal(true); 
    });
    it('it should return true if === for a Number type', 
      function() {
        var props = ["prop1"];
        var pObj = {"prop1":123456};
        var tObj = {"prop1":123456};
        var f = fos.makeMatchFn(props);
        f(pObj, tObj).should.equal(true); 
    });
    it('it should return false if !== for a Number type', 
      function() {
        var props = ["prop1"];
        var pObj = {"prop1":233};
        var tObj = {"prop1":234};
        var f = fos.makeMatchFn(props);
        f(pObj, tObj).should.equal(false); 
    });
    it('it should return false for a partially matched string start', 
      function() {
        var props = ["prop1","prop2"];
        var pObj = {"prop1":"ab","prop2":4};
        var tObj = {"prop1":"abc","prop2":4};
        var f = fos.makeMatchFn(props);
        f(pObj, tObj).should.equal(false); 
    });
    it('it should return false for a partially matched string middle', 
      function() {
        var props = ["prop1","prop2"];
        var pObj = {"prop1":"b","prop2":4};
        var tObj = {"prop1":"abc","prop2":4};
        var f = fos.makeMatchFn(props);
        f(pObj, tObj).should.equal(false); 
    });
    it('it should return false for a partially matched string end', 
      function() {
        var props = ["prop1","prop2"];
        var pObj = {"prop1":"c","prop2":4};
        var tObj = {"prop1":"abc","prop2":4};
        var f = fos.makeMatchFn(props);
        f(pObj, tObj).should.equal(false); 
    });
    it('it should return false for partially matched number start', 
      function() {
        var props = ["prop1","prop2"];
        var pObj = {"prop1":"abc","prop2":45};
        var tObj = {"prop1":"abc","prop2":4};
        var f = fos.makeMatchFn(props);
        f(pObj, tObj).should.equal(false); 
    });
    it('it should return false for partially matched number end', 
      function() {
        var props = ["prop1","prop2"];
        var pObj = {"prop1":"abc","prop2":34};
        var tObj = {"prop1":"abc","prop2":4};
        var f = fos.makeMatchFn(props);
        f(pObj, tObj).should.equal(false); 
    });
  }); // end of For a straight, Non Reg-ex (===) comparison

  describe('For a Reg-ex comparison', function(){
    describe('Where pObj is a string ', function(){
      it('it should return true if reg ex matches', 
        function() {
          var props = {"prop1":{"regExpMatch":true}};
          var pObj = {"prop1":"a.c"};
          var tObj = {"prop1":"abc"};
          var f = fos.makeMatchFn(props);
          f(pObj, tObj).should.equal(true); 
        });
      it('it should return true if reg ex matches', 
        function() {
          var props = {"prop1":{"regExpMatch":true}};
          var pObj = {"prop1":".*dog"};
          var tObj = {"prop1":"cat ate the dog"};
          var f = fos.makeMatchFn(props);
          f(pObj, tObj).should.equal(true); 
        });
      it('it should return false if reg ex does not match', 
        function() {
          var props = {"prop1":{"regExpMatch":true}};
          var pObj = {"prop1":"^dog.*"};
          var tObj = {"prop1":"cat ate the dog"};
          var f = fos.makeMatchFn(props);
          f(pObj, tObj).should.equal(false); 
        });
      it('it should return true for matched string properties', 
        function() {
          var props = 
          {"prop1":{"regExpMatch":true}};
          var pObj = {"prop1":"ab."};
          var tObj = {"prop1":"abc"};
          var f = fos.makeMatchFn(props);
          f(pObj, tObj).should.equal(true); 
        });
      it('it should return true for matched string properties', 
        function() {
          var props = 
            {"prop1":{"regExpMatch":true}};
          var pObj = {"prop1":".*"};
          var tObj = {"prop1":"abc"};
          var f = fos.makeMatchFn(props);
          f(pObj, tObj).should.equal(true); 
        });
      it('it should return true for matched number properties', 
        function() {
          var props = {"prop1":{"regExpMatch":true}};
          var pObj = {"prop1":"4."};
          var tObj = {"prop1":45};
          var f = fos.makeMatchFn(props);
          f(pObj, tObj).should.equal(true); 
        });
      it('it should return true if caps do match, by default', 
        function() {
          var props = {"prop1":{"regExpMatch":true}};
          var pObj = {"prop1":"aBc"};
          var tObj = {"prop1":"aBc"};
          var f = fos.makeMatchFn(props);
          f(pObj, tObj).should.equal(true); 
        });
      it('it should return false if caps do not match, by default', 
        function() {
          var props = {"prop1":{"regExpMatch":true}};
          var pObj = {"prop1":"aBc"};
          var tObj = {"prop1":"abc"};
          var f = fos.makeMatchFn(props);
          f(pObj, tObj).should.equal(false); 
        });
      it('it should return true if caps do not match if regExpIgnoreCase=true', 
        function() {
          var props = {"prop1":{"regExpMatch":true,"regExpIgnoreCase":true}};
          var pObj = {"prop1":"aBc"};
          var tObj = {"prop1":"abc"};
          var f = fos.makeMatchFn(props);
          f(pObj, tObj).should.equal(true); 
        });
      it('it should return false if caps do not match if regExpIgnoreCase=false', 
        function() {
          var props = ['prop1.prop2'];
          var options = {regExpMatch:true, regExpIgnoreCase: false}; 
          var pObj = {"prop1":{prop2: "aBc"}};
          var tObj = {"prop1":{prop2: "abc"}};
          var f = fos.makeMatchFn(props,options);
          f(pObj, tObj).should.equal(false); 
        });
      it('it should return true if match without an anchor start or end', 
        function() {
          var props = {"prop1":{"regExpMatch":true}};
          var pObj = {"prop1":"b"};
          var tObj = {"prop1":"abba"};
          var f = fos.makeMatchFn(props);
          f(pObj, tObj).should.equal(true); 
        });
      it('it should return false if no match with regExpAnchorStart=true', 
        function() {
          var props = {"prop1":{"regExpMatch":true,"regExpAnchorStart":true}};
          var pObj = {"prop1":"b"};
          var tObj = {"prop1":"ab"};
          var f = fos.makeMatchFn(props);
          f(pObj, tObj).should.equal(false); 
        });
      it('it should return true matches with regExpAnchorStart=true', 
        function() {
          var props = {"prop1":{"regExpMatch":true,"regExpAnchorStart":true}};
          var pObj = {"prop1":"a"};
          var tObj = {"prop1":"ab"};
          var f = fos.makeMatchFn(props);
          f(pObj, tObj).should.equal(true);
      });
      it('it should return false if no match with regExpAnchorEnd=true', 
        function() {
          var props = {"prop1":{"regExpMatch":true,"regExpAnchorEnd":true}};
          var pObj = {"prop1":"a"};
          var tObj = {"prop1":"ab"};
          var f = fos.makeMatchFn(props);
          f(pObj, tObj).should.equal(false);
      });
      it('it should return true if matches with options regExpAnchorEnd=true', 
        function() {
          var props = {"prop1":{"regExpMatch":true,"regExpAnchorEnd":true}};
          var pObj = {"prop1":"b"};
          var tObj = {"prop1":"ab"};
          var f = fos.makeMatchFn(props);
          f(pObj, tObj).should.equal(true);
      });
      it('it should return true on match allowing for properties ' + 
          'to be defined in options affecting all regExp property defintions', 
          function() {
            var props = ["prop1"]; 
            var options = 
              { regExpMatch:true,
                 regExpAnchorStart: true,
                 regExpAnchorEnd: true,
                 regExpIgnoreCase: true,
              };            
            var f = fos.makeMatchFn(props,options);

            var pObj = {"prop1":".bb."};
            var tObj = {"prop1":"abBc"};
            f(pObj, tObj).should.equal(true);
        });
    }); // end of Where pObj is a string 
    describe('Where pObj is a RegExp object ', function(){
      it('it should return true if matches', 
          function() {
          var props = {"prop1":{"regExpMatch":true}};
          var pObj = {"prop1":/.*an/};
          var tObj = {"prop1":"frank"};
          var f = fos.makeMatchFn(props);
          f(pObj, tObj).should.equal(true);
        });
      it('it should return false if does not match', 
        function() {
          var props = {"prop1":{"regExpMatch":true}};
          var pObj = {"prop1":/.*bn/};
          var tObj = {"prop1":"frank"};
          var f = fos.makeMatchFn(props);
          f(pObj, tObj).should.equal(false);
        });
      it('it should return false if does not match', 
        function() {
          var props = {"prop1":{"regExpMatch":true}};
          var pObj = {"prop1":/.*bn/};
          var tObj = {"prop1":"frank"};
          var f = fos.makeMatchFn(props);
          f(pObj, tObj).should.equal(false);
        });
      it('it should ignore regExpAnchorStart=true ', 
        function() {
          var props = {"prop1":{"regExpMatch":true,"regExpAnchorStart":true}};
          var pObj = {"prop1":/b/};
          var tObj = {"prop1":"ab"};
          var f = fos.makeMatchFn(props);
          f(pObj, tObj).should.equal(true);
      });
      it('it should ignore regExpAnchorEnd=true', 
        function() {
          var props = {"prop1":{"regExpMatch":true,"regExpAnchorEnd":true}};
          var pObj = {"prop1":/a/};
          var tObj = {"prop1":"ab"};
          var f = fos.makeMatchFn(props);
          f(pObj, tObj).should.equal(true);
      });
      describe('When cases do not match, ', function(){
        it('it should return false with default options', 
          function() {
            var props = {"prop2":{"regExpMatch":true}};
            var pObj = {"prop2":/frAnk/};
            var tObj = {"prop2":"frank"};
            var f = fos.makeMatchFn(props);
            f(pObj, tObj).should.equal(false);
        });
        it('it should ignore regExpIgnoreCase=true and return false ', 
          function() {
            var props = {"prop2":{"regExpMatch":true,"regExpIgnoreCase":true}};
            var pObj = {"prop2":/frAnk/};
            var tObj = {"prop2":"frank"};
            var f = fos.makeMatchFn(props);
            f(pObj, tObj).should.equal(false);
        });
        it('it should return true if regExp object includes ignore case flag ', 
          function() {
            var props = {"prop2":{"regExpMatch":true}};
            var pObj = {"prop2":/frAnk/i};
            var tObj = {"prop2":"frank"};
            var f = fos.makeMatchFn(props);
            f(pObj, tObj).should.equal(true);
        });
      });  // end of When cases do not match
    }); // end of Where pObj is a RegExp object 
  }); // end of For a Reg-ex comparison

  describe('For multiple single depth properties', function(){
    it('it should return true if all match', 
      function() {
        var props = ["prop1","prop2"];
        var pObj = {"prop1":"abc","prop2":34};
        var tObj = {"prop1":"abc","prop2":34};
        var f = fos.makeMatchFn(props);
        f(pObj, tObj).should.equal(true);
      });
    it('it should return true if all match including null properties', 
      function() {
        var props = ["prop1","prop2"];
        var options = {};
        var pObj = {"prop1":"cat ate the dog","prop2":null};
        var tObj = {"prop1":"cat ate the dog","prop2":null};
        var f = fos.makeMatchFn(props);
        f(pObj, tObj).should.equal(true);
      });
    it('it should return false if all do not match', 
      function() {
        var props = ["prop1","prop2"];
        var pObj = {"prop1":"x","prop2":"xyz"};
        var tObj = {"prop1":"abc","prop2":"xyz"};
        var f = fos.makeMatchFn(props);
        f(pObj, tObj).should.equal(false);
      });
    it('it should return false if all do not match', 
      function() {
        var props = ["prop1","prop2"];
        var pObj = {"prop1":"abc","prop2":2};
        var tObj = {"prop1":"abc","prop2":"xyz"};
        var f = fos.makeMatchFn(props);
        f(pObj, tObj).should.equal(false);
      });
  }); // end of For multiple single depth properties

  describe('For multiple different property definitions', function() {
    it('it should true when they match for single depth properties',  
      function() {
        var props = 
        {"prop1": {},  //default regExpMatch=false
         "prop2": {regExpMatch: true}
        };
        var pObj = {"prop1":"abc","prop2":"x.z"};
        var tObj = {"prop1":"abc","prop2":"xyz"};
        var f = fos.makeMatchFn(props);
        f(pObj, tObj).should.equal(true);
    });
    it('it should false when they do not match for single depth properties',  
      function() {
        var props = 
        {"prop1": {},  //default regExpMatch=false
         "prop2": {regExpMatch: true}
        };
        var pObj = {"prop1":"a.c","prop2":"x.z"};
        var tObj = {"prop1":"abc","prop2":"xyz"};
        var f = fos.makeMatchFn(props);
        f(pObj, tObj).should.equal(false);
    });
    it('it should true when they match for 2+ deep properties',  
      function() {
        var props = 
        {"prop1.cat": {regExpMatch: true, regExpIgnoreCase: false}, 
         "prop1.dog": {regExpMatch: true, regExpIgnoreCase: true}
        };
        var pObj = {prop1: {cat: "meow", dog: "bARk"}};
        var tObj = {prop1: {cat: "meow", dog: "bark"}};
        var f = fos.makeMatchFn(props);
        f(pObj, tObj).should.equal(true);
    });
    it('it should false when they match for 2+ deep properties',  
      function() {
        var props = 
        {"prop1.cat": {regExpMatch: true, regExpIgnoreCase: false}, 
         "prop1.dog": {regExpMatch: true, regExpIgnoreCase: true}
        };
        var pObj = {prop1: {cat: "mEOw", dog: "b..k"}};
        var tObj = {prop1: {cat: "meow", dog: "bark"}};
        var f = fos.makeMatchFn(props);
        f(pObj, tObj).should.equal(false);
    });
  });

  describe('When propDefnDefault values are included in options', function() {
    it('it should return true when it matches using those options', 
      function() {
        var props = ["prop1","prop2"];
        var options = 
            {regExpMatch: true, 
             regExpIgnoreCase: true};
        var pObj = {"prop1":"abc","prop2":"x.z"};
        var tObj = {"prop1":"aBc","prop2":"xyz"};
        var f = fos.makeMatchFn(props, options);
        f(pObj, tObj).should.equal(true);       
      });
    it('it should return false when does not match using those options', 
      function() {
        var props = ["prop1","prop2"];
        var options = {regExpMatch: true};  //default value of regExpIgnoreCase=false
        var pObj = {"prop1":"abc","prop2":"x.z"};
        var tObj = {"prop1":"aBc","prop2":"xyz"};
        var f = fos.makeMatchFn(props, options);
        f(pObj, tObj).should.equal(false);       
      });
    it('property defintions at the property level should override ' +
       'option propDefnDefault values', 
      function() {
        var options = {regExpMatch: true, regExpIgnoreCase: true};
        var props = 
        {"prop1.cat": {regExpMatch: true, regExpIgnoreCase: false}, 
         "prop1.dog": {}
        };
        var pObj = {prop1: {cat: "meow", dog: "bARk"}};
        var tObj = {prop1: {cat: "meow", dog: "bark"}};
        var f = fos.makeMatchFn(props, options);
        f(pObj, tObj).should.equal(true);       
      });
    it('property defintions at the property level should override ' +
       'option propDefnDefault values', 
      function() {
        var options = {regExpMatch: true, regExpIgnoreCase: true};
        var props = 
        {"prop1.cat": {regExpMatch: true, regExpIgnoreCase: false}, 
         "prop1.dog": {}
        };
        var pObj = {prop1: {cat: "mEOw", dog: "bARk"}};
        var tObj = {prop1: {cat: "meow", dog: "bark"}};
        var f = fos.makeMatchFn(props, options);
        f(pObj, tObj).should.equal(false);       
      });
  }); 

  describe('For missing object properties', function(){
    it('it should return false if a chosen poperty is missing in pObj', 
      function() {
        var props = ["prop1","prop2"];
        var pObj = {"prop1":"abc"};
        var tObj = {"prop1":"abc","prop2":4};
        var f = fos.makeMatchFn(props);
        f(pObj, tObj).should.equal(false);
      });
    it('it should return false if a chosen poperty is missing in tObj', 
      function() {
        var props = ["prop1","prop2"];
        var pObj = {"prop1":"abc","prop2":4};
        var tObj = {"prop1":"abc"};
        var f = fos.makeMatchFn(props);
        f(pObj, tObj).should.equal(false);
      });
    it('it should return false if a chosen poperty is missing in tObj ' + 
       'in a deep property', 
        function() {
          var props = ["prop1","prop2.cat.tail"];
          var pObj = {"prop1":"abc","prop2":{"cat":{"tail":"long"}}};
          var tObj = {"prop1":"abc","prop2":{"cat":{"nose":"short"}}};
          var f = fos.makeMatchFn(props);
          f(pObj, tObj).should.equal(false);
      });
    it('it should return false if a chosen poperty is missing in pObj ' + 
       'in a deep property', 
       function() {
          var props = ["prop1","prop2.cat.tail"];
          var pObj = {"prop1":"abc","prop2":{"cat":{"nose":"short"}}};
          var tObj = {"prop1":"abc","prop2":{"cat":{"tail":"long"}}};
          var f = fos.makeMatchFn(props);
          f(pObj, tObj).should.equal(false);
      });
    it('should return false if a chosen poperty is missing in tObj ' + 
       'including when regExpMatch and pObj has .*', 
       function() {
          var options = {
            regExpMatch:true, 
            // matchIfTObjPropMissing: false   // default is false
          }; 
          var props = ["prop1",'prop2.cat.tail'];
          var pObj = {"prop1":"abc","prop2":{"cat":{"tail":".*"}}};
          var tObj = {"prop1":"abc","prop2":{"cat":{"nose":"brown"}}};
          var f = fos.makeMatchFn(props,options);
          f(pObj, tObj).should.equal(false);
      });
    it('should return false if a chosen poperty is missing in pObj ' + 
       'including when regExpMatch, regExpReverse and tObj has .*', 
       function() {
          var options = {
            regExpMatch:true, 
            regExpReverse:true, 
            // matchIfPObjPropMissing: false   // default is false
          }; 
          var props = ["prop1",'prop2.cat.tail'];
          var pObj = {"prop1":"abc","prop2":{"cat":{"nose":"brown"}}};
          var tObj = {"prop1":"abc","prop2":{"cat":{"tail":".*"}}};
          var f = fos.makeMatchFn(props, options);
          f(pObj, tObj).should.equal(false);
      });
    it('it should return false if a chosen poperty is missing in both objects', 
      function() {
        var props = ["prop1","prop2"];
        var pObj = {"prop1":"abc"};
        var tObj = {"prop1":"abc"};
        var f = fos.makeMatchFn(props);
        f(pObj, tObj).should.equal(false);
      });
    it('it should return true if a property is missing in tObj and ' + 
       'options matchIfTObjPropMissing=true', 
       function() {
          var props = {"prop1":{},"prop2.cat":{"matchIfTObjPropMissing":true}};
          var pObj = {"prop1":"abc","prop2":{"cat":"yellow"}};
          var tObj = {"prop1":"abc","prop2":{"dog":true}};
          var f = fos.makeMatchFn(props);
          f(pObj, tObj).should.equal(true);
      });
    it('it should return true if a property is missing in pObj and ' + 
       'options matchIfPObjPropMissing=true', 
       function() {
        var props = {"prop1":{},"prop2.cat":{"matchIfPObjPropMissing":true}};
        var pObj = {"prop1":"abc","prop2":{"dog":"barks"}};
        var tObj = {"prop1":"abc","prop2":{"cat":"yellow"}};
        var f = fos.makeMatchFn(props);
        f(pObj, tObj).should.equal(true);
    });
    it('it should return true if properties are missing in both objects ' + 
       'and both options ...PropMissing=true', 
       function() {
          var props = 
            {"prop1":{},
             "prop2.cat":
                {"matchIfTObjPropMissing":true,
                 "matchIfPObjPropMissing":true}};
          var pObj = {"prop1":"abc","prop2":{"dog":"barks"}};
          var tObj = {"prop1":"abc","prop2":{"dog":"hank"}};
          var f = fos.makeMatchFn(props);
          f(pObj, tObj).should.equal(true);
     });
    it('it should return true if property chains are missing in both objects ' + 
      'and both options ...PropMissing=true', 
      function() {
        var props = 
          {"prop1":{},
           "prop2.cat":
              {"matchIfTObjPropMissing":true,
               "matchIfPObjPropMissing":true}};
        var pObj = {"prop1":"abc"};
        var tObj = {"prop1":"abc"};
        var f = fos.makeMatchFn(props);
        f(pObj, tObj).should.equal(true);
    });
    describe('matchIfBothPropMissing', function() {
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
    });  // end of describe matchIfBothPropMissing

  }); // end of For missing object properties

  describe('For deep properties (more than one deep)', function(){
    it('it should return true for a match', 
      function() {
        var props = ["prop1.cat"];
        var pObj = {"prop1":{"cat":"gray"}};
        var tObj = {"prop1":{"cat":"gray"}};
        var f = fos.makeMatchFn(props);
        f(pObj, tObj).should.equal(true);
    });
    it('it should return false if a target property is missing', 
      function() {
        var props = ["prop1.cat"];
        var pObj = {"prop1":{"dog":"gray"}};
        var tObj = {"prop1":{"cat":"gray"}};
        var f = fos.makeMatchFn(props);
        f(pObj, tObj).should.equal(false);
    });
    it('it should return false for a non-match', 
      function() {
        var props = ["prop1.cat"];
        var pObj = {"prop1":{"cat":"black"}};
        var tObj = {"prop1":{"cat":"gray"}};
        var f = fos.makeMatchFn(props);
        f(pObj, tObj).should.equal(false);
    });
    it('it should return true when multiple deep properties all match', 
      function() {
        var props = ["prop1.cat","prop2.dog.paw"];
        var pObj = {"prop1":{"cat":"gray"},"prop2":{"dog":{"paw":"white"}}};
        var tObj = {"prop1":{"cat":"gray"},"prop2":{"dog":{"paw":"white"}}};
        var f = fos.makeMatchFn(props);
        f(pObj, tObj).should.equal(true);
    });
    it('it should return false when any multiple deep properties do not match', 
      function() {
        var props = ["prop1.cat","prop2.dog.paw"];
        var pObj = {"prop1":{"cat":"gray"},"prop2":{"dog":{"paw":"white"}}};
        var tObj = {"prop1":{"cat":"gray"},"prop2":{"dog":{"paw":"purple"}}};
        var f = fos.makeMatchFn(props);
        f(pObj, tObj).should.equal(false);
    });
    it('it should return true if all identified properties match ' + 
       'and ignore andy addtl properties', 
        function() {
          var props = ["prop1.cat","prop2.dog.paw"];
          var pObj = 
            {"prop1":{"cat":"gray"},
             "prop2":{"dog":{"paw":"white"}}};
          var tObj = 
            {"prop1":{"cat":"gray"},
             "prop2":{"dog":{"paw":"white","bark":"loud"}}};
          var f = fos.makeMatchFn(props);
          f(pObj, tObj).should.equal(true);
    });
    it('it should return true for a reg-ex match', 
      function() {
        var props = {"prop1.cat":{"regExpMatch":true}};
        var pObj = {"prop1":{"cat":"gr.y"}};
        var tObj = {"prop1":{"cat":"gray"}};
        var f = fos.makeMatchFn(props);
        f(pObj, tObj).should.equal(true);
    });
    it('it should return false if one out of many does not match', 
      function() {
        var props = ["prop1.cat","prop2.dog.paw"];
        var options = {};
        var pObj = {"prop1":{"cat":"gray"},"prop2":{"dog":{"paw":"black"}}};
        var tObj = {"prop1":{"cat":"gray"},"prop2":{"dog":{"paw":"white"}}};
        var f = fos.makeMatchFn(props, options);
        f(pObj, tObj).should.equal(false);
    });
  }); // end of For deep properties (more than one deep)

  describe('For properties with variables', function(){
    it('it should replace the variable and return true for match', 
      function() {
        var props = 
          {"prop1":{"variablesInPObj":true,"variablesStartStr":"/:"}};
        var options =  
          {getVariables:  function(cb) {
            return cb(null, {youngDog: "puppy"}); 
          }};
        var pObj = {"prop1":"/:youngDog"};
        var tObj = {"prop1":"puppy"};
        var f = fos.makeMatchFn(props, options);
        f(pObj, tObj).should.equal(true);

        props = 
          {"prop1":{"variablesInTObj":true,"variablesStartStr":"/:"}};
        options =  
          {getVariables:  function(cb) {
            return cb(null, {youngDog: "puppy"}); 
          }};
        tObj = {"prop1":"/:youngDog"};
        pObj = {"prop1":"puppy"};
        f = fos.makeMatchFn(props, options);
        f(pObj, tObj).should.equal(true);
        
        props = 
          {"prop1":
            {"variablesInTObj":true,
             "variablesInPObj":true,
             "variablesStartStr":"/:"}};
        options =  
          {getVariables:  function(cb) {
            return cb(null, {youngDog: "puppy", littleCuteUn: "puppy"}); 
          }};
        tObj = {"prop1":"/:youngDog"};
        pObj = {"prop1":"/:littleCuteUn"};
        f = fos.makeMatchFn(props, options);
        f(pObj, tObj).should.equal(true);

    });
    it('it should replace the variable and return false for non-match', 
      function() {
        var props = 
          {"prop1":{"variablesInPObj":true,"variablesStartStr":"/:"}};
        var options =               
          {getVariables:  function(cb) {
            return cb(null, {youngDog: "puppy"}); 
          }};
        var pObj = {"prop1":"/:youngDog"};
        var tObj = {"prop1":"kitten"};
        var f = fos.makeMatchFn(props, options);
        f(pObj, tObj).should.equal(false);

        props = 
          {"prop1":{"variablesInPObj":true,"variablesStartStr":"/:"}};
        pObj = {"prop1":"/:youngDog"};
        tObj = {"prop1":"kitten"};
        f = fos.makeMatchFn(props, options);
        f(pObj, tObj).should.equal(false);

        props = 
          {"prop1":{"variablesInTObj":true,"variablesStartStr":"/:"}};
        options =               
          {getVariables:  function(cb) {
            return cb(null, {youngDog: "puppy"}); 
          }};
        pObj = {"prop1":"kitten"};
        tObj = {"prop1":"/:youngDog"};
        f = fos.makeMatchFn(props, options);
        f(pObj, tObj).should.equal(false);

        options =  
          {getVariables:  function(cb) {
            return cb(null, {youngDog: "puppy", littleCuteUn: "bitey"}); 
          }};

        props = 
          {"prop1":
            {"variablesInTObj":true,
             "variablesInPObj":true,
             "variablesStartStr":"/:"}};
        pObj = {"prop1":"/:littleCuteUn"};
        tObj = {"prop1":"/:youngDog"};
        f = fos.makeMatchFn(props, options);
        f(pObj, tObj).should.equal(false);
        
    });

    it('it should default the start string to ~', 
      function() {
        var props = 
          {"prop1":{"variablesInPObj":true}};
        var options =               
          {getVariables:  function(cb) {
            return cb(null, {youngDog: "puppy"}); 
          }};
        var pObj = {"prop1":"~youngDog"};
        var tObj = {"prop1":"puppy"};
        var f = fos.makeMatchFn(props, options);
        f(pObj, tObj).should.equal(true);
    });
    it('it should allow other variablesStartStr', 
      function() {
        var props = 
          {"prop1":{"variablesInPObj":true,"variablesStartStr":":::"}};
        var options = 
          {getVariables:  function(cb) {
            return cb(null, {youngDog: "puppy"}); 
          }};
        var pObj = {"prop1":":::youngDog"};
        var tObj = {"prop1":"puppy"};
        var f = fos.makeMatchFn(props, options);
        f(pObj, tObj).should.equal(true);
    });
    it('it should allow other variablesStartStr that include ' + 
      'reserved regExp characters', 
      function() {
        var props = {"prop1":{"variablesInPObj":true,"variablesStartStr":"+"}};
        var options =      
          {getVariables:  function(cb) {
            return cb(null, {youngDog: "puppy"}); 
          }};
        var pObj = {"prop1":"+youngDog"};
        var tObj = {"prop1":"puppy"};
        var f = fos.makeMatchFn(props, options);
        f(pObj, tObj).should.equal(true);

        props = {"prop1":{"variablesInTObj":true,"variablesStartStr":"+"}};
        options =      
          {getVariables:  function(cb) {
            return cb(null, {youngDog: "puppy"}); 
          }};
        pObj = {"prop1":"puppy"};
        tObj = {"prop1":"+youngDog"};
        f = fos.makeMatchFn(props, options);
        f(pObj, tObj).should.equal(true);
    });
    it('it should replace all occurances of the variable', 
      function() {
        var props = {"prop1":
             {"variablesInPObj":true,
              "variablesInTObj":true,"variablesStartStr":"+"}};
        var options = 
          {getVariables:  function(cb) {
            return cb(null, {youngDog: "puppy",littleCuteUn:"puppy"}); 
          }};
        var pObj = {"prop1":"+youngDog+youngDog"};
        var tObj = {"prop1":"+youngDog+littleCuteUn"};
        var f = fos.makeMatchFn(props, options);
        f(pObj, tObj).should.equal(true);
    });
    it('it should allow string values prior to the variable name', 
      function() {
        var props = {"prop1":{"variablesInPObj":true,"variablesStartStr":"+"}};
        var options = 
          {getVariables:  function(cb) {
            return cb(null, {youngDog: "puppy"}); 
        }};
        var pObj = {"prop1":"cute+youngDog"};
        var tObj = {"prop1":"cutepuppy"};
        var f = fos.makeMatchFn(props, options);
        f(pObj, tObj).should.equal(true);
    });
    it('it should allow string values immediately after the variable ' + 
       'if variablesEndStr is defined', 
       function() {
          var props = 
            {"prop1":
              {"variablesInPObj":true,
               "variablesStartStr":"~",
               "variablesEndStr":"~"}};
          var options = 
            {getVariables:  function(cb) {
              return cb(null, {youngDog: "puppy"}); 
            }};
          var pObj = {"prop1":"~youngDog~cat"};
          var tObj = {"prop1":"puppycat"};
          var f = fos.makeMatchFn(props, options);
          f(pObj, tObj).should.equal(true);
    });
    it('it should allow string values immediately after the variable ' + 
       'if variablesEndStr is defined with a different character', 
       function() {
          var props = 
            {"prop1":
              {"variablesInPObj":true,
               "variablesInTObj":true,
               "variablesStartStr":"~",
               "variablesEndStr":"+"}};
          var options = 
            {getVariables:  function(cb) {
              return cb(null, {youngDog: "puppy",meow: "cat"}); 
            }};
          var pObj = {"prop1":"~youngDog+cat"};
          var tObj = {"prop1":"puppy~meow+"};
          var f = fos.makeMatchFn(props, options);
          f(pObj, tObj).should.equal(true);
    });
    it('it should not replace strings with var values if variablesInXObj' + 
       ' is not true', function() {
          var props = 
            {"prop1":
              {"variablesInPObj":true,
               // "variablesInTObj":true,  // defaults to false
               "variablesStartStr":"~",
               "variablesEndStr":"+"}};
          var options = 
            {getVariables:  function(cb) {
              return cb(null, {youngDog: "puppy",meow: "cat"}); 
            }};
          var pObj = {"prop1":"~youngDog+cat"};
          var tObj = {"prop1":"puppy~meow+"};
          var f = fos.makeMatchFn(props, options);
          f(pObj, tObj).should.equal(false);

          props = 
            {"prop1":{
               // "variablesInPObj":false,
               "variablesInTObj":true,  // defaults to false
               "variablesStartStr":"~",
               "variablesEndStr":"+"}};
          f = fos.makeMatchFn(props, options);
          f(pObj, tObj).should.equal(false);
    });
    it('it should replace multiple occurances of different variables', 
      function() {
        var props = {"prop1":{"variablesInPObj":true,"variablesStartStr":"+"}};
        var options = 
          {getVariables:  function(cb) {
            return cb(null, 
            {youngDog: "puppy", youngCat: "kitten", youngSheep:"ewe"}); 
          }};
        var pObj = {"prop1":"+youngDog+youngCat+youngSheep"};
        var tObj = {"prop1":"puppykittenewe"};
        var f = fos.makeMatchFn(props, options);
        f(pObj, tObj).should.equal(true);
    });
    it('it should replace multiple occurances of different variables', 
      function() {
        // var props = {"prop1":{"variablesInPObj":true,"variablesStartStr":"+"}};
        var props = {
          "prop1":{"variablesInPObj":true,
            "variablesEndStr":"~",
            "variablesStartStr":"+"
          }
        };
        var options = 
          {getVariables:  function(cb) {
            return cb(null, 
            {youngDog: "puppy", youngCat: "kitten", youngSheep:"ewe"}); 
          }};
        var pObj = {"prop1":"+youngDog~WHAT+youngCat~"};
        var tObj = {"prop1":"puppyWHATkitten"};
        var f = fos.makeMatchFn(props, options);
        f(pObj, tObj).should.equal(true);
    });

    it('it should replace multiple occurances of different variables', 
      function() {
        // var props = {"prop1":{"variablesInPObj":true,"variablesStartStr":"+"}};
        var props = {
          "prop1":{"variablesInPObj":true,
            "variablesEndStr":"~",
            "variablesStartStr":"~"
          }
        };
        var options = 
          {getVariables:  function(cb) {
            return cb(null, 
            {youngDog: "puppy", youngCat: "kitten", youngSheep:"ewe"}); 
          }};
        var pObj = {"prop1":"~youngDog~WHAT~youngCat~"};
        var tObj = {"prop1":"puppyWHATkitten"};
        var f = fos.makeMatchFn(props, options);
        f(pObj, tObj).should.equal(true);
    });
    
    it('it should allow the variablesInPObj to be set in options to affect ' + 
       'all property definitions', 
       function() {
          var props = ["prop1.cat","prop2.dog.paw"];
          var options = 
            {getVariables:  function(cb) {
              return cb(null,{colorWhite: "white", colorGray: "gray"}); },
              variablesInPObj:true, 
              variablesStartStr: '+'
            };
          var pObj = 
            {"prop1": {"cat":"+colorGray"},
             "prop2":{"dog":{"paw":"+colorWhite"}}};
          var tObj = 
            {"prop1": {"cat":"gray"},
             "prop2": {"dog":{"paw":"white"}}};
          var f = fos.makeMatchFn(props, options);
          f(pObj, tObj).should.equal(true);
      });
    it('it should match with a regular expression (as a string) ',
       function() {
          var props = ["prop1.cat"];
          var options = 
            {getVariables:  function(cb) {
              return cb(null,{colorGray: "gr.y", grayLit: "gray"}); },
              regExpMatch: true,
              variablesInPObj:true, 
              variablesInTObj:true, 
              variablesStartStr: '+'
            };
          var f = fos.makeMatchFn(props, options);

          var pObj = 
            {"prop1": {"cat":"+colorGray"}};
          var tObj = 
            {"prop1": {"cat":"~grayLit"}};
          f(pObj, tObj).should.equal(true);
      });
    it('it should not error if a property value is not a string', 
      function() {
        var props = ["prop1","prop2","prop3","prop4","prop5.init"];
        var options = 
          {getVariables:  function(cb) {
            return cb(null, 
              {testVarStr1: "puppy", testVarStr2: "cat",anotherVar:"worm"}); 
          },
          variablesInPObj:true, 
          variablesStartStr: '+',
          regExpMatch: true
         };
        var f = fos.makeMatchFn(props, options);

        var imundefined; 
        var pObj = 
          {prop1:2,
           prop2:null,
           prop3: imundefined, 
           prop4:/a/,
           prop5:{"init":573}};
        var tObj = 
          {prop1:2,
           prop2:null,
           prop3: imundefined, 
           prop4:"abc",
           prop5:{"init":573}};
        f(pObj, tObj).should.equal(true);
      });
    it('it should allow getVariables fn for each property', 
      function() {
        var props = 
          {"prop1":
            {"variablesInPObj":true,
             "variablesStartStr":"/:",
             getVariables:  function(cb) {
              return cb(null, {youngDog: "puppy"}); 
            }},
           "prop2":
            {"variablesInPObj":true,
             "variablesStartStr":"/:",
             getVariables:  function(cb) {
              return cb(null, {youngDog: "koinu"}); 
            }}
          };
        var f = fos.makeMatchFn(props);

        var pObj = {"prop1":"/:youngDog", "prop2": "/:youngDog"};
        var tObj = {"prop1":"puppy", "prop2": "koinu"};
        f(pObj, tObj).should.equal(true);
    });
    describe('when the pObj value is the variable name only and ' + 
        'the variable value is an reg exp object', function() {
      it('it should replace the variable name with the object',
         function() {
            var props = ["prop1.cat"];
            var options = 
              {getVariables:  function(cb) {
                return cb(null,{colorGray: /gr.y/i}); },
              regExpMatch: true,
              variablesInPObj:true, 
              variablesStartStr: '+'
              };
            var f = fos.makeMatchFn(props, options);

            var pObj = 
              {"prop1": {"cat":"+colorGray"}};
            var tObj = 
              {"prop1": {"cat":"graY"}};
            f(pObj, tObj).should.equal(true);
      }); //end of it
      it('it should replace the variable name with the object ' + 
         'even when variablesEndStr is included', function() {
            var props = ["prop1.cat"];
            var options = 
              {getVariables:  function(cb) {
                return cb(null,{colorGray: /gr.y/i}); },
              regExpMatch: true,
              variablesInPObj:true, 
              variablesStartStr: '+',
              variablesEndStr: ':'
              };
            var f = fos.makeMatchFn(props, options);

            var pObj = 
              {"prop1": {"cat":"+colorGray:"}};
            var tObj = 
              {"prop1": {"cat":"graY"}};
            f(pObj, tObj).should.equal(true);
      }); //end of it
      it('it should replace the variable name with the object as a string ' + 
         'if the pObj value is not a var name only',function() {
            var props = ["prop1.cat"];
            var options = 
              {getVariables:  function(cb) {
                return cb(null,{colorGray: /gr.y/i}); },
              regExpMatch: true,
              variablesInPObj:true, 
              variablesStartStr: '+',
              variablesEndStr: ':'
              };
            var f = fos.makeMatchFn(props, options);

            var pObj = 
              {"prop1": {"cat":"bl+colorGray:wh"}};
            var tObj = 
              {"prop1": {"cat":"bl/gr.y/iwh"}};
            f(pObj, tObj).should.equal(true);
      }); //end of it
    }); // end of when the pObj value is the variable name only...
  }); // end of For properties with variablesAllowed=true

  // variablesAllowed is DEPRECATED.  This describe is being kept until removed. 
  describe('For properties with variablesAllowed=true', function(){
    it('it should replace the variable and return true for match', 
      function() {
        var props = 
          {"prop1":{"variablesAllowed":true,"variablesStartStr":"/:"}};
        var options =  
          {getVariables:  function(cb) {
            return cb(null, {youngDog: "puppy"}); 
          }};
        var pObj = {"prop1":"/:youngDog"};
        var tObj = {"prop1":"puppy"};
        var f = fos.makeMatchFn(props, options);
        f(pObj, tObj).should.equal(true);
    });
    it('it should replace the variable and return false for non-match', 
      function() {
        var props = 
          {"prop1":{"variablesAllowed":true,"variablesStartStr":"/:"}};
        var options =               
          {getVariables:  function(cb) {
            return cb(null, {youngDog: "puppy"}); 
          }};
        var pObj = {"prop1":"/:youngDog"};
        var tObj = {"prop1":"kitten"};
        var f = fos.makeMatchFn(props, options);
        f(pObj, tObj).should.equal(false);
    });
    it('it should default the start string to ~', 
      function() {
        var props = 
          {"prop1":{"variablesAllowed":true}};
        var options =               
          {getVariables:  function(cb) {
            return cb(null, {youngDog: "puppy"}); 
          }};
        var pObj = {"prop1":"~youngDog"};
        var tObj = {"prop1":"puppy"};
        var f = fos.makeMatchFn(props, options);
        f(pObj, tObj).should.equal(true);
    });
    it('it should allow other variablesStartStr', 
      function() {
        var props = 
          {"prop1":{"variablesAllowed":true,"variablesStartStr":":::"}};
        var options = 
          {getVariables:  function(cb) {
            return cb(null, {youngDog: "puppy"}); 
          }};
        var pObj = {"prop1":":::youngDog"};
        var tObj = {"prop1":"puppy"};
        var f = fos.makeMatchFn(props, options);
        f(pObj, tObj).should.equal(true);
    });
    it('it should allow other variablesStartStr that include ' + 
      'reserved regExp characters', 
      function() {
        var props = {"prop1":{"variablesAllowed":true,"variablesStartStr":"+"}};
        var options =      
          {getVariables:  function(cb) {
            return cb(null, {youngDog: "puppy"}); 
          }};
        var pObj = {"prop1":"+youngDog"};
        var tObj = {"prop1":"puppy"};
        var f = fos.makeMatchFn(props, options);
        f(pObj, tObj).should.equal(true);
    });
    it('it should replace all occurances of the variable', 
      function() {
        var props = {"prop1":{"variablesAllowed":true,"variablesStartStr":"+"}};
        var options = 
          {getVariables:  function(cb) {
            return cb(null, {youngDog: "puppy"}); 
          }};
        var pObj = {"prop1":"+youngDog+youngDog"};
        var tObj = {"prop1":"puppypuppy"};
        var f = fos.makeMatchFn(props, options);
        f(pObj, tObj).should.equal(true);
    });
    it('it should allow string values prior to the variable name', 
      function() {
        var props = {"prop1":{"variablesAllowed":true,"variablesStartStr":"+"}};
        var options = 
          {getVariables:  function(cb) {
            return cb(null, {youngDog: "puppy"}); 
        }};
        var pObj = {"prop1":"cute+youngDog"};
        var tObj = {"prop1":"cutepuppy"};
        var f = fos.makeMatchFn(props, options);
        f(pObj, tObj).should.equal(true);
    });
    it('it should allow string values immediately after the variable ' + 
       'if variablesEndStr is defined', 
       function() {
          var props = 
            {"prop1":
              {"variablesAllowed":true,
               "variablesStartStr":"~",
               "variablesEndStr":"~"}};
          var options = 
            {getVariables:  function(cb) {
              return cb(null, {youngDog: "puppy"}); 
            }};
          var pObj = {"prop1":"~youngDog~cat"};
          var tObj = {"prop1":"puppycat"};
          var f = fos.makeMatchFn(props, options);
          f(pObj, tObj).should.equal(true);
    });
    it('it should allow string values immediately after the variable ' + 
       'if variablesEndStr is defined with a different character', 
       function() {
          var props = 
            {"prop1":
              {"variablesAllowed":true,
               "variablesStartStr":"~",
               "variablesEndStr":"+"}};
          var options = 
            {getVariables:  function(cb) {
              return cb(null, {youngDog: "puppy"}); 
            }};
          var pObj = {"prop1":"~youngDog+cat"};
          var tObj = {"prop1":"puppycat"};
          var f = fos.makeMatchFn(props, options);
          f(pObj, tObj).should.equal(true);
    });
    it('it should replace multiple occurances of different variables', 
      function() {
        var props = {"prop1":{"variablesAllowed":true,"variablesStartStr":"+"}};
        var options = 
          {getVariables:  function(cb) {
            return cb(null, 
            {youngDog: "puppy", youngCat: "kitten", youngSheep:"ewe"}); 
          }};
        var pObj = {"prop1":"+youngDog+youngCat+youngSheep"};
        var tObj = {"prop1":"puppykittenewe"};
        var f = fos.makeMatchFn(props, options);
        f(pObj, tObj).should.equal(true);
    });
    it('it should allow the variablesAllowed to be set in options to affect ' + 
       'all property definitions', 
       function() {
          var props = ["prop1.cat","prop2.dog.paw"];
          var options = 
            {getVariables:  function(cb) {
              return cb(null,{colorWhite: "white", colorGray: "gray"}); },
              variablesAllowed:true, 
              variablesStartStr: '+'
            };
          var pObj = 
            {"prop1": {"cat":"+colorGray"},
             "prop2":{"dog":{"paw":"+colorWhite"}}};
          var tObj = 
            {"prop1": {"cat":"gray"},
             "prop2": {"dog":{"paw":"white"}}};
          var f = fos.makeMatchFn(props, options);
          f(pObj, tObj).should.equal(true);
      });
    it('it should match with a regular expression (as a string) ',
       function() {
          var props = ["prop1.cat"];
          var options = 
            {getVariables:  function(cb) {
              return cb(null,{colorGray: "gr.y"}); },
              regExpMatch: true,
              variablesAllowed:true, 
              variablesStartStr: '+'
            };
          var f = fos.makeMatchFn(props, options);

          var pObj = 
            {"prop1": {"cat":"+colorGray"}};
          var tObj = 
            {"prop1": {"cat":"gray"}};
          f(pObj, tObj).should.equal(true);
      });
    it('it should not error if a property value is not a string', 
      function() {
        var props = ["prop1","prop2","prop3","prop4","prop5.init"];
        var options = 
          {getVariables:  function(cb) {
            return cb(null, 
              {testVarStr1: "puppy", testVarStr2: "cat",anotherVar:"worm"}); 
          },
          variablesAllowed:true, 
          variablesStartStr: '+',
          regExpMatch: true
         };
        var f = fos.makeMatchFn(props, options);

        var imundefined; 
        var pObj = 
          {prop1:2,
           prop2:null,
           prop3: imundefined, 
           prop4:/a/,
           prop5:{"init":573}};
        var tObj = 
          {prop1:2,
           prop2:null,
           prop3: imundefined, 
           prop4:"abc",
           prop5:{"init":573}};
        f(pObj, tObj).should.equal(true);
      });
    it('it should allow getVariables fn for each property', 
      function() {
        var props = 
          {"prop1":
            {"variablesAllowed":true,
             "variablesStartStr":"/:",
             getVariables:  function(cb) {
              return cb(null, {youngDog: "puppy"}); 
            }},
           "prop2":
            {"variablesAllowed":true,
             "variablesStartStr":"/:",
             getVariables:  function(cb) {
              return cb(null, {youngDog: "koinu"}); 
            }}
          };
        var f = fos.makeMatchFn(props);

        var pObj = {"prop1":"/:youngDog", "prop2": "/:youngDog"};
        var tObj = {"prop1":"puppy", "prop2": "koinu"};
        f(pObj, tObj).should.equal(true);
    });
    describe('when the pObj value is the variable name only and ' + 
        'the variable value is an object', function() {
      it('it should replace the variable name with the object',
         function() {
            var props = ["prop1.cat"];
            var options = 
              {getVariables:  function(cb) {
                return cb(null,{colorGray: /gr.y/i}); },
              regExpMatch: true,
              variablesAllowed:true, 
              variablesStartStr: '+'
              };
            var f = fos.makeMatchFn(props, options);

            var pObj = 
              {"prop1": {"cat":"+colorGray"}};
            var tObj = 
              {"prop1": {"cat":"graY"}};
            f(pObj, tObj).should.equal(true);
      }); //end of it
      it('it should replace the variable name with the object ' + 
         'even when variablesEndStr is included', function() {
            var props = ["prop1.cat"];
            var options = 
              {getVariables:  function(cb) {
                return cb(null,{colorGray: /gr.y/i}); },
              regExpMatch: true,
              variablesAllowed:true, 
              variablesStartStr: '+',
              variablesEndStr: ':'
              };
            var f = fos.makeMatchFn(props, options);

            var pObj = 
              {"prop1": {"cat":"+colorGray:"}};
            var tObj = 
              {"prop1": {"cat":"graY"}};
            f(pObj, tObj).should.equal(true);
      }); //end of it
      it('it should replace the variable name with the object as a string ' + 
         'if the pObj value is not a var name only',function() {
            var props = ["prop1.cat"];
            var options = 
              {getVariables:  function(cb) {
                return cb(null,{colorGray: /gr.y/i}); },
              regExpMatch: true,
              variablesAllowed:true, 
              variablesStartStr: '+',
              variablesEndStr: ':'
              };
            var f = fos.makeMatchFn(props, options);

            var pObj = 
              {"prop1": {"cat":"bl+colorGray:wh"}};
            var tObj = 
              {"prop1": {"cat":"bl/gr.y/iwh"}};
            f(pObj, tObj).should.equal(true);
      }); //end of it
    }); // end of when the pObj value is the variable name only...
  }); // end of For properties with variablesAllowed=true

  describe('When a custom match function is defined ', 
    function() {
      describe('for a single property', function() {

      var matchFn = function(pObjProp, tObjProp) {
        return tObjProp.exists && tObjProp.value > pObjProp.value;  
      }; 
      var doesItMatch = fos.makeMatchFn({"cat.kittens": {propMatchFn: matchFn}}); 

      it('should return true if a match',function(){

        doesItMatch(
          {cat:{kittens:2}}, 
          {cat:{kittens:5}}).should.equal(true); 

      }); // end of it

      it('should return false if not a match',function(){

        doesItMatch(
          {cat:{kittens:6}}, 
          {cat:{kittens:5}}).should.equal(false); 

      }); // end of it
    });
    describe('for all properties via options default' +
      ' in options', function() {

      var matchFn = function(pObjProp, tObjProp) {
        return tObjProp.exists && tObjProp.value > pObjProp.value;  
      }; 
      var doesItMatch = fos.makeMatchFn(
        ["cat.kittens", "dog.puppies"], 
         {propMatchFn: matchFn}); 

      it('should return true if a match',function(){

        doesItMatch(
          {cat:{kittens:2}, dog:{puppies:10}}, 
          {cat:{kittens:5}, dog:{puppies:12}}).should.equal(true); 

      }); // end of it

      it('should return false if not a match',function(){

        doesItMatch(
          {cat:{kittens:5}, dog:{puppies:12}}, 
          {cat:{kittens:6}, dog:{puppies:10}}).should.equal(false); 

      }); // end of it
    }); // end of When a propMatchFn is defined as default for all properties
  }); // When a user defined function is called

 describe('pObj or tObj property values', 
    function() {

    it('should not be changed for a simple match ', 
      function() {
        var props = ["prop1"];
        var f = fos.makeMatchFn(props);

        var pObj = {"prop1":"abc"};
        var tObj = {"prop1":"abc"};
        f(pObj, tObj).should.equal(true);
        pObj.should.match({"prop1":"abc"}); 
        tObj.should.match({"prop1":"abc"}); 
    }); // end of it

    it('should not be changed when variables are replaced', 
      function() {
        var props = 
          {"prop1":{"variablesAllowed":true,"variablesStartStr":"/:"}};
        var options =  
          {getVariables:  function(cb) {
            return cb(null, {youngDog: "puppy"}); 
          }};
        var pObj = {"prop1":"/:youngDog"};
        var tObj = {"prop1":"puppy"};
        var f = fos.makeMatchFn(props, options);
        f(pObj, tObj).should.equal(true);
        pObj.should.match({"prop1":"/:youngDog"}); 
        tObj.should.match({"prop1":"puppy"}); 
    });

    it('should not be changed when regular expressions are used (as a string)', 
      function() {
        var props = {"prop1":{"regExpMatch":true}};
        var pObj = {"prop1":"a.c"};
        var tObj = {"prop1":"abc"};
        var f = fos.makeMatchFn(props);
        f(pObj, tObj).should.equal(true);
        pObj.should.match({"prop1":"a.c"}); 
        tObj.should.match({"prop1":"abc"}); 
    });

    it('should not be changed when regular expressions are used (as an obj)', 
      function() {
        var props = {"prop1":{"regExpMatch":true}};
        var pObj = {"prop1":/a.c/};
        var tObj = {"prop1":"abc"};
        var f = fos.makeMatchFn(props);
        f(pObj, tObj).should.equal(true);
        pObj.should.match({"prop1":/a.c/}); 
        tObj.should.match({"prop1":"abc"}); 
      });

    it('should not be changed when a custom match function is defined ' +
       'which does not change the prop values', function() {

        var matchFn = function(pObjProp, tObjProp) {
          return tObjProp.exists && tObjProp.value > pObjProp.value;  
        }; 
        var doesItMatch = 
            fos.makeMatchFn({"cat.kittens": {propMatchFn: matchFn}}); 

        var pObj = {cat:{kittens:2}};
        var tObj = {cat:{kittens:5}};
        doesItMatch(pObj, tObj).should.equal(true);
        pObj.should.match({cat:{kittens:2}}); 
        tObj.should.match({cat:{kittens:5}}); 
    }); // end of it

    it('should not be changed when a custom match function is defined ' +
       'which does change the prop values', function() {

        var matchFn = function(pObjProp, tObjProp) {
          tObjProp.value = tObjProp.value + 1; 
          pObjProp.value = pObjProp.value + 1; 
          return tObjProp.exists && tObjProp.value > pObjProp.value;  
        }; 
        var doesItMatch = 
            fos.makeMatchFn({"cat.kittens": {propMatchFn: matchFn}}); 

        var pObj = {cat:{kittens:2}};
        var tObj = {cat:{kittens:5}};
        doesItMatch(pObj, tObj).should.equal(true);
        pObj.should.match({cat:{kittens:2}}); 
        tObj.should.match({cat:{kittens:5}}); 
    }); // end of it

    it('should not be changed when a custom match function is defined ', 
      function() {

        var matchFn = function(pObjProp, tObjProp) {
          return tObjProp.exists && tObjProp.value > pObjProp.value;  
        }; 
        var doesItMatch = 
            fos.makeMatchFn({"cat.kittens": {propMatchFn: matchFn}}); 

        var pObj = {cat:{kittens:2}};
        var tObj = {cat:{kittens:5}};
        doesItMatch(pObj, tObj).should.equal(true);
          pObj.should.match({cat:{kittens:2}}); 
          tObj.should.match({cat:{kittens:5}}); 
    }); // end of it
  }); // end of pObj & tObj property values

}); // end of When the makeMatchFn is used


describe('When matches is called without propMatchFns', function() {
  it('it should return true when it matches using strings', 
    function() {
      fos.matches(
        {cat: "yellow"}, 
        {cat: "yellow"}).should.equal(true);
         
  });
  it('it should return false when it does not match using strings', 
    function() {
      fos.matches(
        {cat: "yellow"}, 
        {cat: "gray"}).should.equal(false); 
         
  });
  it('it should return true if there are additional properties on ' + 
    ' the tObj (target object) but the other properties match',  
    function() {
      fos.matches(
        {cat: "yellow"}, 
        {cat: "yellow", dog: "black"}).should.equal(true); 
         
  });
  it('it should return FALSE if there are additional properties on ' + 
    ' the pObj (pattern object) and the other properties match', 
    function() {
      fos.matches(
        {cat: "yellow", dog: "black"},
        {cat: "yellow"}).should.equal(false); 
         
  });
  it('it should return true when it matches with deep properties', 
    function() {
      fos.matches(
        {pet: {cat: {tail: "long", paws: 4}}}, 
        {pet: {cat: {tail: "long", paws: 4}}}).should.equal(true); 
    });
  it('it should return false when it does not match with deep properties', 
    function() {
      fos.matches(
        {pet: {cat: {tail: "long"}}}, 
        {pet: {cat: {tail: "curly"}}}).should.equal(false); 
    });
  it('it should return false if matches given a regObj in the pObj', 
    function() {
      fos.matches(
        {pet: {cat: {tail: /l.ng/}}}, 
        {pet: {cat: {tail: "long"}}}).should.equal(false); 
    });
  it('it should return false if does not match given a regObj in the pObj', 
    function() {
      fos.matches(
        {pet: {cat: {tail: /l.g/}}}, 
        {pet: {cat: {tail: "long"}}}).should.equal(false); 
    });
}); 

describe('When makeFilterFn is called', function() {
  it('it should filter the target objects with simple properties', 
    function() {
      var props = ["pet"]; 
      var pObj = {pet: "cat"}; 
      var tObjs = [
          {pet: "dog"},
          {pet: "rabbit"},
          {pet: "cat"}
      ]; 
      var f = fos.makeFilterFn(props);
      f(pObj, tObjs).should.match([{pet: "cat"}]); 
  });
  it('it should filter the target objects with deep properties', 
    function() {
      var props = ["tail.color"]; 
      var pObj = {tail: {color: "gray"}}; 
      var tObjs = [
          {type: "dog", paws: {count: 4}, tail: {count: 1, color: "black"}},
          {type: "rabbit", paws: {count: 3}, tail: {count: 1, color: "white"}},
          {type: "cat", paws: {count: 4}, tail: {color: "gray"}},
          {type: "lizard", paws: {count: 0}, tail: {color: "gray"}},
      ]; 
      var f = fos.makeFilterFn(props);
      f(pObj, tObjs).should.match(
        [{type: "cat", paws: {count: 4}, tail: {color: "gray"}},
         {type: "lizard", paws: {count: 0}, tail: {color: "gray"}}
        ]); 
  });
  it('it should filter the target objects with regular expressions', 
    function() {
      var options = {regExpMatch: true};
      var props = ["tail.color"]; 
      var f = fos.makeFilterFn(props,options);

      var pObj = {tail: {color: /gr.y/}}; 
      var tObjs = [
          {type: "dog", paws: {count: 4}, tail: {count: 1, color: "black"}},
          {type: "rabbit", paws: {count: 3}, tail: {count: 1, color: "white"}},
          {type: "cat", paws: {count: 4}, tail: {color: "gray"}},
          {type: "lizard", paws: {count: 0}, tail: {color: "grey"}},
      ]; 
      f(pObj, tObjs).should.match(
        [{type: "cat", paws: {count: 4}, tail: {color: "gray"}},
         {type: "lizard", paws: {count: 0}, tail: {color: "grey"}}
        ]); 
  });
  it('it should filter the target objects with variables replaced', 
    function() {
      var options =  
          {regExpMatch: true,
           variablesAllowed:true,
           variablesStartStr:"~",
           getVariables:  function(cb) {
             return cb(null, {grayColor: /gr.y/i}); 
           }};
      var props = ["tail.color"]; 
      var f = fos.makeFilterFn(props,options);

      var pObj = {tail: {color: "~grayColor"}}; 
      var tObjs = [
          {type: "dog", paws: {count: 4}, tail: {count: 1, color: "black"}},
          {type: "rabbit", paws: {count: 3}, tail: {count: 1, color: "white"}},
          {type: "cat", paws: {count: 4}, tail: {color: "gray"}},
          {type: "lizard", paws: {count: 0}, tail: {color: "GREY"}},
      ]; 
      f(pObj, tObjs).should.match(
        [{type: "cat", paws: {count: 4}, tail: {color: "gray"}},
         {type: "lizard", paws: {count: 0}, tail: {color: "GREY"}}
        ]); 
  });
  it('it should filter target objects containing regular expressions' + 
    'when regExpReverse is true', function() {
      var options = {regExpMatch: true, regExpReverse: true};
      var props = ["tail.color"]; 
      var f = fos.makeFilterFn(props,options);

      var pObj = {tail: {color: 'gray'}}; 
      var tObjs = [
          {type: "dog", paws: {count: 4}, tail: {count: 1, color: "black"}},
          {type: "rabbit", paws: {count: 3}, tail: {count: 1, color: "white"}},
          {type: "cat", paws: {count: 4}, tail: {color: "gray"}},
          {type: "lizard", paws: {count: 0}, tail: {color: /gr.y/}},
      ]; 
      f(pObj, tObjs).should.match(
        [{type: "cat", paws: {count: 4}, tail: {color: "gray"}},
         {type: "lizard", paws: {count: 0}, tail: {color: /gr.y/}}
        ]); 
  });


}); 

describe('When filter is called', function() {
  it('it should filter the target objects with simple properties', 
    function() {
      var pObj = {pet: "cat"}; 
      var tObjs = [
          {pet: "dog"},
          {pet: "rabbit"},
          {pet: "cat"}
      ]; 
      fos.filter(pObj, tObjs).should.match([{pet: "cat"}]); 
  });
  it('it should filter the target objects with deep properties', 
    function() {
      var pObj = {tail: {color: "gray"}}; 
      var tObjs = [
          {type: "dog", paws: {count: 4}, tail: {count: 1, color: "black"}},
          {type: "rabbit", paws: {count: 3}, tail: {count: 1, color: "white"}},
          {type: "cat", paws: {count: 4}, tail: {color: "gray"}},
          {type: "lizard", paws: {count: 0}, tail: {color: "gray"}},
      ]; 
      fos.filter(pObj, tObjs).should.match(
        [{type: "cat", paws: {count: 4}, tail: {color: "gray"}},
         {type: "lizard", paws: {count: 0}, tail: {color: "gray"}}
        ]); 
  });
  it('it should filter the target objects with regular expressions', 
    function() {
      var pObj = {tail: {color: /gr.y/}}; 
      var tObjs = [
          {type: "dog", paws: {count: 4}, tail: {count: 1, color: "black"}},
          {type: "rabbit", paws: {count: 3}, tail: {count: 1, color: "white"}},
          {type: "cat", paws: {count: 4}, tail: {color: "gray"}},
          {type: "lizard", paws: {count: 0}, tail: {color: "grey"}},
      ]; 
      fos.filter(pObj, tObjs).should.match(
        [{type: "cat", paws: {count: 4}, tail: {color: "gray"}},
         {type: "lizard", paws: {count: 0}, tail: {color: "grey"}}
        ]); 
  });
}); 

describe('setNestedPropOptions', function() {
  it('should correctly set options', function() {
    var propsToTest = [
      'method',
      'query.filter',
      {name:'query.limit', regExpMatch: false},
      'query.filter.sort'];
    var propOptions = {
      'query': {regExpMatch: true},
      'query.limit': {variablesInTObj: true}
    }; 

    var updatedProps = fos.setNestedPropOptions(propsToTest, propOptions); 

    Object.keys(updatedProps).length.should.equal(4); 
    updatedProps.filter(function(prop) {
      return prop.name === 'query.filter';
    })[0].regExpMatch.should.equal(true);

    updatedProps.filter(function(prop) {
      return prop.name === 'query.filter.sort';
    })[0].regExpMatch.should.equal(true); 
    
    updatedProps.filter(function(prop) {
      return prop.name === 'query.limit';
    })[0].regExpMatch.should.equal(false); 

    updatedProps.filter(function(prop) {
      return prop.name === 'query.limit';
    })[0].variablesInTObj.should.equal(true); 

  });
}); // end of describe for setNestedPropOptions 
