require.config({
	baseUrl: './js',
	paths: {
		json2:'libs/json2',
		plugins:'libs/plugins'
	},
	shim: {
		json2: {
			exports: 'JSON'
		}
	}
});
require(['app/app']);