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
            createMap: function () {
                _renderer.renderMap(_view.renderMapNode());
            },
            createMapMarker: function (city) {
                _renderer.renderMarker(city);

            },
            // map renderer connections
            // ------------------------
            handleMarkerClick: function (marker, uuid) {

            },
            // view connections
            // ----------------
            handleUISelectionChange: function (selects) {
                // process all incoming <select> elements
            }
        });
    }


    plugin.controller = make({
        make: makeController
    });
    
})(funkyJS, PlaceMap);