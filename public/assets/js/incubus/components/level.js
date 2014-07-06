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
GJ.Level = (function ()
{

    var SETTINGS = {};

    var SELECTORS = {

    };

    var INSTANCE = null;

    // Constructor
    var Level = function(level, data, settings)
    {

        this.level = id;
        this.__classId = ((( 1 + Math.random()) * 0x10000) | 0) + new Date().getTime();

        this.data = data;
        this.settings = $.extend(SETTINGS, settings);

        this.init();

    };

    // Initialize (public)
    Level.prototype.init = function ()
    {

    };

    Level.prototype.bind = function()
    {

    };

    Level.prototype.render = function()
    {

    };

    return Level;

})();