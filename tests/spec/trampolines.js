/* globals describe, it, expect, funkyJS */
describe('funkyJS Trampolines Module', function () {

    var _flatten = function (acc, arr) {
        if (arr.length < 1) {
            return acc;
        }
        return funkyJS.thunk(function () {
            if (funkyJS.isArray(arr[0])) {
                return _flatten(acc, arr[0].concat(arr.slice(1)));
            }
            return _flatten(acc.concat(arr[0]), arr.slice(1));
        });
    }


    it('testing trampoline :: f -> f -> *', function () {
        var _f = function (arr) {
            return funkyJS.trampoline(_flatten([], arr));
        }

        expect(_f([1, [[[2, 3, [4, [5]]]], 6]])).toEqual([1, 2, 3, 4, 5, 6]);
    });

});