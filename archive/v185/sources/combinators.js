;(function (global, factory) {
    var ext,
        it;

    if (typeof define === 'function' && define.amd) {
        define(['./type', './arity'], factory);

    } else if (typeof exports === 'object') {
        module.exports = factory(require('type'), require('arity'));

    } else {
        ext = factory(global.funkyJS, global.funkyJS);
        for (it in ext) {
            if (ext.hasOwnProperty(it)) {
                global.funkyJS[it] = ext[it];
            }
        }
    }

})(this, function (type, arity) {

    /**
    @module combinators
    **/
    var api = {};



    // INTERNAL UTILS
    // ==============
    var slice = function (x) {
        return [].slice.apply(x, [].slice.call(arguments, 1));
    }

    var flat = function (x) {
        var flattened = [],
            len,
            it;

        x = slice(x);
        for (it = 0, len = x.length; it < len; it += 1) {
            if (type.isArray(x[it])) {
                flattened = flattened.concat(flat(x[it]));
            } else {
                flattened.push(x[it]);
            }
        }

        return flattened;
    }

    var execBoundContract = function (args, f) {
        return !!f.apply(this, args);
    }



    /**
    The compose function allows to create a function from a set of functions. The
        returned function executes the given set of functions from right to left
        and returns the final result of all applications to the arguments given

    @method compose
    @for funkyJS
    @param {function} fn1* One to N functions to compose together
    @return {function} The composed functions as a new function

    @example
        var hello = function (name) { return 'hello ' + name; }
        var shout = function (sentence) { return sentence.toUpperCase() + '!'; }

        var shoutHello = funkyJS.compose(shout, hello);
        hello('joe');
        // -> 'hello joe'

        shout('joe');
        // -> 'JOE!'

        shoutHello('joe');
        // -> 'HELLO JOE!'

    **/
    api.compose = function compose (/* fn1, ...fnN */) {
        var fns;

        if (arguments.length < 1) {
            return compose;
        }

        fns = slice(arguments).filter(type.isFunction);
        if (fns.length < 1) {
            throw new Error('Expected at least one function to compose but found none');
        }

        return arity.aritize(fns[fns.length - 1].length)(function (args) {
            return fns.reduceRight(function (acc, fn) {
                return [fn.apply(this, acc)];
            }, args, this)[0];
        });
    }

    /**
    The pipe function allows to create a function from a set of functions. The
        returned function executes the given set of functions from left to right
        and returns the final result of all applications to the arguments given

    @method pipe
    @for funkyJS
    @param {function} fn1* One to N functions to pipe through
    @return {function} The piped functions as a new function

    @example
        var greet = function (name) { return 'good evening ' + name; }
        var bePoliteTo = function (name) { return name + ', are you fine today?'; }

        var greetAndBePoliteTo = funkyJS.pipe(greet, bePoliteTo);
        greet('joe');
        // -> 'good evening joe'

        bePoliteTo('joe');
        // -> 'joe, are you fine today?'

        greetAndBePoliteTo('joe');
        // -> 'good evening joe, are you fine today?'

    **/
    api.pipe = function pipe (/* fn1, ...fnN */) {
        var fns;

        if (arguments.length < 1) {
            return pipe;
        }

        fns = slice(arguments).filter(type.isFunction);
        if (fns.length < 1) {
            throw new Error('Expected at least one function to pipe but found none');
        }

        return arity.aritize(fns[0].length)(function (args) {
            return fns.reduce(function (acc, fn) {
                return [fn.apply(this, acc)];
            }, args, this)[0];
        });
    }

    /**
    The and function allows to combine a series of comparator functions into a
        sequence of and-and (&&) conditions, incoming values must pass

    @method and
    @for funkyJS
    @param {function} fn1* One to N functions to compare against
    @return {function} The conditions chained inside a new function

    @example
        var isBelow10 = function (value) {
            return value < 10;
        }

        var isDivBy2 = function (value) {
            return value % 2 === 0;
        }

        var isNumBelow10DivBy2 = funkyJS.and(
            funkyJS.isNumber,
            isBelow10,
            isDivBy2
        );

        isNumBelow10DivBy2(8);
        // -> true

        isNumBelow10DivBy2(9);
        // -> false

        isNumBelow10DivBy2(null);
        // -> false

    **/
    api.and = function and (/* fn1, ...fnN */) {
        var fns,
            max;

        if (arguments.length < 1) {
            return and;
        }

        fns = slice(arguments).filter(type.isFunction);
        max = Math.max.apply(Math, fns.map(function (f) { return f.length; }));
        if (fns.length < 1) {
            throw new Error('and expected at least two functions but found none');
        }

        return arity.aritize(max)(function (args) {
            return fns.every(execBoundContract.bind(this, args));
        });
    }

    /**
    The or function allows to combine a series of comparator functions into a
        sequence of or-or (||) conditions, incoming values must pass

    @method or
    @for funkyJS
    @param {function} fn1* One to N functions to compare against
    @return {function} The conditions chained inside a new function

    @example
        var hasLength = funkyJS.has('length');

        var isIterable = funkyJS.or(
            funkyJS.isArray,
            funkyJS.and(hasLength, funkyJS.isNotFunction)
        );

        isIterable('string');
        // -> true

        isIterable(['a', 'b', 'c']);
        // -> true

        isIterable({
            length: 3,
            0: 'some',
            1: 'thing',
            2: 'here'
        });
        // -> true

        isIterable(null);
        // -> false

        isIterable(function (a, b, c) {});
        // -> false

    **/
    api.or = function or (/* fn1, ...fnN */) {
        var fns,
            max;

        if (arguments.length < 1) {
            return or;
        }

        fns = slice(arguments).filter(type.isFunction);
        max = Math.max.apply(Math, fns.map(function (f) { return f.length; }));
        if (fns.length < 1) {
            throw new Error('or expected at least two functions but found none');
        }

        return arity.aritize(max)(function (args) {
            return fns.some(execBoundContract.bind(this, args));
        });
    }

    /**
    Given a array of functions, the splat function allows to apply incoming
        arguments to all given functions at once. It returns a function which
        consumes the arguments and passes them to every function in the array

    @method splat
    @for funkyJS
    @param {array} fns The functions to "splat" onto the arguments
    @return {function} A function awaiting arguments

    @example
        var multiply = function (n) {
            console.log(n * n);
        }

        var add = function (n) {
            console.log(n + n);
        }

        var logMultAdd = funkyJS.splat([multiply, add]);

        logMultAdd(4);
        // -> console logs 16
        // -> console logs 8

    **/
    api.splat = function splat (fns) {
        if (arguments.length < 1) {
            return splat;
        }

        if (type.isNotArray(fns) || fns.some(type.isNotFunction)) {
            throw new Error('splat expected arguments to be array of functions but saw ' + fns);
        }

        return arity.aritize(
            fns.reduce(function (acc, fn) {
                return Math.max(acc, fn.length);
            }, 0)
        )(function (args) {
            return fns.map(function (fn) {
                return fn.apply(this, args);
            }, this);
        });
    }



    /***
     * EXPORT
     * ======
     */

    return api;

});