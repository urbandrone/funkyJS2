/* global describe, it, expect, beforeEach, funkyJS */
describe('funkyJS Combinators Extension Module', function () {

    var _ = funkyJS;

    var val;
    var lifted = function (id) {
        return id + 1;
    }

    var fn1 = function (id, cont, fail) {
        if (id == null) {
            return fail(new Error('id is missing'));
        }
        cont(parseInt(id, 10));
    }

    var fn2 = function (id, cont, fail) {
        if (isNaN(id)) {
            return fail(new Error('id must be valid integer'));
        }
        cont(id * 2);
    }

    var test = function (done, expected) {
        return function (id) {
            expect(id).toBe(expected);
            done();
        }
    }

    var testSFx = function (done, expected, sideFx) {
        return function (id) {
            expect(id).toBe(expected);
            if (sideFx) {
                expect(sideFx.val).toBe('1!');
            }
            done();
        }
    }



    beforeEach(function (done) {
        setTimeout(function () {
            val = '1';
            done();
        }, 50);
    });

    it('testing composeAsync :: f -> f1, f2, ... -> f', function (done) {
        var f = _.composeAsync(fn2, fn1);
        f(val, test(done, 2), function (err) { throw err; });
    });

    it('testing pipeAsync :: f -> f1, f2, ... -> f', function (done) {
        var f = _.pipeAsync(fn1, fn2);
        f(val, test(done, 2), function (err) { throw err; });
    });

    it('testing liftAsync :: f -> f -> f', function (done) {
        var f = _.pipeAsync(fn1, _.liftAsync(lifted), fn2);
        f(val, testSFx(done, 4), function (err) { throw err; });
    });

    it('testing sideEffect :: f -> f -> f', function (done) {
        var _sfx = {};
        
        function sEffect () {
            _sfx.val = '1!';
        }

        var f = _.pipeAsync(fn1, _.sideEffect(sEffect), fn2);
        f(val, testSFx(done, 2, _sfx), function (err) { throw err; });
    });
});