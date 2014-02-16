require.config({
	baseUrl: './js',
	paths: {
		json2:'libs/json2',
		http:'libs/http',
		plugins:'libs/plugins'
	},
	shim: {
		json2: {
			exports: 'JSON'
		},
		http: {
			exports:'http'
		}
	}
});
require(['app/app']);