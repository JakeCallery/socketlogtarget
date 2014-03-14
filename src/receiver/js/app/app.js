/**
 * Created with PhpStorm.
 * User: Jake
 */

define([
	'jac/logger/Logger',
	'jac/logger/ConsoleTarget',
	'app/ServerManager',
	'app/AppConfig',
	'app/ServerEvent',
	'app/ClientManager',
	'jac/logger/VerboseLevel',
	'app/MainView',
	'app/ClientListManager'
],
function(L,ConsoleTarget,ServerManager,AppConfig,
		 ServerEvent,ClientManager,VerboseLevel,
		 MainView,ClientListManager){
	L.addLogTarget(new ConsoleTarget());
	L.verboseFilter = (VerboseLevel.LEVEL | VerboseLevel.LINE | VerboseLevel.FUNCTION);
	L.log('-- AppJS Start --', '@app');

	this._appConfig = new AppConfig();

	//Set up server
	var sm = new ServerManager();
	var cm = new ClientManager(sm);
	var clientList = new ClientListManager(cm);

	//Views
	var mainView = new MainView();

	//Wait for connections
	sm.init(this._appConfig.SOCKET_IP, this._appConfig.SOCKET_PORT);

	L.log('-- AppJS End --',  '@main');

});