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
    @module arrays
    **/
    var api = {};



    // INTERNAL UTILITES
    // =================
    var slice = Array.prototype.slice;



    /**
    The toArray function takes in any enumerable value (arrays, nodelists, strings,
        objects, arguments) and transforms it into a real array. If the given
        value is not enumerable, it will be wrapped into a array

    @method toArray
    @for funkyJS
    @param {any} x Anything
    @return {array} Array from enumerable or array with given value

    @example
        funkyJS.toArray([1, 2, 3]);
        // -> [1, 2, 3]

        funkyJS.toArray({ a: 1, b: 2, c: 3 });
        // -> [1, 2, 3]

        funkyJS.toArray(null);
        // -> [null]

    **/
    api.toArray = function toArray (x) {
        if (arguments.length < 1) {
            return toArray;
        }

        if (type.isArray(x)) {
            return x;
        }

        if (!type.isEnumerable(x)) {
            return [x];
        }

        if (type.isString(x)) {
            return x.split('');
        }

        if (type.isObject(x)) {
            return Object.keys(x).map(function (key) {
                return x[key];
            });
        }

        return slice.call(x);
    }

    /**
    The first function returns the first item of any sequencial value given. For
        not sequencial values the given value is returned

    @method first
    @for funkyJS
    @param {array|nodelist|arguments|string} a The sequencial value
    @return {any} The first item

    @example
        funkyJS.first(['a', 'b', 'c']);
        // -> 'a'

        funkyJS.first('some string');
        // -> 's'

        funkyJS.first(null);
        // -> null

        funkyJS.first()(['a', 'b', 'c']);
        // -> 'a'

    **/
    api.first = function first (a) {
        if (arguments.length < 1) {
            return first;
        }

        if (type.isSequencial(a) && a.length) {
            return a[0];
        }

        return a;
    }

    /**
    The last function returns the last item of any sequencial value given. For
        not sequencial values the given value is returned

    @method last
    @for funkyJS
    @param {array|nodelist|arguments|string} a The sequencial value
    @return {any} The last item

    @example
        funkyJS.last(['a', 'b', 'c']);
        // -> 'c'

        funkyJS.last('some string');
        // -> 'g'

        funkyJS.last(null);
        // -> null

        funkyJS.last()(['a', 'b', 'c']);
        // -> 'c'

    **/
    api.last = function last (a) {
        if (arguments.length < 1) {
            return last;
        }

        if (type.isSequencial(a) && a.length) {
            return a[a.length - 1];
        }

        return a;
    }

    /**
    The head function returns all but the last item of any sequencial value given.
        For not sequencial values the given value is returned

    @method head
    @for funkyJS
    @param {array|nodelist|arguments|string} a The sequencial value
    @return {array} The head items

    @example
        funkyJS.head(['a', 'b', 'c']);
        // -> ['a', 'b']

        funkyJS.head('some string');
        // -> 'some strin'

        funkyJS.head(null);
        // -> null

        funkyJS.head()(['a', 'b', 'c']);
        // -> ['a', 'b']

    **/
    api.head = function head (a) {
        if (arguments.length < 1) {
            return head;
        }

        if (type.isSequencial(a) && a.length) {
            return api.toArray(a).slice(0, a.length - 1);
        }

        return a;
    }

    /**
    The tail function returns all but the first item of any sequencial value given.
        For not sequencial values the given value is returned

    @method tail
    @for funkyJS
    @param {array|nodelist|arguments|string} a The sequencial value
    @return {array} The tail items

    @example
        funkyJS.tail(['a', 'b', 'c']);
        // -> ['b', 'c']

        funkyJS.tail('some string');
        // -> 'ome string'

        funkyJS.tail(null);
        // -> null

        funkyJS.tail()(['a', 'b', 'c']);
        // -> ['b', 'c']

    **/
    api.tail = function tail (a) {
        if (arguments.length < 1) {
            return tail;
        }

        if (type.isSequencial(a) && a.length) {
            return api.toArray(a).slice(1);
        }

        return a;
    }

    /**
    Given a index number and any sequencial value, the nth function returns the
        item on the given index position or null if no such item can be found or
        the given value is not sequencial

    @method nth
    @for funkyJS
    @param {number} n Index of the item to return
    @param {array|nodelist|arguments|string} a The sequencial value
    @return {any} The item on position n or null

    @example
        funkyJS.nth(1, ['a', 'b', 'c']);
        // -> 'b'

        funkyJS.nth(1, 'some string');
        // -> 'o'

        funkyJS.nth(1, null);
        // -> null

        funkyJS.nth(1)()(['a', 'b', 'c']);
        // -> 'b'

    **/
    api.nth = function nth (n, a) {
        if (arguments.length < 1) {
            return nth;
        }

        if (arguments.length < 2) {
            return function (a) {
                return nth(n, a);
            }
        }

        if (!type.isNumber(n) || n < 0) {
            n = 0;
        }

        if (type.isSequencial(a) && a.length >= 1) {
            return a[n] || null;
        }

        return null;
    }

    /**
    The take function returns a new array from a given sequencial with as many
        items taken from the beginning of the given value as specified

    @method take
    @for funkyJS
    @param {number} n The amount of items to take into a new array
    @param {array|nodelist|arguments|string} a The sequencial value
    @return {array} Array of n items from the left of the given sequencial value

    @example
        funkyJS.take(2, ['a', 'b', 'c', 'd']);
        // -> ['a', 'b']

        funkyJS.take(4, 'some string');
        // -> ['s', 'o', 'm', 'e']

        funkyJS.take(2, null);
        // -> null

        funkyJS.take(2)()(['a', 'b', 'c', 'd']);
        // -> ['a', 'b']

    **/
    api.take = function take (n, a) {
        if (arguments.length < 1) {
            return take;
        }

        if (arguments.length < 2) {
            return function (a) {
                return take(n, a);
            }
        }

        if (!type.isNumber(n)) {
            n = 0;
        }

        if (type.isSequencial(a) && a.length) {
            return api.toArray(a).slice(0, Math.min(a.length, n));
        }

        return a;
    }

    /**
    The drop function returns a new array from a given sequencial with as many
        items dropn from the beginning of the given value as specified

    @method drop
    @for funkyJS
    @param {number} n The amount of items to drop into a new array
    @param {array|nodelist|arguments|string} a The sequencial value
    @return {array} Array of n items from the left of the given sequencial value

    @example
        funkyJS.drop(2, ['a', 'b', 'c', 'd']);
        // -> ['c', 'd']

        funkyJS.drop(5, 'some string');
        // -> ['s', 't', 'r', 'i', 'n', 'g']

        funkyJS.drop(2, null);
        // -> null

        funkyJS.drop(2)()(['a', 'b', 'c', 'd']);
        // -> ['c', 'd']

    **/
    api.drop = function drop (n, a) {
        if (arguments.length < 1) {
            return drop;
        }

        if (arguments.length < 2) {
            return function (a) {
                return drop(n, a);
            }
        }

        if (!type.isNumber(n)) {
            n = a && a.length ? a.length : Infinity;
        }

        if (type.isSequencial(a) && a.length) {
            return api.toArray(a).slice(Math.min(a.length, n));
        }

        return a;
    }

    /**
    Given two sequencial values, the append function adds the first one to the
        end of the second one

    @method append
    @for funkyJS
    @param {array|nodelist|arguments|string} a1 The sequence to append
    @param {array|nodelist|arguments|string} a2 The sequence to append a1 to
    @return {array} a1 after the sequence of a2

    @example
        var newTail = [1, 2, 3];

        funkyJS.append(newTail, ['a', 'b', 'c']);
        // -> ['a', 'b', 'c', 1, 2, 3]

        funkyJS.append(newTail, null);
        // -> null

        funkyJS.append(newTail)()(['a', 'b', 'c']);
        // -> ['a', 'b', 'c', 1, 2, 3]

    **/
    api.append = function append (a1, a2) {
        if (arguments.length < 1) {
            return append;
        }

        if (arguments.length < 2) {
            return function (a2) {
                return append(a1, a2);
            }
        }

        a1 = type.isSequencial(a1) ? api.toArray(a1) : [];
        if (type.isSequencial(a2)) {
            return api.toArray(a2).concat(a1);
        }

        return a2;
    }

    /**
    Given two sequencial values, the prepend function adds the first one to the
        end of the second one

    @method prepend
    @for funkyJS
    @param {array|nodelist|arguments|string} a1 The sequence to prepend
    @param {array|nodelist|arguments|string} a2 The sequence a1 should preceede
    @return {array} a1 before the sequence of a2

    @example
        var newHead = [1, 2, 3];

        funkyJS.prepend(newHead, ['a', 'b', 'c']);
        // -> [1, 2, 3, 'a', 'b', 'c']

        funkyJS.prepend(newHead, null);
        // -> null

        funkyJS.prepend(newHead)()(['a', 'b', 'c']);
        // -> [1, 2, 3, 'a', 'b', 'c']

    **/
    api.prepend = function prepend (a1, a2) {
        if (arguments.length < 1) {
            return prepend;
        }

        if (arguments.length < 2) {
            return function (a2) {
                return prepend(a1, a2);
            }
        }

        a1 = type.isSequencial(a1) ? api.toArray(a1) : [];
        if (type.isSequencial(a2)) {
            return a1.concat(api.toArray(a2));
        }

        return a2;
    }

    /**
    Given three sequencial values, the surround function adds the first one to the
        head and the second one to the tail of the third value.

    @method surround
    @for funkyJS
    @param {array|nodelist|arguments|string} a1 The head sequence
    @param {array|nodelist|arguments|string} a2 The tail sequence
    @param {array|nodelist|arguments|string} target The sequence to be surrounded
    @return {array} Target between a1 and a2

    @example
        var newHead = ['a', 'b', 'c'];
        var newTail = ['x', 'y', 'z'];

        funkyJS.surround(newHead, newTail, ['m', 'n', 'o']);
        // -> ['a', 'b', 'c', 'm', 'n', 'o', 'x', 'y', 'z']

        funkyJS.surround(newHead, newTail, null);
        // -> null

        funkyJS.surround(newHead)(newTail)(['m', 'n', 'o']);
        // -> ['a', 'b', 'c', 'm', 'n', 'o', 'x', 'y', 'z']

    **/
    api.surround = function surround (head, tail, target) {
        if (arguments.length < 1) {
            return surround;
        }

        if (arguments.length < 2) {
            return function (tail, target) {
                return surround(head, tail, target);
            }
        }

        if (arguments.length < 3) {
            return function (target) {
                return surround(head, tail, target);
            }
        }

        head = type.isSequencial(head) ? api.toArray(head) : [];
        tail = type.isSequencial(tail) ? api.toArray(tail) : [];
        if (type.isSequencial(target)) {
            return head.concat(api.toArray(target)).concat(tail);
        }

        return target;
    }

    /**
    The unique function takes a sequencial value and returns a new array from it
        which contains only the unique items

    @method unique
    @for funkyJS
    @param {array|nodelist|arguments|string} a The original sequencial
    @return {array} Array with only the unique values from a

    @example
        var original = ['a', 'c', 'b', 'b', 'a', 'a', 'f', 'k', 'a', 'b', 'f', 'c'];

        funkyJS.unique(original);
        // -> ['a', 'c', 'b', 'f', 'k']

    **/
    api.unique = function unique (a) {
        var clone;

        if (arguments.length < 1) {
            return unique;
        }

        clone = [];
        a = type.isSequencial(a) ? api.toArray(a) : [];
        a.forEach(function (value) {
            if (clone.indexOf(value) < 0) {
                clone.push(value)
            }
        });
        return clone;
    }

    /**
    The flatten function flattens any given nested sequencial value

    @method flatten
    @for funkyJS
    @param {array|nodelist|arguments|string} a1 The nested sequencial
    @return {array} A new flat version of the given array

    @example
        var singleLevel = [['a', 'b'], ['c', 'd'], 'e'];
        var multiLevel = [[[['a', 'b']], ['c']], 'd', [[[['e']]]]];

        funkyJS.flatten(singleLevel);
        // -> ['a', 'b', 'c', 'd', 'e'];

        funkyJS.flatten(multiLevel);
        // -> ['a', 'b', 'c', 'd', 'e'];

    **/
    api.flatten = (function () {
        function flattenTCO (list, acc) {
            if (list.length < 1) {
                return acc;
            }

            return function () {
                if (Array.isArray(list[0])) {
                    return flattenTCO(list[0].concat(list.slice(1)), acc);
                }

                return flattenTCO(list.slice(1), acc.concat(list[0]));
            }
        }

        return function flatten (a1) {
            var _list = api.toArray(a1);
            if (arguments.length < 1) {
                return flatten;
            }

            _list = flattenTCO(a1, []);
            while (type.isFunction(_list)) {
                _list = _list();
            }

            return _list;
        }

    })();

    /**
    Given two sequencial values, the union function returns a new array which
        contains the unique values of both

    @method union
    @for funkyJS
    @param {array|nodelist|arguments|string} a1 First sequencial
    @param {array|nodelist|arguments|string} a2 Second sequencial
    @return {array} New array containing the union of a1 and a2

    @example
        var first = ['a', 'h', 'e', 'c', 'b', 'f'];
        var second = ['c', 'd', 'a', 'f', 'e', 'h'];

        funkyJS.union(first, second);
        // -> ['a', 'h', 'e', 'c', 'b', 'f', 'd']

    **/
    api.union = function union (a1, a2) {
        if (arguments.length < 1) {
            return union;
        }

        if (arguments.length < 2) {
            return function (a2) {
                return union(a1, a2);
            }
        }

        a1 = type.isSequencial(a1) ? api.toArray(a1) : [];
        a2 = type.isSequencial(a2) ? api.toArray(a2) : [];
        return api.unique(a1.concat(a2));
    }

    /**
    Given two sequencial values, the intersect function returns a new array which
        contains the intersection of both

    @method intersect
    @for funkyJS
    @param {array|nodelist|arguments|string} a1 First sequencial
    @param {array|nodelist|arguments|string} a2 Second sequencial
    @return {array} New array containing the intersection of a1 and a2

    @example
        var first = ['a', 'h', 'e', 'c', 'b', 'f'];
        var second = ['c', 'd', 'a', 'f', 'e', 'h'];

        funkyJS.intersect(first, second);
        // -> ['a', 'h', 'e', 'c', 'f']

    **/
    api.intersect = function intersect (a1, a2) {
        if (arguments.length < 1) {
            return intersect;
        }

        if (arguments.length < 2) {
            return function (a2) {
                return intersect(a1, a2);
            }
        }

        a1 = type.isSequencial(a1) ? api.unique(api.toArray(a1)) : [];
        a2 = type.isSequencial(a2) ? api.unique(api.toArray(a2)) : [];
        if (a2.length > a1.length) {
            return a2.filter(function (v) {
                return a1.indexOf(v) >= 0;
            });
        }

        return a1.filter(function (v) {
            return a2.indexOf(v) >= 0;
        });
    }

    /**
    Given two sequencial values, the difference function returns a new array which
        contains the difference of both

    @method difference
    @for funkyJS
    @param {array|nodelist|arguments|string} a1 First sequencial
    @param {array|nodelist|arguments|string} a2 Second sequencial
    @return {array} New array containing the difference of a1 and a2

    @example
        var first = ['a', 'h', 'e', 'c', 'b', 'f'];
        var second = ['c', 'd', 'a', 'f', 'e', 'h'];

        funkyJS.difference(first, second);
        // -> ['b', 'd']

    **/
    api.difference = function difference (a1, a2) {
        if (arguments.length < 1) {
            return difference;
        }

        if (arguments.length < 2) {
            return function (a2) {
                return difference(a1, a2);
            }
        }

        a1 = type.isSequencial(a1) ? api.toArray(a1) : [];
        a2 = type.isSequencial(a2) ? api.toArray(a2) : [];
        return api.union(a1, a2).filter(function (v) {
            return a1.indexOf(v) < 0 || a2.indexOf(v) < 0;
        });
    }



    return api;

});