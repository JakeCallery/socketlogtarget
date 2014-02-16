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
			this._httpServer = new http.Server();
			this._wsServer = new http.WebSocketServer(self._httpServer);

			//Setup delegates
			this._handleHttpRequestDelegate = EventUtils.bind(self, self.handleHttpRequest);

			//Setup listeners
			this._httpServer.addEventListener('request', this._handleHttpRequestDelegate);

        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(ServerManager,EventDispatcher);
        var p = ServerManager.prototype;

		p.init = function($port){
			L.log('ServerManager init', '@sm');
			this._httpServer.listen($port);
		};

		p.handleHttpRequest = function($req){
			var url = $req.headers.url;

			if(url == '/'){
				//serve index
				url = '/serverindex.html';
			}

			//Server it up fresh
			$req.serveUrl(url);
			return true;
		};

        //Return constructor
        return ServerManager;
    })();
});
