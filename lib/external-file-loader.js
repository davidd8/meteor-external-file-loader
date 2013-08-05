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
		if(Template[template_name])
			return Template[template_name];
	
		var raw = '';
		if(typeof url !== "string")
			raw = url();
		else
			$.ajax({
				url:    url,
				success: function(html) {
					raw = html;
				},
				async:false
			});
			
		return Meteor._def_template(template_name, function() {
			return raw;
		})();
	},

	Loader.prototype.loaded = function(url) {
		var self = this;
		return (_.has(self.loadedUrls, url) && self.loadedUrls[url]);
	}

	// Only use this method for testing.
	Loader.prototype.resetUrls = function() {
		this.loadedUrls = {};
	}

	Meteor.Loader = new Loader();

}());