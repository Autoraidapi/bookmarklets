/* setup */


/* View to extend  */
const View = Backbone.View.extend({
    initialize: function (options) {
        this.options = _.extend({
            template: false
        }, options);
        this.render()
    },
    render: function () {
        this.$el.html(this.options.template());
        return this;
    }
});