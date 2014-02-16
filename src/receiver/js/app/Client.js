/**
 * Created with PhpStorm.
 * User: Jake
 */

define([
	'jac/events/EventDispatcher',
	'jac/utils/ObjUtils',
	'jac/logger/Logger'
],
function(EventDispatcher,ObjUtils,L){
    return (function(){
        /**
         * Creates a Client object
         * @extends {EventDispatcher}
         * @constructor
         */
        function Client($socket){
            //super
            EventDispatcher.call(this);

			this._socket = $socket;

			L.log('New client', '@client');
        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(Client,EventDispatcher);
        var p = Client.prototype;

		p.destroy = function(){
			L.log('Client caught destroy', '@client');
		};
        //Return constructor
        return Client;
    })();
});
