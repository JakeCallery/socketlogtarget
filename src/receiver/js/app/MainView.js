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
	'jac/utils/DOMUtils'
],
function(Doc,EventDispatcher,ObjUtils,EventUtils,L,AppConfig,DOMUtils){
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
			this._sectionEl = $sectionEl;
			this._appConfig = new AppConfig();
			this._ipSpan = Doc.getElementById('ipSpan');
			this._portSpan = Doc.getElementById('portSpan');

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

		};

		p.enter = function(){
			L.log('Entering Main View', '@mainview');
			DOMUtils.removeClass(this._sectionEl, 'hiddenElement');
		};

        //Return constructor
        return MainView;
    })();
});
