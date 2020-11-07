requirejs.config({
    baseUrl: 'assets',
    paths: {
        jquery : 'https://assets.codepen.io/1674766/jquery.min',
        underscore : 'https://assets.codepen.io/1674766/underscore.min',
        backbone : 'https://assets.codepen.io/1674766/backbone.min' 
    }
});

requirejs(['js/routes/router' ], function(Router){
    if(typeof window !== 'undefined'){
        window.app = new Router();        
    }
});