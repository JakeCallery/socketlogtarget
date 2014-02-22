/**
 * Created with PhpStorm.
 * User: Jake
 */

define([],
function(){
    return (function(){
		var config = {};

		config.SOCKET_PORT = 9999;
        config.SOCKET_IP = '0.0.0.0';
        
        //Return constructor
        return config;
    })();
});
