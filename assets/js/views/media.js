const MediaView = View.extend({
    model : mediaModel,
    template : _.template('<%= obj.title %>'),
    intialize : function(){
        this.render();
    },
    render : function(){
        this.$el.html(this.template(this.model.toJSON()[0]));
        return this;
    }
});

