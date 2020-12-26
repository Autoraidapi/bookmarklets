(function(global){
    require.config({	
        baseUrl : '',	
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
    requirejs(['assets/js/main'], function(Main){
        if(typeof global !== 'undefined'){
            global.app = new Main();
        }
    });
})(this);