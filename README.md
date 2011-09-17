# Backbone localStorage Adapter LocalStore adds *localStorage*-based persistence to a Backbone collection Dependencies: Underscore.js, (Backbone.js is not a hard dependency) ## Usage Include Backbone.localStorage after having included Backbone.js: <script type="text/javascript" src="backbone.js"></script> <script type="text/javascript" src="backbone.localStorage.js"></script> Create your collections like so: window.SomeCollection = Backbone.Collection.extend({ initialize: function() { new Store(this, "SomeCollection"); // Unique name within your app. } // ... everything else is normal. }); Feel free to use Backbone as you usually would, this is a drop-in replacement.