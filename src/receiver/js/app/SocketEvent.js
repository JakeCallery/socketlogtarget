/**
 * Created with PhpStorm.
 * User: Jake
 */

define(['jac/events/JacEvent','jac/utils/ObjUtils'],
function(JacEvent,ObjUtils){
    return (function(){

		//Statics
		SocketEvent.SOCKET_CONNECTED = 'serverSocketConnectedEvent';
		SocketEvent.SOCKET_DISCONNECTED = 'serverSocketDisconnectedEvent';
		SocketEvent.SOCKET_MESSAGE = 'serverSocketMessageEvent';

		/**
         * Creates a SocketEvent object
         * @extends {JacEvent}
         * @constructor
         */
        function SocketEvent($type, $socket, $data){
            //super
            JacEvent.call(this, $type, $data);

			this.socket = $socket;
        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(SocketEvent,JacEvent);
        
        //Return constructor
        return SocketEvent;
    })();
});
