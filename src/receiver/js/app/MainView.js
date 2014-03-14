/**
 * Created with PhpStorm.
 * User: Jake
 */

define([
	'jac/events/EventDispatcher',
	'jac/utils/ObjUtils',
	'jac/utils/EventUtils',
	'jac/logger/Logger',
	'app/AppConfig'
],
function(EventDispatcher,ObjUtils,EventUtils,L,AppConfig){
    return (function(){
        /**
         * Creates a MainView object
         * @extends {EventDispatcher}
         * @constructor
         */
        function MainView($document){
            //super
            EventDispatcher.call(this);

			var self = this;
			this._config = new AppConfig();
			this._document = $document;
			this._ipSpan = this._document.getElementById('ipSpan');
			this._portSpan = this._document.getElementById('portSpan');

			this.init();

			L.log('Main View', '@mainview');

        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(MainView,EventDispatcher);
        var p = MainView.prototype;

		p.init = function(){
			L.log('Init Main View', '@mainview');
			this._ipSpan.innerHTML = this._config.SOCKET_IP;
			this._portSpan.innerHTML = this._config.SOCKET_PORT;

			//TODO: when network api is in stable channel set up selection for ip addresses
//			//Get network interfaces, currently not supported in stable chrome
//			//Don't forget to add "system.network" to the manifest permissions
//			chrome.system.network.getNetworkInterfaces(function($evt){
//				L.log('Got network interfaces');
//			});

		};

        //Return constructor
        return MainView;
    })();
});
