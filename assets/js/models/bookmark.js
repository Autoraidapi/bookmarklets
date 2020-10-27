const Bookmark = Backbone.Model.extend({
    defaults: {
        name: '',
        title: '',
        uri: ''
    },
    validate: function () {
        var uri = this.get('uri');
        var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
        var regex = new RegExp(expression);
        if (!uri.match(regex)) {
            console.error('Please use a valid URI');
        } 
        else {
            console.log(JSON.stringify(this.toJSON()));  
        }
    },
    initialize: function () {      
      this.validate();      
    }
});

const github = new Bookmark({
    name: 'Github',
    title: 'Github',
    uri: 'https://www.github.com/'
});