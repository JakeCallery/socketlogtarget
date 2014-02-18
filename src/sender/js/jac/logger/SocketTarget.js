/**
 * Created with PhpStorm.
 * User: Jake
 */

define([
	'jac/logger/BaseTarget',
	'jac/utils/ObjUtils',
	'jac/logger/events/LogEvent',
	'jac/utils/EventUtils',
	'json2'
],
function(BaseTarget,ObjUtils,LogEvent,EventUtils,JSON){
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
			if(this.isEnabled){
				console.log('trying output');
			}
		};

		p.connect = function(){
			console.log('trying connect');
			if('WebSocket' in window){
				this._socket = new WebSocket(this.receiverAddress, 'log-proto');
			} else if('MozWebSocket' in window){
				this._socket = new MozWebSocket();
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

		/**
		 *
		 * @param {Object} $msgDataObj
		 * @param {String} [$msgType='message']
		 * @param {String} [$msgData='']
		 */
		p.send = function($msgDataObj, $msgType, $msgData){
			if(this._socket && this._isConnected && this._socket.readyState == 1){
				var obj = {};
				if($msgType === undefined){$msgType = 'message';}
				if($msgData === undefined){$msgType = '';}
				obj.type = $msgType;
				obj.data = $msgData;
				obj.message = $msgDataObj;
				var str = JSON.stringify(obj);
				this._socket.send(str);
			} else {
				//can't send
				console.log('Can\'t Send');
			}
		};

		p.disconnect = function(){
			console.log('trying disconnect');
		};

		p.handleSocketOpen = function($evt){
			console.log('Caught socket open');
			this._isConnected = true;

			//send hello
			this.send({},'hello', this._clientId);
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
