JavaScript Bookmarklets

- [Bookmarklet Panel](https://000538127.codepen.website/assets/html/bookmarklets/BlackBerryBookmark.processed.html)

A Template for adding various bookmarklet links to improve users browsing experience.

```javascript

(function(fragment){
	
	const link = document.createElement('link');
	link.id='blackberry-bookmark';
	// all styles can be embedded here
	link.href = 'data:text/css, .blackberry-bar { height : 1px; box-sizing : border-box; }';
	document.head.appendChild(link);
	
	const section = document.createElement('section');
	section.style.cssText = '\
		display:none;\
		position:fixed;\
		top:0;\
		left:0;\
		height:200px;\
		width:200px;\
		background-color:#FEF;\
		border-right:1px solid:#DDD;\
		border-bottom:1px solid #DDD;\
	';

	const button = document.createElement('button');
	
	button.innerHTML = '<img height="32" widht="32" src="https://assets.codepen.io/1674766/ic_view_list.png">';
	
	button.id = '#blackberry-button';
	
	button.addEventListener('click', function(e){ 
		if(section.style.display === 'none'){ section.style.display = 'block'; } 
		else { section.style.display = 'none'; } 
	},false);
	
	button.style.cssText = '\
		background-color:#333;\
		border-radius:3px;\
		border:1px solid RGBA(0,0,0,0.5);\
		position:fixed;top:1px;right:1px;\
	';
	
  	const bookmarklets = [
		{ title : "", content : "", uri : "javascript:(function(){})();"}
	];
	
	var i, len = bookmarklets.length;

	for(i = 0;i < len;i++){      
		var li  = document.createElement("li");
    		var a  = document.createElement("a");
		a.href = bookmarklets[i].uri;
		a.textContent = bookmarklets[i].content;
		li.appendChild(a);
		section.appendChild(li);
	}
	
	fragment.appendChild(button);
	fragment.appendChild(section);
	
	document.body.appendChild(fragment);
	
})(new DocumentFragment());
```
