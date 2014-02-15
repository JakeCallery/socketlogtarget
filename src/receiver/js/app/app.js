/**
 * Created with PhpStorm.
 * User: Jake
 */

define([
	'jac/logger/Logger',
	'jac/logger/ConsoleTarget'
],
	function(L,ConsoleTarget){
		L.addLogTarget(new ConsoleTarget());
		L.log('-- Logger Test --');
	});