/* globals funkyJS, promise */
;(function (ns, factory) {
    ns.Builder = factory();
})(this, function () {
    var f = funkyJS;
    var Repo, Xhr, DepsManager, FormWatcher, Output;

    // Xhr
    // ---
    // .request({options}, doneFn, failFn)
    Xhr = (function () {
        function request (options, done, fail) {
            var method;
            if (!f.isString(options.url)) {
                return fail(new Error('Missing URL for XHR'));
            }

            method = promise[options.type.toLowerCase()].bind(promise);
            method(
                options.url,
                options.data,
                options.headers
            ).then(function (err, response) {
                if(err) {
                    return fail(err);
                }
                done(response);
            });
        }

        return {
            request: request
        };
    })();

    // DepsManager
    // -----------
    // .needs(moduleId) -> [dependencies],
    // .dependend(moduleId) -> [dependend modules]
    DepsManager = (function () {
        var managed = {
            birds: [],
            type: [],
            arity: ['type'],
            decorators: ['type', 'arity'],
            combinators: ['type', 'arity'],
            arrays: ['type'],
            object: ['type'],
            strings: ['type'],
            lenses: ['arity'],
            trampolines: ['type'],
            iterators: ['type'],
            decorators2: ['type', 'arity'],
            combinators2: ['type', 'arity'],
            advices: ['type', 'arity'],
            functors: ['type'],
            contracts: ['type'],
            dom: ['type', 'arity', 'decorators', 'arrays', 'advices']
        };

        function getDependencies (module) {
            if (f.has(module, managed)) {
                return managed[module];
            }
            return [];
        }

        function getDependend (module) {
            return f.keys(managed).reduce(function (acc, dep) {
                if (managed[dep].indexOf(module) > -1) {
                    acc.push(dep);
                }
                return acc;
            }, []);
        }

        return {
            needs: getDependencies,
            dependend: getDependend
        }
    })();

    // Repo
    // ----
    // .get(scriptIds, doneFn, failFn)
    Repo = (function () {
        var _cache = {},
            _url = '';

        function setUrl (url) {
            if (f.isString(url)) {
                _url = f.trim(url);
            }
        }

        function separate (ids, done, fail) {
            // separates given ids into those who are in _cache and those who
            // are not
            var scripts = {cached: [], missing: []};
            if (ids.length < 1) {
                return fail(new Error('Repo cannot get without any ID'));
            }
            ids.forEach(function (id) {
                if (f.has(id, _cache)) {
                    scripts.cached.push(_cache[id]);
                } else {
                    scripts.missing.push(id);
                }
            });
            done(scripts);
        }

        function getMissing (scripts, done, fail) {
            var _available = scripts.cached.join('');
            if (scripts.missing.length < 1) {
                return done(_available);
            }

            if (!_url) {
                return fail(new Error('Missing URL for output'));
            }

            Xhr.request({
                url: _url,
                type: 'GET',
                headers: {"Accept": "application/json"},
                data: {modules: scripts.missing.join(',')}
            }, function (response) {
                var parsed = JSON.parse(response);
                if (!f.isArray(parsed)) {
                    return fail(new Error('Invalid response of ' + parsed));
                }
                done(parsed.reduce(getMissing.transform, _available));
            }, fail);
        }
        getMissing.transform = function (acc, script) {
            _cache[script.id] = script.text;
            return acc + script.text;
        };

        function provide (scripts, done, fail) {
            if (!f.isString(scripts)) {
                return fail(new Error('unable to get the scripts'));
            }
            done(scripts);
        }

        var getScripts = f.pipeAsync(
            f.liftAsync(f.call(String.prototype.split, ',')),
            separate,
            getMissing,
            provide
        );

        return {
            src: setUrl,
            get: getScripts
        };
    })();

    // Output
    // ------
    // .set(node) -> sets output node
    // .render(text) -> renders text into output node
    // .error(exc) -> renders exception message into output node
    // .empty() -> eraises all text from output node
    Output = (function () {
        var $output;

        function set (node) {
            $output = f.beNode(node);
        }

        function format (text) {
            return text.replace(/\/\*!*?[\s\S]*?\*\//g, '');
        }

        function render (text) {
            $output.className = 'code success';
            $output.textContent = f.trim(format(text));
        }

        function error (exc) {
            $output.className = 'code failure';
            $output.textContent = 'Exception thrown: ' + f.trim(exc.message);
        }

        function empty () {
            $output.className = 'code';
            $output.textContent = '';
        }

        return {
            set: set,
            render: render,
            error: error,
            empty: empty
        };
    })();

    // FormWatcher
    // -----------
    // 
    FormWatcher = (function () {
        var fields;

        function activateFormFields (node) {
            fields = f.toArray(node.querySelectorAll('.checkbox'));
            fields.forEach(addAutoCheckListener)
        }

        function addAutoCheckListener (field) {
            var needs = DepsManager.needs(field.value),
                deps = DepsManager.dependend(field.value);

            field.addEventListener('change', function () {
                if (!field.checked) {
                    return fields.forEach(function (_field) {
                        if (deps.indexOf(_field.value) > -1) {
                            _field.checked = null;
                        }
                    });
                }
                fields.forEach(function (_field) {
                    if (needs.indexOf(_field.value) > -1) {
                        _field.checked = true;
                    }
                });
            });
        }

        function isChecked (field) {
            return !!field.checked;
        }

        function getFields (event) {
            event.preventDefault();
            return fields.filter(isChecked).map(f.get('value'));
        }

        var run = f.pipe(
            getFields,
            function (ids) {
                Repo.get(ids, Output.render, Output.error);
            }
        );

        return {
            observe: function (node) {
                activateFormFields(node);
                node.addEventListener('submit', run);
                node.addEventListener('reset', Output.empty);
            }
        };
    })();

    return {
        setOutput: function (node) {
            Output.set(node);
        },
        setInput: function (node) {
            FormWatcher.observe(node);
            Repo.src(node.action);
        }
    };
});