/* globals funkyJS */
;(function (factory) {
    // global factory definition, pushed up for better readability
    window.locationsRepo = factory(funkyJS);

})(function (f) {

    // for this example, assume a JSON file is present and loaded. the file
    //   contains an array of objects, each representing a different location
    //   along with the corresponding latitude/longitude parameters, country and
    //   continent information. before they are usable, their coordinates have
    //   to be parsed into numbers, because they are provided as strings. for
    //   now, the goal is to create some automatic parsing, as well as providing
    //   a simple and extendable asynchronous interface inside a factory
    //   function, so creating a repository for the JSON file is not different
    //   from calling any kind of function on it. also, if any incoming query
    //   has been queried before, the result should be returned instantly.
    //   for easier understanding of the example, the structure of the JSON file
    //   is shown below:
    // ----
    // [
    //   {
    //     "name": "london",
    //     "lat": "123.456",
    //     "lng": "123.456",
    //     "continent": "europe",
    //     "country": "great britain"
    //   },
    //   {
    //     "name": "berlin",
    //     "lat": "123.456",
    //     "lng": "123.456",
    //     "continent": "europe",
    //     "country": "germany"
    //   },
    //   ...
    // ]
    // ----
    // the final result in this example can be used like this:
    // 
    //  var loc = locationsRepo({ JSON });
    //  loc.eqName(
    //      'name of place',
    //      function (place) {
    //          ... do something with place ...
    //      },
    //      function (err) {
    //          ... some error occured ...
    //      }
    //  );
    // 
    //  equivalent but longer:
    //  
    //  var loc = locationsRepo.createStore({ JSON });
    //  ...
    


    // outer factory creation
    var locationsRepo = f.tap(function _Repo (data) { // tap :: f -> g -> gf
        return _Repo.createStore(data); // inner factory application
    })(function (fn) {
        // parses the incoming JSON, uses lenses to parse coordinates
        var L = f.makeLenses(['lat', 'lng']);
        var parse = f.pipe(
            JSON.parse.bind(JSON),
            f.mapWith(f.pipe(
                L.lat.over(parseFloat),
                L.lng.over(parseFloat)
            ))
        );

        // triadic comparator, matches equality
        var comparePropStrict = f.triadic(function (props, value, obj) {
            return props.some(function (prop) {
                return obj[prop] === value;
            });
        });

        // triadic comparator, true for submatches
        var comparePropLose = f.triadic(function (props, value, obj) {
            return props.some(function (prop) {
                return obj[prop].indexOf(value) > -1;
            });            
        });

        // filter creation
        var filter = function (store, withComparatorOf) {
            return f.liftAsync(f.memoize(function (val) {
                return store.filter(withComparatorOf(val));
            }));
        }

        // internal factory
        fn.createStore = function (obj) {
            var _stored = parse(obj);

            // visible interface creation ("instance" if you like)
            return {
                atLat: filter(_stored, comparePropStrict(['lat'])),
                atLng: filter(_stored, comparePropStrict(['lng'])),
                equals: filter(_stored, comparePropStrict([
                    'name',
                    'country',
                    'continent'
                ])),
                contains: filter(_stored, comparePropLose([
                    'name',
                    'country',
                    'continent'
                ]))
            };
        }

        // return outer factory
        return fn;
    });

    // expose outer factory
    return locationsRepo;

});