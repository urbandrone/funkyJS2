<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <meta name="robots" content="index,follow">
    <meta name="keywords" content="funkyJS, Example, Javascript">
    <meta name="description" content="Example application for funkyJS demo">
    <meta name="author" content="D. Hofmann">
    <title>Contacts</title>
    <link rel="stylesheet" href="normalize.css">
    <link rel="stylesheet" href="contacts.css">
</head>
<body>
    <div class="contacts" data-app="Contacts">
        <form id="contacts-form" class="form" action="#" method="post" accept-charset="utf-8">
            <div class="form_group">
                <label class="label" for="contact-fname">
                    Vorname:
                </label>
                <input type="text"
                    id="contact-fname"
                    name="contact_fname"
                    class="input--text"
                    placeholder="John"
                    data-required="true" />

                <label class="label" for="contact-lname">
                    Name:
                </label>
                <input type="text"
                    id="contact-lname"
                    name="contact_lname"
                    class="input--text"
                    placeholder="Doe" />
            </div>
            <div class="form_group">
                <label class="label" for="contact-by">
                    Kontakt:
                </label>
                <input type="text"
                    id="contact-by"
                    name="contact_option"
                    class="input--text"
                    placeholder="EMail or Phone" />

                <button type="submit" class="base_button button">
                    Add
                </button>
            </div>
        </form>
        <ul class="list list--nobullet" id="contact-list">
            <script type="text/template" id="contact-template">
                <p class="contact_name">${name}</p>
                <p class="contact_option">${option}</p>
                <button type="button" class="contact_button button">
                    &times;
                </button>
            </script>
        </ul>
    </div>
    <script src="../../builds/funkyjs2.bundled.min.js"></script>
    <script src="../../builds/funkyjs2.ext.bundled.min.js"></script>
    <script src="zepto.min.js"></script>
    <script src="contact.js"></script>
    <script src="repo.js"></script>
    <script src="form.js"></script>
    <script src="app.js"></script>
</body>
</html>