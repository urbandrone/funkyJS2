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







    /***
     * EXPORT
     * ======
     */

    return api;

});