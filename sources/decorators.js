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
    @module decorators
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
    Given a function, the flip function returns a function which takes in the
        number of arguments from the given one but applies the arguments to the
        given function reversed

    @method flip
    @for funkyJS
    @param {function} fn The function to apply reversed
    @return {function} A accumulator function

    @example
        var greets = function (a, b) {
            return 'hello ' + a + ', my name is ' + b;
        }

        greets('joe', 'jane');
        // -> 'hello joe, my name is jane'

        funkyJS.flip(greets)('joe', 'jane');
        // -> 'hello jane, my name is joe'

    **/
    api.flip = function flip (fn) {
        if (arguments.length < 1) {
            return flip;
        }

        if (!type.isFunction(fn)) {
            throw 'Expected to wrap a function with flip but saw ' + fn;
        }

        function acc (collected) {
            return arity.aritize(fn.length - collected.length, true)(function (/* arg1, ...argN */) {
                var args = collected.concat(slice(arguments));
                if (args.length < fn.length) {
                    return acc(args);
                }

                return fn.apply(this, args.reverse());
            });
        }

        return acc([]);
    }

    /**
    The fluent function returns a fluent version of any given function so one can
        chain method calls together (like in jQuery)

    @method fluent
    @for funkyJS
    @param {function} fn The original function
    @return {function} A fluent variant of the given function

    @example
        var staticClass = {
            foo: function () {
                // does something
            },
            bar: function () {
                // does another thing
            }
        }

        staticClass.foo().bar();
        // -> Error: Cannot call method "bar" of undefined

        ['foo', 'bar'].forEach(function (method) {
            staticClass[method] = funkyJS.fluent(staticClass[method]);
        });

        staticClass.foo().bar();
        // -> Works like a charm now

    **/
    api.fluent = function fluent (fn) {
        if (arguments.length < 1) {
            return fluent;
        }

        if (!type.isFunction(fn)) {
            throw 'Expected to wrap a function with fluent but saw ' + fn;
        }

        return arity.aritize(fn.length, true)(function (/* arg1, ...argN */) {
            fn.apply(this, arguments);
            return this;
        });
    }

    /**
    Given a predicate and a operator function, the guard function returns a function
        which only executes the operator if the arguments given pass the predicate
        function. Otherwise `null` is returned

    @method guard
    @for funkyJS
    @param {function} predicate The guarding/predicate function
    @param {function} fn The operator function
    @return {function} A guarded function

    @example
        var operand = function (str) {
            return str.toUpperCase();
        }

        var guardedOperand = funkyJS.guard(funkyJS.isString, operand);

        operand('joe');
        // -> 'JOE'

        guardedOperand('joe');
        // -> 'JOE'

        operand(1);
        // -> TypeError: undefined is not a function

        guardedOperand(1);
        // -> null, no error

    **/
    api.guard = function guard (predicate, fn) {
        if (arguments.length < 1) {
            return guard;
        }

        if (arguments.length < 2) {
            return function (fn) {
                return guard(predicate, fn);
            }
        }

        if (!type.isFunction(predicate)) {
            throw 'Expected to guard with a function but saw ' + predicate;
        }

        if (!type.isFunction(fn)) {
            throw 'Expected to guard a function but saw ' + fn;
        }

        return arity.aritize(fn.length, true)(function (/* arg1, ...argN */) {
            if (predicate.apply(null, arguments)) {
                return fn.apply(this, arguments);
            }
            return null;
        });
    }

    /**
    The maybe function takes a function and returns a guarded function which is
        only executed, if none of the arguments it is applied to is `null` or
        `undefined`. Otherwise `null` is returned

    @method maybe
    @for funkyJS
    @param {function} fn The function to execute maybe
    @return {function} A guarded function

    @example
        var queryAll = function (selector, root) {
            return root.querySelectorAll(selector);
        }

        var maybeQueryAll = funkyJS.maybe(function (selector, root) {
            return root.querySelectorAll(selector);
        });


        queryAll('div', document);
        // -> Nodelist[<div>, <div>, <div>, ...]

        maybeQueryAll('div', document);
        // -> Nodelist[<div>, <div>, <div>, ...]

        queryAll('div');
        // -> TypeError: Cannot read property 'querySelectorAll' of undefined

        maybeQueryAll('div');
        // -> null, no error

    **/
    api.maybe = function maybe (fn) {
        if (arguments.length < 1) {
            return maybe;
        }

        if (!type.isFunction(fn)) {
            throw 'Expected to maybe execute a function but saw ' + fn;
        }

        return arity.aritize(fn.length)(function (args) {
            return args.some(type.isNil) ? null : fn.apply(this, args);
        });
    }

    /**
    The not function takes a function as argument and returns a function which
        when applied returns the opposite boolean result of the given function

    @method not
    @for funkyJS
    @param {function} fn The function to negate
    @return {function} A function giving the opposite boolean result of fn

    @example
        var sayYes = function () { return true; }
        var sayNo = funkyJS.not(sayYes);

        sayYes();
        // -> true

        sayNo();
        // -> false

    **/
    api.not = function not (fn) {
        if (arguments.length < 1) {
            return not;
        }

        if (!type.isFunction(fn)) {
            throw 'Expected to negate a function but saw ' + fn;
        }

        return arity.aritize(fn.length, true)(function () {
            return !fn.apply(this, arguments);
        });
    }

    /**
    Given a number of milliseconds and a function, the debounce function returns
        a function which calls the given function debounced for the given amount
        of milliseconds. Every new call to the returned function debounces the
        invocation further.

    @method debounce
    @for funkyJS
    @param {number} ticks Milliseconds to debounce
    @param {function} fn Function to debounce
    @return {function} A function which calls fn debounced

    @example
        var recalcComplexLayout = function () {
            // does some complex layout recalculations
        }

        window.onresize = funkyJS.debounce(250, recalcComplexLayout);
        // recalcComplexLayout is only called 250ms after the last resize action

    **/
    api.debounce = function debounce (ticks, fn) {
        var timeout;

        if (arguments.length < 1) {
            return debounce;
        }

        if (arguments.length < 2) {
            if (type.isInt32(ticks)) {
                return function (fn) {
                    return debounce(ticks, fn);
                }
            }

            if (!type.isFunction(ticks)) {
                throw 'Expected to debounce a function but saw ' + ticks + ' / ' + fn;
            }

            fn = ticks;
            ticks = 250;
        }

        if (!type.isInt32(ticks)) {
            throw 'Ticks to debounce must be given as integer';
        }

        if (!type.isFunction(fn)) {
            throw 'Expected to debounce a function but instead saw ' + fn;
        }

        return arity.aritize(fn.length)(function () {
            var args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                fn.apply(this, args);
            }.bind(this), ticks);
        });
    }

    /**
    Given a function, the memoize function returns a memoized version of that
        function

    @method memoize
    @for funkyJS
    @param {function} fn Function to return a memoized version from
    @return {function} A memoized version of the given function

    @example
        var complexCalculation = function (numInput) {
            // does some complex calculation with the given number
        }

        var complexCalcMemo = funkyJS.memoize(complexCalculation);
        // -> returns result of any number given before immediatly (without recalculation)

    **/
    api.memoize = function memoize (fn) {
        if (arguments.length < 1) {
            return memoize;
        }

        if (!type.isFunction(fn)) {
            throw 'Expected to memoize a function but saw ' + fn;
        }

        function memoized (/* arg1, ...argN */) {
            var key = JSON.stringify(arguments);

            if (type.isNil(memoized.cache[key])) {
                memoized.cache[key] = fn.apply(this, arguments);
            }

            return memoized.cache[key];
        }
        memoized.cache = {};

        return memoized;
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

        if (!type.isFunction(fn)) {
            throw 'Expected to curry a function but saw ' + fn;
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

        if (!type.isFunction(fn)) {
            throw 'Expected to curryRight a function but saw ' + fn;
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

        if (!type.isFunction(fn)) {
            throw 'partial expected to see a function but saw ' + fn;
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

        if (!type.isFunction(fn)) {
            throw 'partialRight expected to see a function but saw ' + fn;
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

    /**
    The call function kind of works much like the native Function.prototype.bind
        function, but skips the setting of a specific context until execution.
        The returned function awaits the context as the first argument given. If
        a function with a arity of zero is passed into call, the returned function
        has a arity of one, because at least the context argument must be given

    @method call
    @for funkyJS
    @param {function} fn The function to call
    @param {any} [...leftArgs] Any arguments to pass through from the left
    @return {function} Function awaiting a context and optionally more arguments

    @example
        var slice = funkyJS.call(Array.prototype.slice);

        slice(['a', 'b', 'c'], 1, 2);
        // -> ['b']

        var sliceTail = funkyJS.call(Array.prototype.slice, 1);

        sliceTail(['a', 'b', 'c']);
        // -> ['b', 'c']

    **/
    api.call = function call (fn /*, leftArgs*/) {
        var lArgs;
        if (fn === undefined) {
            return call;
        }

        if (!type.isFunction(fn)) {
            throw 'call expected to see a function but saw ' + fn;
        }

        lArgs = slice(arguments, 1);
        return arity.aritize(fn.length + 1, true)(function (context) {
            return fn.apply(context, lArgs.concat(slice(arguments, 1)));
        });
    }

    /**
    The callRight function kind of works much like the native Function.prototype.bind
        function, but skips the setting of a specific context until execution.
        The returned function awaits the context as the first argument given. If
        a function with a arity of zero is passed into call, the returned function
        has a arity of one, because at least the context argument must be given

    @method callRight
    @for funkyJS
    @param {function} fn The function to call
    @param {any} [...leftArgs] Any arguments to pass through from the right
    @return {function} Function awaiting a context and optionally more arguments

    @example
        var slice = funkyJS.callRight(Array.prototype.slice);

        slice(['a', 'b', 'c'], 2, 1);
        // -> ['b']

        var slice2 = funkyJS.callRight(Array.prototype.slice, 2);

        slice2(['a', 'b', 'c'], 0);
        // -> ['a', 'b']

    **/
    api.callRight = function callRight (fn /*, rightArgs*/) {
        var rArgs;
        if (fn === undefined) {
            return callRight;
        }

        if (!type.isFunction(fn)) {
            throw 'callRight expected to see a function but saw ' + fn;
        }

        rArgs = slice(arguments, 1);
        return arity.aritize(fn.length + 1, true)(function (context) {
            return fn.apply(context, rArgs.concat(slice(arguments, 1)).reverse());
        });
    }

    /*
    The defaults function allow to define overwritable default arguments for a
        given function. If less arguments are given to the returned function
        than the given function needs the missing arguments are filled with
        the defined default parameters. It is possible to skip concrete parameters
        on function invocation by passing "undefined". A skipped parameter
        will also be filled with the default arguments

    @method defaults
    @for funkyJS
    @param {function} fn The function to define default parameters for
    @param {array} defs The default parameters in order
    @return {function} Function with default parameters set

    @example
        var sayTo = function (sentence, subject) {
           console.log(sentence + ' ' + subject);
        }

        var greet = funkyJS.defaults(sayTo, ['hello', 'world']);

        greet();
        // -> 'hello world'

        greet('again, hello');
        // -> 'again, hello world'
        
        greet('hi', 'joe');
        // -> 'hi joe'

        greet(undefined, 'joe');
        // -> 'hello joe'
       
     */
    api.defaults = function defaults (fn, defs) {
        if (arguments.length < 1) {
            return defaults;
        }

        if (!type.isFunction(fn)) {
            throw 'defaults expected to see a function but saw ' + fn;
        }

        if (!type.isArray(defs)) {
            return fn;
        }

        if (defs.length < fn.length) {
            throw 'defaults misses parameters, expected ' + fn.length + ' but saw ' + defs.length;
        }

        return arity.aritize(fn.length)(function (args) {
            return fn.apply(this, defs.map(function (def, idx) {
                if (idx < args.length && !type.isVoid(args[idx])) {
                    return args[idx];
                }
                return def;
            }));
        });
    }



    /***
     * EXPORT
     * ======
     */

    return api;

});