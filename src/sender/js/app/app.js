/**
 * Created with PhpStorm.
 * User: Jake
 */

define([
	'jac/logger/Logger',
	'jac/logger/ConsoleTarget',
	'jac/logger/VerboseLevel',
	'jac/logger/SocketTarget'
],
	function(L,ConsoleTarget,VerboseLevel,SocketTarget){

		L.addLogTarget(new ConsoleTarget());
		L.verboseFilter = VerboseLevel.ALL;
		L.log('-- AppJS Start --', '@app');

		if(SocketTarget.canUseWebSockets()){
			L.log('Adding Socket Target', '@app');
			L.addLogTarget(new SocketTarget('ws://localhost:9999', 'My Test CLient', true));
		} else {
			L.warn('Could not add Socket Target', '@app');
		}


		L.log('-- AppJS End --');

	});