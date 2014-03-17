/**
 * Created with PhpStorm.
 * User: Jake
 */

define([
	'jac/events/EventDispatcher',
	'jac/utils/ObjUtils',
	'app/ServerManager',
	'app/SocketEvent',
	'jac/Utils/EventUtils',
	'jac/logger/Logger',
	'app/Client',
	'app/ClientManagerEvent',
	'app/ClientEvent',
	'jac/events/GlobalEventBus',
	'app/AppEvent'
],
function(EventDispatcher,ObjUtils,ServerManager,
		 SocketEvent,EventUtils,L,Client,ClientManagerEvent,
		 ClientEvent,GEB,AppEvent){
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

			this._geb = new GEB();

			//global events
			this._geb.addEventListener(AppEvent.APP_CLOSE, EventUtils.bind(self, self.handleAppClose));

			//Server manager events
			this._sm = $serverManager;
			this._sm.addEventListener(SocketEvent.SOCKET_CONNECTED, EventUtils.bind(self, self.handleClientConnected));
			this._sm.addEventListener(SocketEvent.SOCKET_DISCONNECTED, EventUtils.bind(self, self.handleClientDisconnected));
			this._sm.addEventListener(SocketEvent.SOCKET_MESSAGE, EventUtils.bind(self, self.handleClientMessage));

			//delegates
			this._handleWindowClosedDelegate = EventUtils.bind(self, self.handleWindowClosing);

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

			//Notify of client connection and addition
			this.dispatchEvent(new ClientManagerEvent(ClientManagerEvent.ADDED_CLIENT, client));
			this.dispatchEvent(new ClientManagerEvent(ClientManagerEvent.CLIENT_CONNECTED, client));

			client.addEventListener(ClientEvent.WINDOW_CLOSING, this._handleWindowClosedDelegate);
		};

		p.handleWindowClosing = function($clientEvt){
			L.log('Caught Client Window Closing', '@cm');
			this.dispatchEvent(new ClientManagerEvent(ClientManagerEvent.REMOVED_CLIENT, $clientEvt.client));
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

			//Notify of disconnection, a client can be disconnected, but not removed
			this.dispatchEvent(new ClientManagerEvent(ClientManagerEvent.CLIENT_DISCONNECTED, client));

			if(client !== null){
				//clean up
				L.log('Found Client, disconnecting', '@cm');
				if(client.closeOnDisconnect === true){
					client.destroy();
					this._clients.splice(idx,1);
					this.dispatchEvent(new ClientManagerEvent(ClientManagerEvent.REMOVED_CLIENT, client));
				} else {
					client.setConnectionStatus(false);
				}
			}
		};

		p.handleAppClose = function($appEvt){
			L.log('Caught Global App Close Event', '@cm');
			for(var i = 0; i < this._clients.length; i++){
				//Close all of the clients
				var client = this._clients[i];
				client.destroy();
			}
		};

        //Return constructor
        return ClientManager;
    })();
});
