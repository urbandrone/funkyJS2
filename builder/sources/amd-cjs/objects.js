/*! funkyjs-2 2.1.0
 *  David Hofmann <the.urban.drone@gmail.com>, MIT license */
/* globals define, module, exports, require */
!function(a,b){var c,d;if("function"==typeof define&&define.amd)define(["./type"],b);else if("object"==typeof exports)module.exports=b(require("type"));else{c=b(a.funkyJS);for(d in c)c.hasOwnProperty(d)&&(a.funkyJS[d]=c[d])}}(this,function(a){var b={},c=Object.prototype.hasOwnProperty,d=Array.prototype.slice;return b.has=function e(b,d){return arguments.length<1?e:arguments.length<2?function(a){return e(b,a)}:!a.isNil(d)&&c.call(d,""+b)},b.get=function f(b,c){var d;return arguments.length<1?f:arguments.length<2?function(a){return f(b,a)}:(d=""+b,a.isNil(c)||a.isNil(c[d])?null:c[d])},b.pluck=function g(c,d){return arguments.length<1?g:arguments.length<2?function(a){return g(c,a)}:a.isArray(d)?d.map(b.get(c)):b.get(c,d)},b.keys=function h(b){return arguments.length<1?h:a.isNil(b)?[]:Object.keys(b)},b.values=function i(a){return arguments.length<1?i:b.keys(a).map(function(b){return a[b]})},b.methods=function j(c){return arguments.length<1?j:b.keys(c).filter(function(b){return a.isFunction(c[b])})},b.pairs=function k(a){return arguments.length<1?k:b.keys(a).map(function(b){return[b,a[b]]})},b.inverse=function l(c){var d;return arguments.length<1?l:a.isObject(c)?(d={},b.keys(c).reduce(function(a,b){return a[String(c[b])]=b,a},d)):null},b.instance=function(b,c){if(!a.isFunction(b))throw"instance expected Ctor to be function but saw "+b;return void 0!==c&&b.prototype.isPrototypeOf(c)?c:Object.create(b.prototype)},b.factory=function(b){if(!a.isFunction(b))throw"factory expected Ctor to be function but saw "+b;return function(){var a=Object.create(b.prototype);return b.apply(a,arguments),a}},b.extend=function m(c,d){return arguments.length<1?m:arguments.length<2?function(a){return m(c,a)}:a.isNil(c)||!a.isObject(d)?c:b.keys(d).reduce(function(a,b){return a[b]=d[b],a},c)},b.extendWith=function n(a,c){return arguments.length<1?n:arguments.length<2?function(b){return n(a,b)}:b.extend(c,a)},b.inherits=function o(a,c){return arguments.length<1?o:arguments.length<2?function(b){return o(a,b)}:b.extend(b.extend({},a&&a.prototype||{}),c)},b.delegate=function p(b,c,d){return arguments.length<1||!a.isObject(b)?p:arguments.length<2||!a.isObject(c)?function(a,c){return p(b,a,c)}:arguments.length<3||!a.isArray(d)?function(a){return p(b,c,a)}:(d.forEach(function(d){a.isFunction(b[d])&&(c[d]=function(){return b[d].apply(c,arguments)})}),c)},b.forward=function q(b,c,d){return arguments.length<1||!a.isObject(b)?q:arguments.length<2||!a.isObject(c)?function(a,c){return q(b,a,c)}:arguments.length<3||!a.isArray(d)?function(a){return q(b,c,a)}:(d.forEach(function(d){a.isFunction(c[d])&&(b[d]=function(){return c[d].apply(c,arguments)})}),b)},b.immutable=function r(b){return arguments.length<1?r:a.isObject(b)?Object.keys(b).reduce(function(a,c){return Object.defineProperty(a,c,{enumerable:!0,writable:!1,value:b[c]}),a},{}):b},b.fAccess=function s(b){function c(a){return c.o[a]}if(arguments.length<1)return s;if(!a.isObject(b)&&!a.isArray(b))throw"fAccess expected argument to be object but saw "+b;return Object.defineProperty(c,"o",{enumerable:!1,writable:!1,value:b}),c},b.exec=function t(b){var c;if(arguments.length<1)return t;if(!a.isString(b)&&!a.isFunction(b))throw"exec expected argument to be string or function but saw "+b;return c=d.call(arguments,1),function(e){return e?a.isString(b)&&a.isFunction(e[b])?e[b].apply(e,c.concat(d.call(arguments,1))):b.apply(e,c.concat(d.call(arguments,1))):void 0}},b});