
var Model = Backbone.Model.extend({
    preinitiailize : function(){}
});

var Bookmark = Model.extend({
    initiailize : function(){},
    defaults: {
        title: '',
        href: '',
        description: '',
        permalink: '',
        display: true
    }
});