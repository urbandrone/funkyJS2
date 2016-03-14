;(function (global, factory) {
    var ext,
        it;

    if (typeof define === 'function' && define.amd) {
        define(factory);

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
    @module type
    **/
    var api = {};




    // INTERNAL UTILS
    // ==============
    var toStr = function (x) {
        return Object.prototype.toString.call(x).toLowerCase();
    }





    /**
    The is function takes in the name of any internal [[Class]] and a value and
        checks if the internal [[Class]] of the given value matches the given
        name

    @method is
    @for funkyJS
    @param {string} cls Name of the internal [[Class]]
    @param {any} x The value
    @return {boolean} True on match, false otherwise

    @example
        var aString = 'string';
        var aArray = [];

        typeof aString === 'string';
        // -> true

        typeof aArray === 'array';
        // -> false

        funkyJS.is('string', aString);
        // -> true

        funkyJS.is('array', aArray);
        // -> true

        var isArray = funkyJS.is('array');

        isArray(aArray);
        // -> true

    **/
    api.is = function is (cls, x) {
        if (arguments.length < 2) {
            return function (x) {
                return is(cls, x);
            }
        }

        return toStr(x) === '[object ' + cls + ']';
    }

    /**
    The isNull function takes in a value and checks if it is null

    @method isNull
    @for funkyJS
    @param {any} x Value to check against
    @return {boolean} True if x is null, false otherwise

    @example
        funkyJS.isNull(null);
        // -> true

        funkyJS.isNull(undefined);
        // -> false

        funkyJS.isNull(0);
        // -> false

    **/
    api.isNull = function isNull (x) {
        return x === null;
    }

    /**
    The isVoid function takes in a value and checks if it is undefined

    @method isVoid
    @for funkyJS
    @param {any} x Value to check against
    @return {boolean} True if x is undefined, false otherwise

    @example
        funkyJS.isVoid(undefined);
        // -> true

        funkyJS.isVoid(null);
        // -> false

        funkyJS.isVoid(0);
        // -> false

    **/
    api.isVoid = function isVoid (x) {
        return x === undefined;
    }

    /**
    The isNil function takes in a value and checks if it is null or undefined

    @method isNil
    @for funkyJS
    @param {any} x Value to check against
    @return {boolean} True if x is null or undefined, false otherwise

    @example
        funkyJS.isNil(null);
        // -> true

        funkyJS.isNil(undefined);
        // -> true

        funkyJS.isNil(0);
        // -> false

    **/
    api.isNil = function isNil (x) {
        return x == null;
    }

    /**
    The isBool function takes in a value and checks if it is a boolean

    @method isBool
    @for funkyJS
    @param {any} x Value to check against
    @return {boolean} True if x is a boolean, false otherwise

    @example
        funkyJS.isBool(false);
        // -> true

        funkyJS.isBool('true');
        // -> false

        funkyJS.isBool(0);
        // -> false

    **/
    api.isBool = function isBool (x) {
        return typeof x === 'boolean';
    }

    /**
    The isString function takes in a value and checks if it is a string

    @method isString
    @for funkyJS
    @param {any} x Value to check against
    @return {boolean} True if x is a string, false otherwise

    @example
        funkyJS.isString('string');
        // -> true

        funkyJS.isString(undefined);
        // -> false

        funkyJS.isString(0);
        // -> false

    **/
    api.isString = function isString (x) {
        return typeof x === 'string';
    }

    /**
    The isNumber function takes in a value and checks if it is a number (not NaN
        and finite)

    @method isNumber
    @for funkyJS
    @param {any} x Value to check against
    @return {boolean} True if x is a number, false otherwise

    @example
        funkyJS.isNumber(0);
        // -> true

        funkyJS.isNumber(NaN);
        // -> false

    **/
    api.isNumber = function isNumber (x) {
        return typeof x === 'number' && !isNaN(x) && isFinite(x);
    }

    /**
    The isInt32 function takes in a value and checks if it is a integer

    @method isInt32
    @for funkyJS
    @param {any} x Value to check against
    @return {boolean} True if x is a integer, false otherwise

    @example
        funkyJS.isInt32(1);
        // -> true

        funkyJS.isInt32(1.5);
        // -> false

    **/
    api.isInt32 = function isInt32 (x) {
        return api.isNumber(x) && x % 1 === 0 || api.isNumber(x) && x === 1;
    }

    /**
    The isFloat32 function takes in a value and checks if it is a floating point number

    @method isFloat32
    @for funkyJS
    @param {any} x Value to check against
    @return {boolean} True if x is a floating point number, false otherwise

    @example
        funkyJS.isFloat32(1.5);
        // -> true

        funkyJS.isFloat32(1);
        // -> false

    **/
    api.isFloat32 = function isFloat32 (x) {
        return api.isNumber(x) && x % 1 !== 0;
    }

    /**
    The isFunction function takes in a value and checks if it is a function

    @method isFunction
    @for funkyJS
    @param {any} x Value to check against
    @return {boolean} True if x is a function, false otherwise

    @example
        funkyJS.isFunction(function () {});
        // -> true

        funkyJS.isFunction('function');
        // -> false

    **/
    api.isFunction = function isFunction (x) {
        return typeof x === 'function';
    }

    /**
    The isArray function takes in a value and checks if it is a array

    @method isArray
    @for funkyJS
    @param {any} x Value to check against
    @return {boolean} True if x is a array, false otherwise

    @example
        funkyJS.isArray([]);
        // -> true

        funkyJS.isArray({});
        // -> false

    **/
    api.isArray = function isArray (x) {
        return Array.isArray(x);
    }

    /**
    The isObject function takes in a value and checks if it is a object

    @method isObject
    @for funkyJS
    @param {any} x Value to check against
    @return {boolean} True if x is a object, false otherwise

    @example
        funkyJS.isObject({});
        // -> true

        funkyJS.isObject([]);
        // -> false

    **/
    api.isObject = function isObject (x) {
        return api.is('object', x);
    }

    /**
    The isDate function takes in a value and checks if it is a Date() instance

    @method isDate
    @for funkyJS
    @param {any} x Value to check against
    @return {boolean} True if x is a Date() instance, false otherwise

    @example
        funkyJS.isDate(new Date());
        // -> true

        funkyJS.isDate('2014-01-01');
        // -> false

    **/
    api.isDate = function isDate (x) {
        return api.is('date', x);
    }

    /**
    The isRegex function takes in a value and checks if it is a regular expression

    @method isRegex
    @for funkyJS
    @param {any} x Value to check against
    @return {boolean} True if x is a regular expression, false otherwise

    @example
        funkyJS.isRegex(/.+/);
        // -> true

        funkyJS.isRegex(' ');
        // -> false

    **/
    api.isRegex = function isRegex (x) {
        return api.is('regexp', x);
    }

    /**
    The isNode function takes in a value and checks if it is a DOM-Node

    @method isNode
    @for funkyJS
    @param {any} x Value to check against
    @return {boolean} True if x is a DOM-Node, false otherwise

    @example
        funkyJS.isNode(document.createElement('div'));
        // -> true

        funkyJS.isNode('<div></div>');
        // -> false

    **/
    api.isNode = function isNode (x) {
        return !api.isNil(x) && api.isInt32(x.nodeType);
    }

    /**
    The isNodeList function takes in a value and checks if it is a list of DOM-Nodes

    @method isNodeList
    @for funkyJS
    @param {any} x Value to check against
    @return {boolean} True if x is a list of DOM-Nodes, false otherwise

    @example
        funkyJS.isNodeList(document.querySelectorAll('div'));
        // -> true

        funkyJS.isNodeList([]);
        // -> false

    **/
    api.isNodeList = function isNodeList (x) {
        return (/^((\[object\s)(html(options)?collection|nodelist)(\]))$/).test(toStr(x));
    }

    /**
    The isSequencial function takes in a value and checks if it is a sequencial
        enumerable. A enumerable is considered sequencial, if it validates against
        the following tests:
        1) Is not null or undefined AND
        2) Has a length property with int32 value AND
        3) Is not a function AND
        4) Is not a object

    @method isSequencial
    @for funkyJS
    @param {any} x Value to check against
    @return {boolean} True if x is a sequencial enumerable, false otherwise

    @example
        funkyJS.isSequencial(document.querySelectorAll('div'));
        // -> true

    **/
    api.isSequencial = function isSequencial (x) {
        return !api.isNil(x) &&
               api.isInt32(x.length) &&
               !api.isFunction(x) &&
               !api.isObject(x);
    }

    /**
    The isEnumerable function takes in a value and checks if it is a enumerable.
        A enumerable must validate against the following tests:
        1) Is object
        OR
        1) Is not null or undefined AND
        2) Has a length property with int32 value AND
        3) Is not a function AND
        4) Is not a object

    @method isEnumerable
    @for funkyJS
    @param {any} x Value to check against
    @return {boolean} True if x is a enumerable, false otherwise

    @example
        funkyJS.isEnumerable(document.querySelectorAll('div'));
        // -> true

    **/
    api.isEnumerable = function isEnumerable (x) {
        return api.isObject(x) || api.isSequencial(x);
    }

    /*
    The isIterator function takes a value and checks if it conforms (loosely) to
        the @@iterator prototcol or (at least) has a `next` method. For ES2015
        use, the function checks if `Symbol` and `Symbol.iterator` are defined
        and used on the value.

    @method isIterator
    @for funkyJS
    @param {any} x Value to check against
    @return {boolean} True if x is a iterator, false otherwise

    @example
        funkyJS.isIterator({
            next: function () {
                return {done: false, value: 1};
            }
        });
        // -> true

    */
    api.isIterator = function isIterator (x) {
        if (x) {
            /* jshint undef: false */
            if (typeof Symbol === 'function' && Symbol.iterator != null) {
                // note: this is a future-safe check for ES2015 environments,
                //       but the entity we're dealing with may be defined in
                //       ES5 environment, so do not simply stop here and return
                //       false if the entity does not have Symbol.iterator!
                if (x[Symbol.iterator]) {
                    return true;
                }
            }
            /* jshint undef: true */

            if (api.isFunction(x['@@iterator']) && api.isFunction(x.next)) {
                return x['@@iterator']() === x;
            }

            return api.isFunction(x.next);
        }
        return false;
    }
    



    return api;

});