/**
 * Created with PhpStorm.
 * User: Jake
 */

define([
	'plugins/domReady!',
	'jac/events/EventDispatcher',
	'jac/utils/ObjUtils'
],
function(Doc,EventDispatcher,ObjUtils){
    return (function(){
        /**
         * Creates a ClientListItem object
         * @extends {EventDispatcher}
         * @constructor
         */
        function ClientListItem($socket){
            //super
            EventDispatcher.call(this);

			var self = this;

			var _baseView = Doc.getElementsByClassName('clientListLI')[0];
			this.view = _baseView.cloneNode(true);

			this.socket = $socket;

        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(ClientListItem,EventDispatcher);
        var p = ClientListItem.prototype;

        //Return constructor
        return ClientListItem;
    })();
});
