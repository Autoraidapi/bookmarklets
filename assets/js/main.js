


var Template = Backbone.View.extend({
    template : _.template($('#bookmarkTemplate').html()),
    initialize : function(){
        this.listenTo(this.model, 'change', this.render);
    },
    render : function(){
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});


var View = Backbone.View.extend({
    el : $(document.documentElement),
    initialize : function(){},
    render : function(){}
});
