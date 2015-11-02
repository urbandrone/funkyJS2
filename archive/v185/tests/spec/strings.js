/* global describe, it, expect, funkyJS */
describe('funkyJS Strings Extension Module', function () {

    it('testing trimLeft :: f -> s -> s', function () {
        expect(funkyJS.trimLeft('   test   ')).toBe('test   ');
    });

    it('testing trimRight :: f -> s -> s', function () {
        expect(funkyJS.trimRight('   test   ')).toBe('   test');
    });

    it('testing trim :: f -> s -> s', function () {
        expect(funkyJS.trim('   test   ')).toBe('test');
    });

    it('testing camelize :: f -> s -> s', function () {
        expect(funkyJS.camelize('a-string')).toBe('aString');
        expect(funkyJS.camelize('a_string')).toBe('aString');
    });

    it('testing dasherize :: f -> s -> s', function () {
        expect(funkyJS.dasherize('aString')).toBe('a-string');
        expect(funkyJS.dasherize('a_string')).toBe('a-string');
    });

    it('testing underscore :: f -> s -> s', function () {
        expect(funkyJS.underscore('a-string')).toBe('a_string');
        expect(funkyJS.underscore('aString')).toBe('a_string');
    });

    it('testing splitParse :: f -> f, s|r, s -> a', function () {
        var op = funkyJS.monadic(parseInt);

        expect(funkyJS.splitParse(op, '-', '1-2-3')).toEqual([1, 2, 3]);
        expect(funkyJS.splitParse(op, /\-/g, '1-2-3')).toEqual([1, 2, 3]);
        expect(funkyJS.splitParse(op)('-')('1-2-3')).toEqual([1, 2, 3]);
    });

    it('testing substitude :: f -> s, o -> s', function () {
        var tpl = funkyJS.substitude('${greet} ${subject}');

        expect(tpl({subject: 'World', greet: 'Hello'})).toBe('Hello World');
        expect(tpl()({subject: 'Tim', greet: 'Hi'})).toBe('Hi Tim');
    });

});