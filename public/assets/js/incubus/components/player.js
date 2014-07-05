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

    var INSTANCE = null;

    // Constructor
    var Player = function(world, settings)
    {

        this.__classId = ((( 1 + Math.random()) * 0x10000) | 0) + new Date().getTime();

        this.settings = $.extend(SETTINGS, settings);
        this.init();

    };

    // Initialize (public)
    Player.prototype.init = function ()
    {



    };

    Player.prototype.render = function() {
        console.log('rendering');
    };

    // Force singleton (public)
    return Player;

})();