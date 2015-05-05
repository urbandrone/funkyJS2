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

    function isMultiDispatchDef (item) {
        return item &&
               type.isArray(item.args) &&
               type.isFunction(item.proc);
    }

    function acceptsDispatchTo (argsList) {
        return function (comparator, index) {
            return !!comparator(argsList[index]);
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
            // enforce incoming arguments to be a string and
            //   a date object. any function which returns a
            //   boolean result may be used here
            [funkyJS.isString, funkyJS.isDate],
            Person.is
        )(function (name, birthday) {
            if (+birthday > +(new Date())) {
                // this throws error because it violates the
                //   output contract, so we are able to detect
                //   persons created with a date in future
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
        var fromStrDateMake = funkyJS.hom([
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
        Person.make = fromStrDateMake(Person.is)(function (name, bDay) {
            return new Person(name, bDay);
        });

        // the label factory
        var makeLabel = fromStrDateMake(isLabel)(labelDelivery);

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

    /**
    The multiDispatch function allows to create so called multi methods, known
        from LISP, which makes it possible to define a single function, composed
        out of multiple functions which are called depending on the type of the
        input arguments. Please note that the arity of a multi method/multiple
        dispatched function is zero, so it might be useful to use the aritize
        function after creating a multi dispatched function depending on the
        usecase

    @method multiDispatch
    @for funkyJS
    @param {array} defs Definition objects of a function in a multi method
    @return {function} The multi method

    @example

        var multiply = funkyJS.multiDispatch([{
            // this definition says:
            // -> input must be 2 arguments of type number
            // -> output must be of type number
            // -> operation to perform if input validates
            args: [funkyJS.isNumber, funkyJS.isNumber],
            out: funkyJS.isNumber,
            proc: function (n1, n2) {
                return n1 * n2;
            }
        }, {
            // this definition says:
            // -> input must be 1 argument of type number
            // -> any output accepted
            // -> operation to perform if input validates
            args: [funkyJS.isNumber],
            proc: function (n) {
                return n * n;
            }
        }, {
            // this definition says:
            // -> input must be 1 argument of type array
            // -> output must be of type number
            // -> operation to perform if input validates
            args: [funkyJS.isArray],
            out: funkyJS.isNumber,
            proc: function (list) {
                return list.reduce(function (acc, n) { return acc * n; }, 0);
            }
        }]);

        multiply(2, 3);
        // -> 6

        multiply(9);
        // -> 81

        multiply([1, 2, 3, 4, 5]);
        // -> 120

        multiply(null);
        // -> undefined

        multiply.length;
        // -> 0

        // uses the aritize function to create the wished arity
        multiply = funkyJS.aritize(2, true)(multiply);

        multiply.length;
        // -> 2

        // works like before
        multiply(2, 3);
        // -> 6

        // works also with single argument like before
        multiply(9);
        // -> 81

        // or with arrays
        multiply([1, 2, 3, 4, 5]);
        // -> 120

    **/
    api.multiDispatch = function multiDispatch (defs) {
        var _applicable;
        if (type.isNotArray(defs)) {
            throw new Error('multiDispatch expects argument to be array but saw ' + defs);
        }

        _applicable = defs.filter(isMultiDispatchDef);
        return function () {
            var _args = [].slice.call(arguments),
                _rslt,
                _def,
                _i;

            for (_i = 0; !!(_def = _applicable[_i]); _i += 1) {
                if (_def.args.length > 0 && _args.length !== _def.args.length) {
                    continue; // skip, wrong input
                }

                if (!_def.args.every(acceptsDispatchTo(_args))) {
                    continue; // skip, input not accepted
                }

                _rslt = _def.proc.apply(this, _args);
                if (type.isFunction(_def.out) && !!_def.out.call(this, _rslt)) {
                    return _rslt; // stop as soon as possible
                }
            }

            return _rslt;
        }
    }

    /**
    The displaceArgs function allows to rearrange the position of arguments passed
        to a function before the function is applied to them. This is especially
        useful if a function should be reused, but the order of arguments it
        consumes does not match for any reason with the new implementation (for
        example: a incoming array should be applied to a existing function, but
        the order of items is incorrect)

    @method displaceArgs
    @for funkyJS
    @param {function} fn A function with the operation
    @param {array} positions Index:value pairs where the values or the argument positions
    @return {function} A wrapper function

    @example
        var add = function (a, b) {
            return a + b;
        }

        add('a', 'z');
        // -> 'az'

        var revAdd = funkyJS.displaceArgs(add, [1, 0]);

        revAdd('z', 'a');
        // -> 'az'

    **/
    api.displaceArgs = function displaceArgs (fn, positions) {
        if (type.isNotFunction(fn)) {
            throw new Error('displaceArgs expects first argument to be function but saw ' + fn);
        }

        if (positions === undefined) {
            return function (positions) {
                return displaceArgs(fn, positions);
            }
        }

        if (type.isNotArray(positions)) {
            throw new Error('displaceArgs expects second argument to be array but saw ' + positions);
        }

        if (fn.length < positions.length) {
            throw new Error('displaceArgs(:array, :fn) Given functions arity is to low');
        }

        return function () {
            var _params = arguments,
                _args = [];

            positions.forEach(function (pos, idx) {
                _args[idx] = _params[pos];
            });

            return fn.apply(this, _args);
        }
    }





    /***
     * EXPORT
     * ======
     */

    return api;

});