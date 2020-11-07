define(['jquery','underscore','backbone'], function($,_,Backbone) {
    
    'use strict';
    
    const Router = Backbone.Router.extend({      
        
        routes : {
            '' : '',
            'search(/:collection)(/:model)' : 'search',
            '*filter' : 'filter'
        },

        initialize : function(){
            this.on('filter', function(){})
            Backbone.history.start();
        },

        // setup registry keys, link keys to table rows, and table columns, return the data
        search : function(collection, model){
            // key value filter
            console.log(collection, model);
        },

        filter : function(param){
            this.filter = param || '';
            // testing, when done just return, string will be used a parameter to more functionality
            return console.log(this.filter);            
        }

    });

    return Router;

});
