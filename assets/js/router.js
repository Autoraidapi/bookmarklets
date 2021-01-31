var Router = Backbone.Router.extend({
    preinitialize: function () {
        this.homeView = new Home();
        this.buildView = new Build();
        this.exportView = new Export();
    },
    routes: {
        '': 'home',
        'build': 'build',
        'export': 'export'
    },
    initialize: function () {
        Backbone.history.start();
    },
    home: function () {
        this.homeView.render();
    },
    build: function () {
        this.buildView.render();
    },
    export: function () {
        this.exportView.render();
    }
});