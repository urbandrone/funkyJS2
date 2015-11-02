/**
This file shows different types of small programs which handle the task of
    accessing properties on objects. By reading, think in terms of operations
    you want to be done.
**/
;(function (f) {

    // a simple store for key-value pairs
    var _stored = {};

    // a reusable helper
    var isStored = f.partial(f.has, [
        undefined, // partial uses undefined as placeholder for unknown values
        _stored
    ]);

    // a helper for more reuse :)
    var manipulateStore = function (predicate, operation) {
        // returns a "pipe", into which a value can be passed, which itself will
        //   then be passed through all operations from left to right
        return f.guard(f.isObject, f.pipe(
            f.pairs,
            f.filterWith(f.pipe(f.first, predicate)),
            f.forEachWith(operation)
        ));
    }

    window.keyValueStore = {
        isStoredKey: isStored,
        getStoredValue: f.guard(
            isStored,
            f.partial(f.get, [undefined, _stored])
        ),
        addKeyValues: manipulateStore(
            f.not(isStored),
            function (pair) {
                _stored[pair[0]] = pair[1];
            }
        ),
        removeKeyValues: manipulateStore(
            isStored,
            function (pair) {
                delete _stored[pair[0]];
            }
        )
    };

})(funkyJS);



;(function (f) {

    // a (oversimplified) NoSQL implementation
    var _entries = [];


    var matchesCriteria = f.dyadic(function (criteria, item) {
        return f.pairs(criteria).every(function (pair) {
            if (f.isFunction(pair[1])) {
                return pair[1](item[pair[0]]);
            }
            return item[pair[0]] === pair[1];
        });
    });

    window.SimpleNoSql = {
        getWhere: f.guard(f.isObject, function (criteria) {
            return _entries.filter(matchesCriteria(criteria));
        }),
        addDoc: f.guard(f.isObject, function (doc) {
            _entries.push(doc);
        })
    }

})(funkyJS);