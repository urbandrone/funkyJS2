/* globals funkyJS, describe, it, expect */
describe('funkyJS Objects Module', function () {
    var dict = {
        foo: 'bar',
        hoo: 'baz',
        fn: function () {}
    };

    it('testing has :: f -> s, o -> b', function () {
        var b1 = funkyJS.has('foo', dict);
        var b2 = funkyJS.has('goo', dict);

        expect(b1).toBe(true);
        expect(b2).toBe(false);
    });

    it('testing get :: f -> s, o -> x', function () {
        var p1 = funkyJS.get('foo', dict);
        var p2 = funkyJS.get('goo', dict);

        expect(p1).toEqual('bar');
        expect(p2).toEqual(null);
    });

    it('testing keys :: f -> o -> a', function () {
        var k = funkyJS.keys(dict);
        var n = funkyJS.keys(null);

        expect(k).toEqual(['foo', 'hoo', 'fn'])
        expect(k.length).toEqual(3)
        expect(n).toEqual([])
        expect(n.length).toEqual(0)
    });

    it('testing values :: f -> o -> a', function () {
        var v = funkyJS.values(dict);
        var n = funkyJS.values(null);

        expect(v).toEqual(['bar', 'baz', dict.fn]);
        expect(v.length).toEqual(3);
        expect(n).toEqual([]);
        expect(n.length).toEqual(0);
    });

    it('testing methods :: f -> o -> a', function () {
        var m = funkyJS.methods(dict);
        var n = funkyJS.methods(null);

        expect(m).toEqual(['fn']);
        expect(m.length).toEqual(1);
        expect(n).toEqual([]);
        expect(n.length).toEqual(0);
    });

    it('testing pairs :: f -> o -> a', function () {
        var p = funkyJS.pairs(dict);
        var n = funkyJS.pairs(null);

        expect(p).toEqual([['foo', 'bar'], ['hoo', 'baz'], ['fn', dict.fn]]);
        expect(p.length).toEqual(3);
        expect(p[0].length).toEqual(2);
        expect(n).toEqual([]);
        expect(n.length).toEqual(0);
    });

    it('testing pluck :: f -> o -> a', function () {
        var p = funkyJS.pluck('foo');

        expect(p([dict])).toEqual(['bar']);
    });

    it('testing inverse :: f -> o -> o', function () {
        var i = funkyJS.inverse({foo: 'bar', hoo: 'baz'});
        var n = funkyJS.inverse(null);

        expect(i).toEqual({bar: 'foo', baz: 'hoo'});
        expect(n).toEqual(null);
    });

    it('testing instance :: f -> f, o -> o', function () {
        function thing (value) {
            var self = funkyJS.instance(thing),
                now = value;
            self.get = function () {
                return now;
            };
            self.set = function (v) {
                now = v;
            };
            return self;
        }
        var it = thing('Testobject');
        expect(it.get()).toBe('Testobject');

        it.set(it.get() + ':altered');
        expect(it.get()).toBe('Testobject:altered');
    });

    it('testing extend :: f -> o, o -> o', function () {
        var o = {};
        var e = {foo: 'bar'};

        var o2 = funkyJS.extend(o, e);
        var o3 = funkyJS.extend({})(e);
        var o4 = funkyJS.extend(null, e);
        var o5 = funkyJS.extend(e, null);

        expect(o2).toEqual({foo: 'bar'});
        expect(o3).toEqual(e);
        expect(o4).toEqual(null);
        expect(o5).toEqual(e);
    });

    it('testing extendWith :: f -> o, o -> o', function () {
        var o = {};
        var e = {foo: 'bar'};

        var o2 = funkyJS.extendWith(e, o);
        var o3 = funkyJS.extendWith(e)({});
        var o4 = funkyJS.extendWith(e, null);
        var o5 = funkyJS.extendWith(null, e);

        expect(o2).toEqual({foo: 'bar'});
        expect(o3).toEqual(e);
        expect(o4).toEqual(null);
        expect(o5).toEqual(e);
    });

    it('testing inherits :: f -> f, o -> o', function () {
        var cTor = function () { this.v = 1; };
        cTor.prototype.inc = function () { this.v += 1; };
        var e = {foo: 'bar'};

        var o1 = funkyJS.inherits(cTor, e);
        var o2 = funkyJS.inherits(cTor)(e);
        var o3 = funkyJS.inherits(cTor, null);
        var o4 = funkyJS.inherits(null, e);

        expect(o1.foo === 'bar' && funkyJS.isFunction(o1.inc)).toBe(true);
        expect(o2.foo === 'bar' && funkyJS.isFunction(o2.inc)).toBe(true);
        expect(funkyJS.isFunction(o3.inc)).toBe(true);
        expect(o4.foo === 'bar' && funkyJS.isFunction(o4.inc)).not.toBe(true);
    });

    it('testing delegate :: f -> o, a, o -> o', function () {
        var incDec = {
            inc: function () { this.v = (this.v || 0) + 1; },
            dec: function () { this.v = (this.v || 0) - 1; }
        }

        var o1 = funkyJS.delegate(incDec, {v: 10}, ['inc', 'dec']);
        var o2 = funkyJS.delegate(incDec, {v: 20})(['inc']);
        var o3 = funkyJS.delegate(incDec)({v: 30})(['dec']);

        o1.inc();
        o2.inc();
        o3.dec();

        expect(o1.v).toEqual(11);
        expect(o2.v).toEqual(21);
        expect(o3.v).toEqual(29);
    });

    it('testing forward :: f -> o, a, o -> o', function () {
        var counter = function () {
            return {
                now: 0,
                inc: function () { this.now += 1; },
                dec: function () { this.now -= 1; },
                cur: function () { return this.now; }
            }
        }

        var o1 = funkyJS.forward({}, counter(), ['cur', 'inc', 'dec']);

        o1.inc();
        o1.inc();
        o1.dec();

        expect(o1.cur()).toEqual(1);
        expect(o1.now).toBeUndefined();
    });

    it('testing immutable :: f -> o -> o', function () {
        var o = funkyJS.immutable({a: 1});
        o.a = 2;
        expect(o.a).toBe(1);
        expect(o.hasOwnProperty('a')).toBe(true);
    });

    it('testing fAccess :: f -> o -> f', function () {
        var o = funkyJS.fAccess({v: 10});
        expect(o('v')).toBe(10);
        expect(['v'].map(o)).toEqual([10]);
    });

    it('testing factory :: f -> f -> f', function () {
        var cTor = function (n) { this.v = n; };
        cTor.prototype.inc = function () {
            this.v += 1;
            return this;
        };

        var fCtor = funkyJS.factory(cTor);
        expect(fCtor(9).inc().v).toBe(10);
        expect(fCtor(10)).toEqual(new cTor(10));
    });
});