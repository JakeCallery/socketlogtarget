/**
 * Created with PhpStorm.
 * User: Jake
 */

define(['jac/events/EventDispatcher','jac/utils/ObjUtils'],
function(EventDispatcher,ObjUtils){
    return (function(){

		//Statics
		AppEvent.APP_CLOSE = 'appCloseEvent';

		/**
         * Creates a AppEvent object
         * @extends {EventDispatcher}
         * @constructor
         */
        function AppEvent($type, $data){
            //super
            EventDispatcher.call(this, $type, $data);
        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(AppEvent,EventDispatcher);
        
        //Return constructor
        return AppEvent;
    })();
});
