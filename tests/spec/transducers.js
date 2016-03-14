/* global describe, it, expect, funkyJS */
describe('funkyJS Transducers Module', function () {
    var t = funkyJS.transducers;
    var add1 = function (v) { return v + 1; };
    var even = function (v) { return v % 2; }



    it('testing reduced :: f -> v -> rv', function () {
        var v = t.reduced(1);

        expect(v.value).toBe(1);
        expect(v.__transformer_reduced__).toBe(true);
    });

    it('testing isReduced :: f -> v -> b', function () {
        var v = t.reduced(1);

        expect(t.isReduced(v)).toBe(true);
    });

    it('testing unReduced :: f -> v -> rv', function () {
        var v = t.reduced(1);

        expect(t.unReduced(v)).toBe(1);
    });

    it('testing foldl :: f -> xf, x, coll -> x', function () {
        var r = t.foldl(
            function (a, b) { return a + b; },
            0,
            [1, 2, 3]
        );

        var r2 = t.foldl(
            function (r, kv) { return r + kv[1]; },
            0,
            {a: 1, b: 2, c: 3}
        );

        expect(r).toBe(6);
        expect(r2).toBe(6);
    });

    it('testing transduce :: f -> xf, f, x, coll -> x', function () {
        var r = t.transduce(
            funkyJS.identity,
            function (r, v) { return r * v; },
            1,
            [1, 2, 3, 4, 5]
        );

        expect(r).toBe(120);
    });

    it('testing into :: f -> x, xf, coll -> x', function () {
        var r = t.into(
            0,
            t.map(add1),
            [1, 2, 3]
        );

        var r2 = t.into(
            '',
            t.map(add1),
            [1, 2, 3]
        );

        expect(r).toBe(9);
        expect(r2).toBe('234');
    });

    it('testing append :: f -> coll, v -> coll', function () {
        expect(t.append([2], 1)).toEqual([2, 1]);
        expect(t.append([[2]], [1])).toEqual([[2], [1]]);
    });

    it('testing prepend :: f -> coll, v -> coll', function () {
        expect(t.prepend([2], 1)).toEqual([1, 2]);
        expect(t.prepend([[2]], [1])).toEqual([[1], [2]]);
    });

    it('testing cons :: f -> coll, v -> coll', function () {
        expect(t.cons([2], 1)).toEqual([1, 2]);
        expect(t.cons([2], [1])).toEqual([1, 2]);
    });

    it('testing conj :: f -> coll, v -> coll', function () {
        expect(t.conj([2], 1)).toEqual([2, 1]);
        expect(t.conj([2], [1])).toEqual([2, 1]);
    });

    it('testing combine :: f -> r, v -> r', function () {
        expect(t.combine(1, 2)).toBe(3);
    });

    it('testing merge :: f -> obj, kv -> obj', function () {
        expect(t.merge({}, ['a', 1])).toEqual({a: 1});
        expect(t.merge({}, {a: 1})).toEqual({a: 1});
    });

    it('testing join :: f -> x -> r, v -> r', function () {
        expect(t.join(0)(1, 2)).toBe(3);
        expect(t.join(' ')(1, 2)).toBe('1 2');
    });

    it('testing liftTransformer :: f ->tf -> f -> xf -> xf', function () {
        var xf = t.liftTransformer(function (step, f, r, v) {
            return step(r, f(v));
        });

        var r = t.into([], xf(add1), [1, 2, 3]);

        expect(r).toEqual([2, 3, 4]);
    });

    it('testing flatten :: xf -> xf', function () {
        var r = t.transduce(t.flatten, t.append, [], [[1], [2], [3]]);

        expect(r).toEqual([1, 2, 3]);
    });

    it('testing map :: f -> f -> xf -> xf', function () {
        var r = t.into([], t.map(add1), [1, 2, 3]);

        expect(r).toEqual([2, 3, 4]);
    });

    it('testing flatMap :: f -> f -> xf -> xf', function () {
        var r = t.into(
            '',
            t.flatMap(add1),
            [[1], [2], [3]]
        );

        expect(r).toBe('234');
    });

    it('testing filter :: f -> f -> xf -> xf', function () {
        var r = t.into('', t.filter(even), [1, '2', 3]);
        expect(r).toBe('13');
    });

    it('testing drop :: f -> n -> xf -> xf', function () {
        var r = t.into([], t.drop(2), [1, 2, 3]);
        expect(r).toEqual([3]);
    });

    it('testing dropNth :: f -> n -> xf -> xf', function () {
        var r = t.into([], t.dropNth(1), [1, 2, 3]);
        expect(r).toEqual([1, 3]);
    });

    it('testing dropWhile :: f -> f -> xf -> xf', function () {
        var r = t.into([], t.dropWhile(even), [1, 2, 3]);
        expect(r).toEqual([2, 3]);
    });

    it('testing take :: f -> n -> xf -> xf', function () {
        var r = t.into([], t.take(2), [1, 2, 3]);
        expect(r).toEqual([1, 2]);
    });

    it('testing takeNth :: f -> n -> xf -> xf', function () {
        var r = t.into([], t.takeNth(1), [1, 2, 3]);
        expect(r).toEqual([2]);
    });

    it('testing takeWhile :: f -> f -> xf -> xf', function () {
        var r = t.into([], t.takeWhile(even), [1, 2, 3]);
        expect(r).toEqual([1]);
    });

    it('testing keep :: f -> xf -> xf', function () {
        var r = t.into([], t.keep, [1, null]);
        expect(r).toEqual([1]);
    });

    it('testing unique :: f -> xf -> xf', function () {
        var r = t.into([], t.unique, [1, 2, 2, 3]);
        expect(r).toEqual([1, 2, 3]);
    });

    it('testing partition :: f -> n -> xf -> xf', function () {
        var r = t.transduce(t.partition(3), t.append, [], [1, 2, 3, 4, 5]);
        expect(r).toEqual([[1, 2, 3], [4, 5]]);
    });

    it('testing partitionBy :: f -> f -> xf -> xf', function () {
        var r = t.transduce(t.partitionBy(even), t.append, [], [1, 2, 3]);
        expect(r).toEqual([[1], [2], [3]]);
    });

});