/**
 * Created with PhpStorm.
 * User: Jake
 */

define([
	'jac/logger/Logger',
	'jac/logger/ConsoleTarget',
	'jac/logger/VerboseLevel',
	'jac/logger/SocketTarget',
	'app/MainView'
],
	function(L,ConsoleTarget,VerboseLevel,SocketTarget,MainView){

		L.addLogTarget(new ConsoleTarget());
		L.verboseFilter = VerboseLevel.ALL;
		L.log('-- AppJS Start --', '@app');

		var mainView = new MainView();

		if(SocketTarget.canUseWebSockets()){
			L.log('Adding Socket Target', '@app');
			L.addLogTarget(new SocketTarget('ws://localhost:9999', 'My Test Client', true));
		} else {
			L.warn('Could not add Socket Target', '@app');
		}

		var testObj = {
			sweet:"stuff",
			num:37
		};

		L.log('-- AppJS End --');
		L.log('-- Another test--');

	});