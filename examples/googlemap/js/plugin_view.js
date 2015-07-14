/* globals PlaceMap, funkyJS, make */
;(function (f, plugin) {

    /* =========== REUSABLE HELPERS =========== */

    function query (selector, root) {
        return f.toArray((root || document).querySelectorAll(selector));
    }

    function tag (name) {
        return document.createElement(name);
    }

    /* =========== VIEW FACTORY =========== */

    function makeView (rootNode) {
        var _controller

        return make({
            $root: rootNode,
            $map: null,
            $selects: null,
            connectController: function (controller) {
                _controller = controller;
            },
            renderMapNode: function () {
                this.$map = tag('div');
                this.$map.className = 'placemap_map';

                return this.$root.appendChild(this.$map);
            },
            renderSelects: function () {

            },
            addSelectOptions: function (select, options) {

            },
            handleSelectChange: function () {
                // process all
                _controller.handleUISelectionChange(this.$selects)
            }
        });
    }


    plugin.view = make({
        make: makeView
    });
    
})(funkyJS, PlaceMap);