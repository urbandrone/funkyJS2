/* globals funkyJS, Zepto */
;(function (ns, factory) {
    // use like so:
    // ------------
    // 
    // 
    ns.colors = factory(Zepto, funkyJS);
})(this, function ($, f) {
    var COLORTABLE = [
        '#ffffff', '#ffff00', '#ff0000', '#00ff00', '#00ffff', '#0000ff',
        '#000000', '#dddddd', '#bbbbbb', '#999999', '#666666', '#333333'
    ];


    if (f.isNil(window.painter)) {
        return f.identity;
    }

    var cell = f.tap(function cell (color) {
        return cell.make(color);
    })(function (fn) {
        fn.make = function (clr) {
            return $('<div></div>').
                addClass('cell').
                css('backgroundColor', clr).
                data('clr', clr);
        }
        return fn;
    });

    var table = f.tap(function table (colors) {
        return table.make(colors);
    })(function (fn) {
        fn.make = function (clrs) {
            var $node = $('<div></div>').addClass('table');
            clrs.forEach(function (clr) {
                $node.append(cell(clr));
            });
            return $node;
        }
        return fn;
    });

    var colors = f.tap(function colors (config) {
        return colors.linkEvents(colors.init(config));
    })(function (fn) {
        fn.init = function (conf) {
            var it = f.extend({}, conf);
            it.canvas = $(it.node, it.container || document);
            it.node = table(COLORTABLE);
            it.node.appendTo(it.canvas.parent());
            return it;
        }
        fn.linkEvents = function (it) {
            it.node.on('click', '.cell', function () {
                var ctx = it.canvas[0].getContext('2d');
                ctx.fillStyle = $(this).data('clr');
            });

            return it;
        }
        return fn;
    });

    return colors;
});