/* globals funkyJS */
describe('funkyJS Types Module', function () {

    it('testing is :: f -> s -> x -> b', function () {
        var f = funkyJS.is('string');
        var b = funkyJS.is('string', 'a string');
        var o = funkyJS.is('string', {});

        expect(b).toBe(true);
        expect(o).toBe(false);
        expect(f('a string')).toBe(true);
        expect(f({})).toBe(false);
    });

    it('testing isNil :: f -> x -> b', function () {
        var nul = funkyJS.isNil(null);
        var undef = funkyJS.isNil(void 0);
        var s = funkyJS.isNil('a string');

        expect(nul).toBe(true);
        expect(undef).toBe(true);
        expect(s).toBe(false);
    });

    it('testing isNull :: f -> x -> b', function () {
        var nul = funkyJS.isNull(null);
        var undef = funkyJS.isNull(void 0);
        var s = funkyJS.isNull('a string');

        expect(nul).toBe(true);
        expect(undef).toBe(false);
        expect(s).toBe(false);
    });

    it('testing isVoid :: f -> x -> b', function () {
        var nul = funkyJS.isVoid(null);
        var undef = funkyJS.isVoid(void 0);
        var s = funkyJS.isVoid('a string');

        expect(nul).toBe(false);
        expect(undef).toBe(true);
        expect(s).toBe(false);
    });

    it('testing isBool :: f -> x -> b', function () {
        var b = funkyJS.isBool(false);
        var s = funkyJS.isBool('a string');

        expect(b).toBe(true);
        expect(s).toBe(false);
    });

    it('testing isString :: f -> x -> b', function () {
        var s = funkyJS.isString('a string');
        var b = funkyJS.isString(true);

        expect(s).toBe(true);
        expect(b).toBe(false);
    });

    it('testing isNumber :: f -> x -> b', function () {
        var n = funkyJS.isNumber(1);
        var b = funkyJS.isNumber(true);
        var nan = funkyJS.isNumber(NaN);
        var inf = funkyJS.isNumber(Infinity);

        expect(n).toBe(true);
        expect(b).toBe(false);
        expect(nan).toBe(false);
        expect(inf).toBe(false);
    });

    it('testing isInt32 :: f -> x -> b', function () {
        var n = funkyJS.isInt32(1);
        var b = funkyJS.isInt32(true);
        var f32 = funkyJS.isInt32(1.5);

        expect(n).toBe(true);
        expect(b).toBe(false);
        expect(f32).toBe(false);
    });

    it('testing isFloat32 :: f -> x -> b', function () {
        var n = funkyJS.isFloat32(1.5);
        var b = funkyJS.isFloat32(true);
        var i32 = funkyJS.isFloat32(1);

        expect(n).toBe(true);
        expect(b).toBe(false);
        expect(i32).toBe(false);
    });

    it('testing isFunction :: f -> x -> b', function () {
        var f = funkyJS.isFunction(funkyJS.is);
        var b = funkyJS.isFunction(true);

        expect(f).toBe(true);
        expect(b).toBe(false);
    });

    it('testing isArray :: f -> x -> b', function () {
        var a = funkyJS.isArray([]);
        var b = funkyJS.isArray({});

        expect(a).toBe(true);
        expect(b).toBe(false);
    });

    it('testing isObject :: f -> x -> b', function () {
        var a = funkyJS.isObject({});
        var b = funkyJS.isObject([]);

        expect(a).toBe(true);
        expect(b).toBe(false);
    });

    it('testing isDate :: f -> x -> b', function () {
        var a = funkyJS.isDate(new Date());
        var b = funkyJS.isDate('2014-01-01');

        expect(a).toBe(true);
        expect(b).toBe(false);
    });

    it('testing isRegex :: f -> x -> b', function () {
        var a = funkyJS.isRegex(/.*/g);
        var b = funkyJS.isRegex(' ');

        expect(a).toBe(true);
        expect(b).toBe(false);
    });

    it('testing isNode :: f -> x -> b', function () {
        var a = funkyJS.isNode(document.createElement('p'));
        var b = funkyJS.isNode('<p></p>');

        expect(a).toBe(true);
        expect(b).toBe(false);
    });

    it('testing isNodeList :: f -> x -> b', function () {
        var a = funkyJS.isNodeList(document.querySelectorAll('html'));
        var b = funkyJS.isNodeList([]);

        expect(a).toBe(true);
        expect(b).toBe(false);
    });

    it('testing isSequencial :: f -> x -> b', function () {
        var a = funkyJS.isSequencial([]);
        var b = funkyJS.isSequencial('string');
        var c = funkyJS.isSequencial(document.querySelectorAll('html'));
        var d = funkyJS.isSequencial({length: 10});

        expect(a).toBe(true);
        expect(b).toBe(true);
        expect(c).toBe(true);
        expect(d).toBe(false);
    });

    it('testing isEnumerable :: f -> x -> b', function () {
        var a = funkyJS.isEnumerable([]);
        var b = funkyJS.isEnumerable('string');
        var c = funkyJS.isEnumerable(document.querySelectorAll('html'));
        var d = funkyJS.isEnumerable({length: 10});
        var e = funkyJS.isEnumerable(new Date());

        expect(a).toBe(true);
        expect(b).toBe(true);
        expect(c).toBe(true);
        expect(d).toBe(true);
        expect(e).toBe(false);
    });

    it('testing isIterator :: f -> x -> b', function () {
        var a = funkyJS.isIterator(null);
        var b = funkyJS.isIterator({next: true});
        var c = funkyJS.isIterator({next: function () {}});

        expect(a).toBe(false);
        expect(b).toBe(false);
        expect(c).toBe(true);
    });

});