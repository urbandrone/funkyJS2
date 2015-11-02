/* global describe, it, expect, funkyJS */
describe('funkyJS Iterators Extension Module', function () {

    var SEQ_STR = 'abc',
        SEQ_ARR = ['a', 'b', 'c'],
        OBJ = {a: 'a', b: 'b', c: 'c'};

    var _ = funkyJS;

    function add (a, b) {
        return a + b;
    }

    var addSelf = function (x) { return x + x; };
    var notB = function (x) { return x !== 'b'; }



    it('testing numIterator :: f -> n, n -> o', function () {
        var _it = _.numIterator();
        expect(_it.next().value()).toBe(0);
        expect(_it.next().value()).toBe(1);
        expect(_it.next().value()).toBe(2);
        expect(_it.next().value()).toBe(3);
        expect(_it.next().value()).toBe(4);
        expect(_it.next().value()).toBe(5);
        expect(_it.next().value()).toBe(6);
        expect(_it.next().value()).toBe(7);
        expect(_it.next().value()).toBe(8);
        expect(_it.next().value()).toBe(9);

        _it = _.numIterator(5);
        expect(_it.next().value()).toBe(5);
        expect(_it.next().value()).toBe(6);
        expect(_it.next().value()).toBe(7);
        expect(_it.next().value()).toBe(8);
        expect(_it.next().value()).toBe(9);

        _it = _.numIterator(0, -Infinity);
        expect(_it.next().value()).toBe(0);
        expect(_it.next().value()).toBe(-1);
        expect(_it.next().value()).toBe(-2);
        expect(_it.next().value()).toBe(-3);
        expect(_it.next().value()).toBe(-4);
        expect(_it.next().value()).toBe(-5);
        expect(_it.next().value()).toBe(-6);
        expect(_it.next().value()).toBe(-7);
        expect(_it.next().value()).toBe(-8);
        expect(_it.next().value()).toBe(-9);

        _it = null;
    });

    it('testing seqIterator :: f -> seq -> o', function () {
        var _itA = _.seqIterator(SEQ_ARR),
            _itS = _.seqIterator(SEQ_STR);

        expect(_itA.next().value()).toBe('a');
        expect(_itA.next().value()).toBe('b');
        expect(_itA.next().value()).toBe('c');
        expect(_itA.next().done).toBe(true);

        expect(_itS.next().value()).toBe('a');
        expect(_itS.next().value()).toBe('b');
        expect(_itS.next().value()).toBe('c');
        expect(_itS.next().done).toBe(true);
    });

    it('testing objIterator :: f -> seq -> o', function () {
        var _itO = _.objIterator(OBJ);

        expect(_itO.next().value()).toBe('a');
        expect(_itO.next().value()).toBe('b');
        expect(_itO.next().value()).toBe('c');
        expect(_itO.next().done).toBe(true);
    });

    it('testing mapLazy :: f -> f, o -> o', function () {
        var _itA = _.seqIterator(SEQ_ARR),
            _itO = _.objIterator(OBJ);

        var _mapA = _.mapLazy(addSelf, _itA),
            _mapO = _.mapLazy(addSelf, _itO);

        expect(_mapA.next().value()).toBe('aa');
        expect(_mapA.next().value()).toBe('bb');
        expect(_mapA.next().value()).toBe('cc');
        expect(_mapA.next().done).toBe(true);

        expect(_mapO.next().value()).toBe('aa');
        expect(_mapO.next().value()).toBe('bb');
        expect(_mapO.next().value()).toBe('cc');
        expect(_mapO.next().done).toBe(true);
    });

    it('testing filterLazy :: f -> f, o -> o', function () {
        var _itA = _.seqIterator(SEQ_ARR),
            _itO = _.objIterator(OBJ);

        var _filtA = _.filterLazy(notB, _itA),
            _filtO = _.filterLazy(notB, _itO);

        expect(_filtA.next().value()).toBe('a');
        expect(_filtA.next().value()).toBe('c');
        expect(_filtA.next().done).toBe(true);

        expect(_filtO.next().value()).toBe('a');
        expect(_filtO.next().value()).toBe('c');
        expect(_filtO.next().done).toBe(true);
    });

    it('testing foldLazy :: f -> f, o, * -> o', function () {
        var _itA = _.seqIterator(SEQ_ARR),
            _itO = _.objIterator(OBJ);

        var _foldA = _.foldLazy(add, _itA, ''),
            _foldO = _.foldLazy(add, _itO, '');

        expect(_foldA.next().value()).toBe('a');
        expect(_foldA.next().value()).toBe('ab');
        expect(_foldA.next().value()).toBe('abc');
        expect(_foldA.next().done).toBe(true);

        expect(_foldO.next().value()).toBe('a');
        expect(_foldO.next().value()).toBe('ab');
        expect(_foldO.next().value()).toBe('abc');
        expect(_foldO.next().done).toBe(true);
    });

    it('testing nested fold-, filter- and mapLazy over finite iterators', function () {
        var _itA = _.seqIterator(SEQ_ARR),
            _itO = _.objIterator(OBJ);

        var filter = _.filterLazy(notB),
            map = _.mapLazy(addSelf),
            fold = _.foldLazy(add);

        var _fmfItA = fold(map(filter(_itA)), ''),
            _fmfItO = fold(map(filter(_itO)), '');

        expect(_fmfItA.next().value()).toBe('aa');
        expect(_fmfItA.next().value()).toBe('aacc');
        expect(_fmfItA.next().done).toBe(true);

        expect(_fmfItO.next().value()).toBe('aa');
        expect(_fmfItO.next().value()).toBe('aacc');
        expect(_fmfItO.next().done).toBe(true);
    });

    it('testing nested fold-, filter- and mapLazy over infinite iterators', function () {
        var _it = _.numIterator();

        var even = function (n) { return n % 2 === 0; },
            sqr = function (n) { return n * n; };

        var filter = _.filterLazy(even),
            map = _.mapLazy(sqr),
            fold = _.foldLazy(add);

        var _fmfIt = fold(map(filter(_it)), 0);

        expect(_fmfIt.next().value()).toBe(0);
        expect(_fmfIt.next().value()).toBe(4);
        expect(_fmfIt.next().value()).toBe(20);
        expect(_fmfIt.next().value()).toBe(56);
        expect(_fmfIt.next().value()).toBe(120);
        expect(_fmfIt.next().value()).toBe(220);
        expect(_fmfIt.next().done).toBe(false);

        _fmfIt = null;
    });

});