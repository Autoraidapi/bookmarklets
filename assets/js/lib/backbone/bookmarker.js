(function () {

	console.clear();

	var BookmarkModel = Backbone.Model.extend({
		sync: Backbone.localforage.sync("backbone-bookmark"),
		defaults: function () {
			return {
				title: "",
				uri: "",
				order: Bookmarks.nextOrder()
			}
		},
	});

	var Base = Backbone.Collection.extend({
		import: function (json) {
			var self = this;
			json.forEach(function (obj) {
				return self.create(obj);
			});
		},
		export: function () {
			var data = JSON.stringify(this.toJSON(), null, 2);
			var blob = new Blob([data], { type: "application/json" });
			this.url = window.URL.createObjectURL(blob);
			this.anchor = document.createElement("a");
			this.anchor.href = this.url;
			this.anchor.download = "export-" + Date.now() + ".json";
			this.anchor.click();
			URL.revokeObjectURL(this.url);
			delete this.url;
			delete this.anchor;
		}
	});

	var BookmarkCollection = Base.extend({
		sync: Backbone.localforage.sync("backbone-bookmarks"),
		model: BookmarkModel,
		comparator: "order",
		nextOrder: function () {
			return this.length ? this.last().get("order") + 1 : 1;
		},
		drop: function () {
			while (this.models.length) {
				this.models[0].destroy();
			}
		}
	});

	window.Bookmarks = new BookmarkCollection();

	window.templates = {		
		bookmark: _.template(
			'<td><a class="text-muted"><%- order %></a></td>'+
			'<td><a class="text-primary" target="_blank" href="<%- uri %>"><%- title %></a></td>' +
				"<td>" +
				'<a class="read text-info">R</a>' +
				"<span> | </span>" +
				'<a class="top text-muted" target="_blank" href="<%- uri %>">B</a>' +
				"<span> | </span>" +
				'<a class="update text-warning" target="_self" href="<%- uri %>">U</a>' +
				"<span> | </span>" +
				'<a class="text-danger destroy">X</a>' +
				"</td>"
		)
	};

	var BookmarkItem = Backbone.View.extend({
		tagName: "tr",
		className: "",
		template: templates.bookmark,
		events: {
			"click .read": "read",
			"click .update": "beginUpdate",
			"click .destroy": "clear"
		},
		initialize: function () {
			this.listenTo(this.model, "change", this.render);
			this.listenTo(this.model, "destroy", this.remove);
		},
		render: function () {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},
		read: function (event) {
			event.stopPropagation();
			alert(JSON.stringify(this.model.toJSON(), null, 2));
		},
		clear: function () {
			this.model.destroy();
		},
		beginUpdate: function (event) {
			console.log(this.model.toJSON());
			return;
		},
		cancelUpdate: function () {},
		commitUpdate: function () {}
	});

	var Container = Backbone.View.extend({
		el: $(document.documentElement),

		events: {
			"submit form": "handler",
			"click .toggle-button": "click"
		},

		statsTemplate: _.template($("#stats-template").html()),

		initialize: function () {
			this.$form = this.$(".form");
			this.$uri = this.$("#uri");
			this.$name = this.$("#name");
			this.$context = this.$(".context");

			this.$table = this.$(".table");

			this.$bookmarks = this.$("#bookmarks");

			this.$footer = this.$("footer");

			this.listenTo(Bookmarks, "add", this.addOne);
			this.listenTo(Bookmarks, "reset", this.addAll);
			this.listenTo(Bookmarks, "all", _.debounce(this.render, 0));

			Bookmarks.fetch({ reset : true });
		},

		render: function () {
			this.$footer.html(
				this.statsTemplate({
					length: Bookmarks.length
				})
			);
		},

		addOne: function (item) {
			var bookmark = new BookmarkItem({ model: item });
			this.$bookmarks.append(bookmark.render().el);
		},

		addAll: function () {
			this.$bookmarks.html("");
			Bookmarks.each(this.addOne, this);
		},

		newAttributes: function () {
			return {
				title: this.$name.val(),
				uri: this.$uri.val(),
				order: Bookmarks.nextOrder(),
			};
		},

		handler: function (event) {
			event.preventDefault();
			event.stopPropagation();
			Bookmarks.create(this.newAttributes());
			event.target.reset();
		}
	});

	var Router = Backbone.Router.extend({
		
		preinitialize: function () {
			this.container = new Container();
		},
		
		routes: {
			"": "home",
			form: "form",
			export: "export"
		},
		
		initialize: function () {
			Backbone.history.start();
		},
		
		form: function () {
			this.container.$table.hide();
			this.container.$form.show();
		},
		
		home: function () {
			this.container.$form.hide();
			this.container.$table.show();
		},
		
		export: function () {
			Bookmarks.export();
		}
		
	});

	var DRouter = Backbone.Router.extend({
		preinitialize : function(){
			this.router = new Router();
		}
	});

	window.router = new DRouter();
	
})();