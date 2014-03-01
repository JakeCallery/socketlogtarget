/**
 * Created with PhpStorm.
 * User: Jake
 */

define([
	'jac/logger/BaseTarget',
	'jac/utils/ObjUtils',
	'jac/logger/events/LogEvent',
	'jac/utils/EventUtils',
	'json2',
	'jac/logger/Logger'
],
function(BaseTarget,ObjUtils,LogEvent,EventUtils,JSON,Logger){
    return (function(){
        /**
         * Creates a SocketTarget object
		 * @param {string} $receiverAddress  ip address of receiver
		 * @param {string} [$clientId='Default Log Client']  connect automatically
		 * @param {boolean} [$autoConnect=true]  connect automatically
         * @extends {BaseTarget}
         * @constructor
         */
        function SocketTarget($receiverAddress, $clientId, $autoConnect){
            //super
            BaseTarget.call(this);

			var self = this;

			this._isConnected = false;
			this._socket = null;

			if($autoConnect === undefined){$autoConnect = true;}
			if($clientId === undefined){$clientId = 'Default Log Client';}
			this.receiverAddress = $receiverAddress;
			this._clientId = $clientId;
			this._autoConnect = $autoConnect;
			this._bufferedMessages = [];

			//Delegates
			this._handleSocketOpenDelegate = EventUtils.bind(self, self.handleSocketOpen);
			this._handleSocketCloseDelegate = EventUtils.bind(self, self.handleSocketClose);
			this._handleSocketErrorDelegate = EventUtils.bind(self, self.handleSocketError);
			this._handleSocketMessageDelegate = EventUtils.bind(self, self.handleSocketMessage);

			if(this._autoConnect && SocketTarget.canUseWebSockets()){
				this.connect();
			}

        }

		/** Statics **/
		SocketTarget.canUseWebSockets = function(){
			return 'WebSocket' in window || 'MozWebSocket' in window;
		};


        //Inherit / Extend
        ObjUtils.inheritPrototype(SocketTarget,BaseTarget);
		var p = SocketTarget.prototype;

		p.output = function($args){
			//Super
			SocketTarget.superClass.output.call(self, arguments);

			console.log('Output requested');
			if(this.isEnabled){
				console.log('trying output');
				var list = Array.prototype.slice.call(arguments,0);
				//TODO: an array might not be the best thing to serialize here
				//TODO: build an 'object dumper' for showing full object properties
				//TODO: loop through all args, if object, make it a json string if possible
				this.addMessage(list.join(''));
				this.dispatchEvent(new LogEvent(LogEvent.TARGET_UPDATED));
			}
		};

		p.connect = function(){
			console.log('trying connect');
			if('WebSocket' in window){
				this._socket = new WebSocket(this.receiverAddress, 'log-proto');
			} else if('MozWebSocket' in window){
				this._socket = new MozWebSocket(this.receiverAddress, 'log-proto');
			} else {
				//Could not new up a websocket...
			}

			var self = this;
			if (this._socket !== null){
				//Set up events
				this._socket.addEventListener('open', self._handleSocketOpenDelegate);
				this._socket.addEventListener('message', self._handleSocketMessageDelegate);
				this._socket.addEventListener('error', self._handleSocketErrorDelegate);
				this._socket.addEventListener('close', self._handleSocketCloseDelegate);
			}

		};

		p.checkCanSend = function(){
			var result = this._socket && this._isConnected && this._socket.readyState == 1;
			console.log('Checking Can Send: ' + result);
			return result;
		};


		p.sendBufferedMessages = function(){
			//TODO: Set up max batch size
			//TODO: think about zlib compression for bigger messages

			var len = this._bufferedMessages.length;

			if(this.checkCanSend()){
				if(len > 0){
					var batchMsg = {};
					batchMsg.messages = [];

					for(var i = 0; i < len; i++){
						batchMsg.messages.push(this._bufferedMessages.shift());
					}

					var str = JSON.stringify(batchMsg);
					this._socket.send(str);
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}

		};

		/**
		 *
		 * Adds a message to the message buffer
		 * {
		 * 	info:{
		 * 		type: 'message',
		 * 		client: 'My ID'
		 * 	    verboseFilter: 0	//Could be useful for color parsing in the receiver
		 * 	    <more optional properties>
		 * 	},
		 * 	 message:{
		 * 		msg: 'some text here'
		 * 		<any properties really>
		 * 	 }
		 * 	}
		 *
		 * @param {Object | Array} $msgDataObj object that is used for the 'message' object property
		 * @param {String} [$msgType='log'] string used for the info.type property
		 * @param {Object} [$optInfoObj={}] object that is copied into the 'message' object property
		 */
		p.addMessage = function($msgDataObj, $msgType, $optInfoObj){
			var obj = {};
			if($msgType === undefined){$msgType = 'log';}
			if($optInfoObj === undefined){$optInfoObj = {};}

			//Setup extra message info
			obj.info = {
				type: $msgType,
				client: this._clientId,
				verboseFilter: Logger.verboseFilter
			};

			//Add extra info
			for(var key in $optInfoObj){
				if($optInfoObj.hasOwnProperty(key)){
					obj.info[key] = $optInfoObj[key]
				}
			}

			obj.message = $msgDataObj;
			this._bufferedMessages.push(obj);

			this.checkShouldSend();
		};

		p.checkShouldSend = function(){
			//TODO: Set up conditions under which the batch messages should be sent
			//for now just send
			var didSend = this.sendBufferedMessages();
			console.log('Did Send: ', didSend);
		};

		p.disconnect = function(){
			console.log('trying disconnect');
			if(this._socket){
				this._socket.close();
				this._isConnected = false;
			}
		};

		p.handleSocketOpen = function($evt){
			console.log('Caught socket open');
			this._isConnected = true;

			//send hello
			this.addMessage({},'hello');

			//request send
			this.checkShouldSend();
		};

		p.handleSocketClose = function($evt){
			console.log('Caught Socket close');
			this._isConnected = false;
		};

		p.handleSocketMessage = function($evt){
			console.log('Caught Socket Message');
		};

		p.handleSocketError = function($evt){
			console.log('Caught Socket Error');
		};

        //Return constructor
        return SocketTarget;
    })();
});
