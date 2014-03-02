/**
 * Created with PhpStorm.
 * User: Jake
 */

define(['jac/events/JacEvent','jac/utils/ObjUtils'],
function(JacEvent,ObjUtils){
    return (function(){

		//Statics
		ClientEvent.WINDOW_CLOSING = 'clientWindowClosingEvent';
		ClientEvent.HELLO_MSG = 'clientHelloMessageEvent';
		ClientEvent.LOG_MSG = 'clientLogMessageEvent';

		/**
         * Creates a ClientEvent object
         * @extends {JacEvent}
         * @constructor
         */
        function ClientEvent($type, $data){
            //super
            JacEvent.call(this, $type, $data);
        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(ClientEvent,JacEvent);
        
        //Return constructor
        return ClientEvent;
    })();
});
