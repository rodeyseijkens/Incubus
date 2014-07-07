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

// Header Class (singleton)
GJ.Core = (function ()
{
    var SETTINGS = {};

    var SELECTORS = {
        'stage': '#stage',
        'frontLayer2': '#f2',
        'frontLayer1': '#f1',
        'backLayer1': '#b1',
        'backLayer2': '#b2',
        'backLayer3': '#b3'
    };

    var INSTANCE = null;

    // Constructor
    var Core = function ()
    {
        // Class ID
        this.__classId = ((( 1 + Math.random()) * 0x10000) | 0) + new Date().getTime();

        // Check if server or client
        if ( typeof window == 'object' )
        {
            this.init();
        }
    };

    // Initialize (public)
    Core.prototype.init = function ()
    {
        var stage = $( SELECTORS.stage );
        var fl2 = $( SELECTORS.frontLayer2 );
        var fl1 = $( SELECTORS.frontLayer1 );
        var bl1 = $( SELECTORS.backLayer1 );
        var bl2 = $( SELECTORS.backLayer2 );
        var bl3 = $( SELECTORS.backLayer3 );

        var layers = [fl2, fl1, bl1, bl2, bl3];

        var audioset = [
            "assets/audio/01_intro.mp3",
            "assets/audio/02_forest.mp3",
            "assets/audio/03_incubus_city.mp3",
            "assets/audio/04_incubus_cave.mp3",
            "assets/audio/05_incubus_endgame.mp3",
            "assets/audio/06_incubus_the_end.mp3"
        ];

        this.game = new GJ.Game( stage, layers );
        this.serverToClient();
        this.game.start( this.socket );
    };

    Core.prototype.serverToClient = function ()
    {
        var self = this;

        this.socket = io.connect( '10.22.244.153', { port: 1337, transports: [ 'websocket' ] } );

        this.socket.on( 'connect', function ()
        {
            console.log( 'Client has connected to the server!' );
            this.connected = true;
        } );

        this.socket.on( 'message', function ( data )
        {
            // GET DATA FROM SERVER

            if ( data.hasOwnProperty( "startId" ) )
            {
                self.game.setClientID( data.startId );
            }

        } );

        this.socket.on( 'clientEntitiesSend', function ( data )
        {
            self.game.serverEnities( data.enityList );
        } );

        this.socket.on( 'powerJump', function ()
        {
            self.game.entities[0].powerJump();
        } );


        this.socket.on( 'barrelPush', function ( dir )
        {
            self.game.entities[1].pulse( dir );
        } );

        this.socket.on( 'disconnect', function ()
        {
            console.log( 'The client has disconnected!' );
            this.connected = false;
        } );
    };

    // Force singleton (public)
    return {
        getInstance: function ()
        {
            if ( INSTANCE == null )
            {
                INSTANCE = new Core();
                // Avoid creating new instance
                INSTANCE.constructor = null;
            }
            return INSTANCE;
        }
    };

})();

(function ()
{
    var Core = GJ.Core.getInstance();

    // Check if server or client
    if ( typeof window == 'object' )
    {
        window.Core = Core;
    }
})();