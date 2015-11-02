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
    @module combinators.extensions
    **/
    var api = {};



    // INTERNAL UTILS
    // ==============
    var slice = function (x) {
        return [].slice.apply(x, [].slice.call(arguments, 1));
    }


    /**
    Allows the compose asynchronous working function, as long as they provide a
        a compatible interface. A function is considered compatible if it
        accepts at least three arguments. The first and the second argument are
        assumed to be (1) the continuation function and (2) the error handler.
        The third argument given to the returned function should be the data/arguments with which to start. The composed function executes the given
        function from right to left, much like the core compose() function. For
        usage information please see the example below

    @method composeAsync
    @for funkyJS
    @param {function} fn1* One to N asynchronous function to compose
    @return {function} The composed functions as a new function
    
    @example
        function findUser (id, cont, fail) {
            users.byId(id, function (err, user) {
                // note: the err argument is completely optional, this is just
                //       a mapping from node's convention
                if (err != null) {
                    return fail(err);
                }

                // call of cont() with user to proceed
                cont(user);
            });
        }

        function formatUser (user, cont, fail) {
            avatars.byId(user.id, function (err, avatar) {
                if (avatar.isCorrupt()) {
                    return fail(new Error('Falsy avatar, only .jpg allowed'));
                }

                cont(funkyJS.inherits(user, avatar));
            });
        }
        

        var showUser = funkyJS.composeAsync(formatUser, findUser);


        // this is the exit function
        function showCard (userAndAccount) {
            ui.addUserCard(userAndAccount).makeEventConnections();
        }

        // this is the fail function
        function catchError (err) {
            console.log(err.message);
        }

        // get user with id 'user012a37fb'
        showUser(addCard, catchError, 'user012a37fb');
    **/
    api.composeAsync = function composeAsync (/* fn1, ...fnN */) {
        var fns;

        if (arguments.length < 1) {
            return composeAsync;
        }

        fns = slice(arguments).filter(type.isFunction);
        if (fns.length < 1) {
            throw 'Expected at least one function to compose but found none';
        }

        return arity.triadic(function (value, contFn, errFn) {
            var self = this;
            fns.reduceRight(function (fn1, fn2) {
                return function (data, cont, err) {
                    fn2.call(self, data, function (_data) {
                        fn1.call(self, _data, cont, err);
                    }, err);
                }
            }).call(this, value, contFn, errFn);
        });
    }


    /**
    Allows the pipe asynchronous working function, as long as they provide a
        a compatible interface. A function is considered compatible if it
        accepts at least three arguments. The first and the second argument are
        assumed to be (1) the continuation function and (2) the error handler.
        The third argument given to the returned function should be the data/arguments with which to start. The piped function executes the given
        function from left to right, much like the core pipe() function. For
        usage information please see the example below

    @method pipeAsync
    @for funkyJS
    @param {function} fn1* One to N asynchronous function to pipe
    @return {function} The piped functions as a new function
    
    @example
        function findUser (id, cont, fail) {
            users.byId(id, function (err, user) {
                // note: the err argument is completely optional, this is just
                //       a mapping from node's convention
                if (err != null) {
                    return fail(err);
                }

                // call of cont() with user to proceed
                cont(user);
            });
        }

        function formatUser (user, cont, fail) {
            avatars.byId(user.id, function (err, avatar) {
                if (avatar.isCorrupt()) {
                    return fail(new Error('Falsy avatar, only .jpg allowed'));
                }

                cont(funkyJS.inherits(user, avatar));
            });
        }

        // this is the exit function
        function showCard (userAndAccount) {
            ui.addUserCard(userAndAccount).makeEventConnections();
        }

        // this is the fail function
        function catchError (err) {
            console.log(err.message);
        }
        

        var getUser = funkyJS.pipeAsync(findUser, formatUser);

        // get user with id 'user0c2a37fb'
        getUser('user0c2a37fb', showCard, catchError);
    **/
    api.pipeAsync = function pipeAsync (/* fn1, ...fnN */) {
        var fns;

        if (arguments.length < 1) {
            return pipeAsync;
        }

        fns = slice(arguments).filter(type.isFunction);
        if (fns.length < 1) {
            throw 'Expected at least one function to pipe but found none';
        }

        return arity.triadic(function (value, contFn, errFn) {
            var self = this;
            fns.reduce(function (fn1, fn2) {
                return function (data, cont, err) {
                    fn1.call(self, data, function (_data) {
                        fn2.call(self, _data, cont, err);
                    }, err);
                }
            }).call(this, value, contFn, errFn);
        });
    }

    /**
    Lifts a synchronous working function into a function which can be composed
        and piped in a asynchronous chain

    @method liftAsync
    @for funkyJS
    @param {function} fn The synchronous function
    @return {function} A function with asynchronous style wrapper

    @example
        var f = funkyJS; // readability

        function getUser(id, cont, fail) {
            users.byId(id, function (err, user) {
                if (err) {
                    return fail(err);
                }
                cont(user);
            });
        }

        function getAvatar (id, cont, fail) {
            avatars.byId(id, function (err, avatar) {
                if (err) {
                    return fail(err);
                }
                cont(avatar);
            });
        }

        var getUserAvatar = f.pipeAsync(
            getUser,
            f.liftAsync(f.get('id')),
            getAvatar
        );

        getUserAvatar('user0c2a37fb', function (avatar) {
            ui.showAvatar(avatar);
        }, function (err) {
            ui.showError(err.message);
        });
    **/
    api.liftAsync = function liftAsync (fn) {
        if (arguments.length < 1) {
            return liftAsync;
        }

        if (!type.isFunction(fn)) {
            throw 'liftAsync can only be called on functions';
        }

        return arity.triadic(function (data, cont, err) {
            if (!type.isFunction(cont)) {
                throw 'Invalid continuation function: ' + cont;
            }

            try {
                cont.call(this, fn.call(this, data));
            } catch (exc) {
                if (type.isFunction(err)) {
                    err(exc);
                }
            }
        });
    }

    /**
    Allows to savely wrap functions which have side effects (like UI updates)
        with a wrapper ready to be used in asynchronous control flows. This
        allows to savely perform side effects inside asynchronous function
        compositions or pipes

    @method sideEffect
    @for funkyJS
    @param {function} fn The function which has side effects
    @return {function} A function with asynchronous style wrapper

    @example
        var f = funkyJS; // readability

        function getUser(id, cont, fail) {
            users.byId(id, function (err, user) {
                if (err) {
                    return fail(err);
                }
                cont(user);
            });
        }

        function getAvatar (id, cont, fail) {
            avatars.byId(id, function (err, avatar) {
                if (err) {
                    return fail(err);
                }
                cont(avatar);
            });
        }

        var getUserAvatar = f.pipeAsync(
            f.sideEffect(ui.showProgressIndicator), // fn with side effect
            getUser, // async operation
            f.liftAsync(f.get('id')), // sync <=> async mapping
            getAvatar,
            f.sideEffect(ui.hideProgressIndicator)
        );

        getUserAvatar('user0c2a37fb', function (avatar) {
            ui.showAvatar(avatar);
        }, function (err) {
            ui.showError(err.message);
        });
    **/
    api.sideEffect = function sideEffect (fn) {
        if (arguments.length < 1) {
            return sideEffect;
        }

        if (!type.isFunction(fn)) {
            throw 'sideEffect can only be called on functions';
        }

        return arity.triadic(function (data, cont, err) {
            if (!type.isFunction(cont)) {
                throw 'Invalid continuation function: ' + cont;
            }

            try {
                fn.call(this, data);
            } catch (exc) {
                if (type.isFunction(err)) {
                    err(exc);
                }
            } finally {
                cont.call(this, data);
            }
        });
    }



    /*
     * EXPORT
     * ======
     */

    return api;

});