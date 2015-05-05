/*! funkyjs-2 1.3.0
 *  David Hofmann <the.urban.drone@gmail.com, MIT license */
/* globals define, module, exports, require */!function(a,b){var c,d;if("function"==typeof define&&define.amd)define(["./type"],b);else if("object"==typeof exports)module.exports=b(require("type"));else{c=b(a.funkyJS);for(d in c)c.hasOwnProperty(d)&&(a.funkyJS[d]=c[d])}}(this,function(a){var b={},c=Object.create(null);return b.lambda=function d(b){var e,f,g,h,i,j,k,l,m,n,o;if(arguments.length<1)return d;if(a.isFunction(b)||a.isNotString(b))return b;if(m=("lambda_"+b).replace(/[\s\-\.,;\:\!\\\[\]\{\}><\?\/\*\+\'\"%&|=\(\)]/g,"_"),a.isFunction(c[m]))return c[m];if(f=b,e=f.split(/\s*->\s*/m),g=[],e.length>1)for(;e.length;)f=e.pop(),g=e.pop().replace(/^\s*(.*)\s*$/,"$1").split(/\s*,\s*|\s+/m),e.length&&e.push("(function("+g+"){return("+f+")})");else if(f.match(/\b_\b/))g="_";else if(i=f.match(/^\s*(?:[+*\/%&|\^\.=<>]|!=)/m),j=f.match(/[+\-*\/%&|\^\.=<>!]\s*$/m),i||j)i&&(g.push("$1"),f="$1"+f),j&&(g.push("$2"),f+="$2");else for(h="",l=/(?:\b[A-Z]|\.[a-zA-Z_$])[a-zA-Z_$\d]*|[a-zA-Z_$][a-zA-Z_$\d]*\s*:|true|false|null|undefined|this|arguments|'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"/g,k=f.replace(l,"").match(/([a-z_$][a-z_$\d]*)/gi)||[],n=0,o;o=k[n];n+=1)h.indexOf(o)<0&&(g.push(o),h+=" # "+o);return c[m]=new Function(g,"return ("+f+")"),c[m]},b});