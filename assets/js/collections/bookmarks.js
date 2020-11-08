define(['jquery', 'underscore', 'backbone'], function ($, _, Backbone) {

    const Bookmarks = Backbone.Collection.extend({

        // primitive object to populate extended collections 
        model: Bookmark,

        // new instances, fetch models from json
        initialize: function () {
            this.fetch();
        },

        // remove methods and return data
        serialize: function () {
            return JSON.stringify(this.toJSON());
        }

    });

    return Bookmarks;

    /* 
        data is populated from individual json files
        Backbones sync abstracts the fetch using jQuery AJAX,
        promise like chaining is available to the method that returns this data
        
        the response will be an array of objects, 
        
        each objects key value pairs populate a new instance of model within the collection
        
        each model and the collection itself are equipped with a toJSON method which return a more sanitized javascript object

        to serialize this into data use JSON.stringify(toJSON()) with optional formatting parameters
        
        Example Chaining : 
        
        const buffer = [];

        $.getJSON('https://assets.codepen.io/1674766/quotes.json', function(data){
	        buffer.push(data);
        })
        .then(function(){
	        console.log(buffer[0].length);
        })
        .then(function(){
	        console.log(buffer[0][0])
        })
        .then(function(){
	        console.log(buffer[0][1])
        })
        .then(function(){
	        console.log(buffer[0][2])
        });
        
    */
    
    const DeveloperBookmarks = Bookmarks.extend({
        // point to the location of this collections json data
        url: 'assets/json/developer.json'
    });

});
