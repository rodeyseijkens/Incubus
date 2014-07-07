var http = require( 'http' );
var io = require( 'socket.io' );
var sys = require( 'sys' );
var fs = require( 'fs' );
var util = require( 'util' );

var socket;
var clients = [];
var serverEnities = [];

var Box2D = require( './public/assets/js/libs/box2d.js' );
eval( fs.readFileSync( './public/assets/js/incubus/components/player.js' ) + '' );
eval( fs.readFileSync( './public/assets/js/incubus/game.js' ) + '' );
eval( fs.readFileSync( './public/assets/js/incubus.js' ) + '' );

function init()
{
    // Create an empty array to store players

    // Set up Socket.IO to listen on port 1337
    socket = io.listen( 1337 );

    // Configure Socket.IO
    socket.configure( function ()
    {
        // Only use WebSockets
        socket.set( 'transports', [ 'websocket' ] );

        // Restrict log output
        socket.set( 'log level', 0 );
    } );

    // Start listening for events
    setEventHandlers();
};

/**************************************************
 ** GAME EVENT HANDLERS
 **************************************************/
var setEventHandlers = function ()
{
    // Socket.IO
    socket.sockets.on( 'connection', onSocketConnection );
};

// New socket connection
function onSocketConnection( client )
{
    clients.push( client );
    console.log( "Total clients: " + clients.length );

    client.emit( 'message', {"startId": clients.length} );

    client.on( 'powerJump', function ()
    {
        for ( var i = 0; i < clients.length; i++ )
        {
            clients[i].emit( 'powerJump' );
        }
    } );

    client.on( 'barrelPush', function ( dir )
    {
        for ( var i = 0; i < clients.length; i++ )
        {
            clients[i].emit( 'barrelPush', dir );
        }
    } );

    client.on( 'serverEntitiesSend', function ( data )
    {
        // SEND DATA TO CLIENT

        for ( var i = 0; i < clients.length; i++ )
        {
            clients[i].emit( 'clientEntitiesSend', data );
        }

    } );

    client.on( 'disconnect', function ()
    {
        var index = clients.indexOf( client );
        clients.splice( index, 1 );

        console.log( "disconnect" );
    } );
};

// INIT SERVER
init();