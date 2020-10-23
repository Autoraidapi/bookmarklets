const Model = Backbone.Model.extend();

const Sync = Backbone.Collection.extend({
	model : Model,
	initialize : function(){ this.fetch(); }
});

const Developer = Sync.extend({ url : 'assets/json/developer.json' });
const Link = Sync.extend({ url : 'assets/json/link.json' });
const Layout = Sync.extend({ url : 'assets/json/layout.json' });
const Media = Sync.extend({ url : 'assets/json/media.json' });


const View = Backbone.View.extend({
	template : _.template(
		'<% _.each(function(){%>' +

		'<% }) %>'
	),
	initialize : function(){},
	render : function(){
		this.template(this.colle.toJSON());
	}
})

