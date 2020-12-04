define(['backbone'], function (Backbone) {

    const View = Backbone.View.extend({
        
        template : _.template('<%- title %>'),
        
        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
            this.render()
        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    return View;

});