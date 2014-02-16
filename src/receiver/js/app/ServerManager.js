/**
 * Created with PhpStorm.
 * User: Jake
 */

define([
	'jac/events/EventDispatcher',
	'jac/utils/ObjUtils',
	'app/config',
	'http',
	'jac/logger/Logger',
	'jac/utils/EventUtils'
],
function(EventDispatcher,ObjUtils,config,http,L,EventUtils){
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

			L.log('New ServerManager', '@sm');

			var self = this;
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
        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(ServerManager,EventDispatcher);
        var p = ServerManager.prototype;

		p.init = function($port){
			L.log('ServerManager init', '@sm');
			this._httpServer.listen($port);
		};


		p.handleSocketMessage = function($evt){
			L.log('Caught Socket Message: ', $evt, '@sm');

		};

		p.handleSocketClose = function($evt){
			L.log('Caught Socket Close: ', $evt, '@sm');
		};

		p.handleHttpRequest = function($req){
			var url = $req.headers.url;

			L.log('Caught Web Request for: ', $req.headers.url, '@sm');

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

			return true;

		};

        //Return constructor
        return ServerManager;
    })();
});
