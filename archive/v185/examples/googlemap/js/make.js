/* global funkyJS */
;(function (f) {

    /**
    The "make" function shown is a kind of "general purpose factory". It allows
        to create all kinds of "things" :). The kind of "thing" made depends on
        the descriptor object passed to the make function. For example: The end
        of the file contains a short selftest of make, where the thing that is
        constructed has the ability to count up. Therefor, the assembled thing
        is referred to as counter. If provided another behaviour, the make function
        can also be used to create other things which are not at all counters

    Examples
    ========
    // a) Creating a counter
    // ---------------------
    var counter = make({
        index: 0,
        inc: function () {
            this.index += 1;
            return this;
        }
    });

    counter instanceof make;
    // -> true

    counter.inc().inc().inc();
    counter.index;
    // -> 3



    // b) Creating a apple and a person
    // --------------------------------
    var apple = make({
        hp: 15,
        eatenBy: function (c) {
            return c.consume(this);
        }
    });

    var person = make({
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
    function make (desc) {
        // get correct instance
        var _self = f.instance(make);

        // copy properties and methods (with a twist)
        f.pairs(desc).forEach(function (pair) {
            if (f.isNotFunction(pair[1])) {
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
    var counter = make({
        value: 0,
        inc: function () {
            if (!this instanceof make) {
                throw new Error('Current context is wrong');
            }

            this.value += 1;
            return this;
        }
    });

    counter.inc().inc().inc();
    if (counter.value !== 3) {
        throw new Error('selftest of "make" failed');
    }
    */

    window.make = make;

})(funkyJS);