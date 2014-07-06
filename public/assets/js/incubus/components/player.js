/**
 * Incubus Game
 *
 * @date		04.07.2014
 * @version		0.1
 * @author		Maarten Oerlemans - Brainseden 2014
 * @depend      jQuery.js
 */

// Namespacing
if ( GJ == null || typeof(GJ) != 'object' )
{
    var GJ = {};
}

// Player class
GJ.Player = (function ()
{

    var SETTINGS = {};

    var SELECTORS = {

    };

    var KEYS = [];

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

    var INSTANCE = null;

    // Constructor
    var Player = function ( world, stage, layers, settings )
    {

        this.world = world;
        this.stage = stage;

        // TODO Change this to a separate layer handler
        this.frontLayer2 =  layers[0];
        this.frontLayer1 =  layers[1];
        this.backLayer1 =  layers[2];
        this.backLayer2 =  layers[3];
        this.backLayer3 =  layers[4];

        this.__classId = ((( 1 + Math.random()) * 0x10000) | 0) + new Date().getTime();

        this.settings = $.extend( SETTINGS, settings );
        this.init();

    };

    Player.prototype.create = function ()
    {
        var ballDef = new b2BodyDef;
        ballDef.type = b2Body.b2_dynamicBody;
        var ypos = 2;
        var xpos = 2;
        var size = (30 / 30);
        ballDef.position.Set(xpos, ypos);
        var ballFixture = new b2FixtureDef;
        ballFixture.density = 1.5;
        ballFixture.friction = 1;
        ballFixture.restitution = .5;
        ballFixture.shape =  new b2PolygonShape(size);
        ballFixture.shape.SetAsBox(size, size);
        var newBall = this.world.CreateBody(ballDef);
        newBall.CreateFixture(ballFixture);
        newBall.SetUserData({w: size * 30, h: size * 30});

        this.node = document.createElement('div');
        this.node.className = 'player';
        this.node.style.width = (size * 30) * 2 + "px";
        this.node.style.height = (size * 30) * 2 + "px";

        var nxpos = (xpos * 30) - (size * 30);
        var nypos = (ypos * 30) - (size * 30);

        this.node.style.webkitTransform = 'matrix(1,0,0,1,' + nxpos + ',' + nypos + ')';
        this.stage.append(this.node);

        return newBall;
    };

    // Initialize (public)
    Player.prototype.init = function ()
    {
        this.player = this.create();
        this.player.SetFixedRotation(true);
        this.bind();
    };

    Player.prototype.move = function()
    {
        if(KEYS[39]) {

            var v = 0;

            if ( this.player.GetLinearVelocity().x < 15 )
            {
                v = 15;
            }
            this.player.ApplyImpulse( new b2Vec2( v, 0 ), this.player.GetWorldCenter() );
            this.direction = "right";
        }

        if ( KEYS[37] )
        {
            var v = 0;

            if ( this.player.GetLinearVelocity().x > -15 )
            {
                v = -15;
            }
            this.player.ApplyImpulse( new b2Vec2( v, 0 ), this.player.GetWorldCenter() );

            this.direction = "left";
        }

        if ( KEYS[38] )
        {
            this.player.ApplyImpulse( new b2Vec2( 0, -30 ), this.player.GetWorldCenter() );
        }
    };

    Player.prototype.bind = function()
    {
        document.addEventListener( 'keydown', function ( e )
        {
            e.preventDefault();
            var key = e.which || e.keyCode;
            KEYS[key] = true;
        }, false );
        document.addEventListener( 'keyup', function ( e )
        {
            e.preventDefault();
            var key = e.which || e.keyCode;
            KEYS[key] = false;
        }, false );
    };

    Player.prototype.render = function ()
    {
        this.move();
        var userdata = this.player.GetUserData();

        // TODO: SCALESIZE GET
        var nxpos = (this.player.GetWorldCenter().x * 30) - userdata.w;
        var nypos = (this.player.GetWorldCenter().y * 30) - userdata.h;

        this.node.style.webkitTransform = 'matrix(1,0,0,1,' + nxpos + ',' + nypos + ')';

        var stageStyle = new WebKitCSSMatrix( window.getComputedStyle( this.stage[0] ).webkitTransform );


        // TODO Change this to a separate layer handler
        if ( (this.direction == "right") )
        {
            if ( (stageStyle.e - -nxpos) >= 880 )
            {
                this.stage.css( 'webkitTransform', 'matrix(1,0,0,1,' + (-nxpos + 880) + ',' + 0 + ')' );
            }
        }
        else if ( this.direction == "left" )
        {
            if ( (stageStyle.e - -nxpos) <= 400 && (stageStyle.e <= -10) )
            {
                this.stage.css( 'webkitTransform', 'matrix(1,0,0,1,' + (-nxpos + 400) + ',' + 0 + ')' );
            }
        }

        this.backLayer3.css( 'webkitTransform', 'matrix(1,0,0,1,' + (stageStyle.e * 0.2) + ',' + 0 + ')' );
        this.backLayer2.css( 'webkitTransform', 'matrix(1,0,0,1,' + (stageStyle.e * 0.6) + ',' + 0 + ')' );
        this.backLayer1.css( 'webkitTransform', 'matrix(1,0,0,1,' + (stageStyle.e) + ',' + 0 + ')' );
        this.frontLayer1.css( 'webkitTransform', 'matrix(1,0,0,1,' + (stageStyle.e) + ',' + 0 + ')' );
        this.frontLayer2.css( 'webkitTransform', 'matrix(1,0,0,1,' + (stageStyle.e * 4) + ',' + 0 + ')' );

    };

    // Force singleton (public)
    return Player;

})();