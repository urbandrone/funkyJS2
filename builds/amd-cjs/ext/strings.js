/*! funkyjs-2 1.8.0
 *  David Hofmann <the.urban.drone@gmail.com>, MIT license */
/* globals define, module, exports, require */!function(a,b){var c,d;if("function"==typeof define&&define.amd)define(["../type"],b);else if("object"==typeof exports)module.exports=b(require("type"));else{c=b(a.funkyJS);for(d in c)c.hasOwnProperty(d)&&(a.funkyJS[d]=c[d])}}(this,function(a){var b={};return b.trimLeft=function(b){if(a.isNotString(b))throw new Error("trimLeft expects str to be string but saw "+b);return b.replace(/^\s+/g,"")},b.trimRight=function(b){if(a.isNotString(b))throw new Error("trimRight expects str to be string but saw "+b);return b.replace(/\s+$/g,"")},b.trim=function(c){if(a.isNotString(c))throw new Error("trim expects str to be string but saw "+c);return b.trimLeft(b.trimRight(c))},b.camelize=function(b){if(a.isNotString(b))throw new Error("camelize expects str to be string but saw "+b);return b.replace(/-[A-Za-z]|_[A-Za-z]/g,function(a){return a[1].toUpperCase()+a.slice(2).toLowerCase()})},b.dasherize=function(b){if(a.isNotString(b))throw new Error("dasherize expects str to be string but saw "+b);return b.replace(/_[A-Za-z]|[A-Z]/g,function(a){return"-"+("_"===a[0]?a.slice(1).toLowerCase():a.toLowerCase())})},b.underscore=function(b){if(a.isNotString(b))throw new Error("underscore expects str to be string but saw "+b);return b.replace(/-[A-Za-z]|[A-Z]/g,function(a){return"_"+("-"===a[0]?a.slice(1).toLowerCase():a.toLowerCase())})},b.splitParse=function c(b,d,e){if(a.isNotFunction(b))throw new Error("splitParse expects fn to be function but saw "+b);if(void 0===d)return function(a,d){return c(b,a,d)};if(a.isNotString(d)&&a.isNotRegex(d))throw new Error("splitParse expects delimiter to be string or regexp but saw "+d);if(void 0===e)return function(a){return c(b,d,a)};if(a.isNotString(e))throw new Error("splitParse expects str to be string but saw "+e);return e.split(d).map(b)},b.substitude=function d(b,c){var e;if(a.isNotString(b))throw new Error("substitude expects str to be string but saw "+b);if(void 0===c)return function(a){return d(b,a)};if(a.isNotObject(c))throw new Error("substitude expects data to be object but saw "+c);return e=b,Object.keys(c).forEach(function(a){var b=new RegExp("(\\$\\{("+a+")\\})+?","g");e=e.replace(b,function(a){var b=a.slice(2,a.length-1);return c.hasOwnProperty(b)?c[b]:""})}),e},b});