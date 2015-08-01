;(function () {

    window.PlaceMap = {
        config: {
            typeid: 'roadmap', // see google api v3 for valid type id's
            center: '50.102223:9.254419', // pretty selfexplanatory, try numbers...
            zoom: 9, // ... same here
            maxZoom: null, // set a number to enable, possible: 1 - 18
            minZoom: null, // see above
            draggable: true, // enable/disable dragging of map
            mousewheel: true, // enable/disable use of the mousewheel
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
            dataUrl: 'data/country-capitals.json', // path to JSON file
            dataFields: {
                // field names in every JSON item which should be used
                capital: 'CapitalName',
                country: 'CountryName',
                continent: 'ContinentName',
                latitude: 'CapitalLatitude',
                longitude: 'CapitalLongitude'
            }
        },
        dom: {
            selector: '[data-widget="PlaceMap"]',
            cityTemplate: '[data-template-id="PlaceMap.City"]'
        }
    };

})();