define(['backbone'], function(Backbone) {
    
    var Router = Backbone.Router.extend({ 
        
        preinitialize : function(){},
    		
        routes : {        
            'find(/:group)(/:id)' : 'find'          
        },
		
        initialize : function(){}, 
        
        find : function(group, id){
        
        }
	 		
    });
    
    return Router;
});
