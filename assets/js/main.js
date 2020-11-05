const Bookmark = Backbone.Model.extend({
    defaults: {
        title: '',
        uri: '',
        description: '',
    }
});
//sync : Backbone.localforage.sync("index")
const Collection = Backbone.Collection.extend({
    initialize : function(){ 
        this.fetch(); 
    }
});

const Index = Collection.extend({ url : '/assets/json/index.json' });

const Dev = Collection.extend({ url : '/assets/json/developer.json' });

const View = Backbone.View.extend({
    el : $('#tbody'),

    tagName : 'tr',
    template : _.template(
        '<td><a href="<%= obj.uri %>"><%= obj.title %></a><p><%= obj.description %></p></td><td></td><td></td>'
    ),
    initialize : function(){
        this.row = document.createElement('tr');
        this.row.innerHTML = this.template(this.model.toJSON());
        this.render();
    },
    render : function(){        
        this.$el.append(this.row);
        return this;
    }
})

const Container = Backbone.View.extend({
    el: $("#main"),
    child: null,
	initialize: function() {
		this.$header = this.$("header");
		this.$article = this.$("article");
		this.$footer = this.$("footer");
    },
	render: function() {
		this.$article.append(this.child.$el);		
		return this;
	}
});

const Router = Backbone.Router.extend({  
    routes : {
        'parse(/:bookmark)':'parse'
    },   
    initialize : function(){
        this.container = new Container();
    },
    parse : function(bookmark){
        this.view = new View({ model : new Bookmark(bookmark) });
        this.view.render();
    }
});

// data for initial page load
const index = new Index();


const app = new Router();
Backbone.history.start();