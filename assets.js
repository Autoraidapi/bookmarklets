require.config({
    baseUrl: '',
    shim: {
        underscore: { exports: '_' },
        backbone: { deps: ['underscore','jquery'], exports: 'Backbone' }
    },
    paths: {
        jquery:'https://assets.codepen.io/1674766/jquery.min',
        underscore: 'https://assets.codepen.io/1674766/underscore.min',
        backbone: 'https://assets.codepen.io/1674766/backbone.min'
    }
});

requirejs(['backbone'], function (Backbone) {

    var View = Backbone.View.extend({
        el : $(document.documentElement),
        initialize : function(){
            this.on('filter', this.filter);
        },
        render : function(){

        },
        filter : function(){
            var filter = window.Filter;
            console.log(filter);            
        }
    });

    var Router = Backbone.Router.extend({
        preinitialize : function(){
            this.view = new View();
        },
        routes : {
            "*filter":"setFilter"
        },
        initialize : function(){
            Backbone.history.start();
        },
        setFilter:function(param){
            window.Filter = param || '';
            this.view.trigger('filter');
        }
    });

    window.router = new Router();

});