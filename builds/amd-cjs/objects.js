/*! funkyjs-2 1.3.0
 *  David Hofmann <the.urban.drone@gmail.com, MIT license */
/* globals define, module, exports, require */!function(a,b){var c,d;if("function"==typeof define&&define.amd)define(["./type"],b);else if("object"==typeof exports)module.exports=b(require("type"));else{c=b(a.funkyJS);for(d in c)c.hasOwnProperty(d)&&(a.funkyJS[d]=c[d])}}(this,function(a){var b={},c=Object.prototype.hasOwnProperty;return b.has=function d(b,e){return arguments.length<1?d:arguments.length<2?function(a){return d(b,a)}:a.isNotNil(e)&&c.call(e,""+b)},b.get=function e(b,c){var d;return arguments.length<1?e:arguments.length<2?function(a){return e(b,a)}:(d=""+b,a.isNotNil(c)&&a.isNotNil(c[d])?c[d]:null)},b.pluck=function f(c,d){return arguments.length<1?f:arguments.length<2?function(a){return f(c,a)}:a.isArray(d)?d.map(b.get(c)):b.get(c,d)},b.keys=function g(b){return arguments.length<1?g:a.isNotObject(b)?[]:Object.keys(b)},b.values=function h(a){return arguments.length<1?h:b.keys(a).map(function(b){return a[b]})},b.methods=function i(c){return arguments.length<1?i:b.keys(c).filter(function(b){return a.isFunction(c[b])})},b.pairs=function j(a){return arguments.length<1?j:b.keys(a).map(function(b){return[b,a[b]]})},b.inverse=function k(c){var d;return arguments.length<1?k:a.isNotObject(c)?null:(d={},b.keys(c).reduce(function(a,b){return a[String(c[b])]=b,a},d))},b.instance=function(b,c){if(a.isNotFunction(b))throw new Error("instance expected Ctor to be function but saw "+b);return void 0!==c&&b.prototype.isPrototypeOf(c)?c:Object.create(b.prototype)},b.extend=function l(c,d){return arguments.length<1?l:arguments.length<2?function(a){return l(c,a)}:a.isNotObject(c)||a.isNotObject(d)?c:b.keys(d).reduce(function(a,b){return a[b]=d[b],a},c)},b.extendWith=function m(a,c){return arguments.length<1?m:arguments.length<2?function(b){return m(a,b)}:b.extend(c,a)},b.inherits=function n(a,c){return arguments.length<1?n:arguments.length<2?function(b){return n(a,b)}:b.extend(b.extend({},a&&a.prototype||{}),c)},b.delegate=function o(b,c,d){return arguments.length<1||a.isNotObject(b)?o:arguments.length<2||a.isNotObject(c)?function(a,c){return o(b,a,c)}:arguments.length<3||a.isNotArray(d)?function(a){return o(b,c,a)}:(d.forEach(function(d){a.isFunction(b[d])&&(c[d]=function(){return b[d].apply(c,arguments)})}),c)},b.forward=function p(b,c,d){return arguments.length<1||a.isNotObject(b)?p:arguments.length<2||a.isNotObject(c)?function(a,c){return p(b,a,c)}:arguments.length<3||a.isNotArray(d)?function(a){return p(b,c,a)}:(d.forEach(function(d){a.isFunction(c[d])&&(b[d]=function(){return c[d].apply(c,arguments)})}),b)},b});