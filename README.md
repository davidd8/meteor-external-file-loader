# meteor-external-file-loader [![Build Status](https://travis-ci.org/davidd8/meteor-external-file-loader.png?branch=master)](https://travis-ci.org/davidd8/meteor-external-file-loader)

The external file loader package makes it easy to load external js and css files dynamically within Meteor.

Whereas non-Meteor web applications can simply add a `<script>` tag to their html header template, Meteor cannot. Adding third-party javascript code to meteor apps is a bit [cumbersome](http://stackoverflow.com/questions/14197398/how-to-include-javascript-from-a-cdn-in-meteor). The fact that the `<head>` portion of meteor templates is not your normal html `<head>` for a web page further complicates the matter. 

This package aims to make it easier.

## Installation

``` sh
$ mrt add external-file-loader
```
**Dependencies**: meteorite, jquery meteor smart package

## Usage

1. Pick a third-party js library to add to your application.
2. Load the library in the template that you'll use it in.
3. Use the library once it's been loaded.

### Script Example

Using [stripe.js](https://js.stripe.com/v2/) as the example. We'll load it into the billing template, and charge people money.

``` javascript
var chargeRandomPerson = function() {
  // Do something here with the stripe api.
};

Template.billing.created = function() {
  Meteor.Loader.loadJs("//js.stripe.com/v2/", chargeRandomPerson);
};
```

The method returns a [jQuery promise](http://api.jquery.com/deferred.promise/), for easy error handling in case the script cannot be loaded.

The request times out after a while in case the script cannot be found. The default is 5000ms, but is customizable:

``` javascript
// These 2 calls are equivalent, and set a 10s timeout
Meteor.Loader.loadJs("//www.google.com/jsapi", sucessCallback, 10000).fail(retryMessageCallback)
Meteor.Loader.loadJs("//www.google.com/jsapi", 10000).fail(retryMessageCallback).done(successCallback);
```

### HTML Examples

Our example plain HTML fragment `fragment.html`, assumed to be served in these examples as static content under `public`.

``` html
<div>I'm text, with a <button>button</button>.</div>
```

Here's loading our external HTML fragment via a Handlebars helper.

``` javascript
Handlebars.registerHelper('loadHtml', function() {
	var template = Meteor.Loader.loadHtml('/fragment.html','new_template_name');
	
	// here we're passing the current data context of the parent template to our fragment
	return template(this);
});
```

Here's loading the same fragment and inserting into the DOM manually.

``` javascript
Meteor.startup(function() { // dom is ready
	var fragment = Meteor.render(function() {
		var tpl = Meteor.Loader.loadHtml('/fragment.html','new_template_name');
		
		// catch an event this time
		tpl.events({
			'click button': function() {
				console.log('hello!');
			}
		});
		
		return tpl();
	});
	
	$('#inserthere').html(fragment);
});
```

### Methods

 - `loadJs(url, callback, timeoutDelay)` - Load external JS from a url. Callback is called once the url has been loaded. TimeoutDelay is the delay before timeout, in ms. Callback and timeoutDelay are optional. The method returns a [jQuery promise](http://api.jquery.com/deferred.promise/).

 - `loadCss(url)` - Load external CSS from a url.
 
 - `loadHtml(url, template_name)` - Load external HTML file from URL and instantiate as template. Returns the template object that's also under the Template namespace (`Template['template_name']`). Handlebar expressions won't work when loading HTML this way.
 
## Contributing

To run the tests:

``` sh
$ mrt test-packages external-file-loader
```

