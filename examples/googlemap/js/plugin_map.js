/* globals PlaceMap, funkyJS, make, google */
;(function (f, plugin, $g) {

    /* =========== REUSABLE HELPERS =========== */

    var toUpper = f.call(String.prototype.toUpperCase);
    var toLower = f.call(String.prototype.toLowerCase);

    var orElse = function (fn, rescue) {
        return f.aritize(fn.length, true)(function () {
            var r = fn.apply(this, arguments);
            if (!!r) {
                return r;
            }
            return rescue.apply(this, arguments);
        });
    }

    var below = f.dyadic(function (n, v) { return n > v; });
    var above = f.dyadic(function (n, v) { return n < v; });



    /* =========== UTILITY DEFINITION =========== */

    /*
    Translator configuration for the translation process into a valid google.maps.
        MapOptions object from the customized user configuration. Keys define
        paths into, prop is the MapOptions properties value and transforms holds
        a array of function transformations which finally return the correct
        value to set
    */
    var CONFIG_TRANSLATE = {
        'typeid': {
            prop: 'mapTypeId',
            transforms: [
                toUpper,
                function (value) {
                    return $g.maps.mapTypeId[value];
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
                orElse(
                    // condition: value if int & > 1 & < 19 else 18
                    f.guard(f.and(f.isInt32, f.and(above(1), below(19))), f.identity),
                    f.constant(18)
                )
            ]
        },
        'minZoom': {
            prop: 'minZoom',
            transforms: [
                orElse(
                    // condition: value if int & > 0 & < 18 else 1
                    f.guard(f.and(f.isInt32, f.and(above(0), below(18))), f.identity),
                    f.constant(1)
                )
            ]
        },
        'draggable': {
            prop: 'draggable',
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
        },
    }


    /*
    Creates a Google MapOptions object according to the specifications above
        from the user configuration. It takes in the user configurations,
        extracts the keys from the translation settings, deep plucks them
        from the user configuration and applies the given transforms in the
        translation configuration. Finally it reduces all the key:value pairs
        into the MapOptions object and returns that
    */
    function translateMapOptions (userConfig) {
        return f.keys(CONFIG_TRANSLATE).reduce(function (acc, key) {
            var transform = f.pipe.apply(null, CONFIG_TRANSLATE[key].transforms);
            acc[CONFIG_TRANSLATE[key].prop] = transform(
                plugin.utils.deepPluck(key, userConfig)
            );

            return acc;
        }, {});
    }




    function makeMap () {
        var _controller;

        return make({
            $map: null,
            connectController: function (controller) {
                _controller = controller;
            },
            renderMap: function (rootNode) {
                this.$map = new $g.maps.Map(
                    rootNode,
                    translateMapOptions(plugin.utils.pluginConfig())
                );
            },
            renderMarker: function (data) {
                var _marker = null,
                    _city = {
                    position: new $g.maps.LatLng(data.latitude, data.longitude),
                    map: this.$map,
                    title: data.capital + ' / ' + data.continent
                };

                if (plugin.utils.pluginConfig().markerIcon) {
                    _city.icon = plugin.utils.pluginConfig().markerIcon;
                }

                _marker = new $g.maps.Marker(_city);

                $g.maps.event.addListener(_marker, 'click', function () {
                    _controller.handleMarkerClick(_marker, data.uuid);
                });
            }
        });
    }



    plugin.mapRenderer = makeMap();

    
})(funkyJS, PlaceMap, google);