;(function (global, factory) {
    var ext,
        it;

    if (typeof define === 'function' && define.amd) {
        define([
            '../type',
            '../arity'
        ], factory);

    } else if (typeof exports === 'object') {
        module.exports = factory(
            require('../type'),
            require('../arity')
        );

    } else {
        ext = factory(
            global.funkyJS,
            global.funkyJS
        );

        for (it in ext) {
            if (ext.hasOwnProperty(it)) {
                global.funkyJS[it] = ext[it];
            }
        }
    }

})(this, function (type, arity) {

    /**
    @module experiments
    **/
    var api = {};



    // internals
    function passesInput (ins) {
        return function (item, i) {
            if (!!ins[i](item)) {
                return true;
            }

            throw new TypeError('passInputContracts(:item) mismatches contract ' + ins[i]);
        }
    }



    /**
    The hom function allows to fix the types of arguments a function accepts and
        the type of output value a function must return to any type of function
        by passing input contracts and a output contract. This allows to implement
        some kind of typesafe functions known from for example Java into the JS
        world. The first call to hom returns a function, which accepts a function
        descibing the operation to perform.

    @method hom
    @for funkyJS
    @param {array} ins Array of input contract functions
    @param {function} out The output contract function
    @return {function} Function awaiting a operation

    @example
        // a "Person" constructor, which is highly dependend on the types of
        //   arguments passed to it to function correctly
        var Person = function (name, birthdate) {
            var _now = +(new Date()) - (+birthdate);

            this.name = Person.formatName(name);
            this.age = Person.calcAge(_now);
            return this;
        }

        // a "isPerson" contract
        Person.is = function (instance) {
            return Person.prototype.isPrototypeOf(instance);
        }

        Person.formatName = function (name) { ... }
        Person.calcAge = function (msSinceBirth) { ... }



        // create a factory function which is typesafe
        Person.make = funkyJS.hom(
            [funkyJS.isString, funkyJS.isDate],
            Person.is
        )(function (name, birthday) {
            if (+birthday > +(new Date())) {
                return null;
            }
            return new Person(name, birthday);
        });



        Person.make('john doe', new Date(1985, 2, 25));
        // -> Person(name:'John Doe', age: ... );

        Person.make(1, 0);
        // -> Error

        Person.make('john doe', 0);
        // -> Error

        Person.make('john doe', new Date());
        // -> Person(name:'John Doe', age: 0); // just born

        Person.make('john doe', new Date(2320, 2, 25));
        // -> Error



        // the behaviour of hom allows also to store for example a creation
        //   process before defining the type of output
        var strDateInput = funkyJS.hom([
            funkyJS.isString,
            funkyJS.isDate
        ]);

        // a delivery label factory
        var labelDelivery = function (id, deliveryDate) {
            return {
                id: 'label-' + id,
                delivered: deliveryDate.toISOString()
            };
        }

        var isLabel = funkyJS.hom(
            [funkyJS.isObject],
            funkyJS.isObject
        )(function (label) {
            if (funkyJS.has('id', label) && funkyJS.has('delivered', label)) {
                return label;
            }
            return null;
        });


        // the factory for Person rewritten
        Person.make = strDateInput(Person.is)(function (name, bDay) {
            return new Person(name, bDay);
        });

        // the label factory
        var makeLabel = strDateInput(isLabel)(labelDelivery);

    **/
    api.hom = function hom (ins, out) {
        if (ins === undefined) {
            return hom;
        }

        if (out === undefined) {
            return function (out) {
                return hom(ins, out);
            }
        }

        if (type.isNotArray(ins) || !ins.every(type.isFunction)) {
            throw new Error('hom expects ins to be array but saw ' + ins);
        }

        if (type.isNotFunction(out)) {
            throw new Error('hom expects out to be function but saw ' + out);
        }

        return function (fn) {
            if (type.isNotFunction(fn)) {
                throw new Error('hom->f expects fn to be function but saw ' + fn);
            }

            if (fn.length !== ins.length) {
                throw new Error('hom->f aritiy of fn mismatches inputs length');
            }

            return arity.aritize(ins.length)(function (args) {
                var _result;
                if (args.every(passesInput(ins))) {
                    _result = fn.apply(this, args);
                }

                if (!out(_result)) {
                    throw new Error('hom->f->f-> output mismatches contract: ' + _result)
                }

                return _result;
            });
        }
    }



    api.eachWith = function eachWith (fn, list) {
        if (type.isNotFunction(fn)) {
            throw new Error('eachWith expects fn to be function but saw ' + fn);
        }

        if (list === undefined) {
            return function (list) {
                return eachWith(fn, list);
            }
        }

        list = Array.prototype.slice.call(list);
        if (type.isNotArray(list)) {
            throw new Error('eachWith expects list to be array but saw ' + list);
        }

        list.forEach(fn);
        return list;
    }

    api.mapWith = function mapWith (fn, list) {
        if (type.isNotFunction(fn)) {
            throw new Error('mapWith expects fn to be function but saw ' + fn);
        }

        if (list === undefined) {
            return function (list) {
                return mapWith(fn, list);
            }
        }

        list = Array.prototype.slice.call(list);
        if (type.isNotArray(list)) {
            throw new Error('mapWith expects list to be array but saw ' + list);
        }

        return list.map(fn);
    }

    api.filterWith = function filterWith (fn, list) {
        if (type.isNotFunction(fn)) {
            throw new Error('filterWith expects fn to be function but saw ' + fn);
        }

        if (list === undefined) {
            return function (list) {
                return filterWith(fn, list);
            }
        }

        list = Array.prototype.slice.call(list);
        if (type.isNotArray(list)) {
            throw new Error('filterWith expects list to be array but saw ' + list);
        }

        return list.filter(fn);
    }

    api.foldWith = function foldWith (fn, list, seed) {
        if (type.isNotFunction(fn)) {
            throw new Error('foldWith expects fn to be function but saw ' + fn);
        }

        if (list === undefined) {
            return function (list, seed) {
                return foldWith(fn, list, seed);
            }
        }

        if (seed === undefined) {
            return function (seed) {
                return foldWith(fn, list, seed);
            }
        }

        list = Array.prototype.slice.call(list);
        if (type.isNotArray(list)) {
            throw new Error('foldWith expects list to be array but saw ' + list);
        }

        return list.reduce(fn, seed);
    }

    api.foldRightWith = function foldRightWith (fn, list, seed) {
        if (type.isNotFunction(fn)) {
            throw new Error('foldRightWith expects fn to be function but saw ' + fn);
        }

        if (list === undefined) {
            return function (list, seed) {
                return foldRightWith(fn, list, seed);
            }
        }

        if (seed === undefined) {
            return function (seed) {
                return foldRightWith(fn, list, seed);
            }
        }

        list = Array.prototype.slice.call(list);
        if (type.isNotArray(list)) {
            throw new Error('foldRightWith expects list to be array but saw ' + list);
        }

        return list.reduceRight(fn, seed);
    }



    /***
     * EXPORT
     * ======
     */

    return api;

});