/* globals funkyJS */
describe('funkyJS Advices Extension Module', function () {
    var gValue = 0,
        gLastUUID = null,
        f = funkyJS;



    var o = {
        getUUID: f.advisable(function () {
            return 'id' + gValue;
        }),
        getError: f.advisable(function () {
            throw new Error('TestError');
        })
    };
    o.getUUID.
        adviceBefore(function () {
            gValue = gValue + 1;

        }).
        adviceAfter(function (result) {
            gLastUUID = result;
        });

    o.getError.adviceError(function (err) {
        gLastUUID = err.message;
    });

    var beforeO = {
        test: f.advisable(f.identity)
    };
    beforeO.test.adviceBefore(function (input) {
        return f.isNumber(input) ? input : [-1]
    });



    var o2 = {
        _id: 0,
        getUUID: f.advisable(function () {
            return 'id' + this._id;
        })
    };
    o2.getUUID.
        adviceBefore(function () {
            this._id = this._id + 1;
        }).
        adviceBefore(function () {
            this._id = this._id * 2;
        });


    it('testing beforeAdvice :: f -> f -> f', function () {
        var oldGValue = gValue,
            uuid = o.getUUID();

        expect(oldGValue).toBe(0);
        expect(uuid).toBe('id1');
        expect(gValue).toBe(1);

        expect(beforeO.test(1)).toBe(1);
        expect(beforeO.test(null)).toBe(-1);

        expect(o2._id).toBe(0);
        expect(o2.getUUID()).toBe('id1');
        expect(o2._id).toBe(1);

        expect(o2.getUUID()).toBe('id3');
        expect(o2._id).toBe(3);
    });


    it('testing afterAdvice :: f -> f -> f', function () {
        var oldGValue = gValue,
            uuid = o.getUUID();

        expect(oldGValue).toBe(1);
        expect(uuid).toBe('id2');
        expect(gValue).toBe(2);
        expect(gLastUUID).toBe(uuid);
    });


    it('testing catchAdvice :: f -> f -> f', function () {
        var oldGValue = gValue;
            
        o.getError();

        expect(oldGValue).toBe(2);
        expect(gValue).toBe(2);
        expect(gLastUUID).toBe('TestError');
    });
});