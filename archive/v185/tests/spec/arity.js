/* globals describe, it, expect */
describe('funkyJS Arity Module', function () {

    var unary = function (a) {
        return a;
    }

    var binary = function (a, b) {
        return [a, b];
    }

    var multary = function () {
        return Array.prototype.slice.call(arguments);
    }



    it('testing aritize :: f -> n, b -> f', function () {
        var e = funkyJS.aritize(2)(multary);
        var f = funkyJS.aritize(2)(unary);
        var g = funkyJS.aritize(1)(binary);
        var h = funkyJS.aritize(2, true)(multary);

        expect(e(1, 2, 3)).toEqual([[1, 2]]);
        expect(f(1, 2)).toEqual([1, 2]);
        expect(g(1, 2)).toEqual([[1], undefined]);
        expect(h(1, 2, 3)).toEqual([1, 2, 3]);
    });

    it('testing niladic :: f -> f -> f', function () {
        var f = funkyJS.niladic(unary);

        expect(unary(1)).toEqual(1);
        expect(f(1)).toEqual(void 0);
    });

    it('testing monadic :: f -> f -> f', function () {
        var f = funkyJS.monadic(multary);

        expect(multary(1, 2, 3)).toEqual([1, 2, 3]);
        expect(f(1, 2, 3)).toEqual([1]);
    });

    it('testing dyadic :: f -> f -> f', function () {
        var f = funkyJS.dyadic(multary);

        expect(multary(1, 2, 3)).toEqual([1, 2, 3]);
        expect(f(1, 2, 3)).toEqual([1, 2]);
    });

    it('testing triadic :: f -> f -> f', function () {
        var f = funkyJS.triadic(multary);

        expect(multary(1, 2, 3, 4)).toEqual([1, 2, 3, 4]);
        expect(f(1, 2, 3, 4)).toEqual([1, 2, 3]);
    });

    it('testing tetradic :: f -> f -> f', function () {
        var f = funkyJS.tetradic(multary);

        expect(multary(1, 2, 3, 4, 5)).toEqual([1, 2, 3, 4, 5]);
        expect(f(1, 2, 3, 4, 5)).toEqual([1, 2, 3, 4]);
    });

    it('testing polyadic :: f -> f -> f', function () {
        var f = funkyJS.polyadic(multary);

        expect(multary(1, 2, 3)).toEqual([1, 2, 3]);
        expect(f(1, 2)).toEqual([1, 2]);
        expect(f(1, 2, 3)).toEqual([1, 2, 3]);
        expect(f(1)()(2, 3)).toEqual([1, 2, 3]);
    });

    it('testing variadic :: f -> f -> f', function () {
        var f = funkyJS.variadic(unary);

        expect(unary(1, 2, 3, 4)).toEqual(1);
        expect(f(1, 2, 3, 4)).toEqual([1, 2, 3, 4]);
    });

});