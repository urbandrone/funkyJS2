/* globals funkyJS */
;(function (f) {

    var config = {
        dataPattern: 'pattern',
        invalidCssClass: 'is--invalid'
    };

    var evaluators = {
        text: function (descriptor) {
            return descriptor.regex.test(descriptor.field.value);
        },
        textarea: function (descriptor) {
            return descriptor.regex.test(descriptor.field.textContent);
        },
        password: function (descriptor) {
            return descriptor.regex.test(descriptor.field.value);
        },
        checkbox: function (descriptor) {
            return !f.isNil(descriptor.field.checked);
        },
    };

    var getFields = function (selector, rootNode) {
        return (rootNode || document).querySelectorAll(selector);
    }

    var data = (function () {
        if (document.body.dataset) {
            return {
                set: f.triadic(function (key, value, node) {
                    node.dataset[f.camelize(key)] = value;
                }),
                get: f.dyadic(function (key, node) {
                    return node.dataset[f.camelize(key)];
                })
            };
        }
        return {
            set: f.triadic(function (key, value, node) {
                node.setAttribute('data-' + f.dasherize(key), value);
            }),
            get: f.dyadic(function (key, node) {
                return node.getAttribute('data-' + f.dasherize(key));
            })
        };
    })();

    var cssClass = (function () {
        var regex;
        if (document.body.classList) {
            return {
                set: f.dyadic(function (cls, node) {
                    node.classList.add(cls);
                    return node;
                }),
                del: f.dyadic(function (cls, node) {
                    node.classList.remove(cls);
                    return node;
                })
            };
        }
        regex = function (str, flags) {
            if (f.isString(flags)) {
                return new RegExp(str, flags);
            }
            return new RegExp(str);
        }
        return {
            set: f.dyadic(function (cls, node) {
                if (!regex(cls).test(node.className)) {
                    node.className += (' ' + cls);
                }
                return node;
            }),
            del: f.dyadic(function (cls, node) {
                if (regex(cls).test(node.className)) {
                    node.className = node.className.replace(
                        regex('\\s+?' + cls, 'g'),
                        ''
                    );
                }
                return node;
            })
        };
    })();



    var getPattern = data.get(config.dataPattern);
    var setInvalid = cssClass.set(config.invalidCssClass);
    var unsetInvalid = cssClass.del(config.invalidCssClass);

    var describe = function (field) {
        var _pattern = getPattern(field);

        return {
            field: field,
            type: (field.type || field.tagName || field.nodeName).toLowerCase(),
            regex: new RegExp(_pattern, 'g')
        }
    }

    var separate = f.triadic(function (divider1, divider2, list) {
        return [divider1(list), divider2(list)];
    });

    var passes = function (descriptor) {
        if (evaluators[descriptor.type]) {
            return evaluators[descriptor.type](descriptor);
        }
        return true;
    }



    var getParts = f.pipe(
        getFields,
        describe,
        separate(passes, f.not(passes))
    );

    var addClasses = f.splat([
        f.pipe(f.first, f.eachWith(unsetInvalid)),
        f.pipe(f.last, f.eachWith(setInvalid))
    ]);

    var validate = f.pipe(getParts, addClasses);



    // use either like this: validate('.is--mandatory');
    // or like this: validate('.is--mandatory', document.querySelector('#myForm'));
    window.validate = validate;

})(funkyJS);