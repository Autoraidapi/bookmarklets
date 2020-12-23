define(['backbone', 'views/view'], function (Backbone) {

	var Container = Backbone.View.extend({
		
		el: $("#main"),
		
		initialize: function () {
			this.$developer = new DeveloperView();
			this.$links = new LinksView();
			this.$media = new MediaView();
			this.$layout = new LayoutView();
			this.listenTo(Bookmarklets, 'reset', this.refresh);
			this.listenTo(Bookmarklets, 'all', _.debounce(this.render, 0));
		},
		
		// render lists from the wrapping instance of this constructor
		render : function(){
		
		},
		
		refresh : function(){
		
		}

	});

	return Container;

});
