var Template = View.extend({
    el: $('article'),
    template: _.template(document.getElementById('bookmarkTemplate').innerHTML),
    events: {
        'click': 'handler'
    },
    initialize: function () {
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.remove);
        this.render();
    },
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },
    handler: function () {
        this.model.set('display', !this.model.get('display'));
    }
});