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
	'jac/logger/Logger',
	'app/ClientListItemEvent'
],
function(Doc,EventDispatcher,ObjUtils,DOMUtils,
		 ClientEvent,EventUtils,L,ClientListItemEvent){
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
			this._clientStatusP = DOMUtils.getChildNodesByClassName(this.view, 'connectionStatusP')[0];
			this._saveToFileButton = DOMUtils.getChildNodesByClassName(this.view, 'saveToFileButton')[0];
			this._clientCloseButton = DOMUtils.getChildNodesByClassName(this.view, 'clientCloseButton')[0];
			this._keepAfterDisconnectCB = DOMUtils.getChildNodesByClassName(this.view, 'keepAfterDisconnectCB')[0];
			this._streamToFileCB = DOMUtils.getChildNodesByClassName(this.view, 'streamToFileCB')[0];
			this._savedP = DOMUtils.getChildNodesByClassName(this.view, 'savedP')[0];

			//Delegates
			this._helloMsgDelegate = EventUtils.bind(self, self.handleClientHello);
			this._saveToFileClickDelegate = EventUtils.bind(self, self.handleSaveToFileClick);
			this._clientCloseClickDelegate = EventUtils.bind(self, self.handleClientCloseClick);
			this._keepAfterDisconnectChangeDelegate = EventUtils.bind(self, self.handleKeepAfterDisconnectChange);
			this._streamToFileChangeDelegate = EventUtils.bind(self, self.handleStreamToFileChange);
			this._newFileWriterDelegate = EventUtils.bind(self, self.handleNewFileWriter);
			this._logMessageDelegate = EventUtils.bind(self, self.handleLogMessage);
			this._fileSaveCompleteDelegate = EventUtils.bind(self, self.handleFileSaveComplete);

			//Listen for hello message (on client)
			this.client.addEventListener(ClientEvent.HELLO_MSG, this._helloMsgDelegate);
			this.client.addEventListener(ClientEvent.NEW_FILE_WRITER, this._newFileWriterDelegate);
			this.client.addEventListener(ClientEvent.LOG_MSG, this._logMessageDelegate);
			this.client.addEventListener(ClientEvent.FILE_SAVE_COMPLETE, this._fileSaveCompleteDelegate);

			//Events
			EventUtils.addDomListener(this._saveToFileButton, 'click', self._saveToFileClickDelegate);
			EventUtils.addDomListener(this._clientCloseButton, 'click', self._clientCloseClickDelegate);
			EventUtils.addDomListener(this._keepAfterDisconnectCB, 'change', self._keepAfterDisconnectChangeDelegate);
			EventUtils.addDomListener(this._streamToFileCB, 'change', self._streamToFileChangeDelegate);

			//Set up
			this.client.closeOnDisconnect = !this._keepAfterDisconnectCB.checked;
			this.client.streamLogToFile = this._streamToFileCB.checked;


			L.log('New Client List Item', '@cli');

        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(ClientListItem,EventDispatcher);
        var p = ClientListItem.prototype;

		p.handleFileSaveComplete = function($clientEvent){
			L.log('Caught file Save complete', '@cli');
			this.updateSavedStatus(this.client.isLogSaved);
		};

		p.handleLogMessage = function($clientEvt){
			L.log('Caught new log message', '@cli');
			this.updateSavedStatus(this.client.isLogSaved);
		};

		p.updateSavedStatus = function($isSaved){
			if($isSaved === false){
				if(this._savedP.style.visibility !== 'visible'){
					this._savedP.style.visibility = 'visible';
				}
			} else {
				if(this._savedP.style.visibility !== 'hidden'){
					this._savedP.style.visibility = 'hidden';
				}
			}
		};

		p.handleNewFileWriter = function($clientEvt){
			L.log('Caught new file writer', '@cli');
			this._streamToFileCB.disabled = false;
		};

		p.handleStreamToFileChange = function($changeEvt){
			L.log('Caught Stream to file change: ' + this._streamToFileCB.checked, '@cli');
			this.client.streamLogToFile = this._streamToFileCB.checked;
		};

		p.handleKeepAfterDisconnectChange = function($changeEvt){
			L.log('Caught Keep After Disconnect Change: ' + this._keepAfterDisconnectCB.checked, '@cli');
			this.client.closeOnDisconnect = !this._keepAfterDisconnectCB.checked;
		};

		p.handleClientCloseClick = function($clickEvt){
			L.log('Caught Close Click', '@cli');
			this.dispatchEvent(new ClientListItemEvent(ClientListItemEvent.REQUEST_REMOVE_CLIENT));
		};

		p.handleSaveToFileClick = function($clickEvt){
			L.log('Caught Safe To File Click', '@cli');
			if(this.client){
				this.client.saveLog();
			} else {
				L.warn('Client Not Ready Yet');
			}
		};

		p.handleClientHello = function($clientEvt){
			L.log('Caught Hello', '@cli');
			this._clientNameP.innerHTML = $clientEvt.data;
		};

		p.setConnectionStatus = function($isConnected){
			if($isConnected === true){
				this._clientStatusP.innerHTML = '(connected)';
			} else {
				this._clientStatusP.innerHTML = '(disconnected)';
			}
		};

		p.destroy = function(){
			L.log('Destroying List Item', '@cli');

			//Remove events
			this.client.removeEventListener(ClientEvent.HELLO_MSG, this._helloMsgDelegate);
			this.client.removeEventListener(ClientEvent.NEW_FILE_WRITER, this._newFileWriterDelegate);
			EventUtils.removeDomListener(this._saveToFileButton, 'click', self._saveToFileClickDelegate);
			EventUtils.removeDomListener(this._clientCloseButton, 'click', self._clientCloseClickDelegate);

			//Remove client reference
			this.client = null;

			//remove element
			this.view.parentNode.removeChild(this.view);

			//clean view
			this.view = null;
		};
        //Return constructor
        return ClientListItem;
    })();
});
