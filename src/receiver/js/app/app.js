/**
 * Created with PhpStorm.
 * User: Jake
 */

define([
	'plugins/domReady!',
	'jac/logger/Logger',
	'jac/logger/ConsoleTarget',
	'jac/logger/VerboseLevel',
	'app/Receiver',
	'jac/utils/EventUtils'
],
function(Doc,L,ConsoleTarget,VerboseLevel,Receiver,EventUtils){
	L.addLogTarget(new ConsoleTarget());
	L.verboseFilter = (VerboseLevel.LEVEL | VerboseLevel.LINE | VerboseLevel.FUNCTION);
	L.log('--  AppJS Start --', '@app');

	var receiver = null;

	var okButton = Doc.getElementById('settingsOKButton');

	EventUtils.addDomListener(okButton, 'click', function($evt){
		receiver = new Receiver();
	});


	L.log('-- AppJS End --',  '@main');

});