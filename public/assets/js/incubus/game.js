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

// Game class (singleton)
GJ.Game = (function ()
{
    // Check if server or client
    if(typeof window == 'object') {
        window.requestAnimationFrame = ( function() {
            return window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
                    window.setTimeout( callback, 1000 / 60 );
                };
        } )();
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
    var Game = function(stage, settings)
    {
        this.stage = stage;
        this.settings = $.extend(SETTINGS, settings);

        // Class ID
        this.__classId = ((( 1 + Math.random()) * 0x10000) | 0) + new Date().getTime();
        this.init();
    };

    // Initialize (public)
    Game.prototype.init = function ()
    {

        //this.stage[0].width = window.innerWidth;
        //this.stage[0].height = window.innerHeight;
        this.stage.width( 800 );
        this.stage.height( 700 );

        this.canvas = $('#canvas');

        this.ctx = this.canvas[0].getContext('2d');
        this.scaleFactor = 30;
        this.entities = [];

        this.leveldata = [];

        this.world = new b2World(new b2Vec2(0,20), true);

        this.debugDraw = new b2DebugDraw();
        this.debugDraw.SetSprite (this.ctx);
        this.debugDraw.SetDrawScale(this.scaleFactor);     //define scale
        this.debugDraw.SetFillAlpha(0.3);    //define transparency
        this.debugDraw.SetLineThickness(1.0);
        this.debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
        this.world.SetDebugDraw(this.debugDraw);

        this._setWalls();
        this.entities.push(
            new GJ.Player(this.world, this.stage, {}),
            new GJ.Obstacle(this.world, this.stage, {classname: "obstacle", type: "dynamic", x: 30, y: 30, w: 30, h: 30, figure: "box", ui: true}),
            new GJ.Obstacle(this.world, this.stage, {classname: "obstacle", type: "static", x: 500, y: 330, w: 230, h: 30, figure: "box", ui: true})
        );


    };

    
    Game.prototype._setWalls = function() {

        var numBalls = 3;
        var balls = new Array();
        for (var i=0; i < numBalls; i++) {
            var ballDef = new b2BodyDef;
            ballDef.type = b2Body.b2_dynamicBody;
            var ypos = (10);
            var xpos = ((i + 1) * 4);
            var size = (30 / this.scaleFactor);
            ballDef.position.Set(xpos, ypos);
            var ballFixture = new b2FixtureDef;
            ballFixture.density = 10;
            ballFixture.friction = .2;
            ballFixture.restitution = .5;
            ballFixture.shape =  new b2PolygonShape(size);
            ballFixture.shape.SetAsBox(size, size);
            var newBall = this.world.CreateBody(ballDef)
            newBall.CreateFixture(ballFixture);
            balls.push(newBall);
        }


        var wallDefs = [
            {x: (this.stage.width() / 2) / 30, y: 0, w: (this.stage.width() / 2) / 30, h: 0}, //top
            {x: (this.stage.width() / 2) / 30, y: (this.stage.height() / 30),w: (this.stage.width() / 2) / 30 ,h: 0},   //bottom
            {x: 0, y: (this.stage.height() / 2) / 30, w: 0 , h: (this.stage.height() / 2) / 30},      //left
            {x: (this.stage.width() / 30), y: (this.stage.height() / 2) / 30, w: 0 , h: (this.stage.height() / 2) / 30}      //left
        ];
        var walls = [];
        for (var j = 0; j < wallDefs.length; j++) {
            var wallDef = new b2BodyDef;
            wallDef.type = b2Body.b2_staticBody;
            wallDef.position.Set(wallDefs[j].x, wallDefs[j].y);
            var newWall = this.world.CreateBody(wallDef);
            var wallFixture = new b2FixtureDef;
            wallFixture.density = 1;
            wallFixture.friction = 0.2;
            wallFixture.restitution = .5;
            wallFixture.shape = new b2PolygonShape;
            wallFixture.shape.SetAsBox(wallDefs[j].w, wallDefs[j].h);
            newWall.CreateFixture(wallFixture);
            walls.push(newWall);
        }


        console.log(this.world);
    };

    Game.prototype.add = function() {

    };

    Game.prototype.render = function() {


        // Check if server or client
        if(typeof window == 'object') {
            requestAnimationFrame(this.render.bind(this));
        } else {
            setInterval(this.render.bind(this), 1000 / 60);
        }

        for (var i = 0, l = this.entities.length; i < l; i++) {
            this.entities[i].render();
        }

        this.world.Step(1 / 60, 10, 10);
        this.world.DrawDebugData();
        this.world.ClearForces();

//        console.log('render');

    };

    Game.prototype.start = function() {
        this.render();
    };


    Game.prototype.stop = function() {

    };


    Game.prototype.pause = function() {

    };

    // Force singleton (public)
    return Game;

})();