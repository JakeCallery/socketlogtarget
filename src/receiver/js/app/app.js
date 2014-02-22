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
	'app/ClientList'
],
function(L,ConsoleTarget,ServerManager,config,
		 ServerEvent,ClientManager,VerboseLevel,
		 MainView,ClientList){
	L.addLogTarget(new ConsoleTarget());
	L.verboseFilter = VerboseLevel.ALL;
	L.log('-- AppJS Start --', '@app');

	//Set up server
	var sm = new ServerManager();
	var cm = new ClientManager(sm);
	var clientList = new ClientList(sm);
	//Views
	var mainView = new MainView();

	//Wait for connections
	sm.init( config.SOCKET_IP, config.SOCKET_PORT);



	L.log('-- AppJS End --',  '@main');

});