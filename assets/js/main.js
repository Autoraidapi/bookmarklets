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