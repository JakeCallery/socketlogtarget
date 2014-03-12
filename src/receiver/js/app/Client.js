/**
 * Created with PhpStorm.
 * User: Jake
 */

define([
	'jac/events/EventDispatcher',
	'jac/utils/ObjUtils',
	'jac/logger/Logger',
	'jac/utils/EventUtils',
	'app/ClientEvent'
],
function(EventDispatcher,ObjUtils,L,EventUtils,ClientEvent){
    return (function(){
        /**
         * Creates a Client object
         * @extends {EventDispatcher}
         * @constructor
         */
        function Client($socket){
            //super
            EventDispatcher.call(this);

			var self = this;

			this._window = null;
			this._document = null;
			this._nameSpan = null;
			this._logArea = null;
			this._connectionStatusP = null;
			this._bufferedMessages = [];
			this._isConnected = false;
			this._isLogSaved = false;
			this._clientName = null;

			this.closeOnDisconnect = false;
			this.socket = $socket;

			//Delegates
			self._handleWindowClosedDelegate = EventUtils.bind(self, self.handleWindowClosed);
			self._chooseEntryCompleteDelegate = EventUtils.bind(self, self.handleChooseEntryComplete);
			self._handleFileWriteCompleteDelegate = EventUtils.bind(self, self.handleFileWriteComplete);
			self._writeFileDelegate = EventUtils.bind(self, self.writeFile);
			self._handleFileWriteErrorDelegate = EventUtils.bind(self, self.handleFileWriteError);
			self.createWindow();
			L.log('New Client', '@client');
        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(Client,EventDispatcher);
        var p = Client.prototype;

		p.ingestMessage = function($rawMsg){
			L.log('Ingesting Message: ' + $rawMsg, '@client');

			if(this._document === null){
				L.log('Buffering Message', '@client');
				this._bufferedMessages.push($rawMsg);
			} else {
				var msgObj = null;
				try {
					msgObj = JSON.parse($rawMsg);
				} catch($err){
					L.error('Bad JSON in Raw Message');
				}

				if(msgObj !== null && this.checkValidMessageList(msgObj)){
					//Good message
					var messages = msgObj.messages;

					for(var i = 0; i < messages.length; i++){
						//deal with each message
						var entry = messages[i];
						switch(entry.info.type){
							case 'hello':
								//Set client title
								L.log('----- CAUGHT HELLO -----', '@client');
								this._nameSpan.innerHTML = entry.info.client;
								this._clientName = entry.info.client;
								this.dispatchEvent(new ClientEvent(ClientEvent.HELLO_MSG, entry.info.client));
								break;
							case 'log':
								this._isLogSaved = false;
								this.postLogEntry(entry.message);
								this.dispatchEvent(new ClientEvent(ClientEvent.LOG_MSG, entry.message));
								break;
						}
					}
				}
			}

		};

		p.postLogEntry = function($logEntry){
			if(this._document != null){
				L.log('Posting Message','@client');
				this._logArea.value += $logEntry + '\n';
			} else {
				L.log('Buffering Message', '@client');
				this._bufferedMessages.push($logEntry);
			}
		};

		p.checkValidMessageList = function($msgObj){
			return ($msgObj.hasOwnProperty('messages') && ObjUtils.isArray($msgObj.messages));
		};

		p.saveLog = function(){
			L.log('Saving Log...', '@client');

			var options = {
				type: 'saveFile',
				suggestedName: 'clientLog-' + this._clientName + '-' + Date.now(),
				accepts: [
					{
						description:'*.log',
						extensions: ['log','txt']
					}
				]
			};
			chrome.fileSystem.chooseEntry(options, this._chooseEntryCompleteDelegate);
		};

		p.handleChooseEntryComplete = function($entry){
			L.log('Choose Entry Complete', '@client');
			L.log('Entry: ', $entry, '@client');
			var self = this;
			if($entry){
				$entry.createWriter(self._writeFileDelegate);
			} else {
				L.log('No file selected for save', '@client');
			}
		};

		p.writeFile = function($writer){
			L.log('Writing file', '@client');
			var self = this;
			EventUtils.addDomListener($writer, 'writeend', self._handleFileWriteCompleteDelegate);
			$writer.write(new Blob([self._logArea.value], {type: 'text/plain'}));
		};

		p.handleFileWriteComplete = function($evt){
			L.log('Write complete: ', $evt);
			EventUtils.removeDomListener($evt.target, 'writeend', this._handleFileWriteCompleteDelegate);
			this._isLogSaved = true;
		};

		p.handleFileWriteError = function($err){
			L.error('Write file error', $err);
		};

		p.setupWindow = function(){
			this._nameSpan = this._document.getElementById('nameSpan');
			this._logArea = this._document.getElementById('logArea');
			this._connectionStatusP = this._document.getElementById('connectionStatusP');
			this._nameSpan.innerHTML = this.socket.id;
			this.setConnectionStatus(true);

			for(var i = 0; i < this._bufferedMessages.length; i++){
				L.log('Ingesting Buffered Message', '@client');
				this.ingestMessage(this._bufferedMessages[i]);
			}

		};

		p.createWindow = function(){
			var self = this;
			chrome.app.window.create('LogWindow.html', {
					'bounds': {
						'width': 800,
						'height': 600
					}
				},function($newWindow) {
					self._window = $newWindow;
					self._window.contentWindow.onload = function(){
						L.log('Window Loaded', '@client');
						self._document = self._window.contentWindow.document;
						self.setupWindow()
					};
					self._window.onClosed.addListener(self._handleWindowClosedDelegate);
					L.log('New client window', '@client');
					L.log(self._window.contentWindow);
				}
			);
		};

		p.handleWindowClosed = function($evt){
			L.log('Client caught Window Closed', '@client');
			if(this._window){
				this.dispatchEvent(new ClientEvent(ClientEvent.WINDOW_CLOSING));
				this.socket.close();
				L.log('Removing onClosed');
				this._window.onClosed.removeListener(this._handleWindowClosedDelegate);
				this._window = null;
			}
		};

		p.setConnectionStatus = function($isConnected){
			this._isConnected = $isConnected;

			if(this._isConnected === true){
				this._connectionStatusP.innerHTML =	'(connected)';
			} else {
				this._connectionStatusP.innerHTML =	'(disconnected)';
			}

		};

		p.destroy = function(){
			L.log('Client caught destroy', '@client');
			if(this._window !== null){
				L.log('Closing Window','@client');
				this._window.close();
			}
		};
        //Return constructor
        return Client;
    })();
});
