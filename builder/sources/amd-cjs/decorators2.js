/*! funkyjs-2 2.1.0
 *  David Hofmann <the.urban.drone@gmail.com>, MIT license */
/* globals define, module, exports, require */
!function(a,b){var c,d;if("function"==typeof define&&define.amd)define(["../type","../arity"],b);else if("object"==typeof exports)module.exports=b(require("type"),require("arity"));else{c=b(a.funkyJS,a.funkyJS);for(d in c)c.hasOwnProperty(d)&&(a.funkyJS[d]=c[d])}}(this,function(a,b){function c(a){return function(b,c){if(a[c](b))return!0;throw"passInputContracts(:item) mismatches contract "+a[c]}}function d(b){return b&&a.isArray(b.args)&&a.isFunction(b.proc)}function e(a){return function(b,c){return!!b(a[c])}}var f={};return f.hom=function g(d,e){if(void 0===d)return g;if(void 0===e)return function(a){return g(d,a)};if(!a.isArray(d)||!d.every(a.isFunction))throw"hom expects ins to be array but saw "+d;if(!a.isFunction(e))throw"hom expects out to be function but saw "+e;return function(f){if(!a.isFunction(f))throw"hom->f expects fn to be function but saw "+f;if(f.length!==d.length)throw"hom->f aritiy of fn mismatches inputs length";return b.aritize(d.length)(function(a){var b;if(a.every(c(d))&&(b=f.apply(this,a)),!e(b))throw"hom->f->f-> output mismatches contract: "+b;return b})}},f.multiDispatch=function(b){var c;if(!a.isArray(b))throw"multiDispatch expects argument to be array but saw "+b;return c=b.filter(d),function(){var b,d,f,g,h=[].slice.call(arguments);for(g=0,f=c.length;f>g&&(d=c[g],d);g+=1)if(!(d.args.length>0&&h.length!==d.args.length)&&d.args.every(e(h))&&(b=d.proc.apply(this,h),a.isFunction(d.out)&&d.out.call(this,b)))return b;return b}},f.displaceArgs=function h(b,c){if(!a.isFunction(b))throw"displaceArgs expects argument to be function but saw "+b;if(void 0===c)return function(a){return h(b,a)};if(!a.isArray(c))throw"displaceArgs expects second argument to be array but saw "+c;if(b.length<c.length)throw"displaceArgs(:array, :fn) Given functions arity is to low";return function(){var a=arguments,d=[];return c.forEach(function(b,c){d[c]=a[b]}),b.apply(this,d)}},f});