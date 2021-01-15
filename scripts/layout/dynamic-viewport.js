(function(meta){ 
    	var io = prompt('Apply Viewport Scale');
	if(document.getElementById('metaview')) document.head.removeChild(document.getElementById('metaview'));
    	meta.id = 'metaview'; 
    	meta.name = 'viewport';
    	meta.content = 'width=device-width, initial-scale=' + io + ', minimum-scale='+io+', maximum-scale='+io+', user-scalable=no'; 
    	window.document.head.appendChild(meta); 
})(document.createElement('meta'));
