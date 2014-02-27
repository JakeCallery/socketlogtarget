/**
 * Created with PhpStorm.
 * User: Jake
 */

define([
	'plugins/domReady!',
	'jac/events/EventDispatcher',
	'jac/utils/ObjUtils',
	'jac/utils/DOMUtils',
	'app/ClientEvent',
	'jac/utils/EventUtils',
	'jac/logger/Logger'
],
function(Doc,EventDispatcher,ObjUtils,DOMUtils,
		 ClientEvent,EventUtils,L){
    return (function(){
        /**
         * Creates a ClientListItem object
         * @extends {EventDispatcher}
         * @constructor
         */
        function ClientListItem($client, $baseView){
            //super
            EventDispatcher.call(this);

			var self = this;

			this.view = $baseView.cloneNode(true);
			this.client = $client;

			//Elements
			this._clientNameP = DOMUtils.getChildNodesByClassName(this.view, 'clientNameP')[0];

			//Delegates
			this._helloMsgDelegate = EventUtils.bind(self, self.handleClientHello);

			//Listen for hello message (on client)
			this.client.addEventListener(ClientEvent.HELLO_MSG, this._helloMsgDelegate);

			L.log('New Client List Item', '@cli');

        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(ClientListItem,EventDispatcher);
        var p = ClientListItem.prototype;

		p.handleClientHello = function($clientEvt){
			L.log('Caught Hello', '@cli');
			this._clientNameP.innerHTML = $clientEvt.data;
		};

		p.destroy = function(){
			L.log('Destroying List Item', '@cli');
			this.client.removeEventListener(ClientEvent.HELLO_MSG, this._helloMsgDelegate);
			this.client = null;

			//remove element
			this.parent.removeChild(this.view);

			//clean view
			this.view = null;
		};
        //Return constructor
        return ClientListItem;
    })();
});
