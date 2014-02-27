/**
 * Created with PhpStorm.
 * User: Jake
 */

define(['jac/events/JacEvent','jac/utils/ObjUtils'],
function(JacEvent,ObjUtils){
    return (function(){


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
