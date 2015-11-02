/* global describe, it, expect, funkyJS */
describe('funkyJS Decorators Extension Module', function () {

    var _ = funkyJS;

    var tryIf = function (fn) {
        return function () {
            try {
                fn.apply(null, arguments);
                return 'success';
            } catch (exc) {}
            return 'failed';
        }
    }



    var It = function (v) {
        this.value = v;
    }
    It.is = function (o) {
        return It.prototype.isPrototypeOf(o);
    }
    It.make = function (v) {
        return new It(v);
    }



    var exclaim = function (v) {
        return v + '!';
    }

    var add = function (v1, v2) {
        return v1 + v2;
    }

    var sqr = function (v) {
        return v * v;
    }



    it('testing hom :: f -> a, f -> f', function () {
        var _h = _.hom([_.isString], It.is)(It.make),
            _f = tryIf(_h);

        expect(_f('pass')).toBe('success');
        expect(_f(1)).toBe('failed');
    });

    it('testing multiDispatch :: f -> a -> f', function () {
        var _f = _.multiDispatch([{
            args: [_.isString],
            out: _.isString,
            proc: exclaim
        }, {
            args: [_.isInt32],
            out: _.isInt32,
            proc: sqr
        }, {
            args: [_.isNumber, _.isNumber],
            out: _.isNumber,
            proc: add
        }]);

        expect(_f('exclaim')).toBe('exclaim!');
        expect(_f(3)).toBe(9);
        expect(_f(3, 2)).toBe(5);
        expect(_f()).toBe(undefined);
    });

    it('testing displaceArgs :: f -> f, a -> f', function () {
        var _f = _.displaceArgs(add, [1, 0]);

        expect(_f('z', 'a')).toBe('az');
        expect(_f('a', 'z')).toBe('za');
        expect(_f(1, 2)).toBe(3);
    });

});