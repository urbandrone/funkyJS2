/* globals PlaceMap, funkyJS, make, google */
;(function (f, plugin, $g) {

    /* =========== REUSABLE HELPERS =========== */
    var addListener = $g.maps.event.addListener.bind($g.maps.event);

    function addMarkerPosition (data, lat, lng) {
        data.position = new $g.maps.LatLng(lat, lng);
        return data;
    }

    function addMarkerMap (data, map) {
        data.map = map;
        return data;
    }

    function addMarkerTitle (data, title) {
        if (f.isString(title)) {
            data.title = title;
        }
        return data;
    }

    function addMarkerIcon (data, icon) {
        if (f.isString(icon)) {
            data.icon = icon;
        }
        return data;
    }


    /* =========== UTILITY DEFINITION =========== */

    /*
    Translator configuration for the translation process into a valid google.maps.
        MapOptions object from the customized user configuration. Keys define
        paths into, prop is the MapOptions properties value and transforms holds
        a array of function transformations which finally return the correct
        value to set
    */
    var getMapConfig = plugin.utils.translateConfig({
        'typeid': {
            prop: 'mapTypeId',
            transforms: [
                plugin.utils.upper,
                function (value) {
                    return $g.maps.MapTypeId[value];
                }
            ],
        },
        'center': {
            prop: 'center',
            transforms: [
                plugin.utils.floatPair,
                function (pair) {
                    return new $g.maps.LatLng(pair[0], pair[1]);
                }
            ]
        },
        'zoom': {
            prop: 'zoom',
            transforms: [f.identity]
        },
        'maxZoom': {
            prop: 'maxZoom',
            transforms: [
                plugin.utils.ifThenElse(
                    // condition: value if int & > 1 & < 19 else 18
                    f.guard(plugin.utils.between(1, 19), f.identity),
                    f.constant(18)
                )
            ]
        },
        'minZoom': {
            prop: 'minZoom',
            transforms: [
                plugin.utils.ifThenElse(
                    // condition: value if int & > 0 & < 18 else 1
                    f.guard(plugin.utils.between(0, 18), f.identity),
                    f.constant(1)
                )
            ]
        },
        'draggable': {
            prop: 'draggable',
            transforms: [f.identity]
        },
        'mousewheel': {
            prop: 'mousewheel',
            transforms: [f.identity]
        },
        'controls.type': {
            prop: 'mapTypeControl',
            transforms: [f.identity]
        },
        'controls.zoom': {
            prop: 'zoomControl',
            transforms: [f.identity]
        },
        'controls.pan': {
            prop: 'panControl',
            transforms: [f.identity]
        },
        'controls.scale': {
            prop: 'scaleControl',
            transforms: [f.identity]
        },
        'controls.overview': {
            prop: 'overviewMapControl',
            transforms: [f.identity]
        },
        'controls.rotate': {
            prop: 'rotateControl',
            transforms: [f.identity]
        },
        'controls.streetview': {
            prop: 'streetViewControl',
            transforms: [f.identity]
        }
    });

    var getMarkerIcon = plugin.utils.translateConfig({
        'markerIcon': {
            prop: 'icon',
            transforms: [f.identity]
        }
    });




    function makeMap () {
        var _controller;

        return make({
            $map: null,
            $cityMarkers: null,
            connectController: function (controller) {
                _controller = controller;
            },
            renderMap: function (rootNode) {
                this.$map = new $g.maps.Map(
                    rootNode,
                    getMapConfig(plugin.utils.pluginConfig())
                );
            },
            renderMarker: function (data) {
                var _marker = null,
                    _icon = getMarkerIcon(plugin.utils.pluginConfig()),
                    _city = {};

                if (this.$cityMarkers === null) {
                    this.$cityMarkers = [];
                }

                addMarkerTitle(_city, data.capital);
                addMarkerPosition(_city, data.latitude, data.longitude);
                addMarkerMap(_city, this.$map);
                addMarkerIcon(_city, _icon);
                _marker = new $g.maps.Marker(_city);

                addListener(
                    _marker,
                    'click',
                    _controller.handleMarkerClick.bind(_controller, data.uuid)
                );

                this.$cityMarkers.push({
                    marker: _marker,
                    city: f.extend({}, data)
                });
            }
        });
    }



    plugin.mapRenderer = make({
        make: makeMap
    });

    
})(funkyJS, PlaceMap, google);