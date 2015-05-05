/* global describe, it, expect, funkyJS */
describe('funkyJS Contracts Extension Module', function () {

    var tryIf = function (fn) {
        return function () {
            try {
                fn.apply(null, arguments);
                return 'success';
            } catch (exc) {}
            return 'failed';
        }
    }



    it('testing beNil :: f -> * -> *', function () {
        var _f = tryIf(funkyJS.beNil);

        expect(_f(null)).toBe('success');
        expect(_f(undefined)).toBe('success');
        expect(_f(1)).toBe('failed');
    });

    it('testing beNull :: f -> * -> *', function () {
        var _f = tryIf(funkyJS.beNull);

        expect(_f(null)).toBe('success');
        expect(_f(undefined)).toBe('failed');
    });

    it('testing beVoid :: f -> * -> *', function () {
        var _f = tryIf(funkyJS.beVoid);

        expect(_f(undefined)).toBe('success');
        expect(_f(null)).toBe('failed');
    });

    it('testing beString :: f -> * -> *', function () {
        var _f = tryIf(funkyJS.beString);

        expect(_f('')).toBe('success');
        expect(_f(null)).toBe('failed');
    });

    it('testing beBool :: f -> * -> *', function () {
        var _f = tryIf(funkyJS.beBool);

        expect(_f(true)).toBe('success');
        expect(_f(null)).toBe('failed');
    });

    it('testing beNumber :: f -> * -> *', function () {
        var _f = tryIf(funkyJS.beNumber);

        expect(_f(1)).toBe('success');
        expect(_f(null)).toBe('failed');
    });

    it('testing beInt32 :: f -> * -> *', function () {
        var _f = tryIf(funkyJS.beInt32);

        expect(_f(1)).toBe('success');
        expect(_f(2.5)).toBe('failed');
    });

    it('testing beFloat32 :: f -> * -> *', function () {
        var _f = tryIf(funkyJS.beFloat32);

        expect(_f(1.5)).toBe('success');
        expect(_f(2)).toBe('failed');
    });

    it('testing beFunction :: f -> * -> *', function () {
        var _f = tryIf(funkyJS.beFunction);

        expect(_f(_f)).toBe('success');
        expect(_f(null)).toBe('failed');
    });

    it('testing beArray :: f -> * -> *', function () {
        var _f = tryIf(funkyJS.beArray);

        expect(_f([])).toBe('success');
        expect(_f({})).toBe('failed');
    });

    it('testing beObject :: f -> * -> *', function () {
        var _f = tryIf(funkyJS.beObject);

        expect(_f({})).toBe('success');
        expect(_f([])).toBe('failed');
    });

    it('testing beDate :: f -> * -> *', function () {
        var _f = tryIf(funkyJS.beDate);

        expect(_f(new Date())).toBe('success');
        expect(_f(null)).toBe('failed');
    });

    it('testing beRegex :: f -> * -> *', function () {
        var _f = tryIf(funkyJS.beRegex);

        expect(_f(/.*/g)).toBe('success');
        expect(_f('.*')).toBe('failed');
    });

    it('testing beNode :: f -> * -> *', function () {
        var _f = tryIf(funkyJS.beNode);

        expect(_f(document.createElement('div'))).toBe('success');
        expect(_f('<div></div>')).toBe('failed');
    });

    it('testing beNodeList :: f -> * -> *', function () {
        var _f = tryIf(funkyJS.beNodeList);

        expect(_f(document.querySelectorAll('body'))).toBe('success');
        expect(_f(document.body)).toBe('failed');
    });

    it('testing beSequencial :: f -> * -> *', function () {
        var _f = tryIf(funkyJS.beSequencial);

        expect(_f(document.querySelectorAll('body'))).toBe('success');
        expect(_f([])).toBe('success');
        expect(_f('strings')).toBe('success');
        expect(_f(arguments)).toBe('success');

        expect(_f(document.body)).toBe('failed');
        expect(_f({})).toBe('failed');
        expect(_f(null)).toBe('failed');
        expect(_f(_f)).toBe('failed');
    });

    it('testing beEnumerable :: f -> * -> *', function () {
        var _f = tryIf(funkyJS.beEnumerable);

        expect(_f(document.querySelectorAll('body'))).toBe('success');
        expect(_f([])).toBe('success');
        expect(_f('strings')).toBe('success');
        expect(_f(arguments)).toBe('success');
        expect(_f({})).toBe('success');

        expect(_f(document.body)).toBe('failed');
        expect(_f(null)).toBe('failed');
        expect(_f(_f)).toBe('failed');
    });

});