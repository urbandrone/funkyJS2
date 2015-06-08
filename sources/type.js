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
        if (arguments.length < 1) {
            return is;
        }

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
        if (arguments.length < 1) {
            return isNull;
        }

        return x === null;
    }

    /**
    The isNotNull function takes in a value and checks if it is not null

    @method isNotNull
    @for funkyJS
    @param {any} x Value to check against
    @return {boolean} True if x is not null, false otherwise

    @example
        funkyJS.isNotNull(null);
        // -> false

        funkyJS.isNotNull(undefined);
        // -> true

        funkyJS.isNotNull(0);
        // -> true

    **/
    api.isNotNull = function isNotNull (x) {
        if (arguments.length < 1) {
            return isNotNull;
        }

        return x !== null;
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
        if (arguments.length < 1) {
            return isVoid;
        }

        return x === undefined;
    }

    /**
    The isNotVoid function takes in a value and checks if it is not undefined

    @method isNotVoid
    @for funkyJS
    @param {any} x Value to check against
    @return {boolean} True if x is not undefined, false otherwise

    @example
        funkyJS.isNotVoid(undefined);
        // -> false

        funkyJS.isNotVoid(null);
        // -> true

        funkyJS.isNotVoid(0);
        // -> true

    **/
    api.isNotVoid = function isNotVoid (x) {
        if (arguments.length < 1) {
            return isNotVoid;
        }

        return x !== undefined;
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
        if (arguments.length < 1) {
            return isNil;
        }

        return x == null;
    }

    /**
    The isNotNil function takes in a value and checks if it is not null or undefined

    @method isNotNil
    @for funkyJS
    @param {any} x Value to check against
    @return {boolean} True if x is not null or undefined, false otherwise

    @example
        funkyJS.isNotNil(0);
        // -> true

        funkyJS.isNotNil(null);
        // -> false

        funkyJS.isNotNil(undefined);
        // -> false

    **/
    api.isNotNil = function isNotNil (x) {
        if (arguments.length < 1) {
            return isNotNil;
        }

        return !api.isNil(x);
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
        if (arguments.length < 1) {
            return isBool;
        }

        return typeof x === 'boolean';
    }

    /**
    The isNotBool function takes in a value and checks if it is not a boolean

    @method isNotBool
    @for funkyJS
    @param {any} x Value to check against
    @return {boolean} True if x is not a boolean, false otherwise

    @example
        funkyJS.isNotBool(0);
        // -> true

        funkyJS.isNotBool('false');
        // -> true

        funkyJS.isNotBool(true);
        // -> false

    **/
    api.isNotBool = function isNotBool (x) {
        if (arguments.length < 1) {
            return isNotBool;
        }

        return !api.isBool(x);
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
        if (arguments.length < 1) {
            return isString;
        }

        return typeof x === 'string';
    }

    /**
    The isNotString function takes in a value and checks if it is not a string

    @method isNotString
    @for funkyJS
    @param {any} x Value to check against
    @return {boolean} True if x is not a string, false otherwise

    @example
        funkyJS.isNotString(0);
        // -> true

        funkyJS.isNotString(undefined);
        // -> true

        funkyJS.isNotString('string');
        // -> false

    **/
    api.isNotString = function isNotString (x) {
        if (arguments.length < 1) {
            return isNotString;
        }

        return !api.isString(x);
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
        if (arguments.length < 1) {
            return isNumber;
        }

        return typeof x === 'number' && !isNaN(x) && isFinite(x);
    }

    /**
    The isNotNumber function takes in a value and checks if it is not a number

    @method isNotNumber
    @for funkyJS
    @param {any} x Value to check against
    @return {boolean} True if x is not a number, false otherwise

    @example
        funkyJS.isNotNumber(0);
        // -> false

        funkyJS.isNotNumber(NaN);
        // -> true

    **/
    api.isNotNumber = function isNotNumber (x) {
        if (arguments.length < 1) {
            return isNotNumber;
        }

        return !api.isNumber(x);
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
        if (arguments.length < 1) {
            return isInt32;
        }

        return api.isNumber(x) && x % 1 === 0;
    }

    /**
    The isNotInt32 function takes in a value and checks if it is not a integer

    @method isNotInt32
    @for funkyJS
    @param {any} x Value to check against
    @return {boolean} True if x is not a integer, false otherwise

    @example
        funkyJS.isNotInt32(1);
        // -> false

        funkyJS.isNotInt32(1.5);
        // -> true

    **/
    api.isNotInt32 = function isNotInt32 (x) {
        if (arguments.length < 1) {
            return isNotInt32;
        }

        return !api.isInt32(x);
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
        if (arguments.length < 1) {
            return isFloat32;
        }

        return api.isNumber(x) && x % 1 !== 0;
    }

    /**
    The isNotFloat32 function takes in a value and checks if it is not a floating point number

    @method isNotFloat32
    @for funkyJS
    @param {any} x Value to check against
    @return {boolean} True if x is not a floating point number, false otherwise

    @example
        funkyJS.isNotFloat32(1.5);
        // -> false

        funkyJS.isNotFloat32(1);
        // -> true

    **/
    api.isNotFloat32 = function isNotFloat32 (x) {
        if (arguments.length < 1) {
            return isNotFloat32;
        }

        return !api.isFloat32(x);
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
        if (arguments.length < 1) {
            return isFunction;
        }

        return typeof x === 'function';
    }

    /**
    The isNotFunction function takes in a value and checks if it is not a function

    @method isNotFunction
    @for funkyJS
    @param {any} x Value to check against
    @return {boolean} True if x is not a function, false otherwise

    @example
        funkyJS.isNotFunction(function () {});
        // -> false

        funkyJS.isNotFunction('function');
        // -> true

    **/
    api.isNotFunction = function isNotFunction (x) {
        if (arguments.length < 1) {
            return isNotFunction;
        }

        return !api.isFunction(x);
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
        if (arguments.length < 1) {
            return isArray;
        }

        return Array.isArray(x);
    }

    /**
    The isNotArray function takes in a value and checks if it is not a array

    @method isNotArray
    @for funkyJS
    @param {any} x Value to check against
    @return {boolean} True if x is not a array, false otherwise

    @example
        funkyJS.isNotArray([]);
        // -> false

        funkyJS.isNotArray({});
        // -> true

    **/
    api.isNotArray = function isNotArray (x) {
        if (arguments.length < 1) {
            return isNotArray;
        }

        return !Array.isArray(x);
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
        if (arguments.length < 1) {
            return isObject;
        }

        return api.is('object', x);
    }

    /**
    The isNotObject function takes in a value and checks if it is not a object

    @method isNotObject
    @for funkyJS
    @param {any} x Value to check against
    @return {boolean} True if x is not a object, false otherwise

    @example
        funkyJS.isNotObject({});
        // -> false

        funkyJS.isNotObject([]);
        // -> true

    **/
    api.isNotObject = function isNotObject (x) {
        if (arguments.length < 1) {
            return isNotObject;
        }

        return !api.isObject(x);
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
        if (arguments.length < 1) {
            return isDate;
        }

        return api.is('date', x);
    }

    /**
    The isNotDate function takes in a value and checks if it is not a Date() instance

    @method isNotDate
    @for funkyJS
    @param {any} x Value to check against
    @return {boolean} True if x is not a Date() instance, false otherwise

    @example
        funkyJS.isNotDate(new Date());
        // -> false

        funkyJS.isNotDate('2014-01-01');
        // -> true

    **/
    api.isNotDate = function isNotDate (x) {
        if (arguments.length < 1) {
            return isNotDate;
        }

        return !api.isDate(x);
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
        if (arguments.length < 1) {
            return isRegex;
        }

        return api.is('regexp', x);
    }

    /**
    The isNotRegex function takes in a value and checks if it is not a regular expression

    @method isNotRegex
    @for funkyJS
    @param {any} x Value to check against
    @return {boolean} True if x is not a regular expression, false otherwise

    @example
        funkyJS.isNotRegex(/.+/);
        // -> false

        funkyJS.isNotRegex(' ');
        // -> true

    **/
    api.isNotRegex = function isNotRegex (x) {
        if (arguments.length < 1) {
            return isNotRegex;
        }

        return !api.isRegex(x);
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
        if (arguments.length < 1) {
            return isNode;
        }

        return api.isNotNil(x) && api.isInt32(x.nodeType);
    }

    /**
    The isNotNode function takes in a value and checks if it is not a DOM-Node

    @method isNotNode
    @for funkyJS
    @param {any} x Value to check against
    @return {boolean} True if x is not a DOM-Node, false otherwise

    @example
        funkyJS.isNotNode(document.createElement('div'));
        // -> false

        funkyJS.isNotNode('<div></div>');
        // -> true

    **/
    api.isNotNode = function isNotNode (x) {
        if (arguments.length < 1) {
            return isNotNode;
        }

        return !api.isNode(x);
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
        if (arguments.length < 1) {
            return isNodeList;
        }

        return (/^((\[object\s)(html(options)?collection|nodelist)(\]))$/).test(toStr(x));
    }

    /**
    The isNotNodeList function takes in a value and checks if it is not a list of DOM-Nodes

    @method isNotNodeList
    @for funkyJS
    @param {any} x Value to check against
    @return {boolean} True if x is not a list of DOM-Nodes, false otherwise

    @example
        funkyJS.isNotNodeList(document.querySelectorAll('div'));
        // -> false

        funkyJS.isNotNodeList([]);
        // -> true

    **/
    api.isNotNodeList = function isNotNodeList (x) {
        if (arguments.length < 1) {
            return isNotNodeList;
        }

        return !api.isNodeList(x);
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
        if (arguments.length < 1) {
            return isSequencial;
        }

        return api.isNotNil(x) &&
               api.isInt32(x.length) &&
               api.isNotFunction(x) &&
               api.isNotObject(x);
    }

    /**
    The isNotSequencial function takes in a value and checks if it is not a
        sequencial enumerable. A enumerable is not considered sequencial, if it
        fails in any of the following tests:
        1) Is not null or undefined AND
        2) Has a length property with int32 value AND
        3) Is not a function AND
        4) Is not a object

    @method isNotSequencial
    @for funkyJS
    @param {any} x Value to check against
    @return {boolean} True if x is not a sequencial enumerable, false otherwise

    @example
        funkyJS.isNotSequencial(document.querySelectorAll('div'));
        // -> false

    **/
    api.isNotSequencial = function isNotSequencial (x) {
        if (arguments.length < 1) {
            return isNotSequencial;
        }

        return !api.isSequencial(x);
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
        if (arguments.length < 1) {
            return isEnumerable;
        }

        return api.isObject(x) || api.isSequencial(x);
    }

    /**
    The isNotEnumerable function takes in a value and checks if it is not a enumerable.
        A value is not considered enumerable if it fails in any of the following
        tests:
        1) Is object
        OR
        1) Is not null or undefined AND
        2) Has a length property with int32 value AND
        3) Is not a function AND
        4) Is not a object


    @method isNotEnumerable
    @for funkyJS
    @param {any} x Value to check against
    @return {boolean} True if x is not a enumerable, false otherwise

    @example
        funkyJS.isNotEnumerable(document.querySelectorAll('div'));
        // -> false

    **/
    api.isNotEnumerable = function isNotEnumerable (x) {
        if (arguments.length < 1) {
            return isNotEnumerable;
        }

        return !api.isEnumerable(x);
    }



    return api;

});