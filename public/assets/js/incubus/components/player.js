/**
 * Incubus Game
 *
 * @date		04.07.2014
 * @version		0.1
 * @author		Maarten Oerlemans - Brainseden 2014
 * @depend      jQuery.js
 */

// Namespacing
if (GJ == null || typeof(GJ) != 'object') {
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
    var Player = function(world, settings)
    {

        this.world = world;
        this.__classId = ((( 1 + Math.random()) * 0x10000) | 0) + new Date().getTime();

        this.settings = $.extend(SETTINGS, settings);
        this.init();

    };

    Player.prototype.create = function()
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
        var newBall = this.world.CreateBody(ballDef)
        newBall.CreateFixture(ballFixture);

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

            if(this.player.GetLinearVelocity().x < 5) {
                v = 5;
            }
            this.player.ApplyImpulse(new b2Vec2(v, 0), this.player.GetWorldCenter());

        }

        if(KEYS[37]) {
            var v = 0;

            if(this.player.GetLinearVelocity().x > -5) {
                v = -5;
            }
            this.player.ApplyImpulse(new b2Vec2(v, 0), this.player.GetWorldCenter());
        }

        if(KEYS[38]) {
            console.log('top');
            this.player.ApplyImpulse(new b2Vec2(0, -5), this.player.GetWorldCenter());
        }
    };

    Player.prototype.bind = function()
    {
        document.addEventListener('keydown', function(e) {
            e.preventDefault();
            var key = e.which || e.keyCode;
            KEYS[key] = true;
        }, false);
        document.addEventListener('keyup', function(e) {
            e.preventDefault();
            var key = e.which || e.keyCode;
            KEYS[key] = false;
        }, false);
    };

    Player.prototype.render = function()
    {
        this.move();
    };

    // Force singleton (public)
    return Player;

})();