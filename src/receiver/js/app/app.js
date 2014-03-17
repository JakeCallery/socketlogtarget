/**
 * Created with PhpStorm.
 * User: Jake
 */

define([
	'plugins/domReady!',
	'jac/logger/Logger',
	'jac/logger/ConsoleTarget',
	'app/ServerManager',
	'app/AppConfig',
	'app/ServerEvent',
	'app/ClientManager',
	'jac/logger/VerboseLevel',
	'app/MainView',
	'app/ClientListManager',
	'app/SettingsManager',
	'jac/utils/DOMUtils'
],
function(Doc,L,ConsoleTarget,ServerManager,AppConfig,
		 ServerEvent,ClientManager,VerboseLevel,
		 MainView,ClientListManager,SettingsManager,
		 DOMUtils){

	L.addLogTarget(new ConsoleTarget());
	L.verboseFilter = (VerboseLevel.LEVEL | VerboseLevel.LINE | VerboseLevel.FUNCTION);
	L.log('-- AppJS Start --', '@app');

	var appConfig = new AppConfig();
	var settingsEl = Doc.getElementById('settingsSection');
	var mainViewEl = Doc.getElementById('mainViewSection');

	var settingsManager = new SettingsManager(settingsEl);
	settingsManager.addEventListener('settingsReadyEvent', function($evt){
		//Manage Views
		settingsManager.exit();
		settingsManager.destroy();
		settingsManager = null;

		//Set up server
		var sm = new ServerManager();
		var cm = new ClientManager(sm);
		var clientList = new ClientListManager(cm);

		//Views
		var mainView = new MainView(mainViewEl);
		mainView.enter();

		//Wait for connections
		sm.init(appConfig.SOCKET_IP, appConfig.SOCKET_PORT);
	});

	L.log('-- AppJS End --',  '@main');

});