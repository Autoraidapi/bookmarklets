const Model = Backbone.Model.extend({	
	defaults : function() {
		return {
			title: "",
			uri : ""
		}
	},		
	sync : Backbone.localforage.sync("model-backbone")	
});

const Collection = Backbone.Collection.extend({	
	model : Model,	
	sync : Backbone.localforage.sync("collection-backbone"),		
	/* utils like this might be better off grouped together in a separate router */
	export: function() {
		const data = JSON.stringify(this.toJSON(), null, 2);
		const blob = new Blob([data], { type: "application/json" });
		const url = window.URL.createObjectURL(blob);
		const fragment = new DocumentFragment();
		const anchor = document.createElement("a");
		anchor.href = url;
		anchor.download = "export-" + Date.now() + ".json";
		fragment.appendChild(anchor);
		anchor.click();
		fragment.removeChild(anchor);
	},	
	import: function(json) {
		var self = this;
		json.forEach(function(obj) {
			return self.create(obj);
		});
	}	
});

const Sync = Backbone.Collection.extend({
	initialize : function(){ 
		this.fetch(); 
		return this; 
	}
});