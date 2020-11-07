define(['jquery','underscore','backbone'],function($,_,Backbone){

    const Bookmark = Backbone.Model.extend({    
        defaults: {
            title: '',
            uri: '',
            description: '',
        }
    });

    return Bookmark;  
})
