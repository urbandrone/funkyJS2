;(function (global, factory) {
    var ext,
        it;

    if (typeof define === 'function' && define.amd) {
        define([
            '../type',
            '../array'
        ], factory);

    } else if (typeof exports === 'object') {
        module.exports = factory(
            require('type'),
            require('array')
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

})(this, function (type) {

    /**
    @module iterators
    **/
    var api = {};



    function conformProtocol (obj) {
        obj['@@iterator'] = function () { return obj; };
        return obj;
    }



    /**
    Allows to create a numerical iterator, with a optional start and end number.
        If the end number is below the start number, the returned iterator counts
        down. If no arguments are given, the iterator counts up to positive
        infinity, starting by zero

    @method numIterator
    @for funkyJS
    @param {number} [start = 0] Optional start number
    @param {number} [max = Infinity] Optional end number
    @return {object} Iterator object

    @example
        var nums = funkyJS.numIterator(5); // counts 5 -> Infinity

        nums.next().value;
        // -> 5

        nums.next().value;
        // -> 6

        nums.next().value;
        // -> 7


        var nums2 = funkyJS.numIterator();

        nums2.next().value;
        // -> 0

        nums2.next().value;
        // -> 1

        nums2.next().value;
        // -> 2


        var nums3 = funkyJS.numIterator(10, 0);

        nums3.next().value;
        // -> 10

        nums3.next().value;
        // -> 9

        nums3.next().value;
        // -> 8

    **/
    api.numIterator = function numIterator (start, max) {
        var _now = !type.isNumber(start) ? 0 : start,
            _end = typeof max !== 'number' || isNaN(max) ? Infinity : max,
            _add = 1;

        if (_end < _now) {
            _add = -1;
        }

        return conformProtocol({
            next: function () {
                var _cur = _now;
                _now += _add;
                if (_cur === _end) {
                    return {
                        done: true,
                        value: undefined
                    };
                }
                return {
                    done: false,
                    value: _cur
                };
            }
        });
    }

    /**
    Creates a sequencial iterator. Sequencial iterators allow to iterate over
        strings, arrays, arguments and nodelist

    @method seqIterator
    @for funkyJS
    @param {array|string|arguments|nodelist} seq Sequencial value
    @return {object} Iterator object

    @example
        var itAbc = funkyJS.seqIterator(['a', 'b', 'c']);

        itAbc.next().value;
        // -> 'a'

        itAbc.next().value;
        // -> 'b'

        itAbc.next().value;
        // -> 'c'


        var itStr = funkyJS.seqIterator('string');

        itStr.next().value;
        // -> 's'

        itStr.next().value;
        // -> 't'

        itStr.next().value;
        // -> 'r'

    **/
    api.seqIterator = function seqIterator (seq) {
        var _index;

        if (!type.isSequencial(seq)) {
            throw 'seqIterator expected argument to be sequencial but saw ' + seq;
        }

        _index = -1;
        return conformProtocol({
            next: function () {
                _index += 1;

                if (_index >= seq.length) {
                    return {
                        done: true,
                        value: undefined
                    };
                }

                return {
                    done: false,
                    value: seq[_index]
                };
            }
        });
    }

    /**
    Creates a object/hashtable iterator. Please note that the returned iterator
        might iterate randomly through the object, depending on the behaviour of
        the underlying JavaScript engine

    @method objIterator
    @for funkyJS
    @param {object} obj Hashtable to iterate over
    @return {object} Iterator object

    @example
        var itAbc = funkyJS.objIterator({
            a: 'first',
            b: 'second',
            c: 'third'
        });

        itAbc.next().value;
        // -> 'first'

        itAbc.next().value;
        // -> 'second'

        itAbc.next().value;
        // -> 'third'

    **/
    api.objIterator = function objIterator (obj) {
        var _keys,
            _index;

        if (!type.isObject(obj)) {
            throw 'objIterator expected argument to be object but saw ' + obj;
        }

        _keys = Object.keys(obj);
        _index = -1;
        return conformProtocol({
            next: function () {
                _index += 1;

                if (_index >= _keys.length) {
                    return {
                        done: true,
                        value: undefined
                    };
                }

                return {
                    done: false,
                    value: obj[_keys[_index]]
                };
            }
        });
    }

    /**
    Returns a lazy iterator, which maps a given function to a given iterator. The
        returned iterator is lazy, as it only maps when calling it's next() method

    @method mapLazy
    @for funkyJS
    @param {function} fn The function to apply
    @param {object} iterator The iterator to map over
    @return {object} Iterator object

    @example
        var itAbc = funkyJS.objIterator({
            a: 'first',
            b: 'second',
            c: 'third'
        });

        var upper = funkyJS.call(String.prototype.toUpperCase);

        var lazyMap = funkyJS.mapLazy(upper, itAbc);

        lazyMap.next().value;
        // -> 'FIRST'

        lazyMap.next().value;
        // -> 'SECOND'

        lazyMap.next().value;
        // -> 'THIRD'

    **/
    api.mapLazy = function mapLazy (fn, iterator) {
        if (typeof fn !== 'function') {
            throw 'mapLazy expected first argument to be function but saw ' + fn;
        }

        if (iterator === undefined) {
            return function (iterator) {
                return mapLazy(fn, iterator);
            }
        }

        if (!type.isIterator(iterator)) {
            throw 'mapLazy expects last argument to be iterator but saw ' + iterator;
        }

        return conformProtocol({
            next: function () {
                var _it = iterator.next();

                if (_it.done) {
                    return {
                        done: true,
                        value: _it.value
                    }
                }

                return {
                    done: false,
                    value: fn(_it.value)
                }
            }
        });
    }

    /**
    Returns a lazy iterator, which filters with a given function a given iterator.
        The returned iterator is lazy, as it only filters when calling it's
        next() method

    @method filterLazy
    @for funkyJS
    @param {function} fn The predicate function
    @param {object} iterator The iterator to filter
    @return {object} Iterator object

    @example
        var itAbc = funkyJS.objIterator({
            a: 'first',
            b: 'second',
            c: 'third'
        });

        var startsEitherFT = function (s) {
            return s[0] === 't' || s[0] === 'f';
        }

        var lazyFilter = funkyJS.filterLazy(startsEitherFT, itAbc);

        lazyFilter.next().value;
        // -> 'first'

        lazyFilter.next().value;
        // -> 'third'

    **/
    api.filterLazy = function filterLazy (fn, iterator) {
        if (typeof fn !== 'function') {
            throw 'filterLazy expected first argument to be function but saw ' + fn;
        }

        if (iterator === undefined) {
            return function (iterator) {
                return filterLazy(fn, iterator);
            }
        }

        if (!type.isIterator(iterator)) {
            throw 'filterLazy expects last argument to be iterator but saw ' + iterator;
        }

        return conformProtocol({
            next: function () {
                var _it = iterator.next();
                while (!_it.done && !fn(_it.value)) {
                    _it = iterator.next();
                }

                if (_it.done) {
                    return {
                        done: true,
                        value: _it.value
                    };
                }

                return {
                    done: false,
                    value: _it.value
                }
            }
        });
    }

    /**
    Returns a lazy iterator, which folds a given iterator into a value. The
        returned iterator is lazy as it only folds one when calling it's next()
        method

    @method foldLazy
    @for funkyJS
    @param {function} fn The function to fold with
    @param {*} seed The initial value to start from
    @param {object} iterator The iterator to fold
    @return {object} Iterator object

    @example
        var itAbc = funkyJS.objIterator({
            a: 'first',
            b: 'second',
            c: 'third'
        });

        var cat = function (a, b) {
            return !a ? b : a + ', ' + b;
        }

        var lazyFold = funkyJS.foldLazy(cat, '', itAbc);

        lazyFold.next().value;
        // -> 'first'

        lazyFold.next().value;
        // -> 'first, second'

        lazyFold.next().value;
        // -> 'first, second, third'

    **/
    api.foldLazy = function foldLazy (fn, seed, iterator) {
        var _acc;
        if (typeof fn !== 'function') {
            throw 'foldLazy expected first argument to be function but saw ' + fn;
        }

        if (iterator === undefined) {
            return function (iterator, seed) {
                return foldLazy(fn, iterator, seed);
            }
        }

        if (seed === undefined) {
            return function (seed) {
                return foldLazy(fn, iterator, seed);
            }
        }

        if (!type.isIterator(iterator)) {
            throw 'foldLazy expects last argument to be iterator but saw ' + iterator;
        }

        _acc = seed;
        return conformProtocol({
            next: function () {
                var _it = iterator.next();

                if (_it.done) {
                    return {
                        done: true,
                        value: _acc
                    };
                }

                _acc = fn(_acc, _it.value);
                return {
                    done: false,
                    value: _acc
                }
            }
        });
    }




    /***
     * EXPORT
     * ======
     */

    return api;

});