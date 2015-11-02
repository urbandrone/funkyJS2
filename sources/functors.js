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
    @module functors
    **/
    var api = {};



    /**
    The forEachWith function is a more functional style of an array's .forEach, as it
        allows to pass in the function first and defer giving the array to iterate
        over. Please note that any function which should be executed in a certain
        context must be bound before being passed

    @method forEachWith
    @for funkyJS
    @param {function} fn The function to call on each iteration
    @param {array} list The array to iterate over
    @return {array} The given list

    @example
        var squared = [],
            square = funkyJS.forEachWith(function (x) { squared.push(x * x) });

        square([1, 2, 3]);

        squared;
        // -> [1, 4, 9]

    **/
    api.forEachWith = function forEachWith (fn, list) {
        if (!type.isFunction(fn)) {
            throw 'forEachWith expects fn to be function but saw ' + fn;
        }

        if (list === undefined) {
            return function (list) {
                return forEachWith(fn, list);
            }
        }

        list = type.isSequencial(list) ?
               [].slice.call(list) :
               null;
        if (!type.isArray(list)) {
            throw 'forEachWith expects list to be array but saw ' + list;
        }

        list.forEach(fn);
        return list;
    }

    /**
    The mapWith function is a more functional style of an array's .map, as it
        allows to pass in the function first and defer giving the array to iterate
        over. Please note that any function which should be executed in a certain
        context must be bound before being passed

    @method mapWith
    @for funkyJS
    @param {function} fn The function to call on each iteration
    @param {array} list The array to iterate over
    @return {array} The mapped list

    @example
        var square = funkyJS.mapWith(function (x) { return (x * x) });

        square([1, 2, 3]);
        // -> [1, 4, 9]

    **/
    api.mapWith = function mapWith (fn, list) {
        if (!type.isFunction(fn)) {
            throw 'mapWith expects fn to be function but saw ' + fn;
        }

        if (list === undefined) {
            return function (list) {
                return mapWith(fn, list);
            }
        }

        list = type.isSequencial(list) ?
               [].slice.call(list) :
               null;
        if (!type.isArray(list)) {
            throw 'mapWith expects list to be array but saw ' + list;
        }

        return list.map(fn);
    }

    /**
    The filterWith function is a more functional style of an array's .filter, as it
        allows to pass in the function first and defer giving the array to iterate
        over. Please note that any function which should be executed in a certain
        context must be bound before being passed

    @method filterWith
    @for funkyJS
    @param {function} fn The function to filter values with
    @param {array} list The array to iterate over
    @return {array} The filtered list

    @example
        var greater1 = funkyJS.filterWith(function (x) { return x > 1; });

        greater1([1, 2, 3]);
        // -> [2, 3]

    **/
    api.filterWith = function filterWith (fn, list) {
        if (!type.isFunction(fn)) {
            throw 'filterWith expects fn to be function but saw ' + fn;
        }

        if (list === undefined) {
            return function (list) {
                return filterWith(fn, list);
            }
        }

        list = type.isSequencial(list) ?
               [].slice.call(list) :
               null;
        if (!type.isArray(list)) {
            throw 'filterWith expects list to be array but saw ' + list;
        }

        return list.filter(fn);
    }

    /**
    The foldWith function is a more functional style of an array's .reduce, as it
        allows to pass in the function first and defer giving the array to iterate
        over. Please note that any function which should be executed in a certain
        context must be bound before being passed

    @method foldWith
    @for funkyJS
    @param {function} fn The function to fold with
    @param {array} list The array to iterate over
    @param {seed} any The base value
    @return {array} The folded/reduced list

    @example
        var sum = funkyJS.foldWith(function (acc, x) {
            return acc + x;
        });

        sum([1, 2, 3], 0);
        // -> 6

    **/
    api.foldWith = function foldWith (fn, list, seed) {
        if (!type.isFunction(fn)) {
            throw 'foldWith expects fn to be function but saw ' + fn;
        }

        if (list === undefined) {
            return function (list, seed) {
                return foldWith(fn, list, seed);
            }
        }

        if (seed === undefined) {
            return function (seed) {
                return foldWith(fn, list, seed);
            }
        }

        list = type.isSequencial(list) ?
               [].slice.call(list) :
               null;
        if (!type.isArray(list)) {
            throw 'foldWith expects list to be array but saw ' + list;
        }

        return list.reduce(fn, seed);
    }

    /**
    The foldWith function is a more functional style of an array's .reduceRight, as it
        allows to pass in the function first and defer giving the array to iterate
        over. Please note that any function which should be executed in a certain
        context must be bound before being passed

    @method foldRightWith
    @for funkyJS
    @param {function} fn The function to fold with
    @param {array} list The array to iterate over
    @param {seed} any The base value
    @return {array} The folded/reduced list

    @example
        var catRight = funkyJS.foldRightWith(function (acc, x) {
            return acc + x;
        });

        catRight(['hello', 'why', 'there'], '');
        // -> 'therewhyhello'

    **/
    api.foldRightWith = function foldRightWith (fn, list, seed) {
        if (!type.isFunction(fn)) {
            throw 'foldRightWith expects fn to be function but saw ' + fn;
        }

        if (list === undefined) {
            return function (list, seed) {
                return foldRightWith(fn, list, seed);
            }
        }

        if (seed === undefined) {
            return function (seed) {
                return foldRightWith(fn, list, seed);
            }
        }

        list = type.isSequencial(list) ?
               [].slice.call(list) :
               null;
        if (!type.isArray(list)) {
            throw 'foldRightWith expects list to be array but saw ' + list;
        }

        return list.reduceRight(fn, seed);
    }

    /**
    The everyWith function is a more functional style of an array's .every, as it
        allows to pass in the function first and defer giving the array to iterate
        over. Please note that any function which should be executed in a certain
        context must be bound before being passed

    @method everyWith
    @for funkyJS
    @param {function} fn The function to compare with
    @param {array} list The array to iterate over
    @return {boolean} True if every value passes the comparator function

    @example
        var allNumbers = funkyJS.everyWith(funkyJS.isNumber);

        allNumbers([1, 2, 3, 4]);
        // -> true

        allNumbers([1, null, 3, 4]);
        // -> false

    **/
    api.everyWith = function everyWith (fn, list) {
        if (!type.isFunction(fn)) {
            throw 'everyWith expects fn to be function but saw ' + fn;
        }

        if (list === undefined) {
            return function (list) {
                return everyWith(fn, list);
            }
        }

        list = type.isSequencial(list) ?
               [].slice.call(list) :
               null;
        if (!type.isArray(list)) {
            throw 'everyWith expects list to be array but saw ' + list;
        }

        return list.every(fn);
    }

    /**
    The someWith function is a more functional style of an array's .some, as it
        allows to pass in the function first and defer giving the array to iterate
        over. Please note that any function which should be executed in a certain
        context must be bound before being passed

    @method someWith
    @for funkyJS
    @param {function} fn The function to compare with
    @param {array} list The array to iterate over
    @return {boolean} True if some values pass the comparator function

    @example
        var someNumbers = funkyJS.someWith(funkyJS.isNumber);

        someNumbers([1, null, 3, 4]);
        // -> true

        someNumbers([null, '', {}]);
        // -> false

    **/
    api.someWith = function someWith (fn, list) {
        if (!type.isFunction(fn)) {
            throw 'someWith expects fn to be function but saw ' + fn;
        }

        if (list === undefined) {
            return function (list) {
                return someWith(fn, list);
            }
        }

        list = type.isSequencial(list) ?
               [].slice.call(list) :
               null;
        if (!type.isArray(list)) {
            throw 'someWith expects list to be array but saw ' + list;
        }

        return list.some(fn);
    }



    /***
     * EXPORT
     * ======
     */

    return api;

});