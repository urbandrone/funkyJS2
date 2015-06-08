/* global funkyJS */
;(function (f) {

    var api = window.dom = {};



    api.setValue = f.dyadic(function setValue (value, node) {
        f.beNode(node).value = f.beString(value);
        return node;
    });

    api.getValue = function getValue (node) {
        return f.beNode(node).value;
    }

    api.appendTo = f.dyadic(function appendTo (parent, node) {
        f.beNode(parent).appendChild(f.beNode(node));
        return node;
    });

    api.removeFrom = f.dyadic(function removeFrom (parent, node) {
        f.beNode(parent).removeChild(f.beNode(node));
        return node;
    });

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
        while (_ls) {
            _node = _node.parentNode;
            _ls -= 1;
        }
        return _node;
    });

    api.enable = function enable (node) {
        f.beNode(node).disabled = null;
        return node;
    }

    api.disable = function disable (node) {
        f.beNode(node).disabled = true;
        return node;
    }



})(funkyJS);