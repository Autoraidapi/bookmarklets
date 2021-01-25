(function (window) {
	var Model = Backbone.Model.extend({
		sync: Backbone.localforage.sync("backbone-model"),
		preinitialize: function () {},
		defaults: function () {
			return {
				complete: false,
				order: router.collection.nextOrder()
			};
		},
		initialize: function () {}
	});

	var Collection = Backbone.Collection.extend({
		sync: Backbone.localforage.sync("backbone-collection"),
		model: Model,
		preinitialize: function () {},
		comparator: "order",
		nextOrder: function () {
			return this.length ? this.last().get("order") + 1 : 1;
		},
		drop: function () {
			while (this.models.length) {
				this.models[0].destroy();
			}
		},
		initialize: function () {}
	});

	var Template = Backbone.View.extend({
		preinitialize: function () {},
		template: _.template(
			"<%= obj.order %><br><%= obj.complete %><br><%= obj.id %>"
		),
		initialize: function () {
			this.listenTo(this.model, "change", this.render);
			this.listenTo(this.model, "destroy", this.remove);
			this.listenTo(this.model, "visible", this.toggleVisible);
		},
		render: function () {
			this.$el.append(this.template(this.model.toJSON()));
			this.$el.toggleClass("completed", this.model.get("completed"));
			return this;
		},
		toggleVisible: function () {
			this.$el.attr({ "aria-hidden": this.isHidden() });
			this.$el.toggleClass("hidden", this.isHidden());
		},
		isHidden: function () {
			return this.model.get("completed")
				? window.Filter === "active"
				: window.Filter === "complete";
		}
	});

	var Section = Backbone.View.extend({
		template: _.template($("#section").html()),
		render: function (src, ext) {
			this.$el.html(this.template({ src: src, ext: ext }));
			return this;
		}
	});

	var View = Backbone.View.extend({
		el: $(document.documentElement),
		preinitialize: function () {},
		initialize: function () {
			this.$main = this.$("main article");
			this.listenTo(this.collection, "add", this.addOne);
			this.listenTo(this.collection, "reset", this.addAll);
			this.listenTo(this.collection, "change:complete", this.filterOne);
			this.listenTo(this.collection, "filter", this.filterAll);
			this.listenTo(this.collection, "all", _.debounce(this.render, 0));
		},
		addOne: function (model) {
			var template = new Template({ model: todo });
			this.$main.append(template.render().el);
		},
		addAll: function () {
			this.$main.html("");
			this.collection.each(this.addOne, this);
		},
		addSection: function (src, ext) {
			var section = new Section();
			this.$main.html(section.render(src, ext).el);
		},
		filterOne: function (todo) {
			this.collection.trigger("visible");
		},
		filterAll: function () {
			this.collection.each(this.filterOne, this);
		},
		newAttributes: function () {
			return {
				order: window.collection.nextOrder(),
				complete: false
			};
		},
		create: function () {
			this.collection.create(this.newAttributes());
		}
	});

	var Router = Backbone.Router.extend({
		preinitialize: function () {
			this.collection = new Collection();
			this.view = new View({
				collection: this.collection
			});
		},
		routes: {
			"*filter": "setFilter"
		},
		setFilter: function (param) {
			window.Filter = param || "";
			this.collection.trigger("filter");
		},
		initialize: function () {
			Backbone.history.start();
		}
	});

	var Search = Backbone.Router.extend({
		routes: {
			"search(/:src)(/:ext)": "search"
		},
		search: function (src, ext) {
			window.router.view.addSection(src, ext);
		}
	});

	window.router = new Router();

	window.search = new Search();
})(window);

(function (pres) {
	var i,
		len = pres.length;

	//for(i = 0;i < len;i++){
	//	console.log(pres[i]);
	//}

	function sendToPrinter() {
		var length = pres.length;
		printer(length);
	}

	function printer(n) {
		if (n <= 0) {
			return;
		}
		n--;
		setTimeout(
			function (n) {
				printer(n);

				/* javascript */

				console.log(pres[n]);

				//for(var k in pres[n]){
				//	if (pres[n][k]){
				//		console.log(pres[n][k]);
				//	}
				//}
			},
			50,
			n
		);
	}

	sendToPrinter();
})(document.querySelectorAll("pre"));

var Model = Backbone.Model.extend({
	
	preinitialize: function () {
		
	},
	
	defaults : function(){
		return {
			connected : false
		}
	},
	
	toggle: function () {	
		this.save({		
			connected : !this.get('connected')			
		});		
	},
	
	initialize: function () {
		
	}
	
});

var model = new Model();
