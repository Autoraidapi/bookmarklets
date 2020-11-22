define(['jquery', 'underscore', 'backbone'], function ($, _, Backbone) {

    const Bookmarks = Backbone.Collection.extend({
        model: Bookmark,
        initialize: function () {
            this.fetch();
        },
        serialize: function () {
            return JSON.stringify(this.toJSON());
        }
    });

    return Bookmarks;

});
