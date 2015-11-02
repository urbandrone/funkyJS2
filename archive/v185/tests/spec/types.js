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

    it('testing isNotNil :: f -> x -> b', function () {
        var nul = funkyJS.isNotNil(null);
        var undef = funkyJS.isNotNil(void 0);
        var s = funkyJS.isNotNil('a string');

        expect(nul).toBe(false);
        expect(undef).toBe(false);
        expect(s).toBe(true);
    });

    it('testing isNull :: f -> x -> b', function () {
        var nul = funkyJS.isNull(null);
        var undef = funkyJS.isNull(void 0);
        var s = funkyJS.isNull('a string');

        expect(nul).toBe(true);
        expect(undef).toBe(false);
        expect(s).toBe(false);
    });

    it('testing isNotNull :: f -> x -> b', function () {
        var nul = funkyJS.isNotNull(null);
        var undef = funkyJS.isNotNull(void 0);
        var s = funkyJS.isNotNull('a string');

        expect(nul).toBe(false);
        expect(undef).toBe(true);
        expect(s).toBe(true);
    });

    it('testing isVoid :: f -> x -> b', function () {
        var nul = funkyJS.isVoid(null);
        var undef = funkyJS.isVoid(void 0);
        var s = funkyJS.isVoid('a string');

        expect(nul).toBe(false);
        expect(undef).toBe(true);
        expect(s).toBe(false);
    });

    it('testing isNotVoid :: f -> x -> b', function () {
        var nul = funkyJS.isNotVoid(null);
        var undef = funkyJS.isNotVoid(void 0);
        var s = funkyJS.isNotVoid('a string');

        expect(nul).toBe(true);
        expect(undef).toBe(false);
        expect(s).toBe(true);
    });

    it('testing isBool :: f -> x -> b', function () {
        var b = funkyJS.isBool(false);
        var s = funkyJS.isBool('a string');

        expect(b).toBe(true);
        expect(s).toBe(false);
    });

    it('testing isNotBool :: f -> x -> b', function () {
        var b = funkyJS.isNotBool(false);
        var s = funkyJS.isNotBool('a string');

        expect(b).toBe(false);
        expect(s).toBe(true);
    });

    it('testing isString :: f -> x -> b', function () {
        var s = funkyJS.isString('a string');
        var b = funkyJS.isString(true);

        expect(s).toBe(true);
        expect(b).toBe(false);
    });

    it('testing isNotString :: f -> x -> b', function () {
        var s = funkyJS.isNotString('a string');
        var b = funkyJS.isNotString(true);

        expect(s).toBe(false);
        expect(b).toBe(true);
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

    it('testing isNotNumber :: f -> x -> b', function () {
        var n = funkyJS.isNotNumber(1);
        var b = funkyJS.isNotNumber(true);
        var nan = funkyJS.isNotNumber(NaN);
        var inf = funkyJS.isNotNumber(Infinity);

        expect(n).toBe(false);
        expect(b).toBe(true);
        expect(nan).toBe(true);
        expect(inf).toBe(true);
    });

    it('testing isInt32 :: f -> x -> b', function () {
        var n = funkyJS.isInt32(1);
        var b = funkyJS.isInt32(true);
        var f32 = funkyJS.isInt32(1.5);

        expect(n).toBe(true);
        expect(b).toBe(false);
        expect(f32).toBe(false);
    });

    it('testing isNotInt32 :: f -> x -> b', function () {
        var n = funkyJS.isNotInt32(1);
        var b = funkyJS.isNotInt32(true);
        var f32 = funkyJS.isNotInt32(1.5);

        expect(n).toBe(false);
        expect(b).toBe(true);
        expect(f32).toBe(true);
    });

    it('testing isFloat32 :: f -> x -> b', function () {
        var n = funkyJS.isFloat32(1.5);
        var b = funkyJS.isFloat32(true);
        var i32 = funkyJS.isFloat32(1);

        expect(n).toBe(true);
        expect(b).toBe(false);
        expect(i32).toBe(false);
    });

    it('testing isNotFloat32 :: f -> x -> b', function () {
        var n = funkyJS.isNotFloat32(1.5);
        var b = funkyJS.isNotFloat32(true);
        var i32 = funkyJS.isNotFloat32(1);

        expect(n).toBe(false);
        expect(b).toBe(true);
        expect(i32).toBe(true);
    });

    it('testing isFunction :: f -> x -> b', function () {
        var f = funkyJS.isFunction(funkyJS.is);
        var b = funkyJS.isFunction(true);

        expect(f).toBe(true);
        expect(b).toBe(false);
    });

    it('testing isNotFunction :: f -> x -> b', function () {
        var f = funkyJS.isNotFunction(funkyJS.is);
        var b = funkyJS.isNotFunction(true);

        expect(f).toBe(false);
        expect(b).toBe(true);
    });

    it('testing isArray :: f -> x -> b', function () {
        var a = funkyJS.isArray([]);
        var b = funkyJS.isArray({});

        expect(a).toBe(true);
        expect(b).toBe(false);
    });

    it('testing isNotArray :: f -> x -> b', function () {
        var a = funkyJS.isNotArray([]);
        var b = funkyJS.isNotArray({});

        expect(a).toBe(false);
        expect(b).toBe(true);
    });

    it('testing isObject :: f -> x -> b', function () {
        var a = funkyJS.isObject({});
        var b = funkyJS.isObject([]);

        expect(a).toBe(true);
        expect(b).toBe(false);
    });

    it('testing isNotObject :: f -> x -> b', function () {
        var a = funkyJS.isNotObject({});
        var b = funkyJS.isNotObject([]);

        expect(a).toBe(false);
        expect(b).toBe(true);
    });

    it('testing isDate :: f -> x -> b', function () {
        var a = funkyJS.isDate(new Date());
        var b = funkyJS.isDate('2014-01-01');

        expect(a).toBe(true);
        expect(b).toBe(false);
    });

    it('testing isNotDate :: f -> x -> b', function () {
        var a = funkyJS.isNotDate(new Date());
        var b = funkyJS.isNotDate('2014-01-01');

        expect(a).toBe(false);
        expect(b).toBe(true);
    });

    it('testing isRegex :: f -> x -> b', function () {
        var a = funkyJS.isRegex(/.*/g);
        var b = funkyJS.isRegex(' ');

        expect(a).toBe(true);
        expect(b).toBe(false);
    });

    it('testing isNotRegex :: f -> x -> b', function () {
        var a = funkyJS.isNotRegex(/.*/g);
        var b = funkyJS.isNotRegex(' ');

        expect(a).toBe(false);
        expect(b).toBe(true);
    });

    it('testing isNode :: f -> x -> b', function () {
        var a = funkyJS.isNode(document.createElement('p'));
        var b = funkyJS.isNode('<p></p>');

        expect(a).toBe(true);
        expect(b).toBe(false);
    });

    it('testing isNotNode :: f -> x -> b', function () {
        var a = funkyJS.isNotNode(document.createElement('p'));
        var b = funkyJS.isNotNode('<p></p>');

        expect(a).toBe(false);
        expect(b).toBe(true);
    });

    it('testing isNodeList :: f -> x -> b', function () {
        var a = funkyJS.isNodeList(document.querySelectorAll('html'));
        var b = funkyJS.isNodeList([]);

        expect(a).toBe(true);
        expect(b).toBe(false);
    });

    it('testing isNotNodeList :: f -> x -> b', function () {
        var a = funkyJS.isNotNodeList(document.querySelectorAll('html'));
        var b = funkyJS.isNotNodeList([]);

        expect(a).toBe(false);
        expect(b).toBe(true);
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

    it('testing isNotSequencial :: f -> x -> b', function () {
        var a = funkyJS.isNotSequencial([]);
        var b = funkyJS.isNotSequencial('string');
        var c = funkyJS.isNotSequencial(document.querySelectorAll('html'));
        var d = funkyJS.isNotSequencial({length: 10});

        expect(a).toBe(false);
        expect(b).toBe(false);
        expect(c).toBe(false);
        expect(d).toBe(true);
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

    it('testing isNotEnumerable :: f -> x -> b', function () {
        var a = funkyJS.isNotEnumerable([]);
        var b = funkyJS.isNotEnumerable('string');
        var c = funkyJS.isNotEnumerable(document.querySelectorAll('html'));
        var d = funkyJS.isNotEnumerable({length: 10});
        var e = funkyJS.isNotEnumerable(new Date());

        expect(a).toBe(false);
        expect(b).toBe(false);
        expect(c).toBe(false);
        expect(d).toBe(false);
        expect(e).toBe(true);
    });

});