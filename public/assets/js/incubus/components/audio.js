/**
 * Incubus Game
 *
 * @date        04.07.2014
 * @version        0.1
 * @author        Maarten Oerlemans - Brainseden 2014
 * @depend      jQuery.js
 */

// Namespacing
if ( GJ == null || typeof(GJ) != 'object' )
{
    var GJ = {};
}

// Game class (singleton)
GJ.Audio = (function ()
{

    var SELECTORS = {

    };

    var SETTINGS = {

    };

    // Constructor
    var Audio = function (audioset, settings)
    {

        this.settings = $.extend( SETTINGS, settings);

        // Class ID
        this.__classId = ((( 1 + Math.random()) * 0x10000) | 0) + new Date().getTime();
        Observable(this);

        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.context = new AudioContext();
        this.bufferLoader = null;
        this.audioset = audioset;
        this.loaded = false;
        this.init();
    };

    // Initialize (public)
    Audio.prototype.init = function () {
        this.bufferLoader = new BufferLoader(this, this.context, this.audioset, this.finishedloading);
        this.bufferLoader.load();
    };

    Audio.prototype.finishedloading = function(bufferList, loader)
    {
        loader.audio.bufferlist = bufferList;
        loader.audio.loaded = true;
        loader.audio.trigger('loaded');
    };

    Audio.prototype.playSound = function(index, loop) {

        if(!this.loaded) {
            console.log('try later, not loaded the audio');
            return;
        }

        if(this.current !== undefined) {
            if(this.current.index && this.current.index === index) {
                return;
            }
            this.current.source.stop();
        }

        this.current = this.createSource(this.bufferlist[index], loop, index);
        this.current.source.start(0);

    };

    Audio.prototype.stopSound = function() {
        if(this.current !== undefined) {
            this.current.source.stop();
            this.current.currentTime = 0;
        }
    };

    Audio.prototype.createSource = function(buffer, loop, index) {

        var source = this.context.createBufferSource();
        var gain = this.context.createGain();

        source.buffer = buffer;
        source.loop = loop || true;
        source.connect(gain);
        gain.connect(this.context.destination);

        return {
            source: source,
            gain: gain,
            index: index
        };
    };

    function BufferLoader(audio, context, urlList, callback) {
        this.audio = audio;
        this.context = context;
        this.urlList = urlList;
        this.onload = callback;
        this.bufferList = [];
        this.loadCount = 0;
    }

    BufferLoader.prototype.loadBuffer = function(url, index) {
        // Load buffer asynchronously
        var request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";

        var loader = this;

        request.onload = function() {
            // Asynchronously decode the audio file data in request.response
            loader.context.decodeAudioData(
                request.response,
                function(buffer) {
                    if (!buffer) {
                        alert('error decoding file data: ' + url);
                        return;
                    }
                    loader.bufferList[index] = buffer;
                    if (++loader.loadCount == loader.urlList.length)
                        loader.onload(loader.bufferList, loader);
                },
                function(error) {
                    console.error('decodeAudioData error', error);
                }
            );
        };

        request.onerror = function() {
            alert('BufferLoader: XHR error');
        };

        request.send();
    };

    BufferLoader.prototype.load = function() {
        for (var i = 0; i < this.urlList.length; ++i)
            this.loadBuffer(this.urlList[i], i);
    };

    // Force singleton (public)
    return Audio;

})();