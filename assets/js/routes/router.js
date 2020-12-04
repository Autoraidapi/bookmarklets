define(['backbone','collections/bookmarks', 'views/container'], function(Backbone, Bookmarks, Container) {
    
    const Router = Backbone.Router.extend({      
        
        initialize : function(){

            this.bookmarks = new Bookmarks();

            Backbone.history.start();
        }

    });

    return Router;

});
