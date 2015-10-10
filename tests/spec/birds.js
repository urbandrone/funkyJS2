/* globals funkyJS */
describe('funkyJS Birds Module', function () {

    it('testing identity :: f -> x -> x', function () {
        var s = funkyJS.identity('funkyJS2');
        var n = funkyJS.identity(1);

        expect(s).toEqual('funkyJS2');
        expect(n).toEqual(1);
    });

    it('testing constant :: f -> x -> y -> x', function () {
        var s = funkyJS.constant('funkyJS2');
        var n = funkyJS.constant(1);

        expect(s()).toEqual('funkyJS2');
        expect(n()).toEqual(1);
    });

    it('testing cmps :: f -> g -> h -> x -> g(hx)', function () {
        var inc = function (a) {
            return (a += 1);
        }

        var int32 = function (a) {
            return parseInt(a, 10);
        }

        var incInt32 = funkyJS.cmps(inc)(int32);

        expect(incInt32('1px')).toEqual(2);
        expect(inc(int32('1px'))).toEqual(2);
    });

    it('testing tap :: f -> x -> g -> gx', function () {
        var f = funkyJS.tap(function tapped (v) {
            return tapped.process(v);
        })(function (fn) {
            fn.process = function (v) {
                return v * v;
            }
            return fn;
        });

        expect(f(2)).toBe(4);
        expect(typeof f.process).toBe('function');
        expect(f(2)).toBe(f.process(2));
    });

});