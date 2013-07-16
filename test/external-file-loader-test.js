// external-file-loader-test.js

Tinytest.add('loadJs Simple Test', function(test) {
	test.equal(Meteor.Loader.loadedUrls, {});

	var url = 'testUrl';
	test.isFalse(Meteor.Loader.loaded(url));

	Meteor.Loader.loadJs(url);

	test.isFalse(Meteor.Loader.loaded(url));

	Meteor.Loader.loadedUrls[url] = true;

	test.isFalse(Meteor.Loader.loadJs(url));
});

Tinytest.addAsync('loadJs Real Test', function(test, expect) {
	// test real url
	var realUrl = "http://code.jquery.com/jquery-1.10.1.min.js";
	test.isFalse(Meteor.Loader.loaded(realUrl));
	var cb = function() {
		test.isTrue(Meteor.Loader.loaded(realUrl));
		test.isFalse(Meteor.Loader.loadJs(realUrl));
		expect();
	};
	Meteor.Loader.loadJs(realUrl, cb);
});
