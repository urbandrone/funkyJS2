/* globals PlaceMap, funkyJS, make */
;(function (f, plugin) {

    /* =========== REUSABLE HELPERS =========== */

    var jsonData = null; // store the json after load here

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
        var fieldNames = plugin.utils.dataConfig('dataFields');

        return f.keys(fieldNames).
            reduce(function (acc, field) {
                acc[field] = data[fieldNames[field]];
                return acc;
            }, {});
    }

    function ifReady (fn) {
        return function () {
            if (this.readyState === 4 && this.status === 200) {
                fn(this.responseText);
            }
        }
    }

    function parseJson (data) {
        return JSON.parse(data);
    }

    function loadJson (success, failure, always) {
        var xhr = new XMLHttpRequest(),
            url = plugin.utils.dataConfig('dataUrl');

        xhr.open('GET', url);
        xhr.addEventListener('load', ifReady(f.pipe(
            parseJson,
            f.mapWith(normalizeJson),
            success
        )));
        xhr.addEventListener('error', failure);
        xhr.addEventListener('abort', failure);
        xhr.addEventListener('loadend', always);
        xhr.send(null);
    }

    // ---
    var pluckUniqueFields = function (field, list) {
        return list.map(function (item) {
            return item[field];
        });
    }

    var pluck2 = function (first, second, list) {
        return list.map(function (item) {
            return [item[first], item[second]];
        });
    }

    /* =========== MODEL FACTORY =========== */

    function makeModel () {
        var _controller;

        return make({
            cities: null,
            connectController: function (controller) {
                _controller = controller;
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
            getSelectOptions: function () {
                return {
                    continents: pluckUniqueFields('continent', this.cities),
                    countries: pluckUniqueFields('country', this.cities),
                    cities: pluck2('capital', 'uuid', this.cities)
                };
            },
            loadJson: function () {
                if (jsonData) {
                    return this.readyLoad(jsonData);
                }

                loadJson(this.readyLoad, this.failLoad, this.endLoad);
            },
            readyLoad: function (cities) {
                jsonData = cities;

                this.cities = cities.map(function (city) {
                    city.uuid = plugin.utils.uuid();
                    _controller.createMapMarker(city);
                    return city;
                });
                debugger;

                _controller.createUI();
                _controller.createMap();
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