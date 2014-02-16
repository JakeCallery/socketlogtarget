/**
 * Created with PhpStorm.
 * User: Jake
 */

define([
	'jac/logger/Logger',
	'jac/logger/ConsoleTarget',
	'app/ServerManager',
	'app/config',
	'app/ServerEvent',
	'app/ClientManager',
	'jac/logger/VerboseLevel'
],
function(L,ConsoleTarget,ServerManager,config,ServerEvent,ClientManager,VerboseLevel){
	L.addLogTarget(new ConsoleTarget());
	L.verboseFilter = VerboseLevel.ALL;
	L.log('-- AppJS Start --', '@app');

	//Set up server
	var sm = new ServerManager();
	var cm = new ClientManager(sm);

	//Wait for connections
	sm.init(config.SOCKET_PORT);



	L.log('-- AppJS End --',  '@main');

});