const Router = Backbone.Router.extend({    
    
    initialize : function(){
        this.container = new Container();
    },

    routes : {
        'developer' : 'developer',
        'layout' : 'layout',
        'media' : 'media'                
    },

    developer : function(){
        this.view = new DeveloperView();
		this.container.child = this.view;        
        this.container.render();
    },

    layout : function(){
        this.view = new LayoutView();
		this.container.child = this.view;        
        this.container.render();
    },

    media : function(){
        this.view = new MediaView();
		this.container.child = this.view;        
        this.container.render();
    }

});

const router = new Router();

Backbone.history.start();