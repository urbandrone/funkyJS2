;(function (global, factory) {
    var ext,
        it;

    if (typeof define === 'function' && define.amd) {
        define([
            '../type'
        ], factory);

    } else if (typeof exports === 'object') {
        module.exports = factory(
            require('type')
        );

    } else {
        ext = factory(
            global.funkyJS
        );

        for (it in ext) {
            if (ext.hasOwnProperty(it)) {
                global.funkyJS[it] = ext[it];
            }
        }
    }

})(this, function (type) {

    /**
    @module transducers
    **/
    var api = {};



    // utilities
    function genTransformer (f) {
        return {
            '@@transducer/init': function () { throw 'Not supported'; },
            '@@transducer/step': f,
            '@@transducer/result': function (x) { return x; }
        };
    }

    function comp (f, g) {
        return function () {
            return f.call(null, g.apply(null, arguments));
        }
    }



    /**
    Returns true for a reduced value

    @method isReduced
    @for funkyJS.transducers
    @param {any} value Any value to test
    @return {boolean} True or false

    @example
        var t = funkyJS.transducers;

        t.isReduced(val);
        // -> True or false

    **/
    api.isReduced = function isReduced (value) {
        return value &&
            (value['@@transducer/reduced'] || value.__transducer_reduced__);
    }

    /**
    Transforms a value into a reduced value

    @method reduced
    @for funkyJS.transducers
    @param {any} value Any value to set finally reduced
    @return {ReducedValue} A reduced value (immutable)

    @example
        var t = funkyJS.transducers;

        var val = t.reduced(1);
        // -> {value: 1}

        t.isReduced(val);
        // -> true

    **/
    api.reduced = function reduced (value) {
        return Object.create(null, {
            '@@transducer/value': {
                enumerable: true,
                writable: false,
                value: value                
            },
            value: {
                enumerable: true,
                writable: false,
                value: value
            },
            '@@transducer/reduced': {
                enumerable: false,
                writable: false,
                value: true                
            },
            __transducer_reduced__: {
                enumerable: false,
                writable: false,
                value: true
            }
        });
    }

    /**
    Transforms a reduced value into a normal value

    @method unReduced
    @alias deref
    @for funkyJS.transducers
    @param {ReducedValue} value Any reduced value
    @return {any} The unreduced value

    @example
        var t = funkyJS.transducers;

        var val = t.reduced(1);
        // -> val === {value: 1}

        t.isReduced(val);
        // -> true

        var nval = t.unReduced(val);
        // -> nval === 1

        t.isReduced(nval);
        // -> false

    **/
    api.deref = api.unReduced = function unReduced (rvalue) {
        return api.isReduced(rvalue) ? rvalue.value : rvalue;
    }

    /**
    Given a transformer/transducer, a seed value and a reducable, tries to fold
        the reducable into the seed value with the transformer

    @method foldl
    @for funkyJS.transducers
    @alias reduce
    @param {transducer|function} xf Transducer function or normal function
    @param {any} seed Final value in initial state
    @param {array|array-like|object|iterator} list The reducable
    @return {any} The final value

    @example
        var t = funkyJS.transducers;

        function add (a, b) { return a + b; }

        t.foldl(add, 0, [1, 2, 3]);
        // -> 6

    **/
    api.reduce = api.foldl = function foldl (xf, seed, list) {
        var _xf = type.isFunction(xf) ? genTransformer(xf) : xf,
            _v, _ks, _i, _l;

        if (list === undefined) {
            return function (_list) {
                return foldl(xf, seed, _list);
            }
        }

        if (seed === undefined) {
            return function (_seed, _list) {
                return foldl(xf, _seed, _list);
            }
        }

        _v = seed;
        if (type.isSequencial(list)) {
            for (_i = 0, _l = list.length; _i < _l; _i += 1) {
                _v = _xf['@@transducer/step'](_v, list[_i]);
                if (api.isReduced(_v)) {
                    _v = api.deref(_v);
                    break;
                }
            }

        } else if (type.isIterator(list)) {
            _i = list.next();
            while(!_i.done) {
                _v = _xf['@@transducer/step'](_v, _i.value);
                if(api.isReduced(_v)) {
                    _v = api.deref(_v);
                    break;
                }
                _i = list.next();
            }

        } else if (type.isObject(list)) {
            _ks = Object.keys(list)
            for (_i = 0, _l = _ks.length; _i < _l; _i += 1) {
                _v = _xf['@@transducer/step'](_v, [_ks[_i], list[_ks[_i]]]);
                if (api.isReduced(_v)) {
                    _v = api.deref(_v);
                    break;
                }
            }
        }

        return _xf['@@transducer/result'](_v);
    }

    /**
    Maps a transformer function and a step function into a seed and over a 
        collection. Does not perform lazy although it has a kind of lazy behaviour indeed.
        The function is fully curried, except for the transformer/transducer
        argument. The stepper function (second argument) should know how to add
        new items into the final result. The seed (third argument) should be the
        final result in it's initial state, while the input (last argument) is
        the source or starting value.

    @method transduce
    @for funkyJS.transducers
    @param {transducer|function} xf Transducer function or normal function
    @param {stepper|function} step One of the stepper functions or normal function
    @param {any} seed Final value in it's inital state
    @param {array|array-like|object|iterator} Collection to transduce
    @return {any} The final value

    @example
        var t = funkyJS.transducers,
            f = funkyJS;


        // multiple transformation, stored as tranducer function
        var xfSquareEven = f.compose(
            t.map(function (v) { return v * v; }),
            t.filter(function (v) { return v % 2 === 0; })
        );

        t.transduce(xfSquareEven, t.conj, [], [1, 2, 3, 4, 5]);
        // -> [4, 16]

        // ... or reversed?
        t.transduce(xfSquareEven, t.cons, [], [1, 2, 3, 4, 5]);
        // -> [16, 4]

        // another way to sum up
        t.transduce(xfSquareEven, t.combine, 0, [1, 2, 3, 4, 5]);
        // -> 20



        // single transformation, stored as a transducer function
        var xfIdentity = t.map(f.identity);

        // general "sum" transducer
        var xfSum = xfIdentity(t.combine, 0);

        xfSum([1, 2, 3, 4, 5]);
        // -> 15



        // DOM operations?
        var buttons = document.querySelector('button.clickMe');

        // define a handler...
        function myHandler (e) {
            ...
        }

        // make all active button clickable
        var xfClickableIfActive = f.compose(
            t.map(function (b) {
                // basically we create a side effect here
                b.addEventListener('click', myHandler, false);
                return b;
            }),
            t.filter(function (b) {
                return b.disabled === null;
            })
        );

        // do it!
        t.transduce(xfClickableIfActive, t.conj, [], buttons);
        // -> [button1, ...buttonN] (if not disabled)

    **/
    api.transduce = function transduce (xf, step, seed, v) {
        if (v === undefined) {
            return function (_v) {
                return transduce(xf, step, seed, _v);
            }
        }

        if (seed === undefined) {
            return function (_seed, _v) {
                return transduce(xf, step, _seed, _v);
            }
        }

        if (step === undefined) {
            return function (_step, _seed, _v) {
                return transduce(xf, _step, _seed, _v);
            }
        }

        return api.foldl(
            xf(type.isFunction(step) ? genTransformer(step) : step),
            seed,
            v
        );
    }

    /**
    Maps a transformer function into a seed value over the collection. Combines
        different depending on the type of seed value. See the example below for
        more information

    @method into
    @for funkyJS.transducers
    @param {any} seed Final value in it's inital state
    @param {transducer|function} xf Transducer function or normal function
    @param {array|array-like|object} Collection to transduce into the seed
    @return {any} The final value

    @example
        var t = funkyJS.transducers,
            f = funkyJS;

    var xfSquareNumericValues = f.compose(
        t.map(function (v) { return v * v; }),
        t.filter(f.compose(f.unary(parseInt), f.isNumber)),
        t.map(f.get('value'))
    );


    var squaresFromInputs = t.into([], xfSquareNumericValues);
    var sumOfSquaredInputs = t.into(0, xfSquareNumericValues);
    var strOfSquaredInputs = t.into('', xfSquareNumericValues);


    // pretending we have input fields with 1, empty string and 3 as values
    var inputs = document.querySelectorAll('input.with-num-val');

    squaresFromInputs(inputs);
    // -> [1, 9]

    sumOfSquaredInputs(inputs);
    // -> 10

    strOfSquaredInputs(inputs);
    // -> '19'

    **/
    api.into = function into (seed, xf, v) {
        if (v === undefined) {
            return function (_v) {
                return into(seed, xf, _v);
            }
        }

        if (xf === undefined) {
            return function (_xf, _v) {
                return into(seed, _xf, _v);
            }
        }

        if (type.isString(seed)) {
            return api.transduce(xf, api.combine, seed, v);
        }

        if (type.isNumber(seed)) {
            return api.transduce(xf, api.combine, seed, v);
        } 

        if (type.isObject(seed)) {
            return api.transduce(xf, api.merge, seed, v);
        }

        if (type.isArray(seed)) {
            return api.transduce(xf, api.conj, seed, v);
        }

        throw new Error('Unsupported input for into(seed, xf, input)');
    }



    // basic step functions
    
    /**
    Takes a list and a value and adds the value to the end of the list. Has a
        side effect on the list. If you do not want to have a side effect use
        funkyJS.transducers.conj instead

    @method append
    @for funkyJS.transducers
    @param {array} list List of results so far
    @param {any} v Next value
    @return {array} Modified list

    @example
        var t = funkyJS.transducers;

        var a = [1];
        var b = t.append(a, 2);
        // -> [1, 2]

        a === b;
        // -> true
    **/
    api.append = function append (list, v) {
        list.push(v);
        return list;
    }
    
    /**
    Takes a list and a value and adds the value to the front of the list. Has a
        side effect on the list. If you do not want to have a side effect use
        funkyJS.transducers.cons instead

    @method prepend
    @for funkyJS.transducers
    @param {array} list List of results so far
    @param {any} v Next value
    @return {array} Modified list

    @example
        var t = funkyJS.transducers;

        var a = [2];
        var b = t.prepend(a, 1);
        // -> [1, 2]

        a === b;
        // -> true
    **/
    api.prepend = function prepend (list, v) {
        list.unshift(v);
        return list;
    }
    
    /**
    Takes a list and a value and adds the value to the front of the list without
        side effects on the list. If you do want to have a side effect use
        funkyJS.transducers.prepend instead

    @method cons
    @for funkyJS.transducers
    @param {array} list List of results so far
    @param {any} v Next value
    @return {array} New list

    @example
        var t = funkyJS.transducers;

        var a = [2];
        var b = t.cons(a, 1);
        // -> [1, 2]

        a === b;
        // -> false
    **/
    api.cons = function (list, v) {
        return (Array.isArray(v) ? v : [v]).concat(list);
    }

    /**
    Takes a list and a value and adds the value to the end of the list without
        side effects on the list. If you do want to have a side effect use
        funkyJS.transducers.append instead

    @method conj
    @for funkyJS.transducers
    @param {array} list List of results so far
    @param {any} v Next value
    @return {array} New list

    @example
        var t = funkyJS.transducers;

        var a = [1];
        var b = t.conj(a, 2);
        // -> [1, 2]

        a === b;
        // -> false
    **/
    api.conj = function (list, v) {
        return list.concat(v);
    }

    /**
    Takes two values and directly combines them via `(+)`. Works on numbers and
        strings

    @method combine
    @for funkyJS.transducers
    @param {number|string} vA Result so far
    @param {number|string} vB Next value
    @return {number|string} Combined value

    @example
        var t = funkyJS.transducers;

        t.combine(1, 2);
        // -> 3

        t.combine('a', 'b');
        // -> 'ab'

    **/
    api.combine = function combine (a, b) {
        return a + b;
    }

    /**
    Takes a glue parameter and returns a stepper function which combines the
        result so far and the next value with the glue in between by calling
        `(+)`. Works on numbers and strings.

    @method join
    @for funkyJS.transducers
    @param {number|string} glue Glue value
    @return {function} A reducing function

    @example
        var t = funkyJS.transducers;

        t.join('-')(1, 2);
        // -> '1-2'

        var glueSpace = t.join(' ');

        glueSpace('a', 'b');
        // -> 'a b'

    **/
    api.join = function join (glue) {
        return function (a, b) {
            return a + glue + b;
        }
    }

    /**
    Given a object and a key-value pair, merges the pair into the object and
        returns it afterwards. If kv is a object itself, the whole object is
        merged into the record

    @method merge
    @for funkyJS.transducers
    @param {object} rec Object to merge into
    @param {array|object} kv Key-value pair where kv[0] is the key
    @return {object} Given `rec` object

    @example
        var t = funkyJS.transducers;

        t.merge({}, ['name', 'John Doe']);
        // -> {name: 'John Doe'}

        t.merge({}, {name: 'John Doe'});
        // -> {name: 'John Doe'}

    **/
    api.merge = function merge (rec, kv) {
        if (type.isObject(kv)) {
            return Object.keys(kv).reduce(function (r, k) {
                r[k] = kv[k];
                return r;
            }, rec);
        }
        rec[kv[0]] = kv[1];
        return rec;
    }




    // transformers
    
    /**
    Accepts a transformer function `t` and returns a function which itself also
        accepts a function and returns a transducer. If the interal `.step`
        function of the transducer is called, the transformer function `t` gets
        called with these arguments before it's final result will be returned:
        `step` a function which moves on to the next step. The transformer `t`
            may call this argument and returns it's result as the final result 
            of the computation or the final results so far.
        `f` the function passed to the returned function.
        `r` the final computed results so far
        `v` the next value

    @method liftTransformer
    @for funkyJS.transducers
    @param {function} t Transformer function `t`
    @return {function} A function awaiting `f`

    @example
        // this examples shows how to implement a transformer which acts like
        //   funkyJS.transducers.map if that wasn't defined already as well as
        //   for funkyJS.transducers.filter if that wasn't defined either

        var t = funkyJS.transducers,
            comp = funkyJS.compose;

        // a mapping transducer
        var xfMap = t.liftTransformer(function (step, f, r, v) {
            return step(r, f(v));
        });

        // a filtering transducer
        var xfFilter = t.liftTransformer(function (step, f, r, v) {
            return !!f(v) ? step(r, v) : r;
        });

        // try it:
        var vals = [1, 2, 3, 4, 5];

        var evenSquares = comp(
            xfMap(function (v) { return v * v; })
            xfFilter(function (v) { return v % 2 === 0; })
        );

        t.transduce(evenSquares, t.conj, [], vals);
        // -> [4, 16]

    **/
    api.liftTransformer = function liftTransformer (t) {
        return function (f) {
            return function (xf) {
                return {
                    '@@transducer/init': function () {
                        return xf['@@transducer/init']();
                    },
                    '@@transducer/step': function (r, v) {
                        return t(xf['@@transducer/step'].bind(xf), f, r, v);
                    },
                    '@@transducer/result': function (v) {
                        return xf['@@transducer/result'](v);
                    }
                };
            }
        }            
    }

    /**
    A transformer which flattens out the resulting structure

    @method flatten
    @for funkyJS.transducers
    @param {transducer} xf A transducer to flatten over
    @return {transducer} A new transducer

    **/
    api.flatten = function flatten (xf) {
        return {
            '@@transducer/init': function () {
                return xf['@@transducer/init']();
            },
            '@@transducer/step': function (r, v) {
                return api.foldl({
                    '@@transducer/init': function() {
                        return xf['@@transducer/init']();
                    },
                    '@@transducer/step': function(__r, __v) {
                        var _v = xf['@@transducer/step'](__r, __v);
                        return api.isReduced(_v) ? api.deref(_v) : _v;
                    },
                    '@@transducer/result': function(v) {
                        return v;
                    }
                }, r, v);
            },
            '@@transducer/result': function (v) {
                return xf['@@transducer/result'](v);
            }
        };
    }

    /**
    Given a function `f`, returns a function awaiting a transducer which when
        reduced maps `f` to every value.

    @method map
    @for funkyJS.transducers
    @param {function} f A function to map
    @return {function} A function awaiting another transducer

    **/
    api.map = function map (f) {
        return function (xf) {
            return {
                '@@transducer/init': function () {
                    return xf['@@transducer/init']();
                },
                '@@transducer/step': function (r, v) {
                    return xf['@@transducer/step'](r, f(v));
                },
                '@@transducer/result': function (v) {
                    return xf['@@transducer/result'](v);
                }
            };
        }
    }

    /**
    Given a function `f`, returns a function awaiting a transducer which when
        reduced maps `f` to every value and then flattens the result out.

    @method flatMap
    @for funkyJS.transducers
    @param {function} f A function to map
    @return {function} A function awaiting a transducer

    **/
    api.flatMap = function flatMap (f) {
        return comp(api.flatten, api.map(f));
    };

    /**
    Given a predicate function `f`, returns a function awaiting a transducer which
        when reduced returns a collection with a values inside for which `f`
        returned `true`.

    @method filter
    @for funkyJS.transducers
    @param {function} f The predicate function
    @return {function} A function awaiting a transducer

    **/
    api.filter = function filter (f) {
        return function (xf) {
            return {
                '@@transducer/init': function () {
                    return xf['@@transducer/init']();
                },
                '@@transducer/step': function (r, v) {
                    return !!f(v) ? xf['@@transducer/step'](r, v) : r;
                },
                '@@transducer/result': function (v) {
                    return xf['@@transducer/result'](v);
                }
            };
        }
    }

    /**
    Given a number `n`, drops `n` items from the beginning of the collection

    @method drop
    @for funkyJS.transducers
    @param {number} n Number of items to drop from the left
    @return {function} A function awaiting a transducer

    **/
    api.drop = function drop (n) {
        return function (xf) {
            var _n = n;
            return {
                '@@transducer/init': function () {
                    return xf['@@transducer/init']();
                },
                '@@transducer/step': function (r, v) {
                    if (_n > 0) {
                        _n -= 1;
                        return r;
                    }
                    return xf['@@transducer/step'](r, v);
                },
                '@@transducer/result': function (v) {
                    return xf['@@transducer/result'](v);
                }
            };
        }
    }

    /**
    Given a number `n`, drops the `n`th item from the collection

    @method dropNth
    @for funkyJS.transducers
    @param {number} n Number of item to drop
    @return {function} A function awaiting a transducer

    **/
    api.dropNth = function dropNth (n) {
        return function (xf) {
            var _i = -1;
            return {
                '@@transducer/init': function () {
                    return xf['@@transducer/init']();
                },
                '@@transducer/step': function (r, v) {
                    _i += 1;
                    if (_i === n) {
                        return r;
                    }
                    return xf['@@transducer/step'](r, v);
                },
                '@@transducer/result': function (v) {
                    return xf['@@transducer/result'](v);
                }
            };
        }
    }

    /**
    Given a predicate function `f`, drops items from the beginning of the
        collection until the predicate returns `false`

    @method dropWhile
    @for funkyJS.transducers
    @param {function} f A predicate function
    @return {function} A function awaiting a transducer

    **/
    api.dropWhile = function dropWhile (f) {
        return function (xf) {
            var _drops = true;
            return {
                '@@transducer/init': function () {
                    return xf['@@transducer/init']();
                },
                '@@transducer/step': function (r, v) {
                    if (_drops) {
                        _drops = !!f(v);    
                    }
                    return _drops ? r : xf['@@transducer/step'](r, v);
                },
                '@@transducer/result': function (v) {
                    return xf['@@transducer/result'](v);
                }
            };
        }
    }

    /**
    Given a number `n`, takes `n` items from the beginning of the collection

    @method take
    @for funkyJS.transducers
    @param {number} n Number of items to take from the left
    @return {function} A function awaiting a transducer

    **/
    api.take = function take (n) {
        return function (xf) {
            var _n = 0;
            return {
                '@@transducer/init': function () {
                    return xf['@@transducer/init']();
                },
                '@@transducer/step': function (r, v) {
                    if (_n < n) {
                        _n += 1;
                        return xf['@@transducer/step'](r, v);
                    }
                    return api.reduced(r);
                },
                '@@transducer/result': function (v) {
                    return xf['@@transducer/result'](v);
                }
            };
        }
    }

    /**
    Given a number `n`, takes the `n`th item from the collection

    @method takeNth
    @for funkyJS.transducers
    @param {number} n Number of item to take
    @return {function} A function awaiting a transducer

    **/
    api.takeNth = function takeNth (n) {
        return function (xf) {
            var _i = -1;
            return {
                '@@transducer/init': function () {
                    return xf['@@transducer/init']();
                },
                '@@transducer/step': function (r, v) {
                    _i += 1;
                    if (_i < n) {
                        return r;
                    }
                    return api.reduced(xf['@@transducer/step'](r, v));
                },
                '@@transducer/result': function (v) {
                    return xf['@@transducer/result'](v);
                }
            };
        }
    }

    /**
    Given a predicate function `f`, takes items from the beginning of the
        collection until the predicate returns `false`

    @method takeWhile
    @for funkyJS.transducers
    @param {function} f A predicate function
    @return {function} A function awaiting a transducer

    **/
    api.takeWhile = function takeWhile (f) {
        return function (xf) {
            var _take = true;
            return {
                '@@transducer/init': function () {
                    return xf['@@transducer/init']();
                },
                '@@transducer/step': function (r, v) {
                    if (_take) {
                        _take = !!f(v);
                        return _take ? xf['@@transducer/step'](r, v) : api.reduced(r);
                    }
                    return api.reduced(r);
                },
                '@@transducer/result': function (v) {
                    return xf['@@transducer/result'](v);
                }
            };
        }
    }

    /**
    A transformer which keeps all values which are not equal to `null` and/or
        to `undefined`

    @method keep
    @for funkyJS.transducers
    @param {transducer} xf A transducer to operate over
    @return {transducer} A new transducer

    **/
    api.keep = function keep (xf) {
        return {
            '@@transducer/init': function () {
                return xf['@@transducer/init']();
            },
            '@@transducer/step': function (r, v) {
                if (v !== null && v !== void 0) {
                    return xf['@@transducer/step'](r, v);
                }
                return r;
            },
            '@@transducer/result': function (v) {
                return xf['@@transducer/result'](v);
            }
        };
    }

    /**
    A transformer which returns a collection of unique values

    @method unique
    @for funkyJS.transducers
    @param {transducer} xf A transducer to operate over
    @return {transducer} A new transducer
    
    **/
    api.unique = function unique (xf) {
        var _found = Object.create(null);
        return {
            '@@transducer/init': function () {
                return xf['@@transducer/init']();
            },
            '@@transducer/step': function (r, v) {
                if (!_found[v]) {
                    _found[v] = true;
                    return xf['@@transducer/step'](r, v);
                }
                return r;
            },
            '@@transducer/result': function (v) {
                return xf['@@transducer/result'](v);
            }
        };
    }
    
    /**
    Given a number `n`, divides the collection into chunks of `n` size. The last
        partition may have less then `n` items, depending on the size of the
        initial collection

    @method partition
    @for funkyJS.transducers
    @param {number} n Size of a single chunk
    @return {function} A function awaiting a transducer

    **/
    api.partition = function partition (n) {
        return function (xf) {
            var _i = 0, _p = [], _r;
            return {
                '@@transducer/init': function () {
                    return xf['@@transducer/init']();
                },
                '@@transducer/step': function (r, v) {
                    if (_i < n) {
                        _i += 1;
                        _p.push(v);
                        return r;
                    }
                    _r = xf['@@transducer/step'](r, _p);
                    _i = 0;
                    _p = [v];
                    return _r;
                },
                '@@transducer/result': function (v) {
                    return _p.length < 1 ?
                            xf['@@transducer/result'](v) :
                            xf['@@transducer/result'](xf['@@transducer/step'](v, _p));
                }
            };
        }
    }
    
    /**
    Given a function `f`, divides the collection into chunks whenever `f` returns
        a new value

    @method partitionBy
    @for funkyJS.transducers
    @param {number} n Size of a single chunk
    @return {function} A function awaiting a transducer

    @example
        var t = funkyJS.transducers;

        var isOdd = function (v) { return v % 2 === 0; }

        t.transduce(
            t.partitionBy(isOdd),
            t.append,
            [],
            [1, 1, 1, 2, 2, 3, 3, 3]
        );
        // -> [[1, 1, 1], [2, 2], [3, 3, 3]]

    **/
    api.partitionBy = function partitionBy (f) {
        return function (xf) {
            var _i = 0, _p = [], _l, _c, _r;
            return {
                '@@transducer/init': function () {
                    return xf['@@transducer/init']();
                },
                '@@transducer/step': function (r, v) {
                    _l = _c;
                    _c = f(v);
                    if (_i < 1 || _l === _c) {
                        _i += 1;
                        _p.push(v);
                        return r;
                    }

                    _r = xf['@@transducer/step'](r, _p);
                    _p = [v];
                    return _r;
                },
                '@@transducer/result': function (v) {
                    return _p.length < 1 ?
                            xf['@@transducer/result'](v) :
                            xf['@@transducer/result'](xf['@@transducer/step'](v, _p));
                }
            };
        }
    }





    /***
     * EXPORT
     * ======
     */

    return {transducers: api};

});