/* global describe, it, expect, funkyJS */
describe('funkyJS Combinators Module', function () {

    var _ = funkyJS;

    var prefix = _.dyadic(function (p, s) {
        return p + '-' + s;
    });

    var exclaim = function (s) {
        return s + '!';
    }

    it('testing compose :: f -> f1, f2, ... -> f', function () {
        var f = _.compose(exclaim, prefix('cmps'));
        expect(f(2)).toBe('cmps-2!');
    });

    it('testing pipe :: f -> f1, f2, ... -> f', function () {
        var f = _.pipe(prefix('pipe'), exclaim);
        expect(f(2)).toBe('pipe-2!');
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