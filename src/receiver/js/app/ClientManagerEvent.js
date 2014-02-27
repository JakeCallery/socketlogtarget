/**
 * Created with PhpStorm.
 * User: Jake
 */

define(['jac/events/JacEvent','jac/utils/ObjUtils'],
function(JacEvent,ObjUtils){
    return (function(){

		//Statics
		ClientManagerEvent.ADDED_CLIENT = 'clientManagerAddedClientEvent';
		ClientManagerEvent.REMOVED_CLIENT = 'clientManagerRemovedClientEvent';

		/**
         * Creates a ClientManagerEvent object
         * @extends {JacEvent}
         * @constructor
         */
        function ClientManagerEvent($type, $client, $optData){
            //super
            JacEvent.call(this, $type, $client, $optData);

			this.client = $client;
        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(ClientManagerEvent,JacEvent);
        
        //Return constructor
        return ClientManagerEvent;
    })();
});
