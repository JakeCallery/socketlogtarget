/**
 * Created with PhpStorm.
 * User: Jake
 */

define(['jac/events/EventDispatcher','jac/utils/ObjUtils'],
function(EventDispatcher,ObjUtils){
    return (function(){
        /**
         * Creates a ClientListItem object
         * @extends {EventDispatcher}
         * @constructor
         */
        function ClientListItem(){
            //super
            EventDispatcher.call(this);
        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(ClientListItem,EventDispatcher);
        
        //Return constructor
        return ClientListItem;
    })();
});
