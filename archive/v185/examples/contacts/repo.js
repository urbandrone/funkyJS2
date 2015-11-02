/* globals funkyJS, Zepto */
;(function (ns, factory) {
    ns.App = factory(ns.App || {});
})(this, function (app) {
    var f = funkyJS,
        $ = Zepto;


    app.makeContactList = function () {
        return buildContactList({
            $root: $('#contact-list'),
            _tpl: $('#contact-template').remove().html()
        });
    };



    function makeView (widget) {
        return f.extend(widget, {
            addContact: f.fluent(function (contact) {
                contact.setTemplate(this._tpl).
                    appendTo(this.$root).
                    render();
            })
        });
    }

    var buildContactList = makeView;


    return app;
});