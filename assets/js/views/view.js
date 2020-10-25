const View = Backbone.View.extend({
    el : $('tbody'),
    tagName : 'tr',
    className : 'bookmarklet-row',
    template : _.template(
        '<%= obj.title %>' +
        '<%= obj.uri %>'
    ),
    intialize : function(){
        this.render();
    },
    render : function(){
        this.$el.html(this.template());
        return this;
    }
});