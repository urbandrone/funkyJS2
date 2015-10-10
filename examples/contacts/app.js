/* globals funkyJS */
;(function (ns, factory) {
    factory(ns.App);
})(this, function (app) {
    var f = funkyJS;

    var form = app.makeContactForm();
    var list = app.makeContactList();

    form.onSubmission(function (formData) {
        var person;
        if (f.trim(formData.name) === '') {
            return; // no name, no contact :)
        }

        person = app.makeContact().
            setName(formData.name).
            setContactType(formData.option);

        list.addContact(person);
    });
});