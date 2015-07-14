/* globals PlaceMap, funkyJS, make */
;(function (f, plugin) {

    /* =========== REUSABLE HELPERS =========== */

    var filters = {
        continent: function (name) {
            return function (city) {
                return city.continent.toLowerCase() === name.toLowerCase();
            } 
        },
        country: function (name) {
            return function (city) {
                return city.country.toLowerCase() === name.toLowerCase();
            } 
        },
        city: function (name) {
            return function (city) {
                return city.name.toLowerCase() === name.toLowerCase();
            }
        },
        uuid: function (uuid) {
            return function (city) {
                return city.uuid === uuid;
            }
        },
        '*': f.constant(true)
    };

    /**
     * internal utility, reads the JSON items. returns a normalized key:value
     *     pair where the keys are named as specified in the configuration
     *     of the plugin.
     *
     * @method normalizeJson
     * @private
     *
     * @param {object} data JSON item
     *
     * @return {object} Normalized representation
     */
    function normalizeJson (data) {
        return f.keys(plugin.json.fields).reduce(function (acc, field) {
            acc[field] = data[field];
            return acc;
        }, {});
    }

    function parseJson (data) {
        return JSON.parse(data.responseText);
    }

    function loadJson (success, failure, always) {
        var xhr = new XMLHttpRequest(),
            url = plugin.utils.dataConfig('url');

        xhr.open('GET', url);
        xhr.addEventListener('load', f.pipe(
            parseJson,
            f.mapWith(normalizeJson),
            success
        ));
        xhr.addEventListener('error', failure);
        xhr.addEventListener('abort', failure);
        xhr.addEventListener('loadend', always);
        xhr.send(null);
    }

    /* =========== MODEL FACTORY =========== */

    function makeModel () {
        var _controller;

        return make({
            cities: null,
            setController: function (controller) {
                _controller = controller;
                
                loadJson(this.readyLoad, this.failLoad, this.endLoad);
            },
            filter: f.defaults(
                function (continent, country, city) {
                    return this.cities.filter(f.pipe(
                        filters.continent(continent),
                        filters.country(country),
                        filters.city(city)
                    ));
                },
                ['*', '*', '*']
            ),
            findByUuid: function (uuid) {
                return f.first(this.cities.filter(filters.uuid(uuid)));
            },
            readyLoad: function (cities) {
                _controller.createMap();

                this.cities = cities.map(function (city) {
                    city.uuid = plugin.utils.uuid();
                    _controller.createMapMarker(city);

                    return city;
                });
            },
            failLoad: function () {
                _controller.shutdown();
            },
            endLoad: function () {
                _controller.releaseSpinner();
            }
        });
    }


    plugin.model = make({
        make: makeModel
    });
    
})(funkyJS, PlaceMap);