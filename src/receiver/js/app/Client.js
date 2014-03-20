/**
 * Created with PhpStorm.
 * User: Jake
 */

define([
	'jac/events/EventDispatcher',
	'jac/utils/ObjUtils',
	'jac/logger/Logger',
	'jac/utils/EventUtils',
	'app/ClientEvent',
	'jac/events/GlobalEventBus',
	'app/AppEvent',
	'jac/utils/DOMUtils'
],
function(EventDispatcher,ObjUtils,L,EventUtils,ClientEvent,GEB,AppEvent,DOMUtils){
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

			this._geb = new GEB();
			this._window = null;
			this._document = null;
			this._nameSpan = null;
			this._logArea = null;
			this._connectionStatusP = null;
			this._bufferedMessages = [];
			this._isConnected = false;
			this._clientName = null;
			this._currentFileWriter = null;
			this._isWriting = false;
			this._writeBuffer = '';

			this.isLogSaved = false;
			this.closeOnDisconnect = false;
			this.streamLogToFile = false;
			this.socket = $socket;

			//Delegates
			self._handleWindowClosedDelegate = EventUtils.bind(self, self.handleWindowClosed);
			self._chooseEntryCompleteDelegate = EventUtils.bind(self, self.handleChooseEntryComplete);
			self._handleFileWriteCompleteDelegate = EventUtils.bind(self, self.handleFileWriteComplete);
			self._writeFileDelegate = EventUtils.bind(self, self.writeFile);
			self._handleFileWriteErrorDelegate = EventUtils.bind(self, self.handleFileWriteError);

			//init
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
								this.isLogSaved = false;
								this.postLogEntry(entry.message);
								this.dispatchEvent(new ClientEvent(ClientEvent.LOG_MSG, entry.message));
								break;
						}
					}
				}
			}
		};

		p.postLogEntry = function($logEntry){
			L.log('Posting Message','@client');
			//this._logArea.value += $logEntry + '\n';

			//Create div
			var el = this._document.createElement('div');
			DOMUtils.addClass(el, 'logEntryDiv');
			el.textContent = $logEntry;
			var container = this._document.getElementById('logEntryContainer');
			container.appendChild(el);
			if(this.streamLogToFile && this._currentFileWriter !== null){
				//stream to file
				this.appendToFile($logEntry + '\n');
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

		p.getAllLogEntriesAsText = function(){
			var containerDiv = this._document.getElementById('logEntryContainer');
			var fullText = '';
			var children = DOMUtils.getChildNodesByClassName(containerDiv, 'logEntryDiv');

			for(var i = 0; i < children.length; i++){
				fullText += children[i].textContent + '\n';
			}

			return fullText;

		};

		p.writeFile = function($writer){
			//TODO: proper error handling for failed writes (missing file, read only file, etc...)
			L.log('Writing file', '@client');
			var self = this;
			if(this._currentFileWriter !== null){
				EventUtils.removeDomListener($writer, 'writeend', self._handleFileWriteCompleteDelegate);
			}

			if($writer){
				var entryText = this.getAllLogEntriesAsText();
				if(this._isWriting === false){
					this._currentFileWriter = $writer;
					this.dispatchEvent(new ClientEvent(ClientEvent.NEW_FILE_WRITER, this._currentFileWriter));
					EventUtils.addDomListener($writer, 'writeend', self._handleFileWriteCompleteDelegate);
					this._isWriting = true;
					$writer.write(new Blob([entryText], {type: 'text/plain'}));
				} else {
					//buffer for next write
					this._writeBuffer += entryText;
				}

			} else {
				L.error('Bad Writer in Client::writeFile');
			}

		};

		p.appendToFile = function($textData){
			//TODO: Proper error handling on write

			if(this._currentFileWriter){
				if(this._isWriting === false){
					this._isWriting = true;
					this._currentFileWriter.seek(this._currentFileWriter.length);
					this._currentFileWriter.write(new Blob([$textData], {type: 'text/plain'}));
				} else {
					//buffer for next write
					L.log('--- Currently Writing, buffering output ---', '@buffer');
					this._writeBuffer += $textData;
				}
			} else {
				L.error('Bad _currentFileWriter in Client::appendToFile');
			}

		};

		p.handleFileWriteComplete = function($evt){
			L.log('Write complete: ', $evt);
			this.isLogSaved = true;
			this._isWriting = false;

			if(this._writeBuffer !== ''){
				this.appendToFile(this._writeBuffer);
				this._writeBuffer = '';
			}

			this.dispatchEvent(new ClientEvent(ClientEvent.FILE_SAVE_COMPLETE));

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

		p.closeWindow = function(){
			L.log('Force Window close', '@client');
			this.destroy();
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
