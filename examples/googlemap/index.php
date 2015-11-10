<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Google Maps Plugin</title>
    <link rel="stylesheet" href="css/map.css">
</head>
<body>
    <div class="information">
        <ul class="notes">
            <li class="notes_item">
                This example will not work in Internet Explorer below version 10.
            </li>
        </ul>
    </div>
    <?php 
    include 'plugin.html';
    ?>
    <script src="https://maps.googleapis.com/maps/api/js?v=3"></script>
    <script src="../../builds/funkyjs2.bundled.min.js"></script>
    <script src="js/make.js"></script>
    <script src="js/plugin_core.js"></script>
    <script src="js/plugin_utils.js"></script>
    <script src="js/plugin_map.js"></script>
    <script src="js/plugin_model.js"></script>
    <script src="js/plugin_view.js"></script>
    <script src="js/plugin_controller.js"></script>
    <script>
    /* globals PlaceMap, funkyJS, make */
    ;(function (f, plugin) {
        var makePluginInstance = f.memoize(function (selector) {
            var node = document.querySelector(selector);

            var model = plugin.model.make(),
                view = plugin.view.make(node),
                map = plugin.mapRenderer.make(),
                controller = plugin.controller.make();

            model.connectController(controller);
            controller.connectModel(model);

            view.connectController(controller);
            controller.connectView(view);

            map.connectController(controller);
            controller.connectRenderer(map);

            model.loadJson();

            return make({
                $root: node,
                filterCityByCategories: function (continent, country, name) {
                    return model.filter(continent, country, name);
                }
            });
        });

        window.onload = function () {
            makePluginInstance(plugin.utils.domConfig('selector'));
        };
    })(funkyJS, PlaceMap);
    </script>
</body>
</html>