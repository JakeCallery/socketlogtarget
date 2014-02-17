/**
 * Created with PhpStorm.
 * User: Jake
 */

define([
	'jac/events/EventDispatcher',
	'jac/utils/ObjUtils',
	'jac/logger/Logger',
	'jac/utils/EventUtils'
],
function(EventDispatcher,ObjUtils,L,EventUtils){
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
			this._socket = $socket;
			this._nameSpan = null;
			this._logArea = null;

			//Delegates
			self._handleWindowClosedDelegate = EventUtils.bind(self, self.handleWindowClosed);

			self.createWindow();
			L.log('New Client', '@client');
        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(Client,EventDispatcher);
        var p = Client.prototype;

		p.setupWindow = function(){
			this._nameSpan = this._document.getElementById('nameSpan');
			this._logArea = this._document.getElementById('logArea');
			this._nameSpan.innerHTML = this._socket.id;
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
				L.log('Removing onClosed');
				this._window.onClosed.removeListener(this._handleWindowClosedDelegate);
				this._window = null;
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
