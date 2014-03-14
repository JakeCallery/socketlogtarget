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
	'jac/logger/VerboseLevel',
	'app/MainView',
	'app/ClientListManager'
],
function(L,ConsoleTarget,ServerManager,config,
		 ServerEvent,ClientManager,VerboseLevel,
		 MainView,ClientListManager){
	L.addLogTarget(new ConsoleTarget());
	L.verboseFilter = (VerboseLevel.LEVEL | VerboseLevel.LINE | VerboseLevel.FUNCTION);
	L.log('--  AppJS Start --', '@app');

	//Set up server
	var sm = new ServerManager();
	var cm = new ClientManager(sm);
	var clientList = new ClientListManager(cm);

	//Views
	var mainView = new MainView();

	//Wait for connections
	sm.init( config.SOCKET_IP, config.SOCKET_PORT);

	L.log('-- AppJS End --',  '@main');

});