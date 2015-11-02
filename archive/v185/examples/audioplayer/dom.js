/* global funkyJS */
;(function (f) {

    var api = window.dom = {};



    api.tag = function tag (name) {
        return document.createElement(f.beString(name));
    }

    api.setText = f.dyadic(function setText (text, node) {
        f.beNode(node).textContent = f.beString(text);
        return node;
    });

    api.getText = function getText (node) {
        return f.beNode(node).textContent;
    }

    api.setClass = f.dyadic(function setClass (classname, node) {
        if (f.isString(classname)) {
            classname = classname.split(' ');
        } else {
            f.beArray(classname).every(f.beString);
        }

        f.beNode(node);
        classname.forEach(function (cls) {
            node.classList.add(cls);
        });
        return node;
    });

    api.delClass = f.dyadic(function delClass (classname, node) {
        if (f.isString(classname)) {
            classname = classname.split(' ');
        } else {
            f.beArray(classname).every(f.beString);
        }

        f.beNode(node);
        classname.forEach(function (cls) {
            node.classList.remove(cls);
        });
        return node;
    });

    api.hasClass = f.dyadic(function delClass (classname, node) {
        return f.beNode(node).classList.contains(f.beString(classname));
    });

    api.parents = f.dyadic(function parents (levels, node) {
        var _node = f.beNode(node),
            _ls = f.beInt32(levels);
        while (_ls && _node !== document.body) {
            _node = _node.parentNode;
            _ls -= 1;
        }
        return _node;
    });

    api.getCoords = function getCoords (node) {
        var _coords = f.beNode(node).getClientRects(),
            _left = document.documentElement.scrollLeft || document.body.scrollLeft,
            _top = document.documentElement.scrollTop || document.body.scrollTop;

        return {
            x: _coords[0].left + _left,
            y: _coords[0].top + _top,
            w: _coords[0].width,
            h: _coords[0].height
        };
    }

    api.on = function on (node, event, handle) {
        f.beNode(node);
        f.beString(event);
        f.beFunction(handle);

        node.addEventListener(event, handle, false);
        return node;
    }



})(funkyJS);