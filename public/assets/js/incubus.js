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

// Header Class (singleton)
GJ.Core = (function ()
{

    var SETTINGS = {};

    var SELECTORS = {
        'stage': '#stage'
    };

    var INSTANCE = null;

    // Constructor
    var Core = function()
    {
        // Class ID
        this.__classId = ((( 1 + Math.random()) * 0x10000) | 0) + new Date().getTime();
        this.init();

        this.__initTicker();
    };

    // Initialize (public)
    Core.prototype.init = function ()
    {
        var stage = $(SELECTORS.stage);
        this.game = new GJ.Game(stage);
        this.game.start();
    };

    Core.prototype.__initPhysicsEngine = function()
    {

    };

    Core.prototype.__initTicker = function() {

    };

    // Force singleton (public)
    return {
        getInstance: function ()
        {
            if (INSTANCE == null)
            {
                INSTANCE = new Core();
                // Avoid creating new instance
                INSTANCE.constructor = null;
            }
            return INSTANCE;
        }
    };

})();

(function()
{
    var Core = GJ.Core.getInstance();
    window.Core = Core;
})();