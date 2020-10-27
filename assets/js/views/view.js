/* import { templateRow } from 'templates/row.js' */

const View = Backbone.View.extend({
    el : $('tbody'),
    tagName : 'tr',
    className : 'bookmarklet-row',
    template : templateRow,
    initialize : function(){
        this.render();
    },
    render : function(){
        this.$el.html(this.template());
        return this;
    }
});
