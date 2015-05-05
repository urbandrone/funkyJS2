/* global _ */
;(function (ns) {

    var FILTER = {
        name: _.dyadic(function (term, city) {
            return city.name.slice(0, term.length) === term;
        }),
        uuid: _.dyadic(function (term, city) {
            return city.uuid === term;
        }),
        latitude: _.dyadic(function (range, city) {
            return city.lat >= range.begin && city.lat <= range.end;
        }),
        longitude: _.dyadic(function (range, city) {
            return city.lng >= range.begin && city.lng <= range.end;
        })
    };
    FILTER.hasFilter = _.partial(_.has, [undefined, FILTER]);



    var _cities = [];
    var applyFilter = function (options) {
        var _opts = _.pairs(options);
        return function (city) {
            return _opts.every(function (pair) {
                if (FILTER.hasFilter(pair[0])) {
                    return FILTER[pair[0]](pair[1], city)
                }
                return false;
            });
        }
    }

    ns.cities = {
        add: _.guard(_.isObject, function (descriptor) {
            _cities.push(ns.City.make(
                descriptor.name,
                descriptor.lat,
                descriptor.lng
            ));
        }),
        findWhere: _.guard(_.isObject, function (options) {
            return _cities.filter(applyFilter(options))
        }),
        findByName: _.guard(_.isString, function (name) {
            return _cities.filter(applyFilter({name:name}));
        }),
        findByUuid: _.guard(_.isString, function (uuid) {
            return _cities.filter(applyFilter({uuid:uuid}));
        })
    };

})(this.App);