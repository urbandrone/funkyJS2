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



    function enforce (type, comparator) {
        return function (value) {
            if (!comparator(value)) {
                throw new TypeError('given value ' + value + 'is not of type ' + type);
            }
            return value;
        }
    }



    /**
    The onlyNil function allows only null or undefined values to pass

    @method onlyNil
    @for funkyJS
    @param {any} value The value to check
    @return {null|undefined} No others pass

    @example
        funkyJS.onlyNil(null);
        // -> null

        funkyJS.onlyNil(undefined);
        // -> undefined

        funkyJS.onlyNil(1);
        // -> Error

    **/
    api.onlyNil = enforce('null or undefined', type.isNil);

    /**
    The onlyNull function allows only null values to pass

    @method onlyNull
    @for funkyJS
    @param {any} value The value to check
    @return {null} No others pass

    @example
        funkyJS.onlyNull(null);
        // -> null

        funkyJS.onlyNull(undefined);
        // -> Error

    **/
    api.onlyNull = enforce('null', type.isNull);

    /**
    The onlyVoid function allows only undefined values to pass

    @method onlyVoid
    @for funkyJS
    @param {any} value The value to check
    @return {undefined} No others pass

    @example
        funkyJS.onlyVoid(undefined);
        // -> undefined

        funkyJS.onlyVoid(null);
        // -> Error

    **/
    api.onlyVoid = enforce('undefined', type.isVoid);

    /**
    The onlyString function allows only strings to pass

    @method onlyString
    @for funkyJS
    @param {any} value The value to check
    @return {string} No others pass

    @example
        funkyJS.onlyString('a string');
        // -> 'a string'

        funkyJS.onlyString(undefined);
        // -> Error

    **/
    api.onlyString = enforce('string', type.isString);

    /**
    The onlyNull function allows only null values to pass

    @method onlyNull
    @for funkyJS
    @param {any} value The value to check
    @return {null} No others pass

    @example
        funkyJS.onlyNull(null);
        // -> null

        funkyJS.onlyNull(undefined);
        // -> Error

    **/
    api.onlyBool = enforce('boolean', type.isBool);

    /**
    The onlyNull function allows only null values to pass

    @method onlyNull
    @for funkyJS
    @param {any} value The value to check
    @return {null} No others pass

    @example
        funkyJS.onlyNull(null);
        // -> null

        funkyJS.onlyNull(undefined);
        // -> Error

    **/
    api.onlyNumber = enforce('int32 or float32', type.isNumber);

    /**
    The onlyNull function allows only null values to pass

    @method onlyNull
    @for funkyJS
    @param {any} value The value to check
    @return {null} No others pass

    @example
        funkyJS.onlyNull(null);
        // -> null

        funkyJS.onlyNull(undefined);
        // -> Error

    **/
    api.onlyInt32 = enforce('int32', type.isInt32);

    /**
    The onlyNull function allows only null values to pass

    @method onlyNull
    @for funkyJS
    @param {any} value The value to check
    @return {null} No others pass

    @example
        funkyJS.onlyNull(null);
        // -> null

        funkyJS.onlyNull(undefined);
        // -> Error

    **/
    api.onlyFloat32 = enforce('float32', type.isFloat32);

    /**
    The onlyNull function allows only null values to pass

    @method onlyNull
    @for funkyJS
    @param {any} value The value to check
    @return {null} No others pass

    @example
        funkyJS.onlyNull(null);
        // -> null

        funkyJS.onlyNull(undefined);
        // -> Error

    **/
    api.onlyFunction = enforce('function', type.isFunction);

    /**
    The onlyNull function allows only null values to pass

    @method onlyNull
    @for funkyJS
    @param {any} value The value to check
    @return {null} No others pass

    @example
        funkyJS.onlyNull(null);
        // -> null

        funkyJS.onlyNull(undefined);
        // -> Error

    **/
    api.onlyArray = enforce('array', type.isArray);

    /**
    The onlyNull function allows only null values to pass

    @method onlyNull
    @for funkyJS
    @param {any} value The value to check
    @return {null} No others pass

    @example
        funkyJS.onlyNull(null);
        // -> null

        funkyJS.onlyNull(undefined);
        // -> Error

    **/
    api.onlyObject = enforce('object', type.isObject);

    /**
    The onlyNull function allows only null values to pass

    @method onlyNull
    @for funkyJS
    @param {any} value The value to check
    @return {null} No others pass

    @example
        funkyJS.onlyNull(null);
        // -> null

        funkyJS.onlyNull(undefined);
        // -> Error

    **/
    api.onlyDate = enforce('date', type.isDate);

    /**
    The onlyNull function allows only null values to pass

    @method onlyNull
    @for funkyJS
    @param {any} value The value to check
    @return {null} No others pass

    @example
        funkyJS.onlyNull(null);
        // -> null

        funkyJS.onlyNull(undefined);
        // -> Error

    **/
    api.onlyRegex = enforce('regexp', type.isRegex);

    /**
    The onlyNull function allows only null values to pass

    @method onlyNull
    @for funkyJS
    @param {any} value The value to check
    @return {null} No others pass

    @example
        funkyJS.onlyNull(null);
        // -> null

        funkyJS.onlyNull(undefined);
        // -> Error

    **/
    api.onlyNode = enforce('DOMNode', type.isNode);

    /**
    The onlyNull function allows only null values to pass

    @method onlyNull
    @for funkyJS
    @param {any} value The value to check
    @return {null} No others pass

    @example
        funkyJS.onlyNull(null);
        // -> null

        funkyJS.onlyNull(undefined);
        // -> Error

    **/
    api.onlyNodeList = enforce('DOMNodeList', type.isNodeList);

    /**
    The onlyNull function allows only null values to pass

    @method onlyNull
    @for funkyJS
    @param {any} value The value to check
    @return {null} No others pass

    @example
        funkyJS.onlyNull(null);
        // -> null

        funkyJS.onlyNull(undefined);
        // -> Error

    **/
    api.onlySequencial = enforce('sequencial', type.isSequencial);

    /**
    The onlyNull function allows only null values to pass

    @method onlyNull
    @for funkyJS
    @param {any} value The value to check
    @return {null} No others pass

    @example
        funkyJS.onlyNull(null);
        // -> null

        funkyJS.onlyNull(undefined);
        // -> Error

    **/
    api.onlyEnumerable = enforce('enumerable', type.isEnumberable);



    /***
     * EXPORT
     * ======
     */

    return api;

});