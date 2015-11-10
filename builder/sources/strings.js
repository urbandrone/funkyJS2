/*! funkyjs-2 2.0.0
 *  David Hofmann <the.urban.drone@gmail.com>, MIT license */
/* globals define, module, exports, require */
!function(a,b){var c,d;if("function"==typeof define&&define.amd)define(["../type"],b);else if("object"==typeof exports)module.exports=b(require("type"));else{c=b(a.funkyJS);for(d in c)c.hasOwnProperty(d)&&(a.funkyJS[d]=c[d])}}(this,function(a){var b={};return b.trimLeft=function(b){return a.isString(b)?b.replace(/^\s+/g,""):b},b.trimRight=function(b){return a.isString(b)?b.replace(/\s+$/g,""):b},b.trim=function(c){return a.isString(c)?b.trimLeft(b.trimRight(c)):c},b.camelize=function(b){return a.isString(b)?b.replace(/-[A-Za-z]|_[A-Za-z]/g,function(a){return a[1].toUpperCase()+a.slice(2).toLowerCase()}):b},b.dasherize=function(b){return a.isString(b)?b.replace(/_[A-Za-z]|[A-Z]/g,function(a){return"-"+("_"===a[0]?a.slice(1).toLowerCase():a.toLowerCase())}):b},b.underscore=function(b){return a.isString(b)?b.replace(/-[A-Za-z]|[A-Z]/g,function(a){return"_"+("-"===a[0]?a.slice(1).toLowerCase():a.toLowerCase())}):b},b.splitParse=function c(b,d,e){if(!a.isFunction(b))throw"splitParse expects fn to be function but saw "+b;if(void 0===d)return function(a,d){return c(b,a,d)};if(!a.isString(d)&&!a.isRegex(d))throw"splitParse expects delimiter to be string or regexp but saw "+d;if(void 0===e)return function(a){return c(b,d,a)};if(!a.isString(e))throw"splitParse expects str to be string but saw "+e;return e.split(d).map(b)},b.substitude=function d(b,c){var e;if(!a.isString(b))throw"substitude expects str to be string but saw "+b;if(void 0===c)return function(a){return d(b,a)};if(!a.isObject(c))throw"substitude expects data to be object but saw "+c;return e=b,Object.keys(c).forEach(function(a){var b=new RegExp("(\\$\\{("+a+")\\})+?","g");e=e.replace(b,function(a){var b=a.slice(2,a.length-1);return c.hasOwnProperty(b)?c[b]:""})}),e},b});