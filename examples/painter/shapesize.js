/* globals funkyJS, Zepto */
;(function (ns, factory) {
    // use like so:
    // ------------
    // 
    // 
    ns.shapeSize = factory(Zepto, funkyJS);
})(this, function ($, f) {
    var SHAPESIZES = {
        small: 2,
        medium: 5,
        big: 10
    };


    if (f.isNil(window.painter)) {
        return f.identity;
    }

    var choice = f.tap(function choice (size, name, active) {
        return choice.make(size, name, active);
    })(function (fn) {
        fn.make = function (num, key, isOn) {
            if (isOn) {
                return $('<div></div>').
                addClass('size').
                html('<input type="radio" name="shapeSize" class="size_choice" value="' + num + '" checked><label>' + key + '</label>');
            }
            return $('<div></div>').
                addClass('size').
                html('<input type="radio" name="shapeSize" class="size_choice" value="' + num + '"><label>' + key + '</label>');
        }
        return fn;
    });

    var table = f.tap(function table (sizes) {
        return table.make(f.pairs(sizes));
    })(function (fn) {
        fn.make = function (sizeList) {
            var $node = $('<div></div>').addClass('table');
            sizeList.forEach(function (size, idx) {
                if (idx < 1) {
                    return $node.append(choice(size[1], size[0], true));
                }
                $node.append(choice(size[1], size[0]));
            });
            return $node;
        }
        return fn;
    });

    var shapeSize = f.tap(function shapeSize (config) {
        return shapeSize.linkEvents(shapeSize.init(config));
    })(function (fn) {
        fn.init = function (conf) {
            var it = f.extend({}, conf);
            it.canvas = $(it.node, it.container || document);
            it.node = table(SHAPESIZES);
            it.node.appendTo(it.canvas.parent());
            return it;
        }
        fn.linkEvents = function (it) {
            it.node.on('change', '.size_choice', function () {
                window.painter.shapeSize = parseInt(this.value);
            });

            return it;
        }
        return fn;
    });

    return shapeSize;
    
});