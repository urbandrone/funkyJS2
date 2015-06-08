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



    /**
    The trimLeft function allows to remove whitespace from the beginning of a
        string

    @method trimLeft
    @for funkyJS
    @param {string} str The string to trim left
    @return {string} The trimmed string

    @example
        var str = '   a string   ';

        funkyJS.trimLeft(str);
        // -> 'a string   '

    **/
    api.trimLeft = function trimLeft (str) {
        if (type.isNotString(str)) {
            throw new Error('trimLeft expects str to be string but saw ' + str);
        }

        return str.replace(/^\s+/g, '');
    }

    /**
    The trimRight function allows to remove whitespace from the end of a string

    @method trimRight
    @for funkyJS
    @param {string} str The string to trim right
    @return {string} The trimmed string

    @example
        var str = '   a string   ';

        funkyJS.trimRight(str);
        // -> '   a string'

    **/
    api.trimRight = function trimRight (str) {
        if (type.isNotString(str)) {
            throw new Error('trimRight expects str to be string but saw ' + str);
        }

        return str.replace(/\s+$/g, '');
    }

    /**
    The trim function allows to remove whitespace from both sides of a string

    @method trim
    @for funkyJS
    @param {string} str The string to trim
    @return {string} The trimmed string

    @example
        var str = '   a string   ';

        funkyJS.trim(str);
        // -> 'a string'

    **/
    api.trim = function trim (str) {
        if (type.isNotString(str)) {
            throw new Error('trim expects str to be string but saw ' + str);
        }

        return api.trimLeft(api.trimRight(str));
    }

    /**
    The camelize function allows to transform a string from separation by
        dashes and underscores into a camelcased form

    @method camelize
    @for funkyJS
    @param {string} str The string to transform
    @return {string} Formatted string

    @example
        var str = 'string-separated';

        funkyJS.camelize(str);
        // -> 'stringSeparated'

    **/
    api.camelize = function camelize (str) {
        if (type.isNotString(str)) {
            throw new Error('camelize expects str to be string but saw ' + str);
        }

        return str.replace(/-[A-Za-z]|_[A-Za-z]/g, function (match) {
            return match[1].toUpperCase() + match.slice(2).toLowerCase();
        });
    }

    /**
    The dasherize function allows to transform a string from separation by
        uppercase letters and underscores into separations by dashes

    @method dasherize
    @for funkyJS
    @param {string} str The string to transform
    @return {string} Formatted string

    @example
        var str = 'stringSeparated';

        funkyJS.dasherize(str);
        // -> 'string-separated'

    **/
    api.dasherize = function dasherize (str) {
        if (type.isNotString(str)) {
            throw new Error('dasherize expects str to be string but saw ' + str);
        }

        return str.replace(/_[A-Za-z]|[A-Z]/g, function (match) {
            return '-' + (match[0] === '_' ? match.slice(1).toLowerCase() : match.toLowerCase());
        });
    }

    /**
    The underscore function allows to transform a string from separation by
        uppercase letters and dashes into separations by underscores

    @method underscore
    @for funkyJS
    @param {string} str The string to transform
    @return {string} Formatted string

    @example
        var str = 'string-separated';

        funkyJS.underscore(str);
        // -> 'string_separated'

    **/
    api.underscore = function underscore (str) {
        if (type.isNotString(str)) {
            throw new Error('underscore expects str to be string but saw ' + str);
        }

        return str.replace(/-[A-Za-z]|[A-Z]/g, function (match) {
            return '_' + (match[0] === '-' ? match.slice(1).toLowerCase() : match.toLowerCase());
        });
    }

    /**
    The splitParse function allows to split a string on a freely definable
        delimiter and parse the created atoms with a given operation

    @method splitParse
    @for funkyJS
    @param {function} fn The operation to perform after splitting
    @param {string|regexp} delimiter The delimiter to split on
    @param {string} str The string seed
    @return {array} The parsed atoms of the string

    @example
        function toInt (n) {
            return parseInt(n, 10);
        }

        var isoDateToInts = funkyJS.splitParse(toInt, /\s|\-|\:/g);

        isoDateToInts('2015-02-25 06:00:00');
        // -> [2015, 2, 25, 6, 0, 0]

    **/
    api.splitParse = function splitParse (fn, delimiter, str) {
        if (type.isNotFunction(fn)) {
            throw new Error('splitParse expects fn to be function but saw ' + fn);
        }

        if (delimiter === undefined) {
            return function (delimiter, str) {
                return splitParse(fn, delimiter, str);
            }
        }

        if (type.isNotString(delimiter) && type.isNotRegex(delimiter)) {
            throw new Error('splitParse expects delimiter to be string or regexp but saw ' + delimiter);
        }

        if (str === undefined) {
            return function (str) {
                return splitParse(fn, delimiter, str);
            }
        }

        if (type.isNotString(str)) {
            throw new Error('splitParse expects str to be string but saw ' + str);
        }

        return str.split(delimiter).map(fn);
    }

    /**
    Meant to be a basic templating function, the substitude function allows to
        replace parts of a template string with real data at runtime. The parts
        of a template which should be replaced have to be wrapped in placeholders
        in the format: ${key}. The actual data is awaited to be given as a pure
        object (may be JSON as well)

    @method substitude
    @for funkyJS
    @param {string} str The template string
    @param {object} data The data as key-value pairs
    @return {string} The parsed string

    @example
        var tpl = 'This is ${subject} and ${does}.';

        var desc = funkyJS.substitude(tpl);

        desc({subject: 'John Doe', does: 'he codes JavaScript'});
        // -> 'This is John Doe and his computer.'

        desc({subject: 'Steve Smith', does: 'he does nothing'});
        // 'This is Steve Smith and he does nothing.'



        funkyJS.substitude(tpl, {
            subject: 'me',
            does: 'I test substitude'
        });
        // -> 'This is me and I test substitude.'

    **/
    api.substitude = function substitude (str, data) {
        var parsed;

        if (type.isNotString(str)) {
            throw new Error('substitude expects str to be string but saw ' + str);
        }

        if (data === undefined) {
            return function (data) {
                return substitude(str, data);
            }
        }

        if (type.isNotObject(data)) {
            throw new Error('substitude expects data to be object but saw ' + data);
        }

        parsed = str;
        Object.keys(data).forEach(function (key) {
            var ereg = new RegExp('(\\$\\{(' + key + ')\\})+?', 'g');
            parsed = parsed.replace(ereg, function (m) {
                var key = m.slice(2, m.length - 1);
                if (data.hasOwnProperty(key)) {
                    return data[key];
                }
                return '';
            });
        });
        return parsed;
    }



    /***
     * EXPORT
     * ======
     */

    return api;

});