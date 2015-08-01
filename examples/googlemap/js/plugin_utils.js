/* globals PlaceMap, funkyJS, make */
;(function (f, plugin) {

    var CITY_TEMPLATE = null;

    /**
     * plugin utility, we use this to split all kinds of strings
     *
     * @method
     * @private 
     *
     * @param {string|regexp} separator Character(s) on which to split
     * @param {string} string The string to split
     *
     * @return {array} Array of N items
     */
    var split = f.dyadic(function (separator, string) {
        return string.split(separator);
    });



    /**
     * plugin utility, pushes funkyJS.pluck to the next level by allowing to
     *     pass in a "path" into a objects properties
     *
     * @method
     * @private 
     *
     * @param {string} path A chain of properties into a given object
     * @param {object} root The object to pluck into
     *
     * @return {*} Whatever the last property's value is
     */
    var deepPluck = function (path, object) {
        var _path = split('.', path);
        var _level = object;
        while (_path.length > 0 && f.has(_path[0], _level)) {
            _level = _level[_path.shift()];            
        }

        if (_path.length > 0) {
            throw 'deepPluck was not able to finish the work, misses: ' + _path.join(':');
        }

        return _level;
    }



    /**
     * plugin utility, converts various inputs into a array of [float32, float32]
     *     numbers. if passed in to numbers, the numbers are returned as they are.
     *     if passed a string in the form "latitude:longitude" (for example:
     *     "3.234:3.251") the string is split and both numbers are converted into
     *     floating point numbers. if passed in a object, it gets a "lat" and a
     *     "lng" property from the object and converts both into floating point
     *     numbers
     *
     * @method
     * @private
     *
     * @param {number|string|object} inputA See description
     * @param {number} [inputB] See description
     *
     * @return {array} Two floating point numbers
     */
    var toFloatPair = f.splitParse(parseFloat, ':');


    // wicked stuff, do not try to understand. returns a function which produces
    //   a valid level 4 UUID
    //   
    var makeUuid = (function () {
        var chars = [],
            i = 0;

        for (; i<256; i++) {
            chars[i] = (i<16?'0':'')+(i).toString(16);
        }

        return function () {
            var d0 = Math.random()*0xffffffff|0;
            var d1 = Math.random()*0xffffffff|0;
            var d2 = Math.random()*0xffffffff|0;
            var d3 = Math.random()*0xffffffff|0;
            return chars[d0&0xff] +
                chars[d0>>8&0xff] +
                chars[d0>>16&0xff] +
                chars[d0>>24&0xff] + '-' +
                chars[d1&0xff] +
                chars[d1>>8&0xff] + '-' +
                chars[d1>>16&0x0f|0x40] +
                chars[d1>>24&0xff] + '-' +
                chars[d2&0x3f|0x80] +
                chars[d2>>8&0xff] + '-' +
                chars[d2>>16&0xff] +
                chars[d2>>24&0xff]+
                chars[d3&0xff] +
                chars[d3>>8&0xff] +
                chars[d3>>16&0xff] +
                chars[d3>>24&0xff];
        }
    })();





    var toUpper = f.call(String.prototype.toUpperCase);
    var toLower = f.call(String.prototype.toLowerCase);
    var join = f.call(Array.prototype.join);

    var orElse = function (fn, rescue) {
        return f.aritize(fn.length, true)(function () {
            var r = fn.apply(this, arguments);
            if (!!r) {
                return r;
            }
            return rescue.apply(this, arguments);
        });
    }

    var below = f.dyadic(function (n, v) { return n > v; });
    var above = f.dyadic(function (n, v) { return n < v; });

    var between = f.dyadic(function (min, max) {
        return f.and(f.isInt32, above(min), below(max));
    });

    var firstUpper = f.pipe(
        f.splat([f.pipe(f.first, toUpper), f.tail]),
        f.flip(f.call(join, ''))
    );


    /*
    Translates the configuration settings according to the translationTable argument
        provided. To see a translation table, take a look at the file plugin_map.js
    */
    var translateConfig = f.dyadic(function (translationTable, configs) {
        return f.keys(translationTable).reduce(function (acc, key) {
            var transform = f.pipe.apply(null, translationTable[key].transforms);
            acc[translationTable[key].prop] = transform(deepPluck(key, configs));

            return acc;
        }, {});
    });

    var getTemplate = f.pipe(f.first, f.get('innerHTML'), f.trim, f.substitude);

    plugin.utils = make({
        upper: toUpper,
        lower: toLower,
        firstUpper: firstUpper,
        ifThenElse: orElse,
        below: below,
        above: above,
        between: between,
        translateConfig: translateConfig,
        uuid: makeUuid,
        deepPluck: deepPluck,
        dataConfig: f.partial(deepPluck, [undefined, plugin.json]),
        domConfig: f.partial(deepPluck, [undefined, plugin.dom]),
        pluginConfig: f.constant(plugin.config),
        floatPair: toFloatPair,
        getTemplateFn: getTemplate
    });

})(funkyJS, PlaceMap);