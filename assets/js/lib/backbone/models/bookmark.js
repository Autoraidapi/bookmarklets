define(['backbone'],function(Backbone){
    
    var Bookmark = Backbone.Model.extend({                
        defaults: function(){
            return {
                title: '',
                uri: '',
                order : app.collection.nextOrder(),
                permalink : '',
                description: ''   
            }            
        }
    });

    return Bookmark;

});
