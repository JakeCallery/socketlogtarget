/**
 * Created with PhpStorm.
 * User: Jake
 */

define([
	'plugins/domReady!',
	'jac/events/EventDispatcher',
	'jac/utils/ObjUtils',
	'jac/utils/EventUtils',
	'jac/logger/Logger',
	'app/AppConfig',
	'jac/utils/DOMUtils',
	'jac/events/GlobalEventBus',
	'app/AppEvent'
],
function(Doc,EventDispatcher,ObjUtils,EventUtils,L,
		 AppConfig,DOMUtils,GEB,AppEvent){
    return (function(){
        /**
         * Creates a MainView object
         * @extends {EventDispatcher}
         * @constructor
         */
        function MainView($sectionEl){
            //super
            EventDispatcher.call(this);

			var self = this;
			this._geb = new GEB();
			this._sectionEl = $sectionEl;
			this._appConfig = new AppConfig();
			this._ipSpan = Doc.getElementById('ipSpan');
			this._portSpan = Doc.getElementById('portSpan');
			this._mainWindow = chrome.app.window.current();
			L.log('Main Window: ', this._mainWindow, '@mainview');

			//Delegates
			this._handleWindowClosedDelegate = EventUtils.bind(self, self.handleWindowClosed);

			this.init();

			L.log('Main View', '@mainview');

        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(MainView,EventDispatcher);
        var p = MainView.prototype;

		p.init = function(){
			L.log('Init Main View', '@mainview');
			this._ipSpan.innerHTML = this._appConfig.SOCKET_IP;
			this._portSpan.innerHTML = this._appConfig.SOCKET_PORT;

			//TODO: when network api is in stable channel set up selection for ip addresses
//			//Get network interfaces, currently not supported in stable chrome
//			//Don't forget to add "system.network" to the manifest permissions
//			chrome.system.network.getNetworkInterfaces(function($evt){
//				L.log('Got network interfaces');
//			});

			this._mainWindow.onClosed.addListener(this._handleWindowClosedDelegate);

		};

		p.handleWindowClosed = function($evt){
			L.log('Caught Main Window Close', '@mainview');
			this._geb.dispatchEvent(new AppEvent(AppEvent.APP_CLOSE));
		};

		p.enter = function(){
			L.log('Entering Main View', '@mainview');
			DOMUtils.removeClass(this._sectionEl, 'hiddenElement');
		};

        //Return constructor
        return MainView;
    })();
});
