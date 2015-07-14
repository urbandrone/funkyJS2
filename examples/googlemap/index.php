<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Google Maps Plugin</title>
    <link rel="stylesheet" href="maps.css">
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
    <script src="../../builds/funkyjs2.browser.min.js"></script>
    <script src="../../builds/funkyjs2.ext.browser.min.js"></script>
    <script src="js/make.js"></script>
    <script src="js/plugin_core.js"></script>
    <script src="js/plugin_utils.js"></script>
    <script src="js/plugin_map.js"></script>
    <script src="js/plugin_model.js"></script>
    <script src="js/plugin_view.js"></script>
    <script src="js/plugin_controller.js"></script>
</body>
</html>