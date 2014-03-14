/**
 * Created with PhpStorm.
 * User: Jake
 */

define([
	'jac/events/EventDispatcher',
	'jac/utils/ObjUtils',
	'jac/logger/Logger',
	'jac/utils/EventUtils',
	'app/ServerManager',
	'app/AppConfig',
	'app/ServerEvent',
	'app/ClientManager',
	'app/MainView',
	'app/ClientListManager'
],
function(EventDispatcher,ObjUtils,L,EventUtils,
		 ServerManager,AppConfig,ServerEvent,ClientManager,
		 MainView,ClientListManager){
    return (function(){
        /**
         * Creates a Receiver object
         * @extends {EventDispatcher}
         * @constructor
         */
        function Receiver(){
            //super
            EventDispatcher.call(this);

			var self = this;
			this._window = null;
			this._document = null;
			this._config = new AppConfig();

			this._sm = null;
			this._cm = null;
			this._clientList = null;
			this._mainView = null;

			self.createWindow();
        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(Receiver,EventDispatcher);
        var p = Receiver.prototype;

		p.init = function(){
			//Set up server
			this._sm = new ServerManager();
			this._cm = new ClientManager(this._sm);
			this._clientList = new ClientListManager(this._cm, this._document);

			//Views
			this._mainView = new MainView(this._document);

			//Wait for connections
			this._sm.init(this._config.SOCKET_IP, this._config.SOCKET_PORT);
		};

		p.createWindow = function(){
			var self = this;
			chrome.app.window.create('receiver.html', {
					'bounds': {
						'width': 800,
						'height': 600
					}
				},function($newWindow) {
					self._window = $newWindow;
					self._window.contentWindow.onload = function(){
						L.log('Receiver Window Loaded', '@receiver');
						self._document = self._window.contentWindow.document;
						self.init();
					};
					self._window.onClosed.addListener(self._handleWindowClosedDelegate);
					L.log('New client window', '@receiver');
					L.log(self._window.contentWindow);
				}
			);
		};

        //Return constructor
        return Receiver;
    })();
});
