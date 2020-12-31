define(['backbone', 'views/view'], function (Backbone, Bookmark) {

	var Container = Backbone.View.extend({
		
		el: $(document.documentElement),

		initialize: function () {
			this.$article = this.$('article');
			this.listenTo(this.collection, 'add', this.addOne);
			this.listenTo(this.collection, 'reset', this.addAll);
			this.listenTo(this.collection, 'all', _.debounce(this.render, 0));
		},
		
		// render lists from the wrapping instance of this constructor
		render : function(){
		
		},
		
		refresh : function(){
		
		},

		addOne : function(model){
			var view = new Bookmark({model:model});
			this.$article.append(view.render().el);
		},

		addAll : function(){
			this.$article.html('');
			this.collection.each(this.addOne, this);
		},
		passAttributes : function(){
			return {
				order : this.collection.nextOrder()
			}
		},
		create: function () {
			this.collection.create(this.passAttributes());
		}		

	});

	return Container;

});
