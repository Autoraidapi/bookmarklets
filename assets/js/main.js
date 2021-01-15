/*
define([
    'assets/js/collection/collection',
    'assets/js/views/container',
    'assets/js/routes/router'
], function(Collection, Container, Router) {  
    'use strict';
    function Main(){
        this.collection = new Collection();
        this.container = new Container({ collection : this.collection });
        this.router = new Router();
    };
    return Main;
});
*/

(function(){

    var Model = Backbone.Model.extend({
        sync : Backbone.localforage.sync('backbone-bookmarklet'),
        defaults : function(){
            return {
                title : '',
                hidden : false
            }
        },
		toggle: function () {
			this.save({
				hidden : !this.get('hidden')
			});
		}        
    });

    var Collection = Backbone.Collection.extend({
        model : Model,
        sync : Backbone.localforage.sync('backbone-bookmarklets'),
		hidden : function () {
			return this.where({ hidden : true});
		},
		shown : function () {
			return this.where({ hidden : false});
        },   
		nextOrder: function () {
			return this.length ? this.last().get('order') + 1 : 1;
		},
		comparator: 'order',
		clear : function(){
			while(this.models.length){
				this.models[0].destroy();
			}
		}             
    })

    var View = Backbone.View.extend({
        tagName : 'section',
        className : 'jumbotron p-3',
        template : _.template($('#bookmarklet').html()),
        initialize:function(){
            this.listenTo(this.model,'change', this.render);
            this.listenTo(this.model,'destroy', this.remove);
        },
        render : function(){
            this.$el.append(this.template(this.model.toJSON()));
            this.$el.toggleClass('hidden', this.model.get('hidden'));
            return this;
        }
    });

    var Container = Backbone.View.extend({
        el : $(document.documentElement),
        initialize:function(){
            this.$article = this.$('main article');
			this.listenTo(this.collection, 'change:completed', this.filterOne);
			this.listenTo(this.collection, 'filter', this.filterAll);            
            this.listenTo(this.collection,'add',this.addOne);
            this.listenTo(this.collection,'reset',this.addAll);
            this.collection.reset([
                {title:'Hello'}
            ])
        },
		filterOne: function (model) {
			model.trigger('visible');
		},
		filterAll: function () {
			this.collection.each(this.filterOne, this);
		},        
        addOne:function(model){
            var view = new View({ model : model});
            this.$article.html(view.render().el);
        },
        addAll:function(model){
            this.$article.html("");
            this.collection.each(this.addOne, this);
        },        
        generate:function(string){
            return {
                title : string
            }
        },
        create:function(){
            
        }

    })
    var Router = Backbone.Router.extend({
        preinitialize : function(){
            this.collection = new Collection();
            this.container = new Container({collection:this.collection});
        },
        routes : {
            '*filter': 'setFilter'            
        },
        setFilter : function(param){
            window.Filter = param || '';
            console.log(window.Filter);
        }
    });

    window.bookmarklets = new Router();
    
    Backbone.history.start();



})();