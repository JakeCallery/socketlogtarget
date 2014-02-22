/**
 * Created with PhpStorm.
 * User: Jake
 */

define([
	'plugins/domReady!',
	'jac/events/EventDispatcher',
	'jac/utils/ObjUtils',
	'jac/utils/EventUtils',
	'jac/logger/Logger'

],
function(Doc,EventDispatcher,ObjUtils,EventUtils,Logger){
    return (function(){
        /**
         * Creates a ClientList object
         * @extends {EventDispatcher}
         * @constructor
         */
        function ClientList($serverManager){
            //super
            EventDispatcher.call(this);

			var self = this;

			this._sm = $serverManager;
			this._clientUL = Doc.getElementById('clientUL');

        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(ClientList,EventDispatcher);
        
        //Return constructor
        return ClientList;
    })();
});
