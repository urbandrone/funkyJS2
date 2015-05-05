;(function (global, factory) {
    var ext,
        it;

    if (typeof define === 'function' && define.amd) {
        define([
            '../type'
        ], factory);

    } else if (typeof exports === 'object') {
        module.exports = factory(
            require('../type')
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



    // internal utility
    function enforce (type, comparator) {
        return function (arg) {
            if (!comparator(arg)) {
                throw new TypeError('enforce(:arg, :type) :: ' + arg + 'is not of type ' + type);
            }
            return arg;
        }
    }



    /**
    The beNil function allows only null or undefined values to pass

    @method beNil
    @for funkyJS
    @param {any} value The value to check
    @return {null|undefined} No others pass

    @example
        funkyJS.beNil(null);
        // -> null

        funkyJS.beNil(undefined);
        // -> undefined

        funkyJS.beNil(1);
        // -> Error

    **/
    api.beNil = enforce('null or undefined', type.isNil);

    /**
    The beNull function allows only null values to pass

    @method beNull
    @for funkyJS
    @param {any} value The value to check
    @return {null} No others pass

    @example
        funkyJS.beNull(null);
        // -> null

        funkyJS.beNull(undefined);
        // -> Error

    **/
    api.beNull = enforce('null', type.isNull);

    /**
    The beVoid function allows only undefined values to pass

    @method beVoid
    @for funkyJS
    @param {any} value The value to check
    @return {undefined} No others pass

    @example
        funkyJS.beVoid(undefined);
        // -> undefined

        funkyJS.beVoid(null);
        // -> Error

    **/
    api.beVoid = enforce('undefined', type.isVoid);

    /**
    The beString function allows only strings to pass

    @method beString
    @for funkyJS
    @param {any} value The value to check
    @return {string} No others pass

    @example
        funkyJS.beString('a string');
        // -> 'a string'

        funkyJS.beString(undefined);
        // -> Error

    **/
    api.beString = enforce('string', type.isString);

    /**
    The beBool function allows only boolean values to pass

    @method beBool
    @for funkyJS
    @param {any} value The value to check
    @return {boolean} No others pass

    @example
        funkyJS.beBool(true);
        // -> true

        funkyJS.beBool(undefined);
        // -> Error

    **/
    api.beBool = enforce('boolean', type.isBool);

    /**
    The beNumber function allows only number values to pass

    @method beNumber
    @for funkyJS
    @param {any} value The value to check
    @return {number} No others pass

    @example
        funkyJS.beNumber(2);
        // -> 2

        funkyJS.beNumber(undefined);
        // -> Error

    **/
    api.beNumber = enforce('int32 or float32', type.isNumber);

    /**
    The beInt32 function allows only integer values to pass

    @method beInt32
    @for funkyJS
    @param {any} value The value to check
    @return {int32} No others pass

    @example
        funkyJS.beInt32(2);
        // -> 2

        funkyJS.beInt32(2.5);
        // -> Error

    **/
    api.beInt32 = enforce('int32', type.isInt32);

    /**
    The beFloat32 function allows only floating point number values to pass

    @method beFloat32
    @for funkyJS
    @param {any} value The value to check
    @return {float} No others pass

    @example
        funkyJS.beFloat32(2.5);
        // -> 2.5

        funkyJS.beFloat32(2);
        // -> Error

    **/
    api.beFloat32 = enforce('float32', type.isFloat32);

    /**
    The beFunction function allows only function values to pass

    @method beFunction
    @for funkyJS
    @param {any} value The value to check
    @return {function} No others pass

    @example
        funkyJS.beFunction(function (a) { return a; });
        // -> function (a) { return a; }

        funkyJS.beFunction(undefined);
        // -> Error

    **/
    api.beFunction = enforce('function', type.isFunction);

    /**
    The beArray function allows only array values to pass

    @method beArray
    @for funkyJS
    @param {any} value The value to check
    @return {array} No others pass

    @example
        funkyJS.beArray([]);
        // -> []

        funkyJS.beArray({});
        // -> Error

    **/
    api.beArray = enforce('array', type.isArray);

    /**
    The beObject function allows only object values to pass

    @method beObject
    @for funkyJS
    @param {any} value The value to check
    @return {object} No others pass

    @example
        funkyJS.beObject({});
        // -> {}

        funkyJS.beObject([]);
        // -> Error

    **/
    api.beObject = enforce('object', type.isObject);

    /**
    The beDate function allows only date values to pass

    @method beDate
    @for funkyJS
    @param {any} value The value to check
    @return {date} No others pass

    @example
        funkyJS.beDate(new Date(2015, 2, 25));
        // -> Date(2015-2-25 00:00:00)

        funkyJS.beDate({});
        // -> Error

    **/
    api.beDate = enforce('date', type.isDate);

    /**
    The beRegex function allows only regular expression values to pass

    @method beRegex
    @for funkyJS
    @param {any} value The value to check
    @return {regular expression} No others pass

    @example
        funkyJS.beRegex(new RegExp('.*', 'g'));
        // -> RegExp

        funkyJS.beRegex('.*');
        // -> Error

    **/
    api.beRegex = enforce('regexp', type.isRegex);

    /**
    The beNode function allows only DOMNode values to pass

    @method beNode
    @for funkyJS
    @param {any} value The value to check
    @return {DOMNode} No others pass

    @example
        funkyJS.beNode(document.body);
        // -> <body>

        funkyJS.beNode(null);
        // -> Error

    **/
    api.beNode = enforce('DOMNode', type.isNode);

    /**
    The beNodeList function allows only DOMNodeList values to pass

    @method beNodeList
    @for funkyJS
    @param {any} value The value to check
    @return {DOMNodeList} No others pass

    @example
        funkyJS.beNodeList(document.querySelectorAll('div'));
        // -> DOMNodeList

        funkyJS.beNodeList([]);
        // -> Error

    **/
    api.beNodeList = enforce('DOMNodeList', type.isNodeList);

    /**
    The beSequencial function allows only sequencial values to pass. For a description
        of when a value is considered sequencial, please see the isSequencial
        function

    @method beSequencial
    @for funkyJS
    @param {any} value The value to check
    @return {sequencial} No others pass

    @example
        funkyJS.beSequencial('abc');
        // -> 'abc'

        funkyJS.beSequencial(undefined);
        // -> Error

    **/
    api.beSequencial = enforce('sequencial', type.isSequencial);

    /**
    The beEnumerable function allows only enumerable values to pass. For a description
        of when a value is considered enumerable, please see the isEnumerable
        function

    @method beEnumerable
    @for funkyJS
    @param {any} value The value to check
    @return {enumerable} No others pass

    @example
        funkyJS.beEnumerable({});
        // -> {}

        funkyJS.beEnumerable(undefined);
        // -> Error

    **/
    api.beEnumerable = enforce('enumerable', type.isEnumerable);



    /***
     * EXPORT
     * ======
     */

    return api;

});