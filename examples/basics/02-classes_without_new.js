// This file contains multiple example for class creation without using the "new"
//   keyword
//
/* globals funkyJS */
;(function (f) {

    /**
    The "thing" function shown is a kind of "general purpose factory". It allows
        to create all kinds of "things" :). The kind of "thing" made depends on
        the descriptor object passed to the thing function. For example: The end
        of the file contains a short selftest of thing, where the thing that is
        constructed has the ability to count up. Therefor, the assembled thing
        is referred to as counter. If provided another behaviour, the thing function
        can also be used to create other things which are not at all counters

    Examples
    ========
    // a) Creating a counter
    // ---------------------
    var counter = thing({
        index: 0,
        inc: function () {
            this.index += 1;
            return this;
        }
    });

    counter instanceof thing;
    // -> true

    counter.inc().inc().inc();
    counter.index;
    // -> 3



    // b) Creating a apple and a person
    // --------------------------------
    var apple = thing({
        hp: 15,
        eatenBy: function (c) {
            return c.consume(this);
        }
    });

    var person = thing({
        lp: 100,
        consume: function (t) {
            if (t.hp) {
                this.lp += t.hp;
            }
            return this;
        }
    });


    person.consume(apple).lp;
    // -> 115

    apple.eatenBy(person).lp;
    // -> 130

    **/
    function thing (desc) {
        // get correct instance
        var _self = f.instance(thing);

        // copy properties and methods (with a twist)
        f.pairs(desc).forEach(function (pair) {
            if (!f.isFunction(pair[1])) {
                // copy properties directly
                _self[pair[0]] = pair[1];

            } else {
                // wrap methods to fix context and aritize to preserve correct
                //   arity of method
                _self[pair[0]] = f.aritize(pair[1].length)(function (args) {
                    return pair[1].apply(_self, args);
                });

            }
        });

        //  return the instance
        return _self;
    }



    /* selftest */
    /*
    var counter = thing({
        value: 0,
        inc: function () {
            if (!this instanceof thing) {
                throw new Error('Current context is wrong');
            }

            this.value += 1;
            return this;
        }
    });

    counter.inc().inc().inc();
    if (counter.value !== 3) {
        throw new Error('selftest of "thing" failed');
    }
    */

    window.thing = thing;

})(funkyJS);
;(function (f) {

    /**
    Here is an example of using just the basic birds module to create a class
        out of a single function and without any prototype except the function's
        original one. Actually, the class does not do anything, it is just a
        example. If it would do anything, the class would be used like this (no
        new):

    var instance = Noop({selector: '#some-id'}).init();
    **/
    window.Noop = f.tap(function noop (config) {
        return noop.setup(config);
    })(function (fn) {
        fn.setup = function (conf) {
            return {
                $node: document.querySelector(conf.selector),
                init: f.fluent(function () {})
            };
        }
        return fn;
    });

})(funkyJS);