const View = Backbone.View.extend({
    initialize : function(options){
        this.options = _.extend({
            template : false
        }, options);
        this.render()
    },
    render : function(){        
        this.$el.html(this.options.template());
        return this;
    }
});

const BookmarkView = Backbone.View.extend({
    template : _.template(
        ''
    )
})