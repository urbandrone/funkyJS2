/*! funkyjs-2 1.3.0
 *  David Hofmann <the.urban.drone@gmail.com, MIT license */
/* globals define, module, exports, require */!function(a,b){var c,d;if("function"==typeof define&&define.amd)define(b);else if("object"==typeof exports)module.exports=b();else{c=b();for(d in c)c.hasOwnProperty(d)&&(a.funkyJS[d]=c[d])}}(this,function(){var a={},b=function(a){return Object.prototype.toString.call(a).toLowerCase()};return a.is=function c(a,d){return arguments.length<1?c:arguments.length<2?function(b){return c(a,b)}:b(d)==="[object "+a+"]"},a.isNull=function d(a){return arguments.length<1?d:null===a},a.isNotNull=function e(a){return arguments.length<1?e:null!==a},a.isVoid=function f(a){return arguments.length<1?f:void 0===a},a.isNotVoid=function g(a){return arguments.length<1?g:void 0===a},a.isNil=function h(a){return arguments.length<1?h:null==a},a.isNotNil=function i(b){return arguments.length<1?i:!a.isNil(b)},a.isBool=function j(a){return arguments.length<1?j:"boolean"==typeof a},a.isNotBool=function k(b){return arguments.length<1?k:!a.isBool(b)},a.isString=function l(a){return arguments.length<1?l:"string"==typeof a},a.isNotString=function m(b){return arguments.length<1?m:!a.isString(b)},a.isNumber=function n(a){return arguments.length<1?n:"number"==typeof a&&!isNaN(a)&&isFinite(a)},a.isNotNumber=function o(b){return arguments.length<1?o:!a.isNumber(b)},a.isInt32=function p(b){return arguments.length<1?p:a.isNumber(b)&&b%1===0},a.isNotInt32=function q(b){return arguments.length<1?q:!a.isInt32(b)},a.isFloat32=function r(b){return arguments.length<1?r:a.isNumber(b)&&b%1!==0},a.isNotFloat32=function s(b){return arguments.length<1?s:!a.isFloat32(b)},a.isFunction=function t(a){return arguments.length<1?t:"function"==typeof a},a.isNotFunction=function u(b){return arguments.length<1?u:!a.isFunction(b)},a.isArray=function v(a){return arguments.length<1?v:Array.isArray(a)},a.isNotArray=function w(a){return arguments.length<1?w:!Array.isArray(a)},a.isObject=function x(b){return arguments.length<1?x:a.is("object",b)},a.isNotObject=function y(b){return arguments.length<1?y:!a.isObject(b)},a.isDate=function z(b){return arguments.length<1?z:a.is("date",b)},a.isNotDate=function A(b){return arguments.length<1?A:!a.isDate(b)},a.isRegex=function B(b){return arguments.length<1?B:a.is("regexp",b)},a.isNotRegex=function C(b){return arguments.length<1?C:!a.isRegex(b)},a.isNode=function D(b){return arguments.length<1?D:a.isNotNil(b)&&a.isInt32(b.nodeType)},a.isNotNode=function E(b){return arguments.length<1?E:!a.isNode(b)},a.isNodeList=function F(a){return arguments.length<1?F:/^((\[object\s)(html(options)?collection|nodelist)(\]))$/.test(b(a))},a.isNotNodeList=function G(b){return arguments.length<1?G:!a.isNodeList(b)},a.isSequencial=function H(b){return arguments.length<1?H:a.isNotNil(b)&&a.isInt32(b.length)&&a.isNotFunction(b)&&a.isNotObject(b)},a.isNotSequencial=function I(b){return arguments.length<1?I:!a.isSequencial(b)},a.isEnumerable=function J(b){return arguments.length<1?J:a.isObject(b)||a.isSequencial(b)},a.isNotEnumerable=function K(b){return arguments.length<1?K:!a.isEnumerable(b)},a});