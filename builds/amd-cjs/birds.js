/*! funkyjs-2 1.7.1
 *  David Hofmann <the.urban.drone@gmail.com>, MIT license */
/* globals define, module, exports, require */!function(a,b){"function"==typeof define&&define.amd?define([],b):"object"==typeof exports?module.exports=b():a.funkyJS=b()}(this,function(){var a=Object.create(null);return a.identity=function(a){return a},a.constant=function(a){return function(){return a}},a.cmps=function(a){if("function"!=typeof a)throw new TypeError("funkyJS.cmps: "+a+" is not a function");return function(b){if("function"!=typeof b)throw new TypeError("funkyJS.cmps: "+b+" is not a function");return function(c){return a.call(this,b.call(this,c))}}},a});