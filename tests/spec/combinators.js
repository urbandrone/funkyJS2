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

    it('testing and :: f -> f1, f2, ... -> f', function () {
        var f = _.and(_.isNumber, _.isInt32);
        expect(f(2)).toBe(true);
        expect(f(0.3)).toBe(false);
    });

    it('testing or :: f -> f1, f2, ... -> f', function () {
        var f = _.or(_.isNumber, _.isString);
        expect(f(2)).toBe(true);
        expect(f('2')).toBe(true);
        expect(f(null)).toBe(false);
    });

});