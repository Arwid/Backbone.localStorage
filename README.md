# Additions in this fork

This adapter is now unobstructive which means it is no longer a drop in replacement. You have to include the following line in your code:

    Backbone.sync = Backbone.syncLocal;

This adapter also includes the ability to save to and from the database so we have offline with online synchronization. For example, after creating your collection:

     SomeCollection.localStorage.loadFromDB(SomeCollection.url) // can optionally include success and error handlers
     SomeCollection.localStorage.saveToDB(SomeCollection.url) // can optionally include success and error handlers

# Backbone.localStorage

Quite simply a localStorage adapter for Backbone. It's a drop-in replacement for Backbone.Sync() to handle saving to a localStorage database.

## Usage

Include Backbone.localStorage after having included Backbone.js:

    <script type="text/javascript" src="backbone.js"></script>
    <script type="text/javascript" src="backbone.localStorage.js"></script>

Create your collections like so:

    window.SomeCollection = Backbone.Collection.extend({
      
      localStorage: new Store("SomeCollection"), // Unique name within your app.
      
      // ... everything else is normal.
      
    });
  
Feel free to use Backbone as you usually would, this is a drop-in replacement.

## Credits

Thanks a lot to Jeremy Ashkenas who refactored pretty much the whole code.
