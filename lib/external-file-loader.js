// external-file-loader.js

(function() {

	var Loader = function() {
		this.loadedUrls = {};
	}

	// Callback must be of the jquery success callback form: function(data, textStatus, jqxhr)
	Loader.prototype.loadJs = function(url, callback) {
		var self = this;

		// Prevent duplicate URLs from being loaded.
		if (self.loaded(url)) {
			return false;
		}

		self.loadedUrls[url] = false;

		$.getScript(url, function(data, textStatus, jqxhr) {
			self.loadedUrls[url] = true;
			if (callback) {
				callback(data, textStatus, jqxhr);
			}
		});
	}

	Loader.prototype.loaded = function(url) {
		var self = this;
		return (_.has(self.loadedUrls, url) && self.loadedUrls[url]);
	}

	Meteor.Loader = new Loader();

}());