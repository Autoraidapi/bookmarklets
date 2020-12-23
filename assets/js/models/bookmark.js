define(['backbone'],function(Backbone){

    var Bookmark = Backbone.Model.extend({                
        defaults: function(){
            return {
                order : Bookmarklets.next(),
                title: '',
                uri: '',
                permalink : '',
                description: ''                
            }
            
        }
    });

    return Bookmark;

});
