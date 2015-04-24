describe('funkyJS Lambda Module', function () {

    var add = funkyJS.lambda('a, b -> a + b');
    var square = funkyJS.lambda('a -> a * a');
    var sub = funkyJS.lambda('_ - 1');
    var div = funkyJS.lambda('b -> c -> b / c');

    it('testing lambda :: f -> s -> f', function () {
        expect(add(2, 3)).toEqual(5);
        expect(square(2)).toEqual(4);
        expect(sub(4)).toEqual(3);
        expect(div(10)(5)).toEqual(2);
    });

});