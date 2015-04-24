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
    The curry function allows to return a function from a given function, which
        splits the application of the given function into multiple steps. The
        returned function returns itself functions, until enough arguments to
        execute the originally given function

    @method curry
    @for funkyJS
    @param {function} fn The function to curry
    @return {function} The curried function

    @example
        var add = funkyJS.curry(function (a, b) {
            return a + b;
        });

        add('a')('z');
        // -> 'az'

    **/
    api.curry = function curry (fn /*, arg1 */) {
        if (arguments.length < 1) {
            return curry;
        }

        if (type.isNotFunction(fn)) {
            throw new Error('Expected to curry a function but saw ' + fn);
        }

        function acc (collected) {
            return function (arg) {
                var args = collected.concat(arg);
                if (args.length < fn.length) {
                    return acc(args);
                }

                return fn.apply(this, args);
            }
        }

        return acc((arguments.length > 1 ? [arguments[1]] : []));
    }

    /**
    The curryRight function allows to return a function from a given function, which
        splits the application of the given function into multiple steps. The
        returned function returns itself functions, until enough arguments to
        execute the originally given function. The collected arguments are reversed
        before applied

    @method curryRight
    @for funkyJS
    @param {function} fn The function to curry
    @return {function} The curried function

    @example
        var add = funkyJS.curryRight(function (a, b) {
            return a + b;
        });

        add('a')('z');
        // -> 'za'

    **/
    api.curryRight = function curryRight (fn /*, arg1 */) {
        if (arguments.length < 1) {
            return curryRight;
        }

        if (type.isNotFunction(fn)) {
            throw new Error('Expected to curryRight a function but saw ' + fn);
        }

        function acc (collected) {
            return function (arg) {
                var args = collected.concat(arg);
                if (args.length < fn.length) {
                    return acc(args);
                }

                return fn.apply(this, args.reverse());
            }
        }

        return acc((arguments.length > 1 ? [arguments[1]] : []));
    }

    /**
    The partial function allows to partially apply a function to a set of arguments
        by leaving the context unbound. It returns a funciton, which collects
        arguments until enough arguments are collected to execute the partially
        applied function. funkyJS.partial also allows to leave holes in the list
        of arguments preset to a function by passing the undefined value

    @method partial
    @for funkyJS
    @param {function} fn The function to partially apply
    @param {array|*} [partials] The argument values to preset (ltr)
    @return {function} The partially applied function

    @example
        var format = function (prefix, value, postfix) {
            return prefix + ' ' + value + ' ' + postfix;
        }

        var formatBtn = funkyJS.partial(format, [
            'this is',
            undefined,
            'button'
        ]);

        formatBtn('joe');
        // -> 'this is joe button';

        formatBtn('a');
        // -> 'this is a button';

    **/
    api.partial = function partial (fn, partials) {
        var missing,
            now;

        if (arguments.length < 1) {
            return partial;
        }

        if (type.isNotFunction(fn)) {
            throw new Error('partial expected to see a function but saw ' + fn);
        }

        if (arguments.length < 2) {
            partials = [];
        } else if (!Array.isArray(partials)) {
            partials = slice(arguments, 1);
        }

        missing = fn.length;
        for (now = 0; now < fn.length; now += 1) {
            if (partials[now] === undefined) {
                partials[now] = undefined;
                continue;
            }
            missing -= 1;
        }

        function accumulator (partials, missed) {
            return arity.aritize(missed)(function (args) {
                var _partials,
                    _missed;

                _missed = missed;
                _partials = partials.map(function (p) {
                    var _p;
                    if (p !== undefined) {
                        return p;
                    }

                    _p = args.shift();
                    if (_p !== undefined) {
                        _missed -= 1;
                    }
                    return _p;
                });

                if (_missed > 0) {
                    return accumulator(_partials, _missed);
                }

                return fn.apply(this, _partials);
            });
        }

        return accumulator(partials, missing);
    }

    /**
    The partialRight function allows to partially apply a function to a set of arguments
        by leaving the context unbound. It returns a funciton, which collects
        arguments until enough arguments are collected to execute the partially
        applied function. funkyJS.partialRight also allows to leave holes in the list
        of arguments preset to a function by passing the undefined value. The
        accumulated arguments are reversed before the function is applied to them

    @method partialRight
    @for funkyJS
    @param {function} fn The function to partially apply
    @param {array|*} [partials] The argument values to preset (rtl)
    @return {function} The partially applied function

    @example
        var format = function (prefix, value, postfix) {
            return prefix + ' ' + value + ' ' + postfix;
        }

        var formatBtnR = funkyJS.partialRight(format, [
            'button',
            undefined,
            'this is'
        ]);

        formatBtnR('joe');
        // -> 'this is joe button';

        formatBtnR('a');
        // -> 'this is a button';

    **/
    api.partialRight = function partialRight (fn, partials) {
        var missing,
            now;

        if (arguments.length < 1) {
            return partialRight;
        }

        if (type.isNotFunction(fn)) {
            throw new Error('partialRight expected to see a function but saw ' + fn);
        }

        if (arguments.length < 2) {
            partials = [];
        } else if (!Array.isArray(partials)) {
            partials = slice(arguments, 1);
        }

        missing = fn.length;
        for (now = 0; now < fn.length; now += 1) {
            if (partials[now] === undefined) {
                partials[now] = undefined;
                continue;
            }
            missing -= 1;
        }

        function accumulator (partials, missed) {
            return arity.aritize(missed)(function (args) {
                var _partials,
                    _missed;

                _missed = missed;
                _partials = partials.map(function (p) {
                    var _p;
                    if (p !== undefined) {
                        return p;
                    }

                    _p = args.shift();
                    if (_p !== undefined) {
                        _missed -= 1;
                    }
                    return _p;
                });

                if (_missed > 0) {
                    return accumulator(_partials, _missed);
                }

                return fn.apply(this, _partials.reverse());
            });
        }

        return accumulator(partials, missing);
    }



    /***
     * EXPORT
     * ======
     */

    return api;

});