;(function (ns, factory) {
    // Just for your interest, if minimized through UglifyJS, this scripe has a
    //   total size of 2076 characters and is therefor about 60% of the original
    factory(ns.funkyDOM, ns.funkyJS, ns.jQuery, ns.hljs)
})(this, function (fdom, f, jQ, highlight) {
    // CONSTANTS
    // =========
    var CONTENTURL = 'introcontent.html';

    var CSS = {
        VISIBLE: {opacity: 1},
        INVISIBLE: {opacity: 0},
        FONT_BIG: {fontSize: '70px'},
        FONT_SMALL: {fontSize: 0},
        MARGIN_BIG: {marginTop: '210px'},
        MARGIN_MEDIUM: {marginTop: '70px'},
        MARGIN_SMALL: {marginTop: 0}
    };

    var SPEED = {
        LOW: 1000,
        HIGH: 500
    };

    // ELEMENT REFERENCES
    // ==================
    var body = fdom('body').ego('css', 'html', 'animate', 'off');
    var lib = body.find('.lib').ego('animate');
    var claim = body.find('.lib_claim').ego('animate', 'html');
    var libText = body.find('.lib_text').ego('animate', 'css');

    // make jQuery.get a egocentric method which allows to evoke it later
    fdom.ego(jQ, 'get');



    // UTILITY CLASSES AND FUNCTIONS
    // =============================
    var firstVisit = f.tap(function firstVisit () {
        return firstVisit.BOOLEAN;
    })(function (fn) {
        if (!window.localStorage) {
            fn.BOOLEAN = true;
            return fn;
        }

        fn.BOOLEAN = !window.localStorage.getItem('funkyDOM_first_visit');
        window.localStorage.setItem('funkyDOM_first_visit', 'nope');

        return fn;
    });

    var makeClickable = f.factory(function Clickable (selector, root) {
        // creates a "Clickable", each wraps a <code> block on the page
        this.$root = fdom(selector, root).
            css('cursor', 'pointer').
            ego('addClass', 'removeClass', 'toggleClass');

        this.activate = this.$root.evoke('addClass', 'is-clicked');
        this.deactivate = this.$root.evoke('removeClass', 'is-clicked');
        this.toggle = this.$root.evoke('toggleClass', 'is-clicked');

        this.$root.on('click', this.toggle); // look ma, no .bind needed :)
    });

    var makeLoadInfo = f.factory(function LoadInfo () {
        this.$root = fdom('<div></div>').
            addClass('loadinfo').
            addClass('is-hidden').
            html('Loading content').
            ego('toggleClass');

        this.toggle = this.$root.evoke('toggleClass', 'is-hidden');
        this.$root.appendTo(body);
    });

    var makeMenu = f.factory(function Menu (selector) {
        this.$root = fdom(selector);
        this.animTarget = fdom(document.body).ego('animate').animate;
        this.handleClick = function (event) {
            var $elm, et = event.currentTarget;
            event.preventDefault();

            $elm = fdom('#' + et.href.replace(/^.+#/, ''));
            if ($elm) {
                this.animTarget({scrollTop: $elm.offset().top}, 1000).
                    find('a').
                    forEach(function (a) {
                        fdom(a)[a === et ? 'addClass' : 'removeClass']('is-active');
                    });
            }
        }
        this.$root.on('click', 'a', this.handleClick.bind(this));
    });





    // ANIMATION DEFINITIONS AND PROGRAM EXECUTION
    // ===========================================
    var afterIntroAnim = f.pipe(
        claim.evoke(
            'animate',
            CSS.VISIBLE,
            SPEED.HIGH
        ),
        libText.evoke(
            'animate',
            CSS.VISIBLE,
            SPEED.LOW,
            libText.evoke('css', 'cursor', 'pointer')
        )
    );

    var introAnim = body.evoke(
        'animate',
        CSS.MARGIN_BIG,
        SPEED.HIGH,
        afterIntroAnim
    );


    var afterContentLoaded = body.evoke(
        'animate',
        CSS.MARGIN_MEDIUM,
        SPEED.HIGH,
        claim.evoke(
            'animate',
            CSS.INVISIBLE,
            SPEED.HIGH,
            claim.evoke('animate', CSS.FONT_SMALL)
        )
    );

    var contentLoaded = f.dyadic(function (firstVisit, response) {
        info.toggle();

        // here's the heart of the program, where the content is stuffed away
        //   right into the DOM
        libText.
            empty().
            css({textAlign: 'left', cursor: 'default'}).
            html(f.trim(response)).
            find('code').
            addClass('code').
            addClass('javascript').
            forEach(highlight.highlightBlock).
            forEach(makeClickable);


        makeMenu('.nav');
        if (!firstVisit) {
            // show content to revisiting visitors right away
            return libText.animate(
                CSS.VISIBLE,
                SPEED.HIGH
            );
        }

        // run rest of animation on first page visit
        libText.animate(
            CSS.VISIBLE,
            SPEED.HIGH,
            afterContentLoaded
        );
    });

    // Ajax calls
    // ----------
    var getContentsFirstVisit = fdom.evoke(
        jQ,
        'get',
        CONTENTURL,
        contentLoaded(true)
    );

    var getContentsNotFirstVisit = fdom.evoke(
        jQ,
        'get',
        CONTENTURL,
        contentLoaded(false)
    );

    var initLoad = libText.evoke(
        'animate',
        CSS.INVISIBLE,
        SPEED.HIGH,
        getContentsFirstVisit
    );



    // BOOT AND RUN
    // ============
    var info = makeLoadInfo();
    if (!firstVisit()) {
        info.toggle();
        return lib.animate(
            CSS.FONT_BIG, 
            SPEED.HIGH,
            getContentsNotFirstVisit
        );
    }

    lib.animate(
        CSS.FONT_BIG, 
        {
            duration: SPEED.HIGH,
            complete: introAnim
        }
    );

    body.on('click', f.pipe(
        body.evoke('off', 'click'),
        info.toggle,
        initLoad
    ));
});