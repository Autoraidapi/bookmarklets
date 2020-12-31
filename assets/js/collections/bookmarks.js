define(['backbone','assets/js/models/model'], function (Backbone,Bookmark) {

    var Bookmarks = Backbone.Collection.extend({
      model : Bookmark,
      nextOrder: function () {
        return this.length ? this.last().get('order') + 1 : 1;
      },
      comparator: 'order'
    });
  
    return Bookmarks;

});
