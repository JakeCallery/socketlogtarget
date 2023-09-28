/**
 * Created by Jake on 2/15/14.
 */
chrome.app.runtime.onLaunched.addListener(function() {
	chrome.app.window.create('receiver.html', {
		'bounds': {
			'width': 600,
			'height': 600
		},
		'minWidth': 300,
		'minHeight': 300,
		'id': 'main-window'
	});
});