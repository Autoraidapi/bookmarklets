define(['backbone'],function(Backbone){

    const Bookmark = Backbone.Model.extend({        
        
        defaults: {
            title: '',
            uri: '',
            source : '',            
            description: ''
        }

    });

    return Bookmark;

});
