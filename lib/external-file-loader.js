// external-file-loader.js

(function() {

	var Loader = function() {
		this.loadedUrls = {};
	}

	// Callback must be of the jquery success callback form: function(data, textStatus, jqxhr)
	Loader.prototype.loadJs = function(url, callback, timeoutDelay) {
		var self = this,
			timeoutId,
			promise;

		if (typeof callback === 'number') {
			timeoutId = callback;
		} else if (typeof timeoutDelay !== 'number') {
			timeoutDelay = 5000
		}

		// Prevent duplicate URLs from being loaded.
		if (self.loaded(url)) {
			return false;
		}

		self.loadedUrls[url] = false;

		promise = $.getScript(url, function(data, textStatus, jqxhr) {
			self.loadedUrls[url] = true;
			clearTimeout(timeoutId);
			if (callback) {
				callback(data, textStatus, jqxhr);
			}
		});

		// $.getScript doesn't reject promises with cross-domain so we need a timeout
		// cf. http://stackoverflow.com/questions/1406537/handling-errors-in-jquery-getscript#answer-11741631
		timeoutId = setTimeout(function() {
			promise.abort("Timeout error: The script was not found or took too long to load.");
		}, timeoutDelay);

		return promise;
	}

	Loader.prototype.loadCss = function(url) {
		var self = this;
		// Prevent duplicate URLs from being loaded.
		if (self.loaded(url)) {
			return false;
		}

		var css = document.createElement('link');
		css.setAttribute('rel', 'stylesheet');
		css.setAttribute('type', 'text/css');
		css.setAttribute('href', url);
		document.getElementsByTagName("head")[0].appendChild(css);

		self.loadedUrls[url] = true;
	}
	
	Loader.prototype.loadHtml = function(url,template_name) {
		if(Template[template_name]) {
			return Template[template_name];
		}
	
		var raw = '';
		this.ajax({
			url:    url,
			success: function(html) {
				raw = html;
			},
			async:false
		});
			
		return Template.__define__(template_name, function() {
			return raw;
		});
	}

	Loader.prototype.loaded = function(url) {
		var self = this;
		return (_.has(self.loadedUrls, url) && self.loadedUrls[url]);
	}

	// Only use this method for testing.
	Loader.prototype.resetUrls = function() {
		this.loadedUrls = {};
	}
	
	// Override for stub during testing
	Loader.prototype.ajax = jQuery.ajax

	Meteor.Loader = new Loader();

}());