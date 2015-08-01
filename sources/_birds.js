;(function (global, factory) {
    var ext,
        it;

    if (typeof define === 'function' && define.amd) {
        define([], factory);

    } else if (typeof exports === 'object') {
        module.exports = factory();

    } else {
        ext = factory();
        for (it in ext) {
            if (ext.hasOwnProperty(it)) {
                global.funkyJS[it] = ext[it];
            }
        }
    }

})(this, function () {

    /**
    @module birds
    **/

    var api = {};



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
            throw new TypeError('funkyJS.cmps: ' + f + ' is not a function');
        }

        return function (g) {
            if (typeof g !== 'function') {
                throw new TypeError('funkyJS.cmps: ' + g + ' is not a function');
            }

            return function (x) {
                return f.call(this, g.call(this, x));
            }
        }
    }



    return api;

});