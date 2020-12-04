(function(){
    res='';
    for(i=0;i<document.links.length;i++) if(document.links[i].href) res+=document.links[i].href + '\n';
    alert(res);
})()