/**
 * Created with PhpStorm.
 * User: Jake
 */

define([
	'jac/logger/Logger',
	'jac/logger/ConsoleTarget',
	'http'
],
	function(L,ConsoleTarget,http){
		L.addLogTarget(new ConsoleTarget());
		L.log('-- Logger Test --', '@main');

		var server = new http.Server();

		L.log('Server', server, '@main');

	});