;(function (global, factory) {
    var ext,
        it;

    if (typeof define === 'function' && define.amd) {
        define([
            '../type'
        ], factory);

    } else if (typeof exports === 'object') {
        module.exports = factory(
            require('../type')
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
    @module experiments
    **/
    var api = {};



    api.listIterator = function listIterator (list) {
        var _i;
        if (type.isNotSequencial(list)) {
            throw new Error('listIterator expects argument to be sequencial but saw ' + list);
        }

        _i = 0;
        function iterate () {
            return list[_i] || null;
        }
        iterate.next = function () {
            _i += 1;
        }

        return iterate;
    }



    /***
     * EXPORT
     * ======
     */

    return api;

});