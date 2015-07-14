;(function () {

    window.PlaceMap = {
        config: {
            typeid: 'roadmap', // see google api v3 for valid type id's
            center: 'lat:lng', // pretty selfexplanatory, try numbers...
            zoom: 9, // ... same here
            maxZoom: null, // set a number to enable, possible: 1 - 18
            minZoom: null, // see above
            draggable: false, // enable/disable dragging of map
            controls: {
                // enables/disables the controls of the map, true = enabled
                type: false,
                zoom: false,
                pan: false,
                scale: false,
                overview: false,
                rotate: false,
                streetview: false
            },
            markerIcon: null // path/to/marker/icon.jpg, or: png/gif
        },
        json: {
            url: 'data/country-capitals.json', // path to JSON file
            fields: {
                // field names in every JSON item which should be used
                capital: 'CapitalName',
                country: 'CountryName',
                continent: 'ContinentName',
                latitude: 'CapitalLatitude',
                longitude: 'CapitalLongitude'
            }
        },
        dom: {
            nodeSelector: '[data-widget="PlaceMap"]'
        }
    };

})();