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
	'app/config'
],
function(Doc,EventDispatcher,ObjUtils,EventUtils,L,config){
    return (function(){
        /**
         * Creates a MainView object
         * @extends {EventDispatcher}
         * @constructor
         */
        function MainView(){
            //super
            EventDispatcher.call(this);

			var self = this;
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
			this._ipSpan.innerHTML = config.SOCKET_IP;
			this._portSpan.innerHTML = config.SOCKET_PORT;

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
