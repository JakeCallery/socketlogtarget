/**
 * Created with PhpStorm.
 * User: Jake
 */

define(['' +
	'jac/events/EventDispatcher',
	'jac/utils/ObjUtils',
	'app/ServerManager',
	'app/ServerEvent',
	'jac/Utils/EventUtils',
	'jac/logger/Logger',
	'app/Client'
],
function(EventDispatcher,ObjUtils,ServerManager,
		 ServerEvent,EventUtils,L,Client){
    return (function(){
        /**
         * Creates a ClientManager object
         * @extends {EventDispatcher}
         * @constructor
         */
        function ClientManager($serverManager){
            //super
            EventDispatcher.call(this);

			var self = this;

			this._clients = [];

			this._sm = $serverManager;
			this._sm.addEventListener(ServerEvent.SOCKET_CONNECTED, EventUtils.bind(self, self.handleClientConnected));
			this._sm.addEventListener(ServerEvent.SOCKET_DISCONNECTED, EventUtils.bind(self, self.handleClientDisconnected));
			this._sm.addEventListener(ServerEvent.SOCKET_MESSAGE, EventUtils.bind(self, self.handleClientMessage));
			L.log('New Client Manager', '@cm');

        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(ClientManager,EventDispatcher);
        var p = ClientManager.prototype;

		p.handleClientMessage = function($srvEvt){
			L.log('Caught client Message', $srvEvt.data, '@cm');

		};

		p.handleClientConnected = function($srvEvt){
			L.log('Caught Client Connected: ' + $srvEvt.data.id, '@cm');
			var client = new Client($srvEvt.data);
			this._clients.push(client);
		};

		p.handleClientDisconnected = function($srvEvt){
			L.log('Caught Client Disconnected: ' + $srvEvt.data.id, '@cm');
			var client = null;
			var idx = -1;
			for(var i = 0; i < this._clients.length; i++){
				if(this._clients[i].socket == $srvEvt.data){
					client = this._clients[i];
					idx = i;
					break;
				}
			}

			if(client !== null){
				//clean up
				L.log('Found Client, disconnecting', '@cm');
				client.destroy();
				this._clients.splice(idx,1);
			}

		};

        //Return constructor
        return ClientManager;
    })();
});
