/* globals funkyJS, Zepto */
;(function (ns, factory) {
    ns.App = factory(ns.App || {});
})(this, function (app) {
    var f = funkyJS,
        $ = Zepto;


    // factory
    // -------
    app.makeContact = function () {
        var contact = buildContact({
            $root: $('<li></li>').addClass('contact').addClass('list_item')
        });

        contact.render.adviceBefore(function () {
            if (f.isNotFunction(this._template)) {
                this._template = f.constant('Template missing');
            }
        }).adviceAfter(function () {
            this.$root.on('click', '.contact_button', this.destroy.bind(this));
        });

        return contact;
    }


    // building blocks
    // ===============
    var addModel = function addModel (widget) {
        return f.extend(widget, {
            setName: f.fluent(function (name) {
                this._name = name;
            }),
            setContactType: f.fluent(function (contactBy) {
                this._contactBy = contactBy;
            }),
            setTemplate: f.fluent(function (tpl) {
                this._template = f.substitude(f.beString(tpl));
            })
        });
    }

    var addView = function addView (widget) {
        return f.extend(widget, {
            appendTo: f.fluent(function ($node) {
                $node.append(this.$root);
            }),
            render: f.advisable(function () {
                this.$root.html(this._template({
                    name: this._name,
                    option: this._contactBy
                }));
            })
        });
    }

    var addController = function addController (widget) {
        return f.extend(widget, {
            destroy: function (event) {
                var _key;

                event.preventDefault();
                event.stopPropagation();

                this.$root.off('click').remove();
                for (_key in this) {
                    if (this.hasOwnProperty(_key)) {
                        delete this[_key];
                    }
                }
            }
        });
    }

    var buildContact = f.pipe(addModel, addView, addController);



    return app;
});