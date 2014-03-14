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
	'app/ClientListItem',
	'app/ClientManagerEvent',
	'jac/utils/ArrayUtils'

],
function(Doc,EventDispatcher,ObjUtils,EventUtils,
		 L,SocketEvent,ClientListItem,ClientManagerEvent,
		 ArrayUtils){
    return (function(){
        /**
         * Creates a ClientListManager object
         * @extends {EventDispatcher}
         * @constructor
         */
        function ClientListManager($clientManager){
            //super
            EventDispatcher.call(this);

			var self = this;

			this._cm = $clientManager;
			this._clientUL = Doc.getElementById('clientUL');

			this._clientListItems = [];
			this._baseLIView = Doc.getElementsByClassName('clientListLI')[0];

			//Delegates
			this._clientAddedDelegate= EventUtils.bind(self, self.handleClientAdded);
			this._clientRemovedDelegate = EventUtils.bind(self, self.handleClientRemoved);
			this._clientDisconnectedDelegate = EventUtils.bind(self, self.handleClientDisconnected);
			this._clientConnectedDelegate = EventUtils.bind(self, self.handleClientConnected);

			this._cm.addEventListener(ClientManagerEvent.CLIENT_CONNECTED, this._clientConnectedDelegate);
			this._cm.addEventListener(ClientManagerEvent.ADDED_CLIENT, this._clientAddedDelegate);
			this._cm.addEventListener(ClientManagerEvent.REMOVED_CLIENT, this._clientRemovedDelegate);
			this._cm.addEventListener(ClientManagerEvent.CLIENT_DISCONNECTED, this._clientDisconnectedDelegate);


			L.log('New Client List', '@cl');
        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(ClientListManager,EventDispatcher);
        var p = ClientListManager.prototype;

		p._getListItemByClient = function($client){
			var idx = ArrayUtils.findFirstIndexObjWithProp(this._clientListItems, 'client', $client);
			if(idx !== -1){
				return this._clientListItems[idx];
			} else {
				return null;
			}
		};

		p.handleClientAdded = function($cmEvt){
			L.log('Caught Client Added: ', $cmEvt, '@clm');
			var ci = new ClientListItem($cmEvt.client, this._baseLIView);
			this._clientListItems.push(ci);
			this._clientUL.appendChild(ci.view);
		};

		p.handleClientConnected = function($cmEvt){
			L.log('Caught Client Connected: ', $cmEvt, '@clm');
			var item = this._getListItemByClient($cmEvt.client);
			if(item !== null){
				item.setConnectionStatus(true);
			}
		};

		p.handleClientDisconnected = function($cmEvt){
			L.log('Caught Client Disconnected', '@clm');
			var item = this._getListItemByClient($cmEvt.client);
			if(item !== null){
				item.setConnectionStatus(false);
			}

		};

		p.handleClientRemoved = function($cmEvt){
			L.log('Caught Client Removed', '@clm');
			var item = this._getListItemByClient($cmEvt.client);
			var idx = ArrayUtils.findFirstIndexObjWithProp(this._clientListItems, 'client', $cmEvt.client);
			if(item !== null){
				item.destroy();
				this._clientListItems.splice(idx,1);
			} else {
				L.error('Couldn\'t find client to remove');
			}
		};

        //Return constructor
        return ClientListManager;
    })();
});
