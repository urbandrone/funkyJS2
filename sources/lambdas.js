;(function (global, factory) {
    var ext,
        it;

    if (typeof define === 'function' && define.amd) {
        define(['./type'], factory);

    } else if (typeof exports === 'object') {
        module.exports = factory(require('type'));

    } else {
        ext = factory(global.funkyJS);
        for (it in ext) {
            if (ext.hasOwnProperty(it)) {
                global.funkyJS[it] = ext[it];
            }
        }

    }

})(this, function (type) {

    /**
    @module lambda
    **/
    var api = {};





    // INTERNAL UTILITES
    // =================
    // A caching object for each created lambda. If a signature is passed twice,
    //   the cached lambda function is returned instead of starting the creation
    //   of a new lambda function
    var cache = Object.create(null);




    /**
    The lambda function creates new functions from string expressions and returns
        them. See also the example below for a example of what the lambda function
        does.

    A "->" separates the arguments from the function body. If the expression
        contains a underscore "_", this is the argument. By chaining "->" between
        the argument names, a curried function is created.

    If the expression begins or ends with an operator or relation, the
        argument is appended/prepended (note that the expression cannot begin
        with a "-").

    @method lambda
    @for funkyJS
    @param {string|function} f Function or string expression
    @return {function} A lambda function

    @example
        var square = funkyJS.lambda('x -> x * x');
        square(2);
        // => 4

        var aPlusB = funkyJS.lambda('x, y -> x + y');
        aPlusB('hello', 'world');
        // => 'hello world'


        var double = funkyJS.lambda('_ * 2');
        double(2);
        // => 4


        var divide4By = funkyJS.lambda('4/');
        divide4By(2);
        // => 2


        var ifElse = funkyJS.lambda('x -> y -> z -> !!x ? y : z');
        ifElse(true)('yep')('nope');
        // => 'yep'

        ifElse(false)('yep')('nope');
        // => 'nope'

    **/
    api.lambda = function lambda (f) {
        // LAMBDA FACTORY FUNCTION
        // ===============================
        // Shamelessly stolen 98% of it from Oliver Steele's
        // Functional JavaScript Library (MIT License)
        // ---
        // https://github.com/osteele/functional-javascript

        var code,
            expr,
            prms,
            hash,
            lhs,
            rhs,
            vrs,
            rgx,
            key,
            i,
            v;

        if (arguments.length < 1) {
            return lambda;
        }

        if (type.isFunction(f) || type.isNotString(f)) {
            return f;
        }

        key = ('lambda_' + f).replace(/[\s\-\.,;\:\!\\\[\]\{\}><\?\/\*\+\'\"%&|=\(\)]/g, '_');
        if (type.isFunction(cache[key])) {
            return cache[key];
        }

        expr = f;
        code = expr.split(/\s*->\s*/m);
        prms = [];

        if (code.length > 1) {
            while (code.length) {
                expr = code.pop();
                prms = code.pop().replace(/^\s*(.*)\s*$/, '$1').split(/\s*,\s*|\s+/m);
                code.length && code.push('(function(' + prms + '){return(' + expr + ')})');
            }
        } else if (expr.match(/\b_\b/)) {
            prms = '_';
        } else {
            lhs = expr.match(/^\s*(?:[+*\/%&|\^\.=<>]|!=)/m);
            rhs = expr.match(/[+\-*\/%&|\^\.=<>!]\s*$/m);

            if (lhs || rhs) {
                if (lhs) {
                    prms.push('$1');
                    expr = '$1' + expr;
                }

                if (rhs) {
                    prms.push('$2');
                    expr += '$2';
                }
            } else {
                hash = '';
                rgx = /(?:\b[A-Z]|\.[a-zA-Z_$])[a-zA-Z_$\d]*|[a-zA-Z_$][a-zA-Z_$\d]*\s*:|true|false|null|undefined|this|arguments|'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"/g;

                vrs = expr.replace(rgx, '').match(/([a-z_$][a-z_$\d]*)/gi) || [];
                for (i = 0, v; v = vrs[i]; i += 1) {
                    if (hash.indexOf(v) < 0) {
                        prms.push(v);
                        hash += ' # ' + v;
                    }
                }
            }
        }

        // sadly, we cannot do better really than using the function constructor
        //   to create the lambda. also take care to cache it as soon as it is
        //   created
        cache[key] = new Function(prms, 'return (' + expr + ')');
        return cache[key];
    }



    return api;

});