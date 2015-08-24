;(function (g, factory) {
    if (typeof define === 'function' && define.amd) {
        // leave alone, a AMD compatible library is already in use!
        return;
    }

    if (typeof module === 'object' && module.exports) {
        // this might be used in CommonJS, although I cannot imagine why. anyway:
        //   you want it, you get it
        module.exports = factory({});
        return;
    }

    // being here means no AMD, no CommonJS - just a good'ol browser
    g.IOC = factory({});

})(this, function (ns) {

    var _modules = {},
        _queued = [];

    function getDependencies (dependencies) {
        var _deps = [],
            _miss = 0,
            _i = 0;

        while (_i < dependencies.length) {
            if (typeof dependencies[_i] === 'string') {
                if (_modules.hasOwnProperty(dependencies[_i])) {
                    _deps[_i] = _modules[dependencies[_i]];
                } else {
                    _deps[_i] = dependencies[_i];
                    _miss += 1;
                }
            } else {
                _deps[_i] = dependencies[_i];
            }

            _i += 1;
        }

        return {
            missing: _miss,
            found: _deps
        };
    }

    function tryInit (cont) {
        var _item = null,
            _deps = null,
            _i = 0;

        while (_i < _queued.length) {
            _item = _queued[_i];

            _deps = getDependencies(_item.found);
            if (_deps.missing > 0) {
                _item.missing = _deps.missing;
                _item.found = _deps.found;
                _deps = null;
                _i += 1;
                continue;
            }

            _queued.splice(_i, 1);
            _modules[_item.module] = _item.factory.apply(
                null,
                _deps.found
            );
            _item = _deps = null;
            _i += 1;
        }

        return cont();
    }

    function internalDefine (mod, dependencies, factory) {
        var _deps;

        if (_modules.hasOwnProperty(mod)) {
            throw new Error('Unable to register module ' + mod + ' twice');
        }
        
        tryInit(function () {
            _deps = getDependencies(dependencies);
            if (_deps.missing > 0) {
                _deps.module = mod;
                _deps.factory = factory;
                _queued.push(_deps);
                return;
            }

            _modules[mod] = factory.apply(null, _deps.found);
        });
    }

    function internalRequire (dependencies, boot) {
        tryInit(function () {
            var _deps = getDependencies(dependencies);
            if (_deps.missing > 0) {
                throw new Error('require() cannot execute, missing modules ' + _deps.missing.join(', '));
            }

            boot.apply(null, _deps.found);
        });            
    }

    function internalRequireInstant (dependencies) {
        return tryInit(function () {
            var _deps = {};
            dependencies.forEach(function (mod) {
                if (this.hasOwnProperty(mod)) {
                    _deps[mod] = this[mod];
                }
            }, _modules);
            return _deps;
        });        
    }

    ns.mods = function () { return _modules; };
    ns.queue = function () { return _queued; };

    ns.define = function (mod, dependencies, factory) {
        if (typeof factory === 'function' && Array.isArray(dependencies)) {
            return internalDefine(mod, dependencies, factory);
        }

        if (typeof dependencies === 'function') {
            return internalDefine(mod, [], dependencies);
        }

        throw new Error('define() -> ARGS_TYPE_MISMATCH:: ' + mod + ':string, ' + dependencies + ':array|function, ' + factory + ':function');
    }

    ns.require = function (dependencies, factory) {
        if (typeof factory === 'function' && Array.isArray(dependencies)) {
            return internalRequire(dependencies, factory);
        }

        if (Array.isArray(dependencies)) {
            return internalRequireInstant(dependencies);
        }

        if (typeof dependencies === 'string') {
            return internalRequireInstant([dependencies])[dependencies] || null;
        }

        throw new Error('require() -> ARGS_TYPE_MISMATCH:: ' + dependencies + ':array, ' + factory + ':function');
    }

    return ns;

});