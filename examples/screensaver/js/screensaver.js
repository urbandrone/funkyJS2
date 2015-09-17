/* globals funkyJS, jQuery */
;(function (ns, factory) {
    ns.ScreenSaver = factory({}, funkyJS, jQuery);
})(this, function (mod, _, $) {

    
    
    // shape implementation
    // --------------------
    // a shape is nothing but a container, which can occupy the whole browser
    //   window. 



    // ====== Different helpers ====== //
    
    /**
     * Returns the x/y space the window occupies on user screen
     *
     * @method browserSize
     *
     * @return {object} Object with x/y properties for axis length
     */
    function browserSize () {
        return {
            x: window.innerWidth,
            y: window.innerHeight
        };
    }

    /**
     * Given a media query, returns true if the query matches
     *
     * @method matchesMQ
     *
     * @param {string} query Any valid CSS3 media query
     *
     * @return {boolean} True/false
     */
    function matchesMQ (query) {
        return window.matchMedia(query).matches;
    }

    function function_name (argument) {
        // body...
    }

});