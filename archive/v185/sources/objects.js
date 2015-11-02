;(function (global, factory) {
    var ext,
        it;

    if (typeof define === 'function' && define.amd) {
        define(['./type'], factory);

    } else if (typeof exports === 'object') {
        module.exports = factory(require('type'));

    } else {
        ext = factory(global.funkyJS);
        for (it in ext) {
            if (ext.hasOwnProperty(it)) {
                global.funkyJS[it] = ext[it];
            }
        }

    }
})(this, function (type) {

    /**
    @module objects
    **/
    var api = {};





    // INTERNAL UTILITES
    // =================
    var hasOwn = Object.prototype.hasOwnProperty;




    /**
    Takes a property or method name and a object and returns true if the object
        has the property (not inherited) or false if not

    @method has
    @for funkyJS
    @param {string} s Name of the property or method
    @param {object} o The object to test against
    @return {boolean} True if the property exists, false otherwise

    @example
        var dict = {
            foo: 'bar'
        }

        funkyJS.has('foo', dict);
        // -> true

        funkyJS.has('howdy', dict);
        // -> false

        funkyJS.has('foo')(dict);
        // -> true

    **/
    api.has = function has (s, o) {
        if (arguments.length < 1) {
            return has;
        }

        if (arguments.length < 2) {
            return function (o) {
                return has(s, o);
            }
        }

        return type.isNotNil(o) && hasOwn.call(o, ('' + s));
    }

    /**
    Takes a property or method name and a object and returns the propertyvalue
        on the object if it exists, otherwise null

    @method get
    @for funkyJS
    @param {string} s Name of the property or method
    @param {object} o The object to get the value from
    @return {any|null} The value of the property or null if it does not exist

    @example
        var dict = {
            foo: 'bar'
        }

        funkyJS.get('foo', dict);
        // -> 'bar'

        funkyJS.get('howdy', dict);
        // -> null

        funkyJS.get('foo')(dict);
        // -> 'bar'

    **/
    api.get = function get (s, o) {
        var p;

        if (arguments.length < 1) {
            return get;
        }

        if (arguments.length < 2) {
            return function (o) {
                return get(s, o);
            }
        }

        p = '' + s;
        if (type.isNotNil(o) && type.isNotNil(o[p])) {
            return o[p];
        }

        return null;
    }

    /**
    Takes a property or method name and a array of objects and returns the value
        on the named property/method for each object as a new array if it exists
        otherwise it returns null

    @method pluck
    @for funkyJS
    @param {string} s Name of the property or method
    @param {array} os Array of objects to get the value from
    @return {array} The collected values or null if the value has not existed

    @example
        var dicts = [{
            foo: 'bar'
        }, {
            foo: 'baz'
        }, {
            foo: 'bam'
        }];

        funkyJS.pluck('foo', dicts);
        // -> ['bar', 'baz', 'bam']

        funkyJS.pluck('howdy', dicts);
        // -> [null, null, null]

        funkyJS.pluck('foo')(dicts);
        // -> ['bar', 'baz', 'bam']

        funkyJS.pluck('foo', dicts[0]);
        // -> 'bar'

    **/
    api.pluck = function pluck (s, os) {
        if (arguments.length < 1) {
            return pluck;
        }

        if (arguments.length < 2) {
            return function (os) {
                return pluck(s, os);
            }
        }

        if (type.isArray(os)) {
            return os.map(api.get(s));
        }

        return api.get(s, os);
    }

    /**
    Given a object, the keys function returns the keys of the object or a empty
        array if anything other than a object is given

    @method keys
    @for funkyJS
    @param {object} o The object to get the keys from
    @return {array} Array of all keys as strings or empty array

    @example
        var dict = {
            foo: 'bar',
            goo: 'car'
        }

        funkyJS.keys(dict);
        // -> ['foo', 'goo']

        funkyJS.keys(null);
        // -> []

        funkyJS.keys()(dict)
        // -> ['foo', 'goo']

    **/
    api.keys = function keys (o) {
        if (arguments.length < 1) {
            return keys;
        }

        if (type.isNotObject(o)) {
            return [];
        }

        return Object.keys(o);
    }

    /**
    The values function returns the values of a given object as array or a empty
        array if no values are present or anything other than a object is given

    @method values
    @for funkyJS
    @param {object} o The object to get the values from
    @return {array} Array of all values or empty array

    @example
        var dict = {
            foo: 'bar',
            goo: 'car'
        }

        funkyJS.values(dict);
        // -> ['bar', 'car']

        funkyJS.values(null);
        // -> []

        funkyJS.values()(dict);
        // -> ['bar', 'car']

    **/
    api.values = function values (o) {
        if (arguments.length < 1) {
            return values;
        }

        return api.keys(o).map(function (k) { return o[k]; });
    }

    /**
    The methods function takes a object and returns the keys of all functions
        that can be found on the object as array of strings or a empty array if
        no functions are found or a non object is given

    @method methods
    @for funkyJS
    @param {object} o The object to get the functions from
    @return {array} Array of method names or empty array

    @example
        var dict = {
            foo: 'bar',
            goo: 'car',
            toString: function () {
                return 'Dictionary(foo, goo)';
            }
        }

        funkyJS.methods(dict);
        // -> ['toString']

        funkyJS.methods(null);
        // -> []

        funkyJS.methods()(dict);
        // -> ['toString']

    **/
    api.methods = function methods (o) {
        if (arguments.length < 1) {
            return methods;
        }

        return api.keys(o).filter(function (k) { return type.isFunction(o[k]); });
    }

    /**
    If given a object, the pairs method returns a array of key-value pairs as
        arrays or a empty array if a non-object is given

    @method pairs
    @for funkyJS
    @param {object} o The object to get the pairs from
    @return {array} Array of key-value pairs or empty array

    @example
        var dict = {
            foo: 'bar',
            goo: null
        }

        funkyJS.pairs(dict);
        // -> [[foo, 'bar'], [goo, null]]

        funkyJS.pairs(null);
        // -> []

        funkyJS.pairs()(dict);
        // -> [[foo, 'bar'], [goo, null]]

    **/
    api.pairs = function pairs (o) {
        if (arguments.length < 1) {
            return pairs;
        }

        return api.keys(o).map(function (k) { return [k, o[k]]; });
    }

    /**
    The inverse function takes in a object and returns a copy of it with the keys
        and the values reversed, so that the keys become the values and vice-versa.
        Note that the values should be unique and serializable to a string

    @method inverse
    @for funkyJS
    @param {object} o The object to inverse
    @return {object|null} A copy of the given object or null

    @example
        var dict = {
            foo: 'bar',
            goo: 'car'
        }

        funkyJS.inverse(dict);
        // -> { bar: 'foo', car: 'goo' }

        funkyJS.inverse(null);
        // -> null

        funkyJS.inverse()(dict);
        // -> { bar: 'foo', car: 'goo' }

    **/
    api.inverse = function inverse (o) {
        var copy;

        if (arguments.length < 1) {
            return inverse;
        }

        if (type.isNotObject(o)) {
            return null;
        }

        copy = {};
        return api.keys(o).reduce(function (acc, k) {
            acc[String(o[k])] = k;
            return acc;
        }, copy);
    }

    /**
    The instance function always returns a instance of the given constructor. If
        the second argument already is a instance of the constructor, it is
        returned, otherwise a new instance of the constructor is created. This
        allows to create instances out of every function

    @method instance
    @for funkyJS
    @param {function} Ctor The constructor function
    @param {any} [context] The current context to check against (optional)
    @return {object} Context if given a instance of Ctor, otherwise new Ctor

    @example
        function thing (value) {
            var self = funkyJS.instance(thing, this);
            self.value = function () {
                return value;
            }
            return self;
        }

        thing.is = function (x) {
            return x instanceof thing;
        }

        var _t = thing(10);

        thing.is(_t);
        // -> true

        _t.value();
        // -> 10

    **/
    api.instance = function instance (Ctor, context) {
        if (type.isNotFunction(Ctor)) {
            throw new Error('instance expected Ctor to be function but saw ' + Ctor);
        }

        if (context !== undefined) {
            if (Ctor.prototype.isPrototypeOf(context)) {
                return context;
            }
        }

        return Object.create(Ctor.prototype);
    }

    /**
    The factory function allows to create a factory for any given constructor
        function

    @method factory
    @for funkyJS
    @param {function} Ctor Constructor function
    @return {function} The factory for Ctor

    @example
        var It = function (val) {
            this.value = val;
        }
        It.prototype.type = function () {
            return typeof this.value;
        }

        var makeIt = funkyJS.factory(It);

        var it = makeIt('Hello World');
        it.type();
        // -> string

        it.value;
        // -> 'Hello World'

    **/
    api.factory = function factory (Ctor) {
        if (type.isNotFunction(Ctor)) {
            throw new Error('factory expected Ctor to be function but saw ' + Ctor);
        }

        return function (/* args */) {
            var it = Object.create(Ctor.prototype);
            Ctor.apply(it, arguments);
            return it;
        }
    }

    /**
    The extend method takes in two objects and extends the first one with the
        last one. See also the extendWith method

    @method extend
    @for funkyJS
    @param {object} o The destination to extend
    @param {object} s The extension
    @return {object} The extended destination

    @example
        var dict = {
            foo: 'bar'
        }

        var ext = {
            goo: 'car'
        }

        funkyJS.extend(dict, ext);
        // -> { foo: 'bar', goo: 'car' }

        funkyJS.extend(dict, null);
        // -> { foo: 'bar' }

        funkyJS.extend(null, ext);
        // -> null

        funkyJS.extend(null, null);
        // -> null

        funkyJS.extend(dict)()(ext);
        // -> { foo: 'bar', goo: 'car' }

    **/
    api.extend = function extend (o, s) {
        if (arguments.length < 1) {
            return extend;
        }

        if (arguments.length < 2) {
            return function (s) {
                return extend(o, s);
            }
        }

        if (type.isNotObject(o) || type.isNotObject(s)) {
            return o;
        }

        return api.keys(s).reduce(function (acc, k) {
            acc[k] = s[k];
            return acc;
        }, o);
    }

    /**
    The extendWith method takes in two objects and extends the last one with the
        first one. See also the extend method

    @method extendWith
    @for funkyJS
    @param {object} s The extension
    @param {object} o The destination to extend
    @return {object} The extended destination

    @example
        var dict = {
            foo: 'bar'
        }

        var ext = {
            goo: 'car'
        }

        funkyJS.extendWith(ext, dict);
        // -> { foo: 'bar', goo: 'car' }

        funkyJS.extendWith(ext, null);
        // -> null

        funkyJS.extendWith(null, dict);
        // -> { foo: 'bar' }

        funkyJS.extendWith(null, null);
        // -> null

        funkyJS.extendWith(ext)()(dict);
        // -> { foo: 'bar', goo: 'car' }

    **/
    api.extendWith = function extendWith (s, o) {
        if (arguments.length < 1) {
            return extendWith;
        }

        if (arguments.length < 2) {
            return function (o) {
                return extendWith(s, o);
            }
        }

        return api.extend(o, s);
    }

    /**
    The inherits method is designed to work particularly well with constructor
        functions. It takes a two object, from which the first one is the source
        and the second one is the extension on the source. The returned value is
        a new object to use as prototype

    @method inherits
    @for funkyJS
    @param {object} src The original constructor to inherit
    @param {object} ext The extension to the original class
    @return {object} A new prototype object

    @example
        var Source = function () {}

        Source.prototype = {
            constructor: Source,

            foo: function () {
                window.console.log('foo::() called');
            },

            bar: function () {
                window.console.log('bar::() was called');
            }
        }

        Source.subClass = function (ext) {
            return funkyJS.inherits(Source, ext);
        }



        var Extended = function () {}

        Extended.prototype = Source.subClass({
            constructor: Extended,

            fooBar: function () {
                this.foo();
                this.bar();
            }
        });

        Extended.subClass = function (ext) {
            return funkyJS.inherits(Extended, ext);
        }

    **/
    api.inherits = function inherits (superClass, target) {
        if (arguments.length < 1) {
            return inherits;
        }

        if (arguments.length < 2) {
            return function (target) {
                return inherits(superClass, target);
            }
        }

        return api.extend(api.extend({}, superClass && superClass.prototype || {}), target);
    }

    /**
    The delegate function is a way to delegate the behaviour of one object to
        other objects. It allows to specify the methods which are available
        exclusive. This means, if no method is specified or none of the given
        method names exists on the provider, no method will be available
        on the receiver either. It is mostly useful if you have a certain
        behaviour you want to share across instances or classes/prototypes

    @method delegate
    @for funkyJS
    @param {object} provider The object which provides methods
    @param {object} receiver The object on which the methods are called
    @param {array} methods Names of method to provide
    @return {object} The receiver

    @example
        var earnsMoney = funkyJS.delegate({
            _parseCurrency: function (input) {
                return '$' + (funkyJS.isNumber(input) ? input.toFixed(2) : '0.00');
            },
            income: function (input) {
                var income = this._parseCurrency(input);
                this.salary = income;
            },
            incrementByPercentage: function (perc) {
                var money = +(this.salary.replace('$', '')),
                    inc = funkyJS.isNumber(perc) && perc > 1 ? perc : 1;

                this.income(money + (money/100 * inc));
            }
        });

        var joe = {
            name: 'joe'
        }

        earnsMoney(joe, [
            'income',
            'incrementByPercentage'
        ]);

        joe.name;
        // -> 'joe'

        joe.income(1500);
        joe.salary;
        // -> '$1500.00'

        joe.incrementByPercentage(6);
        joe.salary;
        // -> '$1590.00'

    **/
    api.delegate = function delegate (provider, receiver, methods) {
        if (arguments.length < 1 || type.isNotObject(provider)) {
            return delegate;
        }

        if (arguments.length < 2 || type.isNotObject(receiver)) {
            return function (receiver, methods) {
                return delegate(provider, receiver, methods);
            }
        }

        if (arguments.length < 3 || type.isNotArray(methods)) {
            return function (methods) {
                return delegate(provider, receiver, methods);
            }
        }

        methods.forEach(function (method) {
            if (type.isFunction(provider[method])) {
                receiver[method] = function () {
                    return provider[method].apply(receiver, arguments);
                }
            }
        });

        return receiver;
    }

    /**
    The forward function can be used to achieve forwarding of method calls from
        one object to another. This is useful if you want to use a object as
        a property of some other object and want to share some methods from
        the inner object on the outer one. It allows to specify the methods
        exclusive. This means, if no method is specified or none of the given
        method names exists on the receiver, no method will be available
        on the forwarder either.

    @method forward
    @for funkyJS
    @param {object} forwarder The objects which forwards the method calls
    @param {object} receiver The object which receives the method calls
    @param {array} methods Names of method to provide
    @return {object} The forwarder

    @example
        var joe = {
            name: 'joe'
        }

        var familyStateManager = function () {
            var partner;
            return {
                marry: function () {
                    partner = 1;
                }
                divorce: function () {
                    partner = 0;
                },
                isMarried: function () {
                    return !!partner;
                }
            };
        }

        funkyJS.forward(joe, familyStateManager(), [
            'marry',
            'divorce',
            'isMarried'
        ]);

        joe.name;
        // -> joe

        joe.isMarried();
        // -> false

        joe.marry();
        joe.isMarried();
        // -> true

        joe.divorce();
        joe.isMarried();
        // -> false

    **/
    api.forward = function forward (forwarder, receiver, methods) {
        if (arguments.length < 1 || type.isNotObject(forwarder)) {
            return forward;
        }

        if (arguments.length < 2 || type.isNotObject(receiver)) {
            return function (receiver, methods) {
                return forward(forwarder, receiver, methods);
            }
        }

        if (arguments.length < 3 || type.isNotArray(methods)) {
            return function (methods) {
                return forward(forwarder, receiver, methods);
            }
        }

        methods.forEach(function (method) {
            if (type.isFunction(receiver[method])) {
                forwarder[method] = function () {
                    return receiver[method].apply(receiver, arguments);
                }
            }
        });

        return forwarder;
    }

    /**
    The immutable function takes an object and returns a immutable copy of it

    @method immutable
    @for funkyJS
    @param {object} o Base object
    @return {object} Immutable copy of the base object

    @example
        var money = funkyJS.immutable({
            dollar: 4,
            cents: 50
        });

        money.dollar;
        // -> 4

        money.dollar = 5;

        money.dollar;
        // -> 4

    **/
    api.immutable = function immutable (o) {
        if (arguments.length < 1) {
            return immutable;
        }

        if (type.isNotObject(o)) {
            return o;
        }

        return Object.keys(o).reduce(function (acc, k) {
            Object.defineProperty(acc, k, {
                enumerable: true,
                writable: false,
                value: o[k]
            });
            return acc;
        }, {});
    }

    /**
    The fAccess function allows to turn a object or array into a function

    @method fAccess
    @for funkyJS
    @param {object|array} o Any plain object or array
    @return {function} Accessor function

    @example
        var john = funkyJS.fAccess({
            name: 'John Doe',
            age: 30
        });

        ['name', 'age'].map(john);
        // -> ['John Doe', 30]



        var abc = funkyJS.fAccess([
            'a', 'b', 'c', 'd', 'e', 'f', 'g',
            'h', 'i', 'j', 'k', 'l', 'm', 'n',
            'o', 'p', 'q', 'r', 's', 't', 'u',
            'v', 'w', 'x', 'y', 'z', ' ', '!'
        ]);

        [7, 4, 11, 11, 14, 26, 23, 14, 18, 12, 3, 27].map(abc).join('');
        // -> 'hello world!'

    **/
    api.fAccess = function fAccess (o) {
        if (type.isNotObject(o) && type.isNotArray(o)) {
            throw new Error('fAccess expected argument to be object but saw ' + o);
        }

        function fobj (key) {
            return fobj.o[key];
        }
        Object.defineProperty(fobj, 'o', {
            enumerable: false,
            writable: false,
            value: o
        });
        return fobj;
    }



    return api;

});