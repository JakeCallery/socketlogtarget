/**
 * Created with PhpStorm.
 * User: Jake
 */

define(['' +
	'jac/events/EventDispatcher',
	'jac/utils/ObjUtils',
	'app/ServerManager',
	'app/SocketEvent',
	'jac/Utils/EventUtils',
	'jac/logger/Logger',
	'app/Client',
	'app/ClientManagerEvent'
],
function(EventDispatcher,ObjUtils,ServerManager,
		 SocketEvent,EventUtils,L,Client,ClientManagerEvent){
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
			this._sm.addEventListener(SocketEvent.SOCKET_CONNECTED, EventUtils.bind(self, self.handleClientConnected));
			this._sm.addEventListener(SocketEvent.SOCKET_DISCONNECTED, EventUtils.bind(self, self.handleClientDisconnected));
			this._sm.addEventListener(SocketEvent.SOCKET_MESSAGE, EventUtils.bind(self, self.handleClientMessage));
			L.log('New Client Manager', '@cm');

        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(ClientManager,EventDispatcher);
        var p = ClientManager.prototype;

		p.getClientBySocket = function($socket){
			for(var i = 0; i < this._clients.length; i++){
				if(this._clients[i].socket === $socket){
					return this._clients[i];
				}
			}

			return null;
		};

		p.handleClientMessage = function($socketEvt){
			L.log('Caught client Message', $socketEvt.data, '@cm');

			var client = this.getClientBySocket($socketEvt.socket);
			if(client !== null){
				//Found client
				client.ingestMessage($socketEvt.data.data);
			} else {
				L.log('Could not find client to post to', '@cm');
			}


		};

		p.handleClientConnected = function($socketEvt){
			L.log('Caught Client Connected: ' + $socketEvt.socket.id, '@cm');
			var client = new Client($socketEvt.socket);
			this._clients.push(client);
			this.dispatchEvent(new ClientManagerEvent(ClientManagerEvent.ADDED_CLIENT, client));
		};

		p.handleClientDisconnected = function($socketEvt){
			L.log('Caught Client Disconnected: ' + $socketEvt.socket.id, '@cm');
			var client = null;
			var idx = -1;
			for(var i = 0; i < this._clients.length; i++){
				if(this._clients[i].socket == $socketEvt.socket){
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
				this.dispatchEvent(new ClientManagerEvent(ClientManagerEvent.REMOVED_CLIENT, client));
			}

		};

        //Return constructor
        return ClientManager;
    })();
});
