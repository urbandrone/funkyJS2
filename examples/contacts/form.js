/* globals funkyJS, Zepto */
;(function (ns, factory) {
    ns.App = factory(ns.App || {});
})(this, function (app) {
    var f = funkyJS,
        $ = Zepto;



    app.makeContactForm = function () {
        var form = buildContactForm({
            $root: $('#contacts-form'),
            $fname: $('#contact-fname'),
            $lname: $('#contact-lname'),
            $by: $('#contact-by'),
            _submissions: []
        });
        form.$root.on('submit', form.handleSubmission.bind(form));

        form.handleSubmission.adviceAfter(function () {
            this._submissions.forEach(function (fn) {
                fn(this.getValues());
            }, this);
        });
        
        return form;
    };



    var makeModel = function makeModel (widget) {
        return f.extend(widget, {
            getValues: function () {
                var name = [this.$fname.val(), this.$lname.val()],
                    by = this.$by.val() || '';

                this.$fname.val('');
                this.$lname.val('');
                this.$by.val('');

                return {
                    name: !!name[1] ? name.join(' ') : !!name[0] ? name[0] : '',
                    option: by
                };
            },
            onSubmission: f.fluent(function (fn) {
                this._submissions.push(fn);
            })
        });
    }

    var makeController = function makeController (widget) {
        return f.extend(widget, {
            handleSubmission: f.advisable(function (event) {
                event.preventDefault();
                event.stopPropagation();
            })
        });
    }

    var buildContactForm = f.pipe(makeModel, makeController);



    return app;
});