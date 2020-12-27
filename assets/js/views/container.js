define(['backbone', 'views/view'], function (Backbone, View) {
	
	var Header = Backbone.View.extend({
		events : {
			'click .btn' : 'handle'
		},
		handle : function(event){
			
		}
	});
	
	var Container = Backbone.View.extend({
		
		el: $(document.documentElement),
		
		initialize: function () {
			
			this.Header = new Header();
			
			this.Developer = new View({ });
			this.Links = new View();
			this.Media = new View();
			this.Layout = new View();
			
			this.listenTo(Bookmarklets, 'reset', this.refresh);
			this.listenTo(Bookmarklets, 'all', _.debounce(this.render, 0));
		},
		
		render : function(){
			return this;
		},
		
		refresh : function(){
			
		}

	});

	return Container;

});
