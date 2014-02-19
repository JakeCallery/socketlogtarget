/**
 * Created with PhpStorm.
 * User: Jake
 */

define([
	'plugins/domReady!',
	'jac/events/EventDispatcher',
	'jac/utils/ObjUtils',
	'jac/logger/Logger',
	'jac/utils/EventUtils'
],
function(Doc,EventDispatcher,ObjUtils,L,EventUtils){
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
			this._testMessageInput = Doc.getElementById('testMessageInput');
			this._testMessageButton = Doc.getElementById('testMessageButton');

			EventUtils.addDomListener(this._testMessageButton, 'click', EventUtils.bind(self, self.handleTestMessageClick));

			L.log('New Main View', '@mainview');


        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(MainView,EventDispatcher);
        var p = MainView.prototype;

		p.handleTestMessageClick = function($evt){
			L.log('Test Message:', this._testMessageInput.value, '@mainview');
		};

        //Return constructor
        return MainView;
    })();
});
