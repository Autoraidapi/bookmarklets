// <template></template>

const template = document.getElementById('template');

function Template(lists) {

    var self = this;

    self.lists = lists;
    self.index = 0;

    var i, len = self.lists.length;

    var fragment = document.createDocumentFragment();

    for (i = 0; i < len; i++) {
        cloneNode = template.content.cloneNode(true);
        parentNode = cloneNode.querySelectorAll('.list');
        childNode = cloneNode.querySelectorAll('.link');
        parentNode[0].id = 'list' + i;
        childNode[0].id = 'link' + i;
        fragment.appendChild(cloneNode);
    }

    template.parentNode.appendChild(fragment);

    for (i = 0; i < len; i++) {
        window['link' + i].textContent = self.lists[i].title;
        window['link' + i].href = self.lists[i].uri;
    }

};

new Template([
   {title:'',uri:''},
   {title:'',uri:''},
   {title:'',uri:''}
]);