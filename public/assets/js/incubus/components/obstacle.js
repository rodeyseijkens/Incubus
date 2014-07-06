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
GJ.Obstacle = (function ()
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
    var Obstacle = function(world, stage, settings)
    {

        this.world = world;
        this.stage = stage;
        this.__classId = ((( 1 + Math.random()) * 0x10000) | 0) + new Date().getTime();

        this.settings = $.extend(SETTINGS, settings);
        this.init();

    };

    Obstacle.prototype.scaleDown = function(value) {
        return value / 30;

    };

    Obstacle.prototype.scaleUp = function(value) {
        return value * 30;
    };

    Obstacle.prototype.create = function()
    {
        var obsDef = new b2BodyDef;
        obsDef.type = (this.settings.type == "dynamic") ? b2Body.b2_dynamicBody : b2Body.b2_staticBody;

        var x = this.scaleDown(this.settings.x),
            y = this.scaleDown(this.settings.y),
            w = this.scaleDown(this.settings.w),
            h = this.scaleDown(this.settings.h);

        var element = this.settings.element || "entity";

        obsDef.position.Set(x, y);
        var obsFix = new b2FixtureDef;
        obsFix.density = 1.5;
        obsFix.friction = 1;
        obsFix.restitution = 0;

        obsFix.shape = (this.settings.figure == "box") ? new b2PolygonShape : new b2CircleShape(this.settings.w);
        if(this.settings.figure == "box") {
            obsFix.shape.SetAsBox(w, h);
        }

        var newObs = this.world.CreateBody(obsDef);
        newObs.CreateFixture(obsFix);
        newObs.SetUserData({element: element, w: this.scaleUp(w), h: this.scaleUp(h), ui: this.settings.ui, type: this.settings.type });

        this.node = document.createElement('div');
        this.node.className = this.settings.classname;
        this.node.style.width = (this.scaleUp(w) * 2) + "px";
        this.node.style.height = (this.scaleUp(h) * 2) + "px";

        var nxpos = (this.scaleUp(x) - this.scaleUp(w));
        var nypos = (this.scaleUp(y) - this.scaleUp(h));
        var sin = Math.sin(newObs.GetAngle()), cos = Math.cos(newObs.GetAngle());
        this.node.style.webkitTransform = 'matrix(' + cos + ',' + sin + ',' + -sin + ',' + cos + ',' + nxpos + ',' + nypos + ')';
        this.stage.append(this.node);

        return newObs;
    };

    // Initialize (public)
    Obstacle.prototype.init = function ()
    {
        this.obstacle = this.create();
    };


    Obstacle.prototype.render = function()
    {
        var userdata = this.obstacle.GetUserData();

        var nxpos = (this.obstacle.GetWorldCenter().x * 30) - userdata.w;
        var nypos = (this.obstacle.GetWorldCenter().y * 30) - userdata.h;
//        var sin = Math.sin(this.obstacle.GetAngle()), cos = Math.cos(this.obstacle.GetAngle());
//        this.node.style.webkitTransform = 'matrix(' + cos + ',' + sin + ',' + -sin + ',' + cos + ',' + nxpos + ',' + nypos + ')';

        $(this.node).css( 'transform', 'translate(' + nxpos + 'px,' + nypos + 'px) rotate('+this.obstacle.GetAngle()+'rad)');

    };

    Obstacle.prototype.mobileRender = function(mWorldCenter, mAngle)
    {
        var userdata = this.obstacle.GetUserData();

        var nxpos = (mWorldCenter.x * 30) - userdata.w;
        var nypos = (mWorldCenter.y * 30) - userdata.h;
//        var sin = Math.sin(mAngle), cos = Math.cos(mAngle);
//        this.node.style.webkitTransform = 'matrix(' + cos + ',' + sin + ',' + -sin + ',' + cos + ',' + nxpos + ',' + nypos + ')';
        $(this.node).css( 'transform', 'translate(' + nxpos + 'px,' + nypos + 'px) rotate('+mAngle+'rad)');

    };

    // Force singleton (public)
    return Obstacle;

})();