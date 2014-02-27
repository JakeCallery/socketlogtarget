/**
 * Created with PhpStorm.
 * User: Jake
 */

define([
	'plugins/domReady!',
	'jac/events/EventDispatcher',
	'jac/utils/ObjUtils',
	'jac/utils/EventUtils',
	'jac/logger/Logger',
	'app/SocketEvent',
	'app/ClientListItem'

],
function(Doc,EventDispatcher,ObjUtils,EventUtils,
		 L,SocketEvent,ClientListItem){
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

			this._clientListItems = [];

			this._sm.addEventListener(SocketEvent.SOCKET_CONNECTED, EventUtils.bind(self, self.handleSocketConnected));
			this._sm.addEventListener(SocketEvent.SOCKET_DISCONNECTED, EventUtils.bind(self, self.handleSocketDisconnected));

			L.log('New Client List', '@cl');
        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(ClientList,EventDispatcher);
        var p = ClientList.prototype;

		p.handleSocketConnected = function($socketEvt){
			L.log('Caught Socket Connected', '@cl');
			var item = new ClientListItem($socketEvt.socket);
			this._clientUL.appendChild(item.view);
		};

		p.handleSocketDisconnected = function($evt){
			L.log('Caught Socket Disconnected', '@cl');

		};


        //Return constructor
        return ClientList;
    })();
});
