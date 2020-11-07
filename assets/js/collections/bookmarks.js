
const Bookmarks = Backbone.Collection.extend({

    // primitive object to populate extended collections 
    model : Bookmark,    

    // new instances, fetch models from json
    initialize : function(){
        this.fetch();
    },

    // remove methods and return data
    serialize : function(){
        return JSON.stringify(this.toJSON());
    }

});

const ExtendedBookmarks = Bookmarks.extend({

});

const DeveloperBookmarks = Bookmarks.extend({
        // point to the location of this collections json data
        url : 'assets/json/developer.json'
});
