define(['backbone','models/bookmark'], function (Backbone, Bookmark) {

    const Bookmarks = Backbone.Collection.extend({

        model : Bookmark

    });

    return Bookmarks;

});
