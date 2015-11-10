/*! funkyjs-2 1.8.5
 *  David Hofmann <the.urban.drone@gmail.com>, MIT license */
/* globals define, module, exports, require */!function(a,b){var c,d;if("function"==typeof define&&define.amd)define(["./type"],b);else if("object"==typeof exports)module.exports=b(require("type"));else{c=b(a.funkyJS);for(d in c)c.hasOwnProperty(d)&&(a.funkyJS[d]=c[d])}}(this,function(a){var b={},c=function(a){return[].slice.apply(a,[].slice.call(arguments,1))};return b.aritize=function d(a,b){var c,e,f,g,h;if(arguments.length<1)return d;if(isNaN(a)||!isFinite(a))throw new Error("aritize expected number as first argument but saw "+a);for(c="return function (",e=") { return fn.apply(this, arguments",f="); }",g="",h=0;a>h;)g+=1>h?"a"+h:", a"+h,h+=1;return b||(e=") { return fn.apply(this, [["+g,f="]]); }"),new Function("fn",c+g+e+f)},b.niladic=function e(b){return arguments.length<1?e:a.isNotFunction(b)?b:function(){return b.call(this)}},b.monadic=function f(b){return arguments.length<1?f:a.isNotFunction(b)?b:function(a){return void 0===a?f(b):b.call(this,a)}},b.dyadic=function g(c){return arguments.length<1?g:a.isNotFunction(c)?c:function(a,d){return void 0===a?g(c):void 0===d?b.monadic(function(b){return c.call(this,a,b)}):c.call(this,a,d)}},b.triadic=function h(c){return arguments.length<1?h:a.isNotFunction(c)?c:function(a,d,e){return void 0===a?h(c):void 0===d?b.dyadic(function(b,d){return c.call(this,a,b,d)}):void 0===e?b.monadic(function(b){return c.call(this,a,d,b)}):c.call(this,a,d,e)}},b.tetradic=function i(c){return arguments.length<1?i:a.isNotFunction(c)?c:function(a,d,e,f){return void 0===a?i(c):void 0===d?b.triadic(function(b,d,e){return c.call(this,a,b,d,e)}):void 0===e?b.dyadic(function(b,e){return c.call(this,a,d,b,e)}):void 0===f?b.monadic(function(b){return c.call(this,a,d,e,b)}):c.call(this,a,d,e,f)}},b.polyadic=function j(d){function e(a){return b.aritize(d.length-a.length,!0)(function(){var b=a.concat(c(arguments));return b.length<2?e(b):d.apply(this,b)})}return arguments.length<1?j:a.isNotFunction(d)?d:e([])},b.variadic=function k(d){var e;return arguments.length<1?k:a.isNotFunction(d)||d.length<1?d:(e=d.length,b.aritize(e,!0)(function(){var a=arguments.length>1?c(arguments,0,e-1):[],b=new Array(Math.max(e-arguments.length-1,0)),f=[c(arguments,e-1)];return d.apply(this,a.concat(b).concat(f))}))},b});