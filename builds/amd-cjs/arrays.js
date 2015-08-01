/*! funkyjs-2 1.6.1
 *  David Hofmann <the.urban.drone@gmail.com>, MIT license */
/* globals define, module, exports, require */!function(a,b){var c,d;if("function"==typeof define&&define.amd)define(["./type"],b);else if("object"==typeof exports)module.exports=b(require("type"));else{c=b(a.funkyJS);for(d in c)c.hasOwnProperty(d)&&(a.funkyJS[d]=c[d])}}(this,function(a){var b={},c=Array.prototype.slice;return b.toArray=function d(b){return arguments.length<1?d:a.isArray(b)?b:a.isNotEnumerable(b)?[b]:a.isString(b)?b.split(""):a.isObject(b)?Object.keys(b).map(function(a){return b[a]}):c.call(b)},b.first=function e(b){return arguments.length<1?e:a.isSequencial(b)&&b.length?b[0]:b},b.last=function f(b){return arguments.length<1?f:a.isSequencial(b)&&b.length?b[b.length-1]:b},b.head=function g(c){return arguments.length<1?g:a.isSequencial(c)&&c.length?b.toArray(c).slice(0,c.length-1):c},b.tail=function h(c){return arguments.length<1?h:a.isSequencial(c)&&c.length?b.toArray(c).slice(1):c},b.nth=function i(b,c){return arguments.length<1?i:arguments.length<2?function(a){return i(b,a)}:((a.isNotNumber(b)||0>b)&&(b=0),a.isSequencial(c)&&c.length>=1?c[b]||null:null)},b.take=function j(c,d){return arguments.length<1?j:arguments.length<2?function(a){return j(c,a)}:(a.isNotNumber(c)&&(c=0),a.isSequencial(d)&&d.length?b.toArray(d).slice(0,Math.min(d.length,c)):d)},b.drop=function k(c,d){return arguments.length<1?k:arguments.length<2?function(a){return k(c,a)}:(a.isNotNumber(c)&&(c=d&&d.length?d.length:1/0),a.isSequencial(d)&&d.length?b.toArray(d).slice(Math.min(d.length,c)):d)},b.append=function l(c,d){return arguments.length<1?l:arguments.length<2?function(a){return l(c,a)}:(c=a.isSequencial(c)?b.toArray(c):[],a.isSequencial(d)?b.toArray(d).concat(c):d)},b.prepend=function m(c,d){return arguments.length<1?m:arguments.length<2?function(a){return m(c,a)}:(c=a.isSequencial(c)?b.toArray(c):[],a.isSequencial(d)?c.concat(b.toArray(d)):d)},b.surround=function n(c,d,e){return arguments.length<1?n:arguments.length<2?function(a,b){return n(c,a,b)}:arguments.length<3?function(a){return n(c,d,a)}:(c=a.isSequencial(c)?b.toArray(c):[],d=a.isSequencial(d)?b.toArray(d):[],a.isSequencial(e)?c.concat(b.toArray(e)).concat(d):e)},b.unique=function o(c){var d;return arguments.length<1?o:(d=[],c=a.isSequencial(c)?b.toArray(c):[],c.forEach(function(a){d.indexOf(a)<0&&d.push(a)}),d)},b.flatten=function(){function c(a,b){return a.length<1?b:function(){return Array.isArray(a[0])?c(a[0].concat(a.slice(1)),b):c(a.slice(1),b.concat(a[0]))}}return function d(e){var f=b.toArray(e);if(arguments.length<1)return d;for(f=c(e,[]);a.isFunction(f);)f=f();return f}}(),b.union=function p(c,d){return arguments.length<1?p:arguments.length<2?function(a){return p(c,a)}:(c=a.isSequencial(c)?b.toArray(c):[],d=a.isSequencial(d)?b.toArray(d):[],b.unique(c.concat(d)))},b.intersect=function q(c,d){return arguments.length<1?q:arguments.length<2?function(a){return q(c,a)}:(c=a.isSequencial(c)?b.unique(b.toArray(c)):[],d=a.isSequencial(d)?b.unique(b.toArray(d)):[],d.length>c.length?d.filter(function(a){return c.indexOf(a)>=0}):c.filter(function(a){return d.indexOf(a)>=0}))},b.difference=function r(c,d){return arguments.length<1?r:arguments.length<2?function(a){return r(c,a)}:(c=a.isSequencial(c)?b.toArray(c):[],d=a.isSequencial(d)?b.toArray(d):[],b.union(c,d).filter(function(a){return c.indexOf(a)<0||d.indexOf(a)<0}))},b});