/* global describe, it, expect, funkyJS */
describe('funkyJS Lenses Module', function () {
    var source = {
        accountNum: 'af280dc8ae25bb',
        user: 'jdoe',
        names: [
            {first: 'John'},
            {last: 'Doe'}
        ]
    };

    var upper = function (str) { return str.toUpperCase(); }
    var fUpper = function (str) { return upper(str[0]) + str.slice(1); }
    
    var L = funkyJS.makeLense(['accountNum', 'user', 'names', 'last']);

    it('testing makeLense :: f -> a -> o', function () {
        var process1 = funkyJS.cmps(
            L.accountNum.over(upper)
        )(
            L.user.over(fUpper)
        );

        var done = process1(source);
        expect(L.user(done)).toBe('Jdoe');
        expect(L.accountNum(done)).toBe('AF280DC8AE25BB');
    });
});