define(['backbone','models/bookmark'], function (Backbone, Bookmark) {

    var Bookmarks = Backbone.Collection.extend({
        model : Bookmark,
        comparator : 'order',
        export : function(){
            
            var json = JSON.stringify(this.toJSON(), null, 2);
            var object = window.URL.createObjectURL(
              new Blob(
                [json], {type : 'application/octet-stream'}
              )
            );
            
            this.anchor = document.createElement('a');        
            this.anchor.setAttribute('href', object);
            this.anchor.setAttribute('download', prompt());    
            this.anchor.click();
            
            URL.revokeObjectURL(object);
            
            delete this.anchor;
        }
    });

    return Bookmarks;

});
