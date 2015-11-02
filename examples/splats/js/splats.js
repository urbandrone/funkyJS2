/* globals funkyJS, jQuery */
;(function (ns, factory) {
    ns.Splat = factory({}, funkyJS, jQuery);
})(this, function (mod, f, $) {
    // shape implementation
    // --------------------
    // a shape is nothing but a container, which can occupy the whole browser
    //   window
    function makeShape () {
        var shape = Object.create(null);
        shape.$node = $('</div>').addClass('shape');
        shape.occupyWindow = function () {
            var css = f.extend(browserSize(), {
                position: 'fixed',
                top: '0',
                right: '0',
                bottom: '0',
                left: '0'
            });

            shape.$node.css(css);
            return shape;
        }
        shape.freeWindow = function () {
            shape.$node.css({
                position: null,
                top: null,
                right: null,
                bottom: null,
                left: null,
                width: null,
                height: null
            });
            return shape;
        }
        shape.on = f.polyadic(function (action, selectorHandle, handle) {
            if (f.isFunction(handle)) {
                shape.$node.on(action, selectorHandle, handle);
            } else {
                shape.$node.on(action, selectorHandle);
            }
            return shape;
        });

        return shape;
    }

    // image loader implementation
    // --------------------------------------
    // allows to load images asynchronously
    function makeImgLoader () {
        var loader = Object.create(null);

        function loadImage (img, src, done, fail) {
            if (f.isNil(img.src)) {
                img.src = src;
            }

            if (img.complete) {
                if (img.naturalWidth && img.naturalWidth * img.naturalHeight > 0) {
                    return done(img);
                }

                if (img.width * img.height > 0) {
                    return done(img);
                }

                return fail(new Error('Was loading image from: ' + src));
            }

            setTimeout(function () {loadImage(img, src, done, fail);}, 500);
        }

        loader.loadImage = function (url, done, fail) {
            var img = document.createElement('img');
            img.alt = '';
            img.onerror = fail;
            loadImage(img, url, done, fail);
        }

        return loader;
    }


    // spinner implementation
    // ----------------------
    // shows a rotating spinner or hides it
    function makeSpinner () {
        var spinner = Object.create(null);
        spinner.$node = $('</div>').addClass('spinner').addClass('is--hidden');
        spinner.show = function () {
            spinner.$node.removeClass('is--hidden');
            return spinner;
        }
        spinner.hide = function () {
            spinner.$node.addClass('is--hidden');
            return spinner;
        }
        return spinner;
    }


    // widget factory
    mod.make = function make (options) {
        var widget = Object.create(null),
            shape = makeShape(),
            loader = makeImgLoader(),
            spinner = makeSpinner();

        shape.id = options.id;
        shape.$node.prop('id', options.id).append(spinner.$node);
        spinner.show();
        loader.loadImage(options.bgImage, update(shape, spinner), log);

        widget.renderInto = function (node) {
            $(node).append(shape.$node);
            return widget;
        }
        widget.getSpinner = function () {
            return spinner;
        }
        widget.setBg = function (url, done, fail) {
            spinner.show();
            if (f.isFunction(done)) {
                loader.loadImage(url, update(shape, spinner, done), fail || log);
                return widget;
            }
            loader.loadImage(url, update(shape, spinner), log);
            return widget;
        }
        widget.addContent = function (node) {
            shape.$node.append(node);
            return widget;
        }
        widget.expand = function () {
            shape.occupyWindow();
            return widget;
        }
        widget.collapse = function () {
            shape.freeWindow();
            return widget;
        }

        return mixinMovable(widget);
    }


    mod.collection = function collection () {
        var widget = Object.create(null);
        var hasId = f.dyadic(function (id, object) { return object.id === id; });

        widget.findById = function (id, done, fail) {
            var item = f.first(widget.find(hasId(id)));
            if (!item) {
                return fail(new Error('No item with id ' + id + ' found'));
            }
            done(item);
        }

        return mixinRepo(widget);
    }


    // ====== Mixins ====== //
    function mixinMovable (widget) {
        return f.extend(widget, {
            move: function (options, done) {
                var opts = restricted(options);
                widget.$node.animate(opts[0], {
                    duration: opts[1],
                    complete: f.isFunction(done) ? done : f.identity
                });
            }
        });
    }

    function mixinRepo (widget) {
        var list = [];
        var eq = f.dyadic(function (x, y) { return x === y;});
        
        return f.extend(widget, {
            add: function (item) {
                list.push(item);
            },
            remove: function (item) {
                list = list.filter(f.not(eq(item)));
            },
            find: function (fn) {
                return list.filter(fn);
            }
        });
    }



    // ====== Different helpers ====== //
    
    /**
     * Returns the x/y space the window occupies on user screen
     *
     * @method browserSize
     *
     * @return {object} Object with width/height properties
     */
    function browserSize () {
        return {
            width: window.innerWidth,
            height: window.innerHeight
        };
    }

    /**
     * Returns a handler which is used to capture loaded images
     *
     * @method update
     * @param {object} shape Shape of instance
     * @param {object} spinner Spinner of instance
     * @return {function} Event handler
     */
    function update (shape, spinner, done) {
        return function (img) {
            shape.$node.css({
                backgroundImage: 'url(' + img.src + ')'
            });
            spinner.hide();

            if (f.isFunction(done)) {
                done(shape);
            }
        }
    }

    /**
     * Captures errors while loading images
     *
     * @method log
     * @param {object} exc Error object
     * @return {undefined} Nothing
     */
    function log (exc) {
        if (!f.isNil(window.console) && f.isFunction(window.console.log)) {
            window.console.log('Exception thrown with message:');
            window.console.log(exc.message);
        }
    }

    /**
     * Transfers only top, left, right and bottom values to the animation object
     *     passed into $node.animate(animation) in Movable
     *
     * @method restricted
     *
     * @param {object} options Config object
     *
     * @return {array} Array of [modifiedAnimation, duration]
     */
    function restricted (options) {
        var opts = {};
        if (options.left) {
            opts.left = options.left;
        } else if (options.right) {
            opts.right = options.right;
        }

        if (options.top) {
            opts.top = options.top;
        } else if (options.bottom) {
            opts.bottom = options.bottom;
        }
        return [opts, options.duration || 500];
    }

    
    return mod;
});