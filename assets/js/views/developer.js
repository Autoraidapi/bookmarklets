const DeveloperView = View.extend({
    
    intialize : function(){
        this.render();
    },
    render : function(){
        this.$el.html(this.template());
        return this;
    }
});