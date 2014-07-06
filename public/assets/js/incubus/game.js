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
GJ.Game = (function ()
{
    // Check if server or client
    if ( typeof window == 'object' )
    {
        window.requestAnimationFrame = (function ()
        {
            return window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function ( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element )
                {
                    window.setTimeout( callback, 1000 / 60 );
                };
        })();
    }

    var SETTINGS = {
        'debug': false
    };

    var SELECTORS = {

    };

    var b2Vec2 = Box2D.Common.Math.b2Vec2,
        b2BodyDef = Box2D.Dynamics.b2BodyDef,
        b2Body = Box2D.Dynamics.b2Body,
        b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
        b2World = Box2D.Dynamics.b2World,
        b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
        b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
        b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
        b2Joint = Box2D.Dynamics.Joints.b2Joint,
        b2RevoluteJoint = Box2D.Dynamics.Joints.b2RevoluteJointDef,
        b2PrismaticJointDef = Box2D.Dynamics.Joints.b2PrismaticJointDef,
        b2Listener = Box2D.Dynamics.b2ContactListener;

    // Constructor
    var Game = function ( stage, layers, settings )
    {
        this.stage = stage;
        this.layers = layers;

        // TODO Change this to a separate layer handler
        this.frontLayer2 = layers[0];
        this.frontLayer1 = layers[1];
        this.backLayer1 = layers[2];
        this.backLayer2 = layers[3];
        this.backLayer3 = layers[4];

        this.settings = $.extend( SETTINGS, settings );

        // Class ID
        this.__classId = ((( 1 + Math.random()) * 0x10000) | 0) + new Date().getTime();

        if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test( navigator.userAgent ) )
        {
            this.isMobile = true;
        }
        else
        {
            this.isMobile = false;
        }

        this.init();

        $( 'body' ).on( 'touchstart', function ( event )
        {
            event.preventDefault();
        } );
    };

    // Initialize (public)
    Game.prototype.init = function ()
    {

        //this.stage[0].width = window.innerWidth;
        //this.stage[0].height = window.innerHeight;

        this.gWidth = 50000;
        this.gHeight = 720;

        this.stage.width( this.gWidth );
        this.stage.height( this.gHeight );

        this.frontLayer2.width( this.gWidth * 4 );
        this.frontLayer2.height( this.gHeight );

        this.frontLayer1.width( this.gWidth );
        this.frontLayer1.height( this.gHeight );

        this.backLayer1.width( this.gWidth );
        this.backLayer1.height( this.gHeight );

        this.backLayer2.width( this.gWidth * 0.6 );
        this.backLayer2.height( this.gHeight );

        this.backLayer3.width( this.gWidth * 0.2 );
        this.backLayer3.height( this.gHeight );

//        this.canvas = $( '#canvas' );
//
//        this.ctx = this.canvas[0].getContext( '2d' );

        this.scaleFactor = 30;
        this.entities = [];

        this.leveldata = [
            {
                "player": {},
                "obstacles": [

                ]
            },
            {
                "obstacles": [

                ]
            }
        ];

        this.world = new b2World( new b2Vec2( 0, 60 ), false );

//        this.debugDraw = new b2DebugDraw();
//        this.debugDraw.SetSprite( this.ctx );
//        this.debugDraw.SetDrawScale( this.scaleFactor );     //define scale
//        this.debugDraw.SetFillAlpha( 0.3 );    //define transparency
//        this.debugDraw.SetLineThickness( 1.0 );
//        this.debugDraw.SetFlags( b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit );
//        this.world.SetDebugDraw( this.debugDraw );

        this._setWalls();
        this.entities.push(
            new GJ.Player( this.world, this.stage, this.layers, {} ),
            new GJ.Obstacle( this.world, this.stage, {classname: "obstacle", type: "dynamic", x: 30, y: 30, w: 30, h: 30, figure: "box", ui: true} ),
            new GJ.Obstacle( this.world, this.stage, {classname: "obstacle", type: "static", x: 1200, y: this.stage.height() -75, w: 270, h: 75, figure: "box", ui: false} ),
            new GJ.Obstacle( this.world, this.stage, {classname: "obstacle", type: "static", x: 1900, y: this.stage.height() -250, w: 170, h: 250, figure: "box", ui: false} )
        );


    };


    Game.prototype._setWalls = function ()
    {

        var wallDefs = [
            {x: (this.stage.width() / 2) / 30, y: 0, w: (this.stage.width() / 2) / 30, h: 0}, //top
            {x: (this.stage.width() / 2) / 30, y: (this.stage.height() / 30), w: (this.stage.width() / 2) / 30, h: 0},   //bottom
            {x: 0, y: (this.stage.height() / 2) / 30, w: 0, h: (this.stage.height() / 2) / 30},      //left
            {x: (this.stage.width() / 30), y: (this.stage.height() / 2) / 30, w: 0, h: (this.stage.height() / 2) / 30}      //left
        ];
        var walls = [];

        for ( var j = 0; j < wallDefs.length; j++ )
        {
            var wallDef = new b2BodyDef;
            wallDef.type = b2Body.b2_staticBody;
            wallDef.position.Set( wallDefs[j].x, wallDefs[j].y );
            var newWall = this.world.CreateBody( wallDef );
            var wallFixture = new b2FixtureDef;
            wallFixture.density = 1;
            wallFixture.friction = 0.6;
            wallFixture.restitution = 0;
            wallFixture.shape = new b2PolygonShape;
            wallFixture.shape.SetAsBox( wallDefs[j].w, wallDefs[j].h );
            newWall.CreateFixture( wallFixture );
            if ( j == 1 )
            {
                newWall.SetUserData( {element: "ground"} );
            }
            walls.push( newWall );
        }
    };

    Game.prototype.add = function ()
    {

    };

    Game.prototype.setClientID = function ( id )
    {
        this.clientID = id;
    };

    Game.prototype.setSocket = function ( socket )
    {
        this.socket = socket;
    };

    Game.prototype.serverEnities = function ( list )
    {
        this.entityServerList = list;
    };

    Game.prototype.render = function ()
    {


        // Check if server or client
        if ( typeof window == 'object' )
        {
            requestAnimationFrame( this.render.bind( this ) );
        }
        else
        {
            setInterval( this.render.bind( this ), 1000 / 60 );
        }


        if ( this.isMobile )
        {

            for ( var i = 0, l = this.entityServerList.length; i < l; i++ )
            {
                var mAngle = this.entityServerList[i].angle;
                var mCenter = this.entityServerList[i].center;

//                console.log(this.entityServerList[i].angle);

                this.entities[i].mobileRender( mCenter, mAngle );
            }
        }
        else
        {
            var newEnitiylist = [];

            for ( var i = 0, l = this.entities.length; i < l; i++ )
            {
                this.entities[i].render();

                if ( this.entities[i].obstacle )
                {

                    newEnitiylist.push( {eID: i, angle: this.entities[i].obstacle.GetAngle(), center: this.entities[i].obstacle.GetWorldCenter() } );
                }
                else if ( this.entities[i].player )
                {

                    newEnitiylist.push( {eID: i, angle: this.entities[i].player.GetAngle(), center: this.entities[i].player.GetWorldCenter() } );
                }
            }

            this.socket.emit( 'serverEntitiesSend', {id: this.clientID, enityList: newEnitiylist} );
        }

        this.world.Step( 1 / 60, 10, 10 );
//        this.world.DrawDebugData();
        this.world.ClearForces();

//        console.log('render');

    };

    Game.prototype.start = function ()
    {
        this.render();
    };


    Game.prototype.stop = function ()
    {

    };


    Game.prototype.pause = function ()
    {

    };

    // Force singleton (public)
    return Game;

})();