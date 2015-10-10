/*! funkyjs-2 1.8.5
 *  David Hofmann <the.urban.drone@gmail.com>, MIT license */
/* globals define, module, exports, require */!function(a,b){var c,d;if("function"==typeof define&&define.amd)define(["../type","../array"],b);else if("object"==typeof exports)module.exports=b(require("type"),require("array"));else{c=b(a.funkyJS,a.funkyJS);for(d in c)c.hasOwnProperty(d)&&(a.funkyJS[d]=c[d])}}(this,function(a){var b={};return b.numIterator=function(b,c){var d=a.isNotNumber(b)?0:b,e="number"!=typeof c||isNaN(c)?1/0:c,f=1;return d>e&&(f=-1),{next:function(){var a=d;return d+=f,a===e?{done:!0,value:function(){return void 0}}:{done:!1,value:function(){return a}}}}},b.seqIterator=function(b){var c;if(a.isNotSequencial(b))throw new Error("seqIterator expected argument to be sequencial but saw "+b);return c=-1,{next:function(){return c+=1,c>=b.length?{done:!0,value:function(){return void 0}}:{done:!1,value:function(){return b[c]}}}}},b.objIterator=function(b){var c,d;if(a.isNotObject(b))throw new Error("objIterator expected argument to be object but saw "+b);return c=Object.keys(b),d=-1,{next:function(){return d+=1,d>=c.length?{done:!0,value:function(){return void 0}}:{done:!1,value:function(){return b[c[d]]}}}}},b.mapLazy=function c(b,d){if("function"!=typeof b)throw new Error("mapLazy expected first argument to be function but saw "+b);if(void 0===d)return function(a){return c(b,a)};if(a.isNotObject(d)||a.isNotFunction(d.next))throw new Error("mapLazy expected second argument to be iterator but was "+d);return{next:function(){var a=d.next();return a.done?{done:!0,value:function(){return void 0}}:{done:!1,value:function(){return b(a.value())}}}}},b.filterLazy=function d(b,c){if("function"!=typeof b)throw new Error("filterLazy expected first argument to be function but saw "+b);if(void 0===c)return function(a){return d(b,a)};if(a.isNotObject(c)||a.isNotFunction(c.next))throw new Error("filterLazy expected second argument to be iterator but was "+c);return{next:function(){for(var a=c.next();!a.done&&!b(a.value());)a=c.next();return a.done?{done:!0,value:function(){return void 0}}:{done:!1,value:function(){return a.value()}}}}},b.foldLazy=function e(b,c,d){var f;if("function"!=typeof b)throw new Error("foldLazy expected first argument to be function but saw "+b);if(void 0===c)return function(a,c){return e(b,a,c)};if(void 0===d)return function(a){return e(b,c,a)};if(a.isNotObject(c)||a.isNotFunction(c.next))throw new Error("foldLazy expected second argument to be iterator but was "+c);return f=d,{next:function(){var a=c.next();return a.done?{done:!0,value:function(){return void 0}}:{done:!1,value:function(){return f=b(f,a.value())}}}}},b});