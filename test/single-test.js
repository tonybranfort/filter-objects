var fos = require('../lib/index.js');
var should = require('should');


  describe('For properties with variables', function(){
    it('it should replace the variable and return true for match', 
      function() {
        var props = 
          {"prop1":{"variablesInPObj":true,"variablesStartStr":"/:"}};
        var options =  
          {variables: {youngDog: "puppy"}};
        var pObj = {"prop1":"/:youngDog"};
        var tObj = {"prop1":"puppy"};
        var f = fos.makeMatchFn(props, options);
        f(pObj, tObj).should.equal(true);

        props = 
          {"prop1":{"variablesInTObj":true,"variablesStartStr":"/:"}};
        options =  
          {variables: {youngDog: "puppy"}};
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
          {variables: {youngDog: "puppy", littleCuteUn: "puppy"}};
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
          {variables: {youngDog: "puppy"}};
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
          {variables: {youngDog: "puppy"}};
        pObj = {"prop1":"kitten"};
        tObj = {"prop1":"/:youngDog"};
        f = fos.makeMatchFn(props, options);
        f(pObj, tObj).should.equal(false);

        options =  
          {variables: {youngDog: "puppy", littleCuteUn: "bitey"}};

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
          {variables: {youngDog: "puppy"}};
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
          {variables: {youngDog: "puppy"}};
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
          {variables: {youngDog: "puppy"}};
        var pObj = {"prop1":"+youngDog"};
        var tObj = {"prop1":"puppy"};
        var f = fos.makeMatchFn(props, options);
        f(pObj, tObj).should.equal(true);

        props = {"prop1":{"variablesInTObj":true,"variablesStartStr":"+"}};
        options =      
          {variables: {youngDog: "puppy"}};
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
          {variables: {youngDog: "puppy",littleCuteUn:"puppy"}};
        var pObj = {"prop1":"+youngDog+youngDog"};
        var tObj = {"prop1":"+youngDog+littleCuteUn"};
        var f = fos.makeMatchFn(props, options);
        f(pObj, tObj).should.equal(true);
    });
    it('it should allow string values prior to the variable name', 
      function() {
        var props = {"prop1":{"variablesInPObj":true,"variablesStartStr":"+"}};
        var options = 
          {variables: {youngDog: "puppy"}};
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
            {variables: {youngDog: "puppy"}};
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
            {variables: {youngDog: "puppy",meow: "cat"}};
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
            {variables: {youngDog: "puppy",meow: "cat"}}; 
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
          {variables: {youngDog: "puppy", youngCat: "kitten", youngSheep:"ewe"}};
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
          {variables: {youngDog: "puppy", youngCat: "kitten", youngSheep:"ewe"}};
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
          {variables: {youngDog: "puppy", youngCat: "kitten", youngSheep:"ewe"}};
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
            {variables: {colorWhite: "white", colorGray: "gray"},
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
            {variables: {colorGray: "gr.y", grayLit: "gray"},
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
          {variables: {testVarStr1: "puppy", testVarStr2: "cat",anotherVar:"worm"},
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
             variables: {youngDog: "puppy"}
            },
           "prop2":
            {"variablesInPObj":true,
             "variablesStartStr":"/:",
             variables: {youngDog: "koinu"} 
            }
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
              {variables: {colorGray: /gr.y/i},
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
              {variables: {colorGray: /gr.y/i},
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
              {variables: {colorGray: /gr.y/i},
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

