/*! funkyjs-2 1.3.0
 *  David Hofmann <the.urban.drone@gmail.com, MIT license */
/* globals define, module, exports, require */!function(a,b){var c,d;if("function"==typeof define&&define.amd)define([],b);else if("object"==typeof exports)module.exports=b();else{c=b();for(d in c)c.hasOwnProperty(d)&&(a.funkyJS[d]=c[d])}}(this,function(){var a={};return a.identity=function(a){return a},a.constant=function(a){return function(){return a}},a.cmps=function(a){if("function"!=typeof a)throw new TypeError("funkyJS.cmps: "+a+" is not a function");return function(b){if("function"!=typeof b)throw new TypeError("funkyJS.cmps: "+b+" is not a function");return function(c){return a(b(c))}}},a});