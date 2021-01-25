var Bookmark = (function(Model){

    var Bookmark = Model.extend({
        defaults : {
            title : '',
            href : '',
            description : '',
            permalink : '',
            display : true
        }
    });

    return Bookmark;

})(Backbone.Model);

var Template = (function(View){

    var Template = View.extend({
        el : $('article'),
        template:_.template(document.getElementById('bookmarkTemplate').innerHTML),
        events : {
            'click' : 'handler'
        },
        initialize : function(){
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
            this.render();
        },    
        render : function(){
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },
        handler : function(){
            this.model.set('display', !this.model.get('display'));
        }        
    });

    return Template;

})(Backbone.View);



(function(){
    var Model = Backbone.Model.extend({
        defaults : {
            title : ''
        }
    });

    var View = Backbone.View.extend({ 
        el : $('article'),
        template : _.template('<%= obj.title %>'),
        render : function(){
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });
    
    var Home = View.extend({
        model : new Model({ title : 'Home' })
    });
    
    var Build = View.extend({
        model : new Model({ title : 'Build' })
    });

    var Export = View.extend({
        model : new Model({ title : 'Export' })
    });

    var Router = Backbone.Router.extend({
        preinitialize : function(){
            this.homeView = new Home();
            this.buildView = new Build();
            this.exportView = new Export();
        },
        routes : {
            '' : 'home',
            'build' : 'build',
            'export' : 'export'
        },
        initialize : function(){
            Backbone.history.start();
        },
        home : function(){
            this.homeView.render();
        },
        build : function(){
            this.buildView.render();
        },
        export : function(){
            this.exportView.render();
        }
    });

    window.router = new Router();

})();