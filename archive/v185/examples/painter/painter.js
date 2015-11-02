/* globals funkyJS, Zepto */
;(function (ns, factory) {
    // use like so:
    // ------------
    // 
    // var myPainter = painter({
    //     node: '#my-selector'
    // });
    // 
    // myPainter.node;
    // -> {0: canvas#my-selector}
    ns.painter = factory(Zepto, funkyJS);
})(this, function ($, f) {
    var cancelDefault = function (event) {
        event.preventDefault();
        return event;
    }

    var draw = f.tap(function drawShape (canvas, coords) {
        if (drawShape.inBounds(canvas, coords)) {
            drawShape.circle(canvas, coords);
        }
    })(function (fn) {
        fn.inBounds = function ($node, coords) {
            var off = $node.offset();
            return off.top <= coords.pageY &&
                   off.top + off.height >= coords.pageY &&
                   off.left <= coords.pageX &&
                   off.left + off.width >= coords.pageX;
        }
        fn.circle = function ($node, coords) {
            var ctx = $node[0].getContext('2d');
            ctx.beginPath();
            ctx.arc(
                coords.pageX,
                coords.pageY,
                window.painter.shapeSize,
                0,
                Math.PI * 2,
                false
            );
            ctx.fill();
            ctx.closePath();
        }
        return fn;
    });

    // overwrite
    var drawTo = f.dyadic(draw);



    var painter = f.tap(function painter (config) {
        return painter.linkEvents(painter.init(config));
    })(function (fn) {
        fn.shapeSize = 2;

        fn.init = function (conf) {
            var it = f.extend({}, conf);
            it.node = $(it.node, it.container || document);
            return it;
        }
        fn.linkEvents = function (it) {
            var painting = false;

            it.node.on('mousedown', function () {
                painting = true;
            });

            it.node.on('mousemove', f.guard(
                function () { return painting; },
                f.pipe(cancelDefault, drawTo(it.node))
            ));

            it.node.on('mouseup mouseover mouseout', function () {
                painting = false;
            });

            $(window).on('resize', function () {
                it.node.attr('width', it.node.parent().width());
            });
            it.node.attr('width', it.node.parent().width());

            return it;
        }
        return fn;
    });



    return painter;
});