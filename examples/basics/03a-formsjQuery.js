/* globals funkyJS, jQuery */
;(function (f, $) {

    var config = {
        dataPattern: 'pattern',
        invalidCssClass: 'is--invalid'
    };

    var evaluators = {
        text: function (descriptor) {
            return descriptor.regex.test(descriptor.field.val());
        },
        textarea: function (descriptor) {
            return descriptor.regex.test(descriptor.field.text());
        },
        password: function (descriptor) {
            return descriptor.regex.test(descriptor.field.val());
        },
        checkbox: function (descriptor) {
            return !!(descriptor.field.is(':checked'));
        },
    };

    var getFields = function (selector, rootNode) {
        return $(selector, rootNode);
    }

    var data = (function () {
        return {
            set: f.triadic(function (key, value, node) {
                node.data(key, value);
                return node;
            }),
            get: f.dyadic(function (key, node) {
                return node.data(key);
            })
        };
    })();

    var cssClass = (function () {
        return {
            set: f.dyadic(function (cls, node) {
                node.addClass(cls);
                return node;
            }),
            del: f.dyadic(function (cls, node) {
                node.removeClass(cls);
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
            type: (field.prop('type') || field.prop('tagName')).toLowerCase(),
            regex: new RegExp(_pattern, 'g')
        }
    }

    var separateWith = f.dyadic(function (divider, list) {
        return [divider(list), f.not(divider)(list)];
    });

    var passing = function (descriptor) {
        if (evaluators[descriptor.type]) {
            return evaluators[descriptor.type](descriptor);
        }
        return true;
    }



    var validate = f.pipe(
        getFields,
        describe,
        separateWith(passing),
        f.splat([
            f.pipe(f.first, f.eachWith(unsetInvalid)),
            f.pipe(f.last, f.eachWith(setInvalid))
        ])
    );



    // use either like this: validate('.is--mandatory');
    // or like this: validate('.is--mandatory', $('#myForm'));
    window.validate = validate;

})(funkyJS, jQuery);