/* globals PlaceMap, funkyJS, make */
;(function (f, plugin) {

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
    var deepPluck = f.pipe(f.splat([split('.'), f.identity]), function (args) {
        return args[0].reduce(f.flip(f.pluck), args[1]);
    });



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
    var toFloatPair = f.multiDispatch([{
        // noop, in case everything is alright
        args: [f.isNumber, f.isNumber],
        proc: f.splat([f.identity, f.identity])
    }, {
        // handles lat:lng notation
        args: [f.isString],
        proc: f.splitParse(parseFloat, ':')
    }, {
        // handles objects with lat/lng properties
        args: [f.isObject],
        proc: f.splat([
            f.pipe(f.get('lat'), parseFloat),
            f.pipe(f.get('lng'), parseFloat)
        ])
    }]);

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



    plugin.utils = make({
        uuid: makeUuid,
        deepPluck: deepPluck,
        dataConfig: f.partial(deepPluck, [undefined, plugin.json]),
        pluginConfig: f.constant(plugin.config),
        floatPair: toFloatPair
    });

})(funkyJS, PlaceMap);