/*
 * Dynamic Viewport
*/
(function(meta){ 
	
    function isNumber(obj) { 
      return !!(obj === 0 || (obj && obj.toExponential && obj.toFixed)); 
    }
      
    if(document.getElementById('metaview')){ 
      document.head.removeChild(document.getElementById('metaview')); 
    }
      
    // var io = parseInt(prompt('Viewport Scale Between 0 and 1'));
    var io = prompt('Viewport Scale Between 0 and 1');
  
    if(!isNumber(io)){ 
      alert('Requires a number'); 
      return false; 
    }
      
    meta.id = 'metaview'; 
    meta.name = 'viewport'; 
    meta.content = 'width=device-width, initial-scale=' + io + ', minimum-scale='+io+', maximum-scale='+io+', user-scalable=no'; 
    
    // top will likely throw an error
    // window.top.document.head.appendChild(meta); 
    
    // might get away with parent
    // window.parent.document.head.appendChild(meta);
    
    // this should work if it is executed in the url, not an embedded window
    window.document.head.appendChild(meta); 
    
  })(document.createElement('meta'));