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

        search : function(collection, model){
            console.log(collection, model);
        },

        filter : function(param){
            this.filter = param || '';
            return console.log(this.filter);            
        }

    });

    return Router;

});