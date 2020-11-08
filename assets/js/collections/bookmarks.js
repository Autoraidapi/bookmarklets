define(['jquery', 'underscore', 'backbone'], function ($, _, Backbone) {

    const Bookmarks = Backbone.Collection.extend({

        // primitive object to populate extended collections 
        model: Bookmark,

        // new instances, fetch models from json
        initialize: function () {
            this.fetch();
        },

        // remove methods and return data
        serialize: function () {
            return JSON.stringify(this.toJSON());
        }

    });

    return Bookmarks;

    /* 
        data is populated from individual json files
        Backbones sync abstracts the fetch using jQuery AJAX,
        promise like chaining is available to the method that returns this data
    */
    const DeveloperBookmarks = Bookmarks.extend({
        // point to the location of this collections json data
        url: 'assets/json/developer.json'
    });

});