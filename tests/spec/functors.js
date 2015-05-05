/* global describe, it, expect, funkyJS */
describe('funkyJS Functors Extension Module', function () {

    it('testing forEachWith :: f -> f, a', function () {
        var _f = funkyJS.forEachWith(function (v) { _r += v; }),
            _r = null;

        _f([1, 2, 3]);
        expect(_r).toBe(6);
    });

    it('testing mapWith :: f -> f, a -> a', function () {
        var _f = funkyJS.mapWith(funkyJS.monadic(parseInt));
        expect(_f(['1', '2', '3'])).toEqual([1, 2, 3]);
    });

    it('testing filterWith :: f -> f, a -> a', function () {
        var _f = funkyJS.filterWith(function (v) { return v % 2 === 0; });
        expect(_f([1, 2, 3, 4])).toEqual([2, 4]);
    });

    it('testing foldWith :: f -> f, a, * -> *', function () {
        var _f = funkyJS.foldWith(function (a, b) { return a + b; });
        expect(_f(['a', 'b', 'c'], '')).toBe('abc');
        expect(_f([1, 2, 3], 0)).toBe(6);
    });

    it('testing foldRightWith :: f -> f, a, * -> *', function () {
        var _f = funkyJS.foldRightWith(function (a, b) { return a + b; });
        expect(_f(['a', 'b', 'c'], '')).toBe('cba');
        expect(_f([1, 2, 3], 0)).toBe(6);
    });

    it('testing someWith :: f -> f, a -> b', function () {
        var _f = funkyJS.someWith(funkyJS.isString);
        expect(_f(['a', 'b', 'c'])).toBe(true);
        expect(_f(['a', null, 'c'])).toBe(true);
        expect(_f([1, 2, 3])).toBe(false);
    });

    it('testing everyWith :: f -> f, a -> b', function () {
        var _f = funkyJS.everyWith(funkyJS.isString);
        expect(_f(['a', 'b', 'c'])).toBe(true);
        expect(_f(['a', null, 'c'])).toBe(false);
        expect(_f([1, 2, 3])).toBe(false);
    });

});