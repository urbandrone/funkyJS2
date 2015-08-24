/* globals module */
;(function (global, factory) {
    var ext,
        it;

    if (typeof define === 'function' && define.amd) {
        define([
            'arity'
        ], factory);

    } else if (typeof exports === 'object') {
        module.exports = factory(
            require('arity')
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

})(this, function (arity) {

    /**
    @module lenses
    **/
    var api = {};



    /**
    makeLense awaits a array of one to N property names and returns a
        collection of lenses with one lense per property. Lenses are a way to
        implement immutable data structures in javascript and they compose
        nicely

    @method makeLense
    @for funkyJS
    @param {array} props Array of property names
    @return {object} Collection of lenses

    @example
        var L = funkyJS.makeLense(['message', 'user', 'email']);

        var comment = {
            message: 'This is the user message',
            user: 'John Doe',
            email: 'jdoe@example.com'
        };

        var formatEmail = function (email) {
            return email.replace(/jdoe@/g, 'charlie(at)');
        }

        var charliesComment = L.user.set('Charlie', comment);
        L.user(charliesComment);
        // -> 'Charlie'

        charliesEscComment = L.email.over(formatEmail, charliesComment);
        L.email(charliesEscComment);
        // -> 'charlie(at)example.com'



        // equivalent but shorter version
        // ------------------------------
        var processComment = funkyJS.compose(
            L.email.over(formatEmail),
            L.user.set('Charlie')
        )

        var f3Comment = processComment(comment);

    **/
    api.makeLense = function makeLense (props) {
        if (!Array.isArray(props)) {
            throw new Error('makeLense() expects argument to be array but saw: ' + props);
        }

        return props.reduce(function (acc, prop) {
            acc[prop] = propLense(prop);
            return acc;
        }, {});
    }


    // utilities
    function over (set, get) {
        return function (fn, obj) {
            return set(fn(get(obj)), obj);
        }
    }






    function toLense (get, set) {
        var lense = function (data) { return get(data); };
        lense.get = get;
        lense.set = arity.dyadic(set);
        lense.over = arity.dyadic(over(set, get));
        return lense;
    }

    function propLense (prop) {
        return toLense(
            function (obj) { return obj[prop]; },
            function (val, obj) {
                var _struct = Object.create(obj);
                _struct[prop] = val;
                return _struct;
            }
        );
    }



    /***
     * EXPORT
     * ======
     */

    return api;

});