;(function (global, factory) {
    var ext,
        it;

    if (typeof define === 'function' && define.amd) {
        define([
            '../type'
        ], factory);

    } else if (typeof exports === 'object') {
        module.exports = factory(
            require('type')
        );

    } else {
        ext = factory(
            global.funkyJS
        );

        for (it in ext) {
            if (ext.hasOwnProperty(it)) {
                global.funkyJS[it] = ext[it];
            }
        }
    }

})(this, function (type) {

    /**
    @module experiments
    **/
    var api = {};



    var Thunk = function (fn) {
        this.exec = fn;
    }

    Thunk.is = function (value) {
        return Thunk.prototype.isPrototypeOf(value);
    }



    /**
    The thunk function allows to wrap a function into a thunk which can be used
        in trampolined functions. For usage please take a look at the trampoline
        function

    @method thunk
    @for funkyJS
    @param {function} fn The function to thunk
    @return {Thunk} A new thunk

    **/
    api.thunk = function thunk (fn) {
        if (type.isNotFunction(fn)) {
            throw new Error('Thunks cannot contain anything but functions');
        }

        return new Thunk(fn);
    }

    /**
    The trampoline function allows to implement tail-call optimized functions/
        tail-recursive function calls in JavaScript as a stack-oriented language.
        This allows to transfer the burden of computations from the stack onto
        the heap which results in the possibility of much longer computations to
        run

    @method trampoline
    @for funkyJS
    @param {function} fn A function returning thunks or a final value
    @return {any} The final result

    @example
        var _vanilla = function (n1, n2) {
            if (n2 < 1) {
                return n1;
            }
            return _vanilla(n1 * n2, n2 - 1);
        }

        var _thunkedInner = function (n1, n2) {
            if (n2 < 1) {
                return n1;
            }
            return funkyJS.thunk(function () {
                return _thunkedInner(n1 * n2, n2 - 1);
            });
        }

        var thunked = function (n) {
            return funkyJS.trampoline(_thunkedInner(1, Math.abs(n)));
        }


        vanilla(10);
        // -> 362880

        vanilla(50325);
        // -> RangeError


        thunked(10);
        // -> 3628800

        thunked(50325);
        // -> ... Wait until finished :)

    **/
    api.trampoline = function trampoline (fn) {
        var _fn = fn;
        while (Thunk.is(_fn)) {
            _fn = _fn.exec();
        }
        return _fn;
    }



    /***
     * EXPORT
     * ======
     */

    return api;

});