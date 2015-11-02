;(function (global, factory) {
    var ext,
        it;

    if (typeof define === 'function' && define.amd) {
        define([
            '../type',
            '../arity'
        ], factory);

    } else if (typeof exports === 'object') {
        module.exports = factory(
            require('type'),
            require('arity')
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

})(this, function (type, arity) {

    /**
    @module advices
    **/
    var api = {};



    // utilities
    function weave (fn, wrapper) {
        if (!wrapper.__funkyAdviced__) {
            Object.defineProperties(wrapper, {
                __funkyAdviced__: {
                    enumerable: false,
                    writable: false,
                    value: true
                },
                befores: {
                    enumerable: false,
                    writable: false,
                    value: []
                },
                body: {
                    enumerable: false,
                    writable: false,
                    value: fn
                },
                throwings: {
                    enumerable: false,
                    writable: false,
                    value: []
                },
                afters: {
                    enumerable: false,
                    writable: false,
                    value: []
                },
                adviceBefore: {
                    enumerable: false,
                    writable: false,
                    value: function (fn) {
                        this.befores.unshift(fn);
                        return this;
                    }
                },
                adviceError: {
                    enumerable: false,
                    writable: false,
                    value: function (fn) {
                        this.throwings.push(fn);
                        return this;
                    }
                },
                adviceAfter: {
                    enumerable: false,
                    writable: false,
                    value: function (fn) {
                        this.afters.push(fn);
                        return this;
                    }
                }
            });
        }
        return wrapper;
    }



    /**
    The advisable function allows to implement some kind of aspect oriented
        programming techniques on other functions by adding a adviceBefore,
        adviceAfter and adviceError method on the function. The advice- methods
        have a fluent interface so that chained calls are possible. While any
        attached after advices are executed in the same order as they are attached,
        all before advices are executed in reversed order. Please see the example
        for details

    @method advisable
    @for funkyJS
    @param {function} fn The function/method which should be advisable
    @return {function} A advisable wrapper function around fn

    @example
        var idMaker = {
            id: 0,
            uuid: funkyJS.advisable(function () {
                return 'uuid' + this.id;
            })
        };

        // add before advice to idMaker.uuid
        idMaker.uuid.adviceBefore(function () {
            this.id += 1;
        });

        idMaker.uuid();
        // -> 'uuid1'

        idMaker.uuid();
        // -> 'uuid2'


        // adding a second before advice
        idMaker.uuid.adviceBefore(function () {
            console.log('last uuid was: uuid' + this.id);
        
        }).adviceAfter(function (result, allArgs) {
            console.log('new uuid is: ' + result);
        });

        idMaker.uuid();
        // -> logs 'last uuid was: uuid2' in console
        // -> logs 'new uuid is: uuid3' in console
        // -> 'uuid3'

    **/
    api.advisable = function advisable (fn) {
        var woven;
        if (arguments.length < 1) {
            return advisable;
        }

        if (!type.isFunction(fn)) {
            throw 'advisable expects fn to be function but saw ' + fn;
        }

        woven = weave(fn, arity.aritize(fn.length)(function (args) {
            var _args = args, self = this;
            try {
                woven.befores.forEach(function (advice) {
                    var __args = advice.apply(self, _args);
                    if (type.isArray(__args)) {
                        _args = __args;
                    }
                });
                _args = [woven.body.apply(this, _args), _args];
                woven.afters.forEach(function (advice) {
                    advice.apply(self, _args);
                });
            } catch (exc) {
                return woven.throwings.forEach(function (advice) {
                    advice.call(self, exc, _args);
                });
            }
            return _args[0];
        }));
        return woven;
    }



    /***
     * EXPORT
     * ======
     */

    return api;

});