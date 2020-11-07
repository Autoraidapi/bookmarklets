const Container = Backbone.View.extend({
    el: $("#main"),
    child: null,
	initialize: function() {
		this.$header = this.$("header");
		this.$article = this.$("article");
		this.$footer = this.$("footer");
    },
	render: function() {
		this.$article.html(this.child.$el);		
		return this;
	}
});