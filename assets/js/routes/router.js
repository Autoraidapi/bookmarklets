define(['backbone'], function(Backbone) {

    var Router = Backbone.Router.extend({      

        preintialize : function(){
            
        },
        
        initialize : function(){
            Backbone.history.start();
        }

    });
    return Router;
});
