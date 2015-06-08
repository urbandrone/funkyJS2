/* global funkyJS, thing, dom */
;(function (f, make, $) {
    /**
     * Formats a number of seconds into a object with min and sec properties
     * @param  {int32} time Time in seconds
     * @return {object}     object with min and sec property
     */
    function formatTime (time) {
        return {
            min: Math.floor(time * 0.6),
            sec: time % 60
        };
    }



    /**
     * Queries one or all DOMNodes by a certain selector
     * @param  {DOMNode} rootNode Root from which to query
     * @param  {string} selector CSS like selector
     * @param  {boolean} all True to query all node which match the selector
     * @return {array|DOMNode} Result of the query
     *
     * @example
     *     var myNode = find(document.body, '#myNode');
     *
     *     var myNodes = find(document.body, '.myNodeClass', true);
     *     
     */
    function find (rootNode, selector, all) {
        if (!!all) {
            return f.toArray(f.beNode(rootNode).querySelectorAll(f.beString(selector)));
        }
        return f.beNode(rootNode).querySelector(f.beString(selector));
    }



    /**
     * Tests if play, pause, stop, get-/setVol, on, jumpTo and info methods are
     *     available on the mediaInterface and if it has a state property
     * @param  {Interface}  mediaInterface The MediaInterfaceObject to validate
     * @return {boolean} True or false
     *
     * @example
     *     var _interface = makeMediaInterface(<audio>);
     *     isValidMediaInterface(_interface);
     *     // -> true
     *     
     */ 
    function isValidMediaInterface (mediaInterface) {
        return [
            'state',
            'play',
            'pause',
            'stop',
            'jumpTo',
            'setVol',
            'getVol',
            'info',
            'on'
        ].every(f.partial(f.has, [undefined, mediaInterface]));
    }



    /**
     * Creates a MediaInterfaceObject
     * @param  {DOMNode} mediaNode HTMLMediaElement <audio> or <video>
     * @return {Interface}         A new MediaInterfaceObject
     *
     * @example
     *     var _interface = makeInterface(document.createElement('audio'));
     *     _interface.type; // -> 'audio'
     *     _interface.state; // -> 'pending'
     *     
     *     _interface.play();
     *     _interface.state; // -> 'playing'
     *     
     *     _interface.pause();
     *     _interface.state; // -> 'paused'
     *     
     *     _interface.stop();
     *     _interface.state; // -> 'pending'
     *     
     *     _interface.setVol(75);
     *     _interface.getVol(); // -> 75
     *
     *     _interface.jumpTo(50); // in percent
     *     _interface.on('play', function (e) { ... });
     *     
     */
    function makeMediaInterface (rootNode) {
        var _media = f.beNode(find(rootNode, '[data-point="mediasrc"]'));
        return make({
            type: _media.nodeName.toLowerCase(),
            $node: _media,
            state: 'pending',
            play: function () {
                this.$node.play();
                this.state = 'playing';
            },
            stop: function () {
                this.pause();
                this.$node.currentTime = 0;
                this.state = 'pending';
            },
            pause: function () {
                this.$node.pause();
                this.state = 'paused';
            },
            setVol: f.guard(f.isInt32, function (percentage) {
                this.$node.volume = Math.max(0, Math.min(percentage * 0.01, 1));
            }),
            getVol: function () {
                return Math.round(this.$node.volume * 100);
            },
            jumpTo: f.guard(f.isNumber, function (percentage) {
                // note: guarded with number instead of int32 to allow more
                //       accurate frame selection
                var _frame;
                if (percentage >= 0 && percentage <= 100) {
                    _frame = this.$node.duration * (percentage * 0.01);
                    if (_frame >= this.$node.buffered) {
                        _frame = Math.max(this.$node.buffered, 10) - 10;
                    }
                    this.$node.currentTime = _frame;
                }
            }),
            info: function () {
                return {
                    now: Math.round(this.$node.currentTime),
                    end: Math.floor(this.$node.duration),
                    buffered: Math.round((this.$node.buffered / this.$node.duration) * 100),
                    elapsed: Math.round((this.$node.currentTime / this.$node.duration) * 100)
                };
            },
            on: function (eventName, fn) {
                this.$node.addEventListener(eventName, fn, false);
            }
        });
    }



    function makeRessourceReader (rootNode) {
        var _sources = f.beNode(find(rootNode, '.mediaplayer_sources'));

        return make({
            connect: function (mediaInterface) {
                if (isValidMediaInterface(mediaInterface)) {
                    this.media = mediaInterface;
                    
                    f.toArray(_sources.children).forEach(this.setSource);
                    if (!this.hasSource()) {
                        // todo: implement user hint,
                        //       for now just dump errors
                        throw new Error('No ressource playable');
                    }
                }
            },
            hasSource: function () {
                return f.isString(this.media.$node.src) &&
                       !!f.trim(this.media.$node.src);
            },
            setSource: function (srcNode) {
                var _fileData,
                    _fileType;

                if (this.hasSource()) {
                    return;
                }

                _fileData = srcNode.getAttribute('data-uri');
                _fileType = this.media.type + '/' + f.last(_fileData.split('.'));
                if (!!this.media.$node.canPlayType(_fileType.toLowerCase())) {
                    this.media.$node.src = _fileData;
                }
            }
        });
    }



    /**
     * Creates a MediaUserInterface
     * @param  {DOMNode} rootNode The rootNode of the mediaplayer
     * @return {UserInterface}    A new MediaUserInterface
     *
     * @example
     * 
     */
    function makeUserInterface (rootNode) {
        var _playBtn = find(rootNode, '[data-cmd="playpause"]'),
            _stopBtn = find(rootNode, '[data-cmd="stop"]');

        return make({
            $root: rootNode,
            $play: f.beNode(_playBtn),
            $stop: f.beNode(_stopBtn),
            $elapsed: find(rootNode, '.timetable_elapsed'),
            $duration: find(rootNode, '.timetable_duration'),
            connect: function (mediaInterface) {
                if (isValidMediaInterface(mediaInterface)) {
                    this.media = mediaInterface;
                    this.init();
                }
            },
            init: function () {
                if (f.isNotVoid(this.media)) {
                    this.media.setVol(90); // default volume
                    this.media.on('durationchange', this.handleMetaDataLoaded);
                    this.media.on('timeupdate', this.handleTimeUpdate);

                    $.on(this.$play, 'click', this.handlePlayPause);
                    $.on(this.$stop, 'click', this.handleStop);

                    if (f.isNode(this.$elapsed)) {
                        this.$root.style.paddingRight = $.getCoords(this.$elapsed.parentNode).width + 'px';
                    }
                }
            },
            handlePlayPause: function () {
                if (this.media.state === 'playing') {
                    this.media.pause();
                    $.setClass('is--paused', this.$play);

                } else {
                    this.media.play();
                    $.delClass('is--paused', this.$play);

                }
            },
            handleStop: function () {
                this.media.stop();
                
                $.delClass('is--paused', this.$play);
            },
            handleMetaDataLoaded: function () {
                // use to display the overall duration to the user
                var _time;
                if (f.isNode(this.$complete)) {
                    _time = formatTime(this.media.info().end);
                    this.$complete.innerHTML = (_time.min + ':' + _time.sec);
                }
            },
            handleTimeUpdate: function () {
                // simply display the current frame position to the user
                var _time;
                if (f.isNode(this.$elapsed)) {
                    _time = formatTime(this.media.info().now);
                    this.$elapsed.innerHTML = (_time.min + ':' + _time.sec);
                }
            }
        });
    }



    function makeTimelineControl (rootNode) {
        var _timeline = find(rootNode, '.mediaplayer_timeline');
        if (f.isNotNode(_timeline)) {
            // if no timeline is found, return a dummy timeline
            return {connect: function () { /*noop*/ }};
        }

        return make({
            $root: _timeline,
            $played: f.beNode(find(_timeline, '.mediaplayer_timeline_played')),
            $buffered: f.beNode(find(_timeline, '.mediaplayer_timeline_buffered')),
            connect: function (mediaInterface) {
                if (isValidMediaInterface(mediaInterface)) {
                    this.media = mediaInterface;
                    this.init();
                }
            },
            init: function () {
                if (f.isNotVoid(this.media)) {
                    this.media.on('progress', this.handleBufferedData);
                    this.media.on('timeupdate', this.handleTimeUpdate);

                    $.on(this.$buffered, 'click', this.handleJump);
                }
            },
            handleBufferedData: function () {
                this.$buffered.style.width = (this.media.info().buffered + '%');
            },
            handleTimeUpdate: function () {
                this.$played.style.width = (this.media.info().elapsed + '%');
            },
            handleJump: function (event) {
                var _pos = $.getCoords(this.$buffered);
                _pos.x = event.pageX - (_pos.x + _pos.w);

                this.media.jumpTo((_pos.x / _pos.w) * 100);
            }
        });
    }



    function makeAudioControl (rootNode) {
        var _audioButton = find(rootNode, '[data-cmd="volume"]');
        if (f.isNotNode(_audioButton)) {
            // if no audiocontrolnode is found, return a dummy audiocontrol
            return {connect: function () { /*noop*/ }};
        }

        return make({
            active: false,
            $root: $.parents(1, _audioButton),
            $trigger: _audioButton,
            connect: function (mediaInterface) {
                if (isValidMediaInterface(mediaInterface)) {
                    this.media = mediaInterface;
                    this.init();
                }
            },
            init: function () {
                if (f.isNotVoid(this.media)) {
                    this.$wrap = $.setClass('mediaplayer_audiocontrol', $.tag('div'));
                    this.$bar = $.setClass('mediaplayer_audiocontrol_bar', $.tag('div'));

                    $.setClass('is--hidden', this.$wrap);
                    this.$bar.style.height = (this.media.getVol() + '%');
                    this.$wrap.appendChild(this.$bar);
                    this.$root.appendChild(this.$wrap);

                    $.on(this.$trigger, 'click', this.handleToggle);
                    $.on(this.$wrap, 'mousedown', this.handleStart);
                    $.on(this.$wrap, 'mousemove', this.handleMove);
                    $.on(this.$wrap, 'mouseup', this.handleEnd);
                }
            },
            handleToggle: function () {
                if ($.hasClass('is--hidden', this.$wrap)) {
                    $.delClass('is--hidden', this.$wrap);

                } else {
                    $.setClass('is--hidden', this.$wrap);

                }
            },
            handleStart: function () {
                this.active = true;
            },
            handleMove: function (event) {
                var _pos,
                    _y;
                
                if (this.active) {
                    _pos = $.getCoords(this.$wrap);
                    
                }
                
            },
            handleEnd: function () {
                this.active = false;
            }
        });
    }



    function makeMediaPlayer (node) {
        var iMedia = window.mediaplayer.makeMediaInterface(node),
            iReader = window.mediaplayer.makeRessourceReader(node),
            iUser = window.mediaplayer.makeUserInterface(node),
            iTimeline = window.mediaplayer.makeTimelineControl(node),
            iAudio = window.mediaplayer.makeAudioControl(node);

        iReader.connect(iMedia);
        iUser.connect(iMedia);
        iTimeline.connect(iMedia);
        iAudio.connect(iMedia);

        return make({
            media: iMedia,
            gui: iUser,
            timelineControl: iTimeline,
            audioControl: iAudio
        });
    }



    window.mediaplayer = {
        makeMediaInterface: makeMediaInterface,
        makeRessourceReader: makeRessourceReader,
        makeUserInterface: makeUserInterface,
        makeTimelineControl: makeTimelineControl,
        makeAudioControl: makeAudioControl
    };

    window.mediaplayer.make = f.displaceArgs(f.pipe(
        f.partial(find, [undefined, undefined, true]),
        f.mapWith(makeMediaPlayer)
    ), [1, 0]);

    // auto initialize
    window.mediaplayer.make('[data-widget="Mediaplayer"]', document.body);

})(funkyJS, thing, dom);