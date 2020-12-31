define(['backbone'], function (Backbone) {

    var View = Backbone.View.extend({
        
        tagName : 'li',

        className : 'list-group-item',
        
        template : _.template('\
            <a href="javascript:<%= obj.uri %>" title="<%= obj.title %>"><%= obj.title %></a>\
        '),

        initialize: function () {

            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
            
            this.render();

        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
        
    });

    return View;

});
