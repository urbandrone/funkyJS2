/* globals PlaceMap, funkyJS, make */
;(function (f, plugin) {

    /* =========== CONTROLLER FACTORY =========== */

    function makeController () {
        var _model,
            _view,
            _renderer;

        return make({
            // startup methods
            // ---------------
            connectModel: function (model) {
                _model = model;
            },
            connectView: function (view) {
                _view = view;
            },
            connectRenderer: function (mapRenderer) {
                _renderer = mapRenderer;
            },
            // model connections
            // -----------------
            createUI: function () {
                _view.renderUINodes();
                _view.renderSelects();
            },
            createMap: function () {
                _view.renderMapNode()

                _renderer.renderMap(_view.$map);
            },
            createMapMarker: function (city) {
                _renderer.renderMarker(city);
            },
            shutdown: function () {

            },
            releaseSpinner: function () {

            },
            // map renderer connections
            // ------------------------
            handleMarkerClick: function (uuid) {
                var city = _model.findByUuid(uuid);
                if (f.isObject(city)) {
                    _view.clear();
                    _view.showData(city);
                }
            },
            // view connections
            // ----------------
            getSelectOptions: function () {
                return _model.getSelectOptions();
            },
            handleUISelectionChange: function (filterValue) {
                // process incoming (all key:value, pass undefined for empty string)
                _view.clear();
                _model.filter(
                    filterValue.continent || undefined,
                    filterValue.country || undefined,
                    filterValue.city || undefined
                ).forEach(_view.showData);
            }
        });
    }


    plugin.controller = make({
        make: makeController
    });
    
})(funkyJS, PlaceMap);