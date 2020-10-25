const View = Backbone.View.extend({
    el : $('tbody'),
    tagName : 'tr',
    className : 'bookmarklet-row',
    template : _.template(
        '<%= obj.title %>' +
        '<%= obj.uri %>'
    ),
    preinitialize : function(){}
});