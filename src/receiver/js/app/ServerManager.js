/**
 * Created with PhpStorm.
 * User: Jake
 */

define([
	'jac/events/EventDispatcher',
	'jac/utils/ObjUtils',
	'http',
	'jac/logger/Logger',
	'jac/utils/EventUtils',
	'app/SocketEvent'
],
function(EventDispatcher,ObjUtils,http,L,EventUtils,SocketEvent){
    return (function(){
        /**
         * Creates a ServerManager object
         * @extends {EventDispatcher}
         * @constructor
         */
        function ServerManager(){
            //super
            EventDispatcher.call(this);

			if(!http.Server || !http.WebSocketServer){
				L.error('Failure to find http.Server or http.WebSocketServer', true);
			}

			var self = this;
			this._idCounter = 0;
			this._connectedSockets = [];
			this._httpServer = new http.Server();
			this._wsServer = new http.WebSocketServer(self._httpServer);

			//Setup delegates
			this._handleHttpRequestDelegate = EventUtils.bind(self, self.handleHttpRequest);
			this._handleWSRrequestDelegate = EventUtils.bind(self, self.handleWSRequest);
			this._handleSocketMessageDelegate = EventUtils.bind(self, self.handleSocketMessage);
			this._handleSocketCloseDelegate = EventUtils.bind(self, self.handleSocketClose);

			//Setup listeners
			this._httpServer.addEventListener('request', this._handleHttpRequestDelegate);
			this._wsServer.addEventListener('request', this._handleWSRrequestDelegate);

			L.log('New ServerManager', '@sm');
        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(ServerManager,EventDispatcher);
        var p = ServerManager.prototype;

		p.init = function($ipAddress, $port){
			L.log('ServerManager init', '@sm');
			this._httpServer.listen($port,$ipAddress);
		};

		p.handleSocketMessage = function($evt){
			L.log('Caught Socket Message: ', $evt, '/', $evt.target.id, '@sm');
			L.log('Socket:', $evt.target.id, '@sm');
			this.dispatchEvent(new SocketEvent(SocketEvent.SOCKET_MESSAGE, $evt.target, $evt));
		};

		p.handleSocketClose = function($evt){
			L.log('Caught Socket Close: ', $evt.target.id, '@sm');

			var len = this._connectedSockets.length;
			L.log('Socket Len Before: ', len, '@sm');
			for(var i = 0; i < len; i++){
				if(this._connectedSockets[i] == $evt.target){
					this._connectedSockets.splice(i,1);
					break;
				}
			}
			L.log('Socket Len After: ', this._connectedSockets.length, '@sm');

			this.dispatchEvent(new SocketEvent(SocketEvent.SOCKET_DISCONNECTED, $evt.target));

		};

		p.handleHttpRequest = function($req){
			var url = $req.headers.url;

			L.log('Caught Web Request for: ', $req.headers.url, '@sm');
			L.log('Request: ', $req, '@sm');

			if(url == '/'){
				//serve index
				url = '/serverindex.html';
			}

			//Server it up fresh
			$req.serveUrl(url);
			return true;
		};

		p.handleWSRequest = function($req){
			L.log('Socket Request', '@sm');
			var self = this;
			var socket = $req.accept();
			this._connectedSockets.push(socket);

			socket.addEventListener('message', self._handleSocketMessageDelegate);
			socket.addEventListener('close', self._handleSocketCloseDelegate);
			socket.id = ++this._idCounter;

			this.dispatchEvent(new SocketEvent(SocketEvent.SOCKET_CONNECTED, socket));
			return true;

		};

        //Return constructor
        return ServerManager;
    })();
});
