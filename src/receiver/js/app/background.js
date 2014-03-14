/**
 * Created by Jake on 2/15/14.
 */
chrome.app.runtime.onLaunched.addListener(function() {
	chrome.app.window.create('receiver.html', {
		'bounds': {
			'width': 800,
			'height': 600
		}
	});
});