(function(cors){
	
	const Section = Backbone.View.extend({
		
		template : _.template($('#section').html()),

		render : function(src,ext){
			this.$el.html(this.template({
				src: src, ext : ext 
			}));
			return this;
		}
		
	});
	
	const Container = Backbone.View.extend({	
		
		el: $('#main'),
		

		
		initialize : function(){
			this.$article = this.$('article');
		},
		
		reset : function(){
			this.$article.html('');
			
		},
		
		search : function(src,ext){		
			var view = new Section();	
			this.$article.html(view.render(src, ext).el);
		}	
		
	});
	
	const Router = Backbone.Router.extend({
		routes : {	
			'':'home',		
			'search(/:src)(/:ext)':'search'
		},
		home : function(){	
			cors.container.reset();		
		},
		search:function(src,ext){					
			cors.container.search(src,ext);							
		}
	});
		
	cors.container = new Container();	
	cors.router = new Router();
		
	Backbone.history.start();

})({});