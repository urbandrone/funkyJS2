;(function (global, factory) {
    var ext,
        it;

    if (typeof define === 'function' && define.amd) {
        define([
            '../type',
            '../arrays',
            '../objects'
        ], factory);

    } else if (typeof exports === 'object') {
        module.exports = factory(
            require('type'),
            require('arrays'),
            require('objects')
        );

    } else {
        ext = factory(
            global.funkyJS,
            global.funkyJS,
            global.funkyJS
        );

        for (it in ext) {
            if (ext.hasOwnProperty(it)) {
                global.funkyJS[it] = ext[it];
            }
        }
    }

})(this, function (type, list, dict) {

    /**
    @module experiments
    **/
    var api = {};



    /**
    The instanceWith function allows to build instances of a given class with
        a freely extendable behaviour without the need to extend the class. This
        is especially useful if you want to use a existing class but with a
        slightly altered behaviour, without creating a new subclass or modifying
        the prototype   
    
    @method instanceWith
    
    @param {function} Ctor Constructor of the class
    @param {object} extension Methods and properties to extend the classinstance with
    
    @return {object} A new instance with extension
    
    @example
        var Some = function () {}
        Some.prototype.setValue = function (value) { this.value = value; }
        Some.prototype.getValue = function () { return this.value; }
    
        var instance = new Some();
        instance.setValue('foo');
        instance.getValue();
        // -> 'foo'


    
        var extendIt = {
            modify: function (v) { return (v + '!').toUpperCase(); },
            getValue: function () { return this.modify(this.value); }
        }
    
        var extInstance = funkyJS.instanceWith(Some, extendIt);
        extInstance.setValue('bar');
        extInstance.getValue();
        // -> 'BAR!'
         
    **/
    api.instanceWith = function instanceWith (Ctor, extension) {
        var stub;
        if (type.isNotFunction(Ctor)) {
            throw new Error('instanceWith expected Ctor to be function but saw ' + Ctor);
        }

        if (extension === undefined) {
            return function () {
                return instanceWith.apply(this, list.append(arguments, [Ctor]));
            };
        }

        stub = dict.instance(Ctor);
        list.tail(arguments).forEach(function (ext) {
            if (type.isObject(ext)) {
                dict.extend(stub, ext);
            }
        });

        return stub;
    }



    /***
     * EXPORT
     * ======
     */

    return api;

});