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
    @module arity
    **/
    var api = {};





    // INTERNAL UTILS
    // ==============
    var slice = function (x) {
        return [].slice.apply(x, [].slice.call(arguments, 1));
    }



    /**
    The aritize function takes a number and returns a function which has a arity
        of exactly that length. A optional second argument allows to create a
        loosely aritized function, which acts much like a variadic function, but
        packs all the given arguments into a array. A call to aritize returns a
        function, which awaits a function describing the operation applied to the
        given arguments (either loosely or strict)

    @method aritize
    @for funkyJS
    @param {number} arity The arity of the original function
    @param {boolean} [loose = false] Return a loose or strict function
    @return {function} A wrapper function with correct arity

    @example
        var max = function () {
            return Math.max.apply(null, arguments);
        }

        max(1, 2, 3, 4, 5);
        // -> 5

        max.length;
        // -> 0

        // loosely aritized (acts much like variadic)
        var looseMax = funkyJS.aritize(3, true)(max);

        looseMax(1, 2, 3, 4, 5);
        // -> 5

        looseMax.length;
        // -> 3


        // strictly aritized (acts much like niladic, monadic, etc...)
        var stictMax = funkyJS.aritize(3)(function (args) {
            return max.apply(null, args);
        });

        strictMax(1, 2, 3, 4, 5);
        // -> 3

        strictMax.length;
        // -> 3

    **/
    api.aritize = function aritize (arity, loose) {
        var _head,
            _body,
            _tail,
            _args,
            _i;

        if (arguments.length < 1) {
            return aritize;
        }

        if (isNaN(arity) || !isFinite(arity)) {
            throw new Error('aritize expected number as first argument but saw ' + arity);
        }

        _head = 'return function (';
        _body = ') { return fn.apply(this, arguments';
        _tail = '); }';
        _args = '';
        _i = 0;

        while (_i < arity) {
            _args += (_i < 1 ? 'a' + _i : ', a' + _i);
            _i += 1;
        }

        if (!loose) {
            _body = ') { return fn.apply(this, [[' + _args;
            _tail = ']]); }';
        }

        return new Function('fn', _head + _args + _body + _tail);
    }

    /**
    The niladic function restricts the number of arguments (a functions arity) that
        are needed to execute a function to zero. It takes a function and returns
        a function which takes arguments until the given function can be executed.
        If more arguments are passed than the arity of the given function is, the
        arguments which are too many will be ignored

    @method niladic
    @for funkyJS
    @param {function} f The function to restrict
    @return {function} A curried, restricted variant of the given function

    @example
        var say = function (sentence) {
            return sentence || '---';
        }

        say('hello');
        // -> 'hello'

        var dontSay = funkyJS.niladic(say);

        dontSay('hello');
        // -> '---'

    **/
    api.niladic = function niladic (f) {
        if (arguments.length < 1) {
            return niladic;
        }

        if (type.isNotFunction(f)) {
            return f;
        }

        return function () {
            return f.call(this);
        }
    }

    /**
    The monadic function restricts the number of arguments (a functions arity) that
        are needed to execute a function to one. It takes a function and returns
        a function which takes arguments until the given function can be executed.
        If more arguments are passed than the arity of the given function is, the
        arguments which are too many will be ignored

    @method monadic
    @for funkyJS
    @param {function} f The function to restrict
    @return {function} A curried, restricted variant of the given function

    @example
        var sayTo = function (sentence, receiver) {
            return sentence + ' ' + (receiver.name || 'nobody');
        }

        sayTo('hello', {name: 'joe'});
        // -> 'hello joe'

        var sayToNobody = funkyJS.monadic(sayTo);

        sayToNobody('hello', {name: 'joe'});
        // -> 'hello nobody'

    **/
    api.monadic = function monadic (f) {
        if (arguments.length < 1) {
            return monadic;
        }

        if (type.isNotFunction(f)) {
            return f;
        }

        return function (x) {
            if (x === undefined) {
                return monadic(f);
            }

            return f.call(this, x);
        }
    }

    /**
    The dyadic function restricts the number of arguments (a functions arity) that
        are needed to execute a function to two. It takes a function and returns
        a function which takes arguments until the given function can be executed.
        If more arguments are passed than the arity of the given function is, the
        arguments which are too many will be ignored

    @method dyadic
    @for funkyJS
    @param {function} f The function to restrict
    @return {function} A curried, restricted variant of the given function

    @example
        var sayTo = function (sentence, receiver) {
            return sentence + ' ' + (receiver.name || 'nobody');
        }

        sayTo('hello', {name: 'joe'});
        // -> 'hello joe'

        var sayToCurried = funkyJS.dyadic(sayTo);

        var greet = sayToCurried('hello');

        greet({name: 'joe'});
        // -> 'hello joe'

    **/
    api.dyadic = function dyadic (f) {
        if (arguments.length < 1) {
            return dyadic;
        }

        if (type.isNotFunction(f)) {
            return f;
        }

        return function (x, y) {
            if (x === undefined) {
                return dyadic(f);
            }

            if (y === undefined) {
                return api.monadic(function (y) {
                    return f.call(this, x, y);
                });
            }

            return f.call(this, x, y);
        }
    }

    /**
    The triadic function restricts the number of arguments (a functions arity) that
        are needed to execute a function to three. It takes a function and returns
        a function which takes arguments until the given function can be executed.
        If more arguments are passed than the arity of the given function is, the
        arguments which are too many will be ignored

    @method triadic
    @for funkyJS
    @param {function} f The function to restrict
    @return {function} A curried, restricted variant of the given function

    @example
        var sayTo = function (sentence, symbol, receiver) {
            return sentence + '' + symbol + '' + (receiver.name || 'nobody');
        }

        sayTo('hello', ', ', {name: 'joe'});
        // -> 'hello, joe'

        var sayToCurried = funkyJS.triadic(sayTo);

        var greet = sayToCurried('hello', ', ');

        greet({name: 'joe'});
        // -> 'hello, joe'

    **/
    api.triadic = function triadic (f) {
        if (arguments.length < 1) {
            return triadic;
        }

        if (type.isNotFunction(f)) {
            return f;
        }

        return function (x, y, z) {
            if (x === undefined) {
                return triadic(f);
            }

            if (y === undefined) {
                return api.dyadic(function (y, z) {
                    return f.call(this, x, y, z);
                });
            }

            if (z === undefined) {
                return api.monadic(function (z) {
                    return f.call(this, x, y, z);
                });
            }

            return f.call(this, x, y, z);
        }
    }

    /**
    The tetradic function restricts the number of arguments (a functions arity) that
        are needed to execute a function to four. It takes a function and returns
        a function which takes arguments until the given function can be executed.
        If more arguments are passed than the arity of the given function is, the
        arguments which are too many will be ignored

    @method tetradic
    @for funkyJS
    @param {function} f The function to restrict
    @return {function} A curried, restricted variant of the given function

    @example
        var takeAll = function () {
            return funkyJS.toArray(arguments);
        }

        takeAll(1, 2, 3, 4, 5);
        // -> [1, 2, 3, 4, 5]

        var takeFour = funkyJS.tetradic(takeAll);

        takeFour(1, 2, 3, 4, 5);
        // -> [1, 2, 3, 4]

    **/
    api.tetradic = function tetradic (f) {
        if (arguments.length < 1) {
            return tetradic;
        }

        if (type.isNotFunction(f)) {
            return f;
        }

        return function (w, x, y, z) {
            if (w === undefined) {
                return tetradic(f);
            }

            if (x === undefined) {
                return api.triadic(function (x, y, z) {
                    return f.call(this, w, x, y, z);
                });
            }

            if (y === undefined) {
                return api.dyadic(function (y, z) {
                    return f.call(this, w, x, y, z);
                });
            }

            if (z === undefined) {
                return api.monadic(function (z) {
                    return f.call(this, w, x, y, z);
                });
            }

            return f.call(this, w, x, y, z);
        }
    }

    /**
    The polyadic function restricts the number of arguments (a functions arity) that
        are needed to execute a function to two or more. It takes a function and returns
        a function which takes arguments until the given function can be executed.
        If too less arguments are given to the returned accumulator function, a
        new accumulator function is returned.

    @method polyadic
    @for funkyJS
    @param {function} f The function to restrict
    @return {function} A curried, restricted variant of the given function

    @example
        var takeAll = function () {
            return funkyJS.toArray(arguments);
        }

        takeAll(1, 2, 3, 4, 5);
        // -> [1, 2, 3, 4, 5]

        var takeTwoOrMore = funkyJS.polyadic(takeAll);

        takeTwoOrMore(1, 2);
        // -> [1, 2]

        takeTwoOrMore(1);
        // -> function accumulator

        takeTwoOrMore(1, 2, 3);
        // -> [1, 2, 3]

    **/
    api.polyadic = function polyadic (f) {
        if (arguments.length < 1) {
            return polyadic;
        }

        if (type.isNotFunction(f)) {
            return f;
        }

        function acc (collected) {
            return api.aritize(f.length - collected.length, true)(function () {
                var args = collected.concat(slice(arguments));
                if (args.length < 2) {
                    return acc(args);
                }

                return f.apply(this, args);
            });
        }

        return acc([]);
    }

    /**
    The variadic function transforms any function which takes at least one argument
        (unary function) into a function which takes a variable number or arguments
        (multary function) by providing the overhanging arguments combined into
        a array with the regular last argument

    @method variadic
    @for funkyJS
    @param {function} f The original (not multary) function
    @return {function} A multary variant of the given function

    @example
        var unary = function (a) {
            return a;
        }

        var binary = function (a, b) {
            return [a, b];
        }

        unary(1, 2, 3);
        // -> 1

        binary(1, 2, 3);
        // -> [1, 2]

        var variUnary = funkyJS.variadic(unary);
        var variBinary = funkyJS.variadic(binary);

        variUnary(1, 2, 3);
        // -> [1, 2, 3]

        variBinary(1, 2, 3);
        // -> [1, [2, 3]]

    **/
    api.variadic = function variadic (f) {
        var arity;

        if (arguments.length < 1) {
            return variadic;
        }

        if (type.isNotFunction(f) || f.length < 1) {
            return f;
        }

        arity = f.length;
        return api.aritize(arity, true)(function () {
            var given = arguments.length > 1 ? slice(arguments, 0, arity - 1) : [],
                miss = new Array(Math.max(arity - arguments.length - 1, 0)),
                rest = [slice(arguments, arity - 1)];

            return f.apply(this, given.concat(miss).concat(rest));
        });
    }



    return api;

});