require.config({	
	baseUrl : 'assets/js',	
	shim: {
		underscore: { exports: '_' },
		backbone: { deps: [ 'underscore', 'jquery' ], exports: 'Backbone' }
	},	
    paths: {
        jquery : 'https://assets.codepen.io/1674766/jquery.min',
        underscore : 'https://assets.codepen.io/1674766/underscore.min',
        backbone : 'https://assets.codepen.io/1674766/backbone.min' 
    }	
});

requirejs(['routes/router' ], function(Router){
    if(typeof window !== 'undefined'){

        window.app = new Router();        
        
    }
});