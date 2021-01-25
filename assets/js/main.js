

var Model = Backbone.Model.extend({
    defaults : {
        title : '',
        href : '',
        description : '',
        display : false
    }
});


var Template = Backbone.View.extend({

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




window.template = new Template({
    
    model : new Model({
        title : 'Hello World!',
        href : '#',
        description : 'Hello World!'
    })

});

var Router = Backbone.Router.extend({
    preinitialize : function(){
        window.Filter = '';
    },
    routes : {
        '*filter':'setFilter'
    },
    initialize : function(){
        Backbone.history.start();
    },
    setFilter:function(x){
        window.Filter = x || '';
    }
});

window.router = new Router();