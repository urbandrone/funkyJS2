/* global describe, it, expect, funkyJS */
describe('funkyJS Decorators Module', function () {

    var _ = funkyJS;

    var ab = function (a, b) {
        return [a, b];
    }

    it('testing flip :: f -> f -> f', function () {
        expect(_.flip(ab)(1, 2)).toEqual([2, 1]);
    });

    it('testing fluent :: f -> f -> f', function () {
        var o = {};
        o.f1 = _.fluent(function () { this.v = 1; })
        expect(o.f1(1).v).toBe(1);
    });

    it('testing guard :: f -> f, f -> f', function () {
        var gF = _.guard(_.isString, _.identity);

        expect(gF('hi')).toBe('hi');
        expect(gF(null)).toBe(null);
    });

    it('testing maybe :: f -> f -> f', function () {
        var mF = _.maybe(_.identity);
        expect(mF('hi')).toBe('hi');
        expect(mF(null)).toBe(null);
    });

    it('testing not :: f -> f -> f', function () {
        var nF = _.not(_.constant(true));
        expect(nF()).toBe(false);
    });

    it('testing splat :: f -> f -> f', function () {
        var sq = _.splat(function (x) { return x * x; });
        expect(sq(1, 2, 3)).toEqual([1, 4, 9]);
    });

});