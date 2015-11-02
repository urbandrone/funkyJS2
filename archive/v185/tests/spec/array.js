/* global describe, it, expect, funkyJS */
describe('funkyJS Array Module', function () {

    var _ = funkyJS;

    var getClass = function (x) {
        return Object.prototype.toString.call(x).replace(/^\[object\s|\]$/g, '');
    }

    it('testing toArray :: f -> seq -> a', function () {
        var a = _.toArray([1, 2, 3]),
            nl = _.toArray(document.querySelectorAll('script')),
            s = _.toArray('strings'),
            o = _.toArray({foo: 'bar'});

        expect(a).toEqual([1, 2, 3]);
        expect(getClass(nl)).toBe('Array');
        expect(s).toEqual(['s', 't', 'r', 'i', 'n', 'g', 's']);
        expect(o).toEqual(['bar']);
    });

    it('testing first :: f -> seq -> *', function () {
        var a = _.first([1, 2, 3]),
            s = _.first('string');

        expect(a).toBe(1);
        expect(s).toBe('s');
    });

    it('testing last :: f -> seq -> *', function () {
        var a = _.last([1, 2, 3]),
            s = _.last('string');

        expect(a).toBe(3);
        expect(s).toBe('g');
    });

    it('testing nth :: f -> n, seq -> *', function () {
        var a = _.nth(1, [1, 2, 3]),
            s = _.nth(3, 'string');

        expect(a).toBe(2);
        expect(s).toBe('i');
    });

    it('testing head :: f -> seq -> a', function () {
        var a = _.head([1, 2, 3]),
            s = _.head('string');

        expect(a).toEqual([1, 2]);
        expect(s).toEqual(['s', 't', 'r', 'i', 'n']);
    });

    it('testing tail :: f -> seq -> a', function () {
        var a = _.tail([1, 2, 3]),
            s = _.tail('string');

        expect(a).toEqual([2, 3]);
        expect(s).toEqual(['t', 'r', 'i', 'n', 'g']);
    });

    it('testing take :: f -> n, seq -> a', function () {
        var a = _.take(2, [1, 2, 3]),
            s = _.take(2, 'string');

        expect(a).toEqual([1, 2]);
        expect(s).toEqual(['s', 't']);
    });

    it('testing drop :: f -> n, seq -> a', function () {
        var a = _.drop(2, [1, 2, 3]),
            s = _.drop(2, 'string');

        expect(a).toEqual([3]);
        expect(s).toEqual(['r', 'i', 'n', 'g']);
    });

    it('testing append :: f -> seq, seq -> a', function () {
        var a = _.append([1, 2, 3], 'nums: ');

        expect(a).toEqual(['n', 'u', 'm', 's', ':', ' ', 1, 2, 3]);
    });

    it('testing prepend :: f -> seq, seq -> a', function () {
        var a = _.prepend('nums: ', [1, 2, 3]);

        expect(a).toEqual(['n', 'u', 'm', 's', ':', ' ', 1, 2, 3]);
    });

    it('testing surround :: f -> seq, seq, seq -> a', function () {
        var a = _.surround('nums: ', '...', [1, 2, 3]);

        expect(a).toEqual(['n', 'u', 'm', 's', ':', ' ', 1, 2, 3, '.', '.', '.']);
    });

    it('testing unique :: f -> seq, seq -> a', function () {
        var a = _.unique([1, 2, 2, 3, 1, 3]);

        expect(a).toEqual([1, 2, 3]);
    });

    it('testing flatten :: f -> a -> a', function () {
        var a = _.flatten([1, [[2], 3]]);

        expect(a).toEqual([1, 2, 3]);
    });

    it('testing union :: f -> seq, seq -> a', function () {
        var a = _.union([1, 2, 3], [2, 4, 6]);

        expect(a).toEqual([1, 2, 3, 4, 6]);
    });

    it('testing intersect :: f -> seq, seq -> a', function () {
        var a = _.intersect([1, 2, 3], [2, 4, 6]);

        expect(a).toEqual([2]);
    });

    it('testing difference :: f -> seq, seq -> a', function () {
        var a = _.difference([1, 2, 3], [2, 4, 6]);

        expect(a).toEqual([1, 3, 4, 6]);
    });

});