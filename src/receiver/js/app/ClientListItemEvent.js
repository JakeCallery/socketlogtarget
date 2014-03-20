/**
 * Created with PhpStorm.
 * User: Jake
 */

define(['jac/events/JacEvent','jac/utils/ObjUtils'],
function(JacEvent,ObjUtils){
    return (function(){

		//Statics
		ClientListItemEvent.REQUEST_REMOVE_CLIENT = 'clientListItemRequestRemoveClient';

		/**
         * Creates a ClientListItemEvent object
         * @extends {JacEvent}
         * @constructor
         */
        function ClientListItemEvent($type){
            //super
            JacEvent.call(this, $type);
        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(ClientListItemEvent,JacEvent);
        
        //Return constructor
        return ClientListItemEvent;
    })();
});
