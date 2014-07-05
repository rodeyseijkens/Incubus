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
        'stage': '#stage'
    };

    var INSTANCE = null;

    // Constructor
    var Core = function ()
    {
        // Class ID
        this.__classId = ((( 1 + Math.random()) * 0x10000) | 0) + new Date().getTime();

        // Check if server or client
        if(typeof window == 'object') {
            this.init();
        }

        this.__initTicker();
    };

    // Initialize (public)
    Core.prototype.init = function ()
    {
        var stage = $( SELECTORS.stage );
        this.game = new GJ.Game( stage );
        this.game.start();
        this.serverToClient();
    };

    Core.prototype.__initPhysicsEngine = function ()
    {

    };

    Core.prototype.__initTicker = function ()
    {

    };

    Core.prototype.serverToClient = function ()
    {
        this.socket = io.connect( 'localhost', { port: 1337, transports: [ 'websocket' ] } );

        this.socket.on( 'connect', function ()
        {
            console.log( 'Client has connected to the server!' );
            this.connected = true;
        } );

        this.socket.on( 'message', function ( data )
        {

            // GET DATA FROM SERVER

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
})();