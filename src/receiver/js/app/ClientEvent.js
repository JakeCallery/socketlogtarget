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
		ClientEvent.NEW_FILE_WRITER = 'clientNewFileWriterEvent';
		ClientEvent.FILE_SAVE_COMPLETE = 'clientFileSaveCompleteEvent';

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
