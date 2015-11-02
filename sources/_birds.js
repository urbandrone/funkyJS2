;(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);

    } else if (typeof exports === 'object') {
        module.exports = factory();

    } else {
        global.funkyJS = factory();
    }

})(this, function () {

    /**
    @module birds
    **/

    var api = Object.create(null);



    /**
    The identity function (Identity/Idiot Bird) takes a argument and instantly
        returns it

    @method identity
    @for funkyJS
    @param {any} x Anything
    @return {any} Anything given

    @example
        var one = funkyJS.identity(1);

    **/
    api.identity = function identity (x) {
        return x;
    }

    /**
    The constant function (Kestrel) takes a argument and returns a function
        which will always return the given argument if called

    @method constant
    @for funkyJS
    @param {any} x Anything
    @return {function} A function which always returns x

    @example
        var getZero = funkyJS.constant(0);

        getZero();
        // -> 0

        getZero(100);
        // -> 0

    **/
    api.constant = function constant (x) {
        return function (/* y */) {
            return x;
        }
    }

    /*
    The tap function (Thrush) takes a argument and a function and returns the
        result of applying the function to the argument.

    @method tap
    @for funkyJS
    @param {any} x Anything
    @return {function} A function to call on x

    @example
        var process = funkyJS.tap(function process (x) {
            var y = process.step1(x);
            var z = process.step2(y);
            return process.step3(z);
        })(function (fn) {
            fn.step1 = function (v) { return v + 1; }
            fn.step2 = function (v) { return v * 2; }
            fn.step3 = function (v) { return v * v; }
            return fn;
        });

        process(1);
        // -> 16
    */
    api.tap = function tap (x) {
        return function (y) {
            return y.call(this, x);
        };
    }

    /**
    The cmps function (Bluebird) is the basic functional higher-order function
        for function composition. It takes a function, returns a function which
        again takes a function and returns a function taking any value which is
        piped through both given functions from right to left

    @method cmps
    @for funkyJS
    @param {function} f A function
    @return {function} Function taking a second function

    @example
        var toInt32 = function (s) {
            return parseInt('' + s, 10);
        }

        var add10 = function (n) {
            return n + 10;
        }

        var toIntPlus10 = funkyJS.cmps(add10)(toInt32);
        toIntPlus10('300px');
        // -> 310

    **/
    api.cmps = function cmps (f) {
        if (typeof f !== 'function') {
            throw 'funkyJS.cmps: ' + f + ' is not a function';
        }

        return function (g) {
            if (typeof g !== 'function') {
                throw 'funkyJS.cmps: ' + g + ' is not a function';
            }

            return function (x) {
                return f.call(this, g.call(this, x));
            }
        }
    }



    return api;

});