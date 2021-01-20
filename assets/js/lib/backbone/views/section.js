(function(View){
    
    Backbone.Section = View.extend({
        template: _.template($('#section').html()),
        render: function (src, ext) {
            this.$el.html(this.template({
                src: src,
                ext: ext
            }));
            return this;
        }
    });
    
    return Section;

})(Backbone.View);
