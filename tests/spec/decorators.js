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

    it('testing curry :: f -> f, * -> f', function () {
        var f = _.curry(function (a, b) { return a + b; });
        var g = _.curry(function (a, b) { return a + b; }, 'g');

        expect(f(1)(2)).toBe(3);
        expect(g(2)).toBe('g2');
    });

    it('testing curryRight :: f -> f, * -> f', function () {
        var f = _.curryRight(function (a, b) { return a + b; });
        var g = _.curryRight(function (a, b) { return a + b; }, 'g');

        expect(f(1)(2)).toBe(3);
        expect(g(2)).toBe('2g');
    });

    it('testing partial :: f -> f, * -> f', function () {
        var f = _.partial(function (a, b) { return a + b; });
        var g = _.partial(function (a, b) { return a + b; }, 'g');
        var h = _.partial(function (a, b, c) { return a + b + c; }, ['a', undefined, 'z']);

        expect(f(1)(2)).toBe(3);
        expect(f(1, 2)).toBe(3);
        expect(g(2)).toBe('g2');
        expect(g()(2)).toBe('g2');
        expect(h('f')).toBe('afz');
    });

    it('testing partialRight :: f -> f, * -> f', function () {
        var f = _.partialRight(function (a, b) { return a + b; });
        var g = _.partialRight(function (a, b) { return a + b; }, 'g');
        var h = _.partialRight(function (a, b, c) { return a + b + c; }, ['a', undefined, 'z']);

        expect(f(1)(2)).toBe(3);
        expect(f(1, 2)).toBe(3);
        expect(g(2)).toBe('2g');
        expect(g()(2)).toBe('2g');
        expect(h('f')).toBe('zfa');
    });

});