/**
 * Created with PhpStorm.
 * User: Jake
 */

//TODO: Main todo list
/*
* Object dumper
* 	if one of the passed in args is an object, break that down and send as JSON?
*
* Reconnection handling?  Might not really be needed, and might be annoying
* Remove console.logs from SocketTarget :)
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
			//L.addLogTarget(new SocketTarget('ws://192.168.1.95:9999', 'My Test Client', true));
		} else {
			L.warn('Could not add Socket Target', '@app');
		}

		L.log('-- AppJS End --');

	});