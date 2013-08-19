Package.describe({
	summary: "The External File Loader package helps easily load external js, css and html files dynamically."
});

Package.on_use(function (api) {
	api.use('jquery', 'client');
	api.use('underscore', 'client');
	api.use('templating', 'client');
	api.add_files([
		'lib/external-file-loader.js'
		],
		'client');
	});

Package.on_test(function (api) {
	api.use('external-file-loader', 'client');
	api.use('tinytest', 'client');
	api.use('test-helpers', 'client');
	api.add_files([
		'test/external-file-loader-test.js'
	], 'client');
});
