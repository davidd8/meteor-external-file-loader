// external-file-loader-test.js

Tinytest.add('loadJs Simple Test', function(test) {
	Meteor.Loader.resetUrls();
	test.equal(Meteor.Loader.loadedUrls, {});

	var url = 'testUrl';
	test.isFalse(Meteor.Loader.loaded(url));

	Meteor.Loader.loadJs(url);

	test.isFalse(Meteor.Loader.loaded(url));

	Meteor.Loader.loadedUrls[url] = true;

	test.isFalse(Meteor.Loader.loadJs(url));
});

Tinytest.addAsync('loadJs Real Test', function(test, expect) {
	Meteor.Loader.resetUrls();
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

Tinytest.addAsync('crossdomain loadJs with promises', function(test, expect) {
	Meteor.Loader.resetUrls();
	// test non-existing cross-domain url
	var fakeUrl = "http://this.url.wont/point/to/anything123.js";
	test.isFalse(Meteor.Loader.loaded(fakeUrl));
	var notCalled = function() {
		test.isTrue(false);
		expect();
	};
	var called = function(status) {
		test.equal(status.statusText, "Timeout error: The script was not found or took too long to load.");
		test.isTrue(true);
		expect();
	};
	Meteor.Loader.loadJs(fakeUrl, 2000).fail(called).done(notCalled);
});

Tinytest.addAsync('local loadJs with promises', function(test, expect) {
	Meteor.Loader.resetUrls();
	// test non-existing cross-domain url
	var fakeUrl = "anything123.js";
	test.isFalse(Meteor.Loader.loaded(fakeUrl));
	var notCalled = function() {
		test.isTrue(false);
		expect();
	};
	var called = function() {
		test.isTrue(true);
		expect();
	};
	Meteor.Loader.loadJs(fakeUrl).fail(called).done(notCalled);
});

Tinytest.add('loadCss Simple Test', function(test) {
	Meteor.Loader.resetUrls();
	test.equal(Meteor.Loader.loadedUrls, {});

	var url = 'testUrl';
	test.isFalse(Meteor.Loader.loaded(url));

	Meteor.Loader.loadCss(url);

	test.isTrue(Meteor.Loader.loaded(url));
	test.isFalse(Meteor.Loader.loadCss(url));
});

Tinytest.add('loadHtml Real Test', function(test) {
	Meteor.Loader.ajax = function(opts) {
		opts.success('<div>Test</div>');
	};

	var tpl = Meteor.Loader.loadHtml('/test/testhtml','test_tpl');

	test.isTrue(Template['test_tpl']);
	test.equal(Template['test_tpl'](), '<div>Test</div>');
	test.equal(Template['test_tpl'], Meteor.Loader.loadHtml('/test/testhtml','test_tpl'));
});
