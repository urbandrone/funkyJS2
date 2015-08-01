/* globals PlaceMap, funkyJS, make */
;(function (f, plugin) {

    /* =========== REUSABLE HELPERS =========== */

    function query (selector, root) {
        return f.toArray((root || document).querySelectorAll(selector));
    }

    function tag (name) {
        return document.createElement(name);
    }

    function on (node, event, handle) {
        node.addEventListener(event, handle, false);
        return node;
    }

    // ---
    var renderOption = f.triadic(function (select, text, value) {
        return select.appendChild(new Option(text, value || text));
    });

    var createCategorySelects = f.pipe(
        f.pairs,
        f.mapWith(function (pair) {
            var select = tag('select');
            select.className = 'select--' + pair[0];
            select.id = pair[0] + 'Select';

            renderOption(select, plugin.utils.firstUpper(pair[0]), '*');
            pair[1].forEach(renderOption(select))

            return select;
        })
    );

    /* =========== VIEW FACTORY =========== */

    function makeView (rootNode) {
        var _controller,
            _template = plugin.utils.getTemplateFn(query(
                plugin.utils.domConfig('cityTemplate'),
                f.beNode(rootNode)
            ));

        return make({
            $root: rootNode,
            $ui: null,
            $list: null,
            $map: null,
            $selects: null,
            connectController: function (controller) {
                _controller = controller;
            },
            renderMapNode: function () {
                this.$map = tag('div');
                this.$map.className = 'placemap_map';

                this.$root.appendChild(this.$map);
            },
            renderUINodes: function () {
                this.$ui = tag('div');
                this.$ui.className = 'placemap_ui';

                this.$form = tag('form');
                this.$form.action = '#';
                this.$form.className = 'placemap_ui_form';

                this.$list = tag('ul');
                this.$list.className = 'placemap_ui_cities';

                this.$ui.appendChild(this.$form);
                this.$ui.appendChild(this.$list);
                this.$root.appendChild(this.$ui);
            },
            renderSelects: function () {
                createCategorySelects(
                    _controller.getSelectOptions()
                ).forEach(this.addSelect);

                // just in case
                on(this.$form, 'submit', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                });
            },
            addSelect: function (select) {
                if (this.$selects === null) {
                    this.$selects = [];
                }
                this.$selects.push(select);
                this.$form.appendChild(on(
                    select,
                    'change',
                    this.handleSelectChange
                ));
            },
            handleSelectChange: function () {
                // process all
                _controller.handleUISelectionChange(
                    this.$selects.reduce(function (acc, select) {
                        var category = select.id.replace('Select'),
                            value = f.nth(select.selectedIndex, query('option', select)).value;

                        acc[category] = value;
                        return acc;
                    }, {})
                );
            },
            showData: function (city) {
                var _item = tag('li');
                _item.className = 'placemap_ui_cities_city';
                _item.innerHTML = _template(city);

                this.$list.appendChild(_item);
            },
            clear: function () {
                this.$list.innerHTML = '';
            }
        });
    }


    plugin.view = make({
        make: makeView
    });
    
})(funkyJS, PlaceMap);