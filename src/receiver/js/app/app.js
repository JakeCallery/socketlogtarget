/**
 * Created with PhpStorm.
 * User: Jake
 */

define([
	'jac/logger/Logger',
	'jac/logger/ConsoleTarget',
	'app/ServerManager',
	'app/config'
],
function(L,ConsoleTarget,ServerManager,config){
	L.addLogTarget(new ConsoleTarget());
	L.log('-- AppJS Start --', '@app');

	//Set up server
	var sm = new ServerManager();
	sm.init(config.SOCKET_PORT);



	L.log('-- AppJS End --',  '@main');

});