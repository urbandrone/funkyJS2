/* global _ */
;(function (ns, g) {

    var City = function (name, lat, lng) {
        this.name = City.formatName(name);
        this.latLng = City.formatLatLng(lat, lng);
        this.lat = this.latLng.lat();
        this.lng = this.latLng.lng();
        this.uuid = City.genUuid(name);
    }

    City.make = _.hom([
        // f -> string, number, number -> City
        _.isString,
        _.isNumber,
        _.isNumber
    ], City.is)(function (name, lat, lng) {
        return new City(name, lat, lng);
    });

    City.is = function (value) {
        // f -> * -> boolean
        return City.prototype.isPrototypeOf(value);
    }

    City.formatName = function (name) {
        // f -> string -> string
        return name.split(' ').reduce(function (acc, part) {
            return (acc === '' ? '' : acc + ' ') +
                    part[0].toUpperCase() + part.slice(1).toLowerCase();
        }, '');
    }

    City.formatLatLng = function (lat, lng) {
        // f -> number, number -> LatLng
        return new g.maps.LatLng(lat, lng);
    }

    City.genUuid = (function () {
        // f -> string
        var _indices = _.numIterator();

        return function (name) {
            return 'city-' + _indices.next().value() + '-' + name.replace(/\s+/g, '');
        }
    })();

    ns.City = City;

})(this.App, this.google);