/* 
  Within the composite javascipt, 
  the opening window is referenced, 
  and an anchor is rendered to send data from the new window back to the opening window 
*/

function linkOpener(){
	with(window.open("", "_blank", "width=" + screen.width * .6 + ",left=" + screen.width * .35 + ",height=" + screen.height * .9 + ",resizable,scrollbars=yes")) {
		document.write("<!DOCTYPE html>"
			+ "<html>"
			+ "<body>"
			+ "<a href='javascript:_window.console.log(_window.location)'>Test</a>"
			+ "<script>"
			+ "var _window; function init(){ _window = window.opener; return _window; }; init();"
			+ "<\/script>"
			+ "</body>"
			+ "</html>"
		);    
		document.close();
	}
	void 0
}


// TRY : Run Code in both windows with a chain of promises
// Multithreaded
// Asynchronous

function promiseLinkReturn(){
  // import { PromisePolyfill } from '';
  return new Promise(function(resolve, reject){
    // if(){ resolve(); }
    // else { reject(); }
  });
  
 	with(window.open("", "_blank", "width=" + screen.width * .6 + ",left=" + screen.width * .35 + ",height=" + screen.height * .9 + ",resizable,scrollbars=yes")) {
		document.write("<!DOCTYPE html>"
			+ "<html>"
			+ "<body>"
			+ "<a href='javascript:_window.console.log(_window.location)'>Test</a>"
			+ "<script>"
			+ "var _window; function init(){ _window = window.opener; return _window; }; init();"
			+ "<\/script>"
			+ "</body>"
			+ "</html>"
		);    
		document.close();
	}
  
	void 0 
  
}
promiseLinkReturn()

.then(function(r){

})

.then(function(){

})

.then(function(){

})

.catch(function(er){

})
