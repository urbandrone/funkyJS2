;(function (ns, factory) {
    ns.funkyDOM = factory(ns.funkyJS, ns.jQuery || ns.Zepto);
})(this, function (f, $) {
    var mod, proto, isjQ, extend, superCall;
    if (f == null || $ == null) {
        return function () { return null; };
    }

    // UTILITIES
    // =========
    isjQ = function (x) {
        // true if $.fn is in prototype chain of x
        return $.fn.isPrototypeOf(x);
    }

    extend = function (jQ, methods) {
        // special extend() method, mixes in the methods as "invisble" methods
        //   on the instance
        if (isjQ(jQ) && f.isObject(methods)) {
            Object.keys(methods).forEach(function (method) {
                Object.defineProperty(jQ, method, {
                    enumerable: false,
                    writable: true,
                    value: methods[method]
                });
            });
        }
        return jQ;
    }
    superCall = f.tap(function superCall (name) {
        // delegate all of these calls to the super method and return a new
        //   funkyDOM collection from it
        return f.variadic(function (args) {
            return mod(superCall.BASE[name].apply(this, args));
        });
    })(function (fn) {
        fn.BASE = $([]); // the BASE
        return fn;
    });




    // HERE'S THE FACTORY FUNCTION (funkyDOM)
    // ======================================
    // takes two arguments (selector and root) like basic jQuery/Zepto and
    //   then extends it
    mod = function (selector, root) {
        return extend(!root ? $(selector) : $(selector, root), proto);
    }
    
    // DEFINITION OF STATIC METHODS
    // ============================
    mod.is = f.monadic(function (self) {
        // take any
        // give true if jQuery and has .ego() method
        return isjQ(self) && f.isFunction(self.ego);
    });
    mod.ego = f.variadic(function (self, methods) {
        // take instance/object, variadic strings
        //   bind those which are functions to the instance/object
        // give instance/object
        if (self) {
            methods.filter(f.isString).forEach(function (method) {
                if (!f.isFunction(self[method])) {
                    return;
                }
                Object.defineProperty(self, method, {
                    enumerable: false,
                    writable: true,
                    value: f.aritize(self[method].length, true)(
                        self[method].bind(self)
                    )
                });
            });
        }
        return self;
    });
    mod.advisable = f.dyadic(function (self, method) {
        // take instance/object, string
        //   make advisable if instance[string] is method
        // give instance/object
        if (self && f.isString(method) && f.isFunction(self[method])) {
            self[method] = f.advisable(self[method]);
        }
        return self;
    });
    mod.evoke = f.variadic(function (self, args) {
        // take instance/object, variadic string and *
        //   give deferred invocation if instance[string] is method
        //   give constant instance/object in any other case
        if (self && f.isString(args[0]) && f.isFunction(self[args[0]])) {
            return f.call.apply(null, [self[args[0]]].concat(args.slice(1)));
        }
        return f.constant(self);
    });
    mod.evokeRight = f.variadic(function (self, args) {
        // take instance/object, variadic string and *
        //   give deferred right invocation if instance[string] is method
        //   give constant instance/object in any other case
        if (self && f.isString(args[0]) && f.isFunction(self[args[0]])) {
            return f.callRight.apply(null, [self[args[0]]].concat(args.slice(1)));
        }
        return f.constant(self);
    });
    mod.unique = f.monadic(function (self) {
        // take instance/object
        //   give unique(instance) if instance is collection
        //   give instance/object otherwise
        if (isjQ(self)) {
            return mod($(f.unique(self.toArray())));
        }
        return self;
    });
    mod.union = f.dyadic(function (self, other) {
        // take instance/object, instance/object
        //   give union(instance, instance) if both are collections
        //   give first instance/object otherwise
        if (isjQ(self) && isjQ(other)) {
            return mod($(f.union(self.toArray(), other.toArray())));
        }
        return self;
    });
    mod.intersect = f.dyadic(function (self, other) {
        // take instance/object, instance/object
        //   give intersetion(instance, instance) if both are collections
        //   give first instance/object otherwise
        if (isjQ(self) && isjQ(other)) {
            return mod($(f.intersect(self.toArray(), other.toArray())));
        }
        return self;
    });
    mod.difference = f.dyadic(function (self, other) {
        // take instance/object, instance/object
        //   give difference(instance, instance) if both are collections
        //   give first instance/object otherwise
        if (isjQ(self) && isjQ(other)) {
            return mod($(f.difference(self.toArray(), other.toArray())));
        }
        return self;
    });
    mod.fEach = f.variadic(function (self, fnScope) {
        // take instance/object, function, optional scope/context
        //   call $.each but alter args if given collection and function
        // give instance/object
        var fn = fnScope[0], scope = fnScope[1];
        if (isjQ(self) && f.isFunction(fn)) {
            scope = f.isNil(scope) ? self : scope;
            superCall.BASE.each.call(self, function (i) {
                fn.call(scope, this, i, self);
            });
        }
        return self;
    });
    mod.fMap = f.variadic(function (self, fnScope) {
        // take instance/object, function, optional scope/context
        //   map with mod.fEach if given collection and function
        // give instance/object
        var fn = fnScope[0], scope = fnScope[1], result = [];
        if (isjQ(self) && f.isFunction(fn)) {
            scope = f.isNil(scope) ? self : scope;
            mod.fEach(self, function (it, i, all) {
                result.push(fn.call(scope, it, i, all));
            });
        }
        return mod($(result));
    });
    mod.fFilter = f.variadic(function (self, fnScope) {
        // take instance/object, function, optional scope/context
        //   filter with mod.fEach if given collection and function
        // give instance/object
        var fn = fnScope[0], scope = fnScope[1], result = [];
        if (isjQ(self) && f.isFunction(fn)) {
            scope = f.isNil(scope) ? self : scope;
            mod.fEach(self, function (it, i, all) {
                if (!!fn.call(scope, it, i, all)) {
                    result.push(it);
                }
            });
        }
        return mod($(result));
    });

    // INSTANCE METHODS MIXED IN ON CREATION
    // =====================================
    proto = {
        ego: f.variadic(function (fns) {
            // see mod.ego
            return mod.ego.apply(null, [this].concat(fns));
        }),
        advisable: function (fn) {
            // see mod.advisable
            return mod.advisable(this, fn);
        },
        evoke: f.variadic(function (fn, args) {
            // see mod.evoke
            return mod.evoke.apply(null, [this, fn].concat(args));
        }),
        evokeRight: f.variadic(function (fn, args) {
            // see mod.evokeRight
            return mod.evokeRight.apply(null, [this, fn].concat(args));
        }),
        fEach: function (fn, scope) {
            // see mod.fEach
            return mod.fEach.apply(null, [this, fn, scope]);
        },
        fMap: function (fn, scope) {
            // see mod.fMap
            return mod.fMap.apply(null, [this, fn, scope]);
        },
        fFilter: function (fn, scope) {
            // see mod.fFilter
            return mod.fFilter.apply(null, [this, fn, scope]);
        },
        unique: function () {
            // see mod.unique
            return mod.unique(this);
        },
        union: function (other) {
            // see mod.union
            return mod.union(this, other);
        },
        intersect: function (other) {
            // see mod.intersect
            return mod.intersect(this, other);
        },
        difference: function (other) {
            // see mod.difference
            return mod.difference(this, other);
        },
        to$: function () {
            // give plain jQuery/Zepto collection
            return $(this.toArray());
        }
    };

    [
        'find', 'closest', 'parent', 'parents', 'parentsUntil', 'children',
        'siblings', 'prev', 'prevAll', 'prevUntil', 'next', 'nextAll', 'nextUntil',
        'contents', 'eq', 'first', 'last', 'offsetParent', 'add', 'addSelf',
        'addBack', 'end', 'has', 'clone', 'not'
    ].forEach(function (method) {
        // declare each to be super calls to ensure returning funkyDOM collections
        //   instead of jQuery/Zepto collections
        proto[method] = superCall(method);
    });

    return mod;
});