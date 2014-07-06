var http = require( 'http' );
var io = require( 'socket.io' );
var sys = require( 'sys' );
var fs = require( 'fs' );
var util = require( 'util' );

var socket;
var clients = [];

var Box2D = require( './public/assets/js/libs/box2d.js' );
eval( fs.readFileSync( './public/assets/js/incubus/components/player.js' ) + '' );
eval( fs.readFileSync( './public/assets/js/incubus/game.js' ) + '' );
eval( fs.readFileSync( './public/assets/js/incubus.js' ) + '' );

function jointsToClients( data )
{
    for ( var i = 0; i < clients.length; i++ )
    {
        clients[i].emit('message', data );
    }
}

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

    client.emit('message', {"startId": clients.length} );

    client.on( 'entityRenderClient', function ( data )
    {
        // SEND DATA TO CLIENT

    } );

    client.on( 'disconnect', function ()
    {
        var index = clients.indexOf(client);
        clients.splice(index, 1);

        console.log( "disconnect" );
    } );
};

// INIT SERVER
init();