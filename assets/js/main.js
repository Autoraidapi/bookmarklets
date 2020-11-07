
function Data(){
    this.initialize.apply(this, arguments);
}

Data.prototype = {
    constructor : Data,
    initialize : function(collections){
        this.collections = (collections || {});
    }
};

function Main(){

    this.initialize.apply(this, arguments);

    this.data = new Data({
        developer : new DeveloperBookmarks()
    });
    
    this.router = new Router();
    Backbone.history.start();

}

_.extend(Main.prototype, Backbone.Events, {
    constructor : Main,
    initialize : function(){
        this.on('message', function(message){
            return message;
        });
        return this;
    }
});

if(typeof window !== 'undefined'){
    window.app = new Main();
    app.trigger('message', console.log('ready'));
}