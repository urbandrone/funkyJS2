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
    @module experiments
    **/
    var api = {};



    /**
    Allows to create a numerical iterator, with a optional start and end number.
        If the end number is below the start number, the returned iterator counts
        down. If no arguments are given, the iterator counts up to positive
        infinity

    @method numIterator
    @for funkyJS
    @param {number} [start = 0] Optional start number
    @param {number} [max = Infinity] Optional end number
    @return {object} Iterator object

    @example
        var nums = funkyJS.numIterator(5); // counts 5 -> Infinity

        nums.next().value();
        // -> 5

        nums.next().value();
        // -> 6

        nums.next().value();
        // -> 7

    **/
    api.numIterator = function numIterator (start, max) {
        var _now = type.isNotInt32(start) ? 0 : start,
            _end = type.isNotInt32(max) ? Infinity : max,
            _add = 1;

        if (_end < _now) {
            _add = -1;
        }

        return {
            next: function () {
                var _cur = _now;
                _now += _add;
                if (_cur === _end) {
                    return {
                        done: true,
                        value: function () {
                            return undefined;
                        }
                    };
                }
                return {
                    done: false,
                    value: function () {
                        return _cur;
                    }
                };
            }
        };
    }

    api.seqIterator = function seqIterator (seq) {
        var _index;

        if (type.isNotSequencial(seq)) {
            throw new Error('seqIterator expected argument to be sequencial but saw ' + seq);
        }

        _index = -1;
        return {
            next: function () {
                _index += 1;

                if (_index >= seq.length) {
                    return {
                        done: true,
                        value: function () {
                            return undefined;
                        }
                    };
                }

                return {
                    done: false,
                    value: function () {
                        return seq[_index];
                    }
                };
            }
        };
    }

    api.objIterator = function objIterator (obj) {
        var _keys,
            _index;

        if (type.isNotObject(obj)) {
            throw new Error('objIterator expected argument to be object but saw ' + obj);
        }

        _keys = Object.keys(obj);
        _index = -1;
        return {
            next: function () {
                _index += 1;

                if (_index >= _keys.length) {
                    return {
                        done: true,
                        value: function () {
                            return undefined;
                        }
                    };
                }

                return {
                    done: false,
                    value: function () {
                        return obj[_keys[_index]];
                    }
                };
            }
        };
    }



    api.mapLazy = function mapLazy (fn, iterator) {
        if (typeof fn !== 'function') {
            throw new Error('mapLazy expected first argument to be function but saw ' + fn);
        }

        if (iterator === undefined) {
            return function (iterator) {
                return mapLazy(fn, iterator);
            }
        }

        if (type.isNotObject(iterator) || type.isNotFunction(iterator.next)) {
            throw new Error('mapLazy expected second argument to be iterator but was ' + iterator);
        }

        return {
            next: function () {
                var _it = iterator.next();

                if (_it.done) {
                    return {
                        done: true,
                        value: function () {
                            return undefined;
                        }
                    }
                }

                return {
                    done: false,
                    value: function () {
                        return fn(_it.value());
                    }
                }
            }
        };
    }

    api.filterLazy = function filterLazy (fn, iterator) {
        if (typeof fn !== 'function') {
            throw new Error('filterLazy expected first argument to be function but saw ' + fn);
        }

        if (iterator === undefined) {
            return function (iterator) {
                return filterLazy(fn, iterator);
            }
        }

        if (type.isNotObject(iterator) || type.isNotFunction(iterator.next)) {
            throw new Error('filterLazy expected second argument to be iterator but was ' + iterator);
        }

        return {
            next: function () {
                var _it = iterator.next();
                while (!_it.done && !fn(_it.value())) {
                    _it = iterator.next();
                }

                if (_it.done) {
                    return {
                        done: true,
                        value: function () {
                            return undefined;
                        }
                    };
                }

                return {
                    done: false,
                    value: function () {
                        return _it.value();
                    }
                }
            }
        };
    }

    api.foldLazy = function foldLazy (fn, iterator, seed) {
        var _acc;
        if (typeof fn !== 'function') {
            throw new Error('foldLazy expected first argument to be function but saw ' + fn);
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

        if (type.isNotObject(iterator) || type.isNotFunction(iterator.next)) {
            throw new Error('foldLazy expected second argument to be iterator but was ' + iterator);
        }

        _acc = seed;
        return {
            next: function () {
                var _it = iterator.next();

                if (_it.done) {
                    return {
                        done: true,
                        value: function () {
                            return undefined;
                        }
                    };
                }

                return {
                    done: false,
                    value: function () {
                        _acc = fn(_acc, _it.value());
                        return _acc;
                    }
                }
            }
        };
    }






    /***
     * EXPORT
     * ======
     */

    return api;

});