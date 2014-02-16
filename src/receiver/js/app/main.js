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