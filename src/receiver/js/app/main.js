//TODO: Main TODO List
/*
* Set up the main window to give some control over the clients
* 	List clients, both connected and disconnected
* 	button to disconnect a client
* 	button to switch to that client's 'window'
* 	button to save to a file
*
* Proper adding of log entries, I highly doubt a text area is the best way
* Log entry parsing for color coding
* fancy object beautifier? or some way to see objects, maybe not inline?
*/

require.config({
	baseUrl: './js',
	paths: {
		json2:'libs/json2',
		http:'libs/http',
		plugins:'libs/plugins',
		sha1:'libs/sha1'
	},
	shim: {
		json2: {
			exports: 'JSON'
		},
		http: {
			exports:'http',
			deps:['sha1']
		}
	}
});
require(['app/app']);