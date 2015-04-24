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

});