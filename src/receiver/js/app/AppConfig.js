/**
 * Created with PhpStorm.
 * User: Jake
 */

define([],
function(){
    return (function(){
        /**
         * Creates a AppConfig Singleton object
         * to use ALWAYS new it up mySingleton = new AppConfig()
         * @constructor
         */
        function AppConfig(){
	        if(AppConfig.prototype._singletonInstance){
		        return AppConfig.prototype._singletonInstance;
	        }

			//Props
			this.SOCKET_PORT = 9999;
			this.SOCKET_IP = '0.0.0.0';

	        //Set first instance
	        AppConfig.prototype._singletonInstance = this;
        }
        
        //Return constructor
        return AppConfig;
    })();
});
