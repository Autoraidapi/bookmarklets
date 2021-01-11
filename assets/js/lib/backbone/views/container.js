define(['backbone', 'views/view'], function (Backbone, View) {
		
	var Container = Backbone.View.extend({
		
		el: $(document.documentElement),

		// todo : render to fragment, then inject fragment to a cached dom node
		fragment : new DocumentFragment(),
		
		initialize: function () {

			this.listenTo(this.collection, 'add', this.addOne);
			this.listenTo(this.collection, 'reset', this.addAll);
			
			this.listenTo(this.collection, 'all', _.debounce(this.render, 0));
		},
		
		render : function(){
			return this;
		},
		addOne : function(model){
			var view = new View({model:model});
			// render single item
		},
		addAll : function(){
			// render all items 
			this.collection.each(this.addOne, this);
		}

	});

	return Container;

});
