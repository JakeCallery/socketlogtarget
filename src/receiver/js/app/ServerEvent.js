/**
 * Created with PhpStorm.
 * User: Jake
 */

define(['jac/events/JacEvent','jac/utils/ObjUtils'],
function(JacEvent,ObjUtils){
    return (function(){

		//Statics
		ServerEvent.SOCKET_CONNECTED = 'serverSocketConnectedEvent';
		ServerEvent.SOCKET_DISCONNECTED = 'serverSocketDisconnectedEvent';
		ServerEvent.SOCKET_MESSAGE = 'serverSocketMessageEvent';


		/**
         * Creates a ServerEvent object
         * @extends {JacEvent}
         * @constructor
         */
        function ServerEvent($type,$data){
            //super
            JacEvent.call(this,$type,$data);
        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(ServerEvent,JacEvent);
        
        //Return constructor
        return ServerEvent;
    })();
});
