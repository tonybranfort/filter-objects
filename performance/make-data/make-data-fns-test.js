
var rog = require('../lib/index.js');
var should = require('should');

var f = function() {return 3;}; 

var x = function() {return 'xy';}; 

var y = function() {return 'whats';}; 


describe('When objectPropertyMap is called', function() {
  it('it should return a simple object with function results', 
    function() {
      var t = {prop1: f}; 
      var res = rog.objectPropertyMap(t); 
      res.should.match({prop1: 3});
  });
  it('it should return an object with deep properties\' function results', 
    function() {
      var t = {prop1: {prop2: f}}; 
      var res = rog.objectPropertyMap(t); 
      res.should.match({prop1: {prop2: 3}});
  });
  it('it should return an object with deep properties mult. function results', 
    function() {
      var t = {prop1: {prop2: f, prop3: x}, propa:y}; 
      var res = rog.objectPropertyMap(t); 
      res.should.match({prop1: {prop2: 3, prop3: 'xy'}, propa:'whats'});
  });
});  
