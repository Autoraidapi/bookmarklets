
(function(){

    const App = {

        Models : {
            Bookmark : Backbone.Model.extend({
                defaults : {
                    title : '',
                    uri : '',
                    source : '',
                    description : ''
                }
            })
        },
    
        Collections : {
            Bookmarks : Backbone.Collection.extend({
                model : App.Models.Bookmark,
                initialize : function(){
                    this.fetch();
                },
                export : function(){},
                import : function(){}
            }),
            Developer : App.Collections.Bookmarks.extend({
                url : 'assets/json/developer.json'
            }),
            Layout : App.Collections.Bookmarks.extend({
                url : 'assets/json/layout.json'
            })            
        },
    
        Views : {
    
            View : Backbone.View.extend({
                template : _.template('')
            }),
    
            Container : Backbone.View.extend({
                el : $('#main')
            })
    
        },
    
        Router : Backbone.Router.extend({
            initialize : function(){
                this.collection = new App.Collections.Bookmarks();
                this.container = new App.Views.Container();
            }
        })
    
    };
   
    if(typeof window !== 'undefined'){
        window.app = new App.Router();
        Backbone.history.start();
    }
    
})();

function Data(){
    this.initialize.apply(this, arguments);
}

Data.prototype = {
    constructor : Data,
    initialize : function(collections){
        this.collections = (collections || {});
    }
};

function Main(){

    this.initialize.apply(this, arguments);

    this.data = new Data({
        developer : new DeveloperBookmarks()
    });
    
    this.router = new Router();
    Backbone.history.start();

}

_.extend(Main.prototype, Backbone.Events, {
    constructor : Main,
    initialize : function(){
        this.on('message', function(message){
            return message;
        });
        return this;
    }
});
