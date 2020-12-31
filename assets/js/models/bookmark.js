define(['backbone'],function(Backbone){
    
    var Bookmark = Backbone.Model.extend({                
        defaults: function(){
            return {
                title: '',
                uri: '',
                order : Bookmarklets.next(),
                permalink : '',
                description: ''   
            }            
        }
    });

    return Bookmark;

});
