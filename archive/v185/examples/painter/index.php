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
    <title>Painter</title>
    <style type="text/css" media="screen">
        html, body {
            margin: 0;
            padding: 0;
        }
        .canvas {
            display: block;
            width: 100%;
            border: 1px solid #000;
            cursor: crosshair;
        }
        .table {
            width: 180px;
            border: 1px solid #000;
            border-top: none;
        }
        .table:after {
            content: '';
            display: block;
            clear: both;
        }
        .cell {
            float: left;
            width: 30px;
            height: 30px;
        }
    </style>
</head>
<body>
    <div class="painterapp">
        <canvas id="paintsurface" class="canvas" width="800" height="600">
        </canvas>
    </div>
    <script src="../../builds/funkyjs2.bundled.min.js"></script>
    <script src="../../builds/funkyjs2.ext.bundled.min.js"></script>
    <script src="zepto.min.js"></script>
    <script src="painter.js"></script>
    <script src="colors.js"></script>
    <script src="shapeSize.js"></script>
    <script>
    /* globals painter, colors, shapeSize */
    ;(function () {
        painter({node: '#paintsurface'});
        colors({node: '#paintsurface'});
        shapeSize({node: '#paintsurface'});
    })();
    </script>
</body>
</html>