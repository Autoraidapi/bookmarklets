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

/*
 * JavaScript REPL
 */
(function(){ 
  var io = prompt('exit to quit\n>'); 
  while(io !== 'exit'){ 
    alert(eval(input)); 
    io = prompt('exit to quit\n>'); 
  } 
})();

/*
 * Todo Functions
 */
(function(cache) {
    var check = confirm('Enter Synchronous Interface?');
    if (check === false) { return false; } 
    else {
        var input = prompt('running Query, type help for info or exit to quit\n >>');
        while (input !== 'exit') {
        
            if (input === 'script') {
                loadScript();
            } 

            else if (input === 'iframe') {
                loadIframe();
            } 

            else if (input === 'repl') {
                runRepl();
            } 

            else if (input === 'help') {
                alert(
                'Commands : \n' + 
                'add    : add an item to cache.\n' +
                'save   : not setupt yet. serialize the cache and store or send\n' + 
                'delete : remove an item from storage\n' + 
                'list   : list items in storage\n' + 
                'iframe : render an iframe into the Document Body\n' + 
                'script : inject a script into the Document Body\n' + 
                'repl   : run javascript evaluation mode\n'
                )
            } 

            else if (input === 'add') {
                addData();
            } 

            else if (input === 'delete') {
                deleteData();
            } 

            else if (input === 'list') {
                listData();
            }
            
            var input = prompt('running Query, type help for info or exit to quit\n >>');
        }
        function loadScript() {
            var src = prompt('file name ?');
            var script = document.createElement('script');
            script.src = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1674766/' + src + '.js';
            script.type = 'text/javascript';
            return document.body.appendChild(script);
        }
        function loadIframe() {
            var src = prompt('path ?');
            var iframe = document.createElement('iframe');
            iframe.style.width = '80vw';
            iframe.style.height = '75vh';
            iframe.src = src;
            return document.body.appendChild(iframe);
        }
        function runRepl() {
            var io = prompt('js>, exit to quit \n >');
            while (io !== 'exit') {
                var result;
                try {
                    result = eval(io);
                } catch (er) {
                    result = er.stack;
                } finally {
                    alert(result);
                }
                io = prompt('js>, exit to quit \n >');
            }
        }
        function addData() {
            var item = prompt('Enter an item to the cache!');
            cache.push(item);

        }
        function deleteData() {
            var index = prompt('Enter index number to delete!');
            cache.splice(index, 1);
            listData();
        }
        function listData() {
            var i, len = cache.length, output = '';
            for(i = 0;i < len;i++){
                output += cache[i] + '\n';
            }
            alert(output);
        }
    }
}
)([]);

/*
 * Media Source
 */
(function(xs){
  for(var i = 0;i < xs.length;++i){
    if(xs[i].currentSrc){
      return window.open(xs[i].currentSrc);
    }
  }
})(document.querySelectorAll('audio,video'));


/*
 * View Variables
*/
function viewVariables() {
    var x, d, i, v, st;
    x = open();
    d = x.document;
    d.open();
    function hE(s) {
        s = s.replace(/\\"/g, '"')
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        return s;
    }
    d.write(
        "<!DOCTYPE html><html><head><style>td{vertical-align:top; white-space:pre; } table,td,th { font-family: monospace; padding:3px; margin: auto; border-radius:2px; border: 1px solid rgba(0,0,0,0.15); } div.er { color:red }</style></head><body><table border=1><thead><tr><th>Variable</th><th>Type</th><th>Value as string</th></tr></thead>"
    );
    for (i in window) {
        if (!(i in x)) {
            v = window[i];
            d.write(
                "<tr><td>" + hE(i) + "</td><td>" + hE(typeof window[i]) + "</td><td>"
            );
            if (v === null) d.write("null");
            else if (v === undefined) d.write("undefined");
            else
                try {
                    st = v.toString();
                    if (st.length) d.write(hE(v.toString()));
                    else d.write(" ");
                } catch (er) {
                    d.write("<div class=er>" + hE(er.toString()) + "</div>");
                }
            d.write("</pre></td></tr>");
        }
    }
    d.write("</table></body></html>");
    d.close();
}
