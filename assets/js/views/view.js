/* setup */

define(['jquery', 'underscore', 'backbone'], function ($, _, Backbone) {

    /* View to extend  */

    const View = Backbone.View.extend({
        initialize: function () {
            this.render()
        },
        render: function () {
            this.$el.html(this.options.template());
            return this;
        }
    });

    return View;

});