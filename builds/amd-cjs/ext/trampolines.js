/*! funkyjs-2 1.7.1
 *  David Hofmann <the.urban.drone@gmail.com>, MIT license */
/* globals define, module, exports, require */!function(a,b){var c,d;if("function"==typeof define&&define.amd)define(["../type"],b);else if("object"==typeof exports)module.exports=b(require("type"));else{c=b(a.funkyJS);for(d in c)c.hasOwnProperty(d)&&(a.funkyJS[d]=c[d])}}(this,function(a){var b={},c=function(a){this.exec=a};return c.is=function(a){return c.prototype.isPrototypeOf(a)},b.thunk=function(b){if(a.isNotFunction(b))throw new Error("Thunks cannot contain anything but functions");return new c(b)},b.trampoline=function(a){for(var b=a;c.is(b);)b=b.exec();return b},b});