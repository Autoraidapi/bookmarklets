(function(){
	
	const Model = Backbone.Model.extend({
		defaults : {
			data : []
		}
	});
	
	const View = Backbone.View.extend({
		el : $('#tablebody'),
		template : _.template('\
			<% _.each(this.model.get(\'data\'), function(obj, index, data) { %>\
			   <tr><td><a href="<%= obj.uri %>"><%= obj.title %></a><p><%= obj.description %></p></td><td></td><td></td></tr>\
			<% }); %>'
		),
		initialize : function(){		  	  
			this.render();	
		},
		render : function(){
		  this.$el.html(this.template());
		  return this;
		}
	});
	
	function initialize(url){
		const request = new XMLHttpRequest();
		request.open('GET', url, true);
		request.responseType = 'text';
		request.onload = function(){
			populate(request.response);
		}
		request.send(null);
		function populate(json){
			new View({
				model : new Model({
					data : JSON.parse(json).children
				})
			});
		}
	}

	if(typeof window !== 'undefined'){
		window.initialize = initialize;
	}

})();


