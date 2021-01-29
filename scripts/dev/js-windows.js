/* Windows by Name, Meant to be a row in a table and consist of a web worker, a window, a message channel, a guid, reference, compositor? */

function Constructor(){
	this.preinitialize.apply(this,arguments);
	this.initialize.apply(this,arguments);
};

Constructor.prototype.preinitialize = function(){
	
};

Constructor.prototype.initialize = function(){
	
};

Constructor.prototype.valueOf = function(){
	return this;
};

// @terminate, revokeObjectURL

function Thread(){
	// call to core contstructor
	var blob = new Blob([document.getElementById('worker').textContent],{type:'text/javascript'});
	this.source = URL.createObjectURL(blob);
	this.worker = new Worker(this.source);
	
	
	this.preinitialize.apply(this, arguments);
	this.initialize.apply(this, arguments);	
};

Thread.prototype = Object.create(Constructor.prototype, {
	// for debugging, all true
	constructor : {
		configurable : true,
		enumerable : true,
		value : Thread,
		writeable : true		
	}	
});

// initializer, composition

Thread.prototype.preinitialize = function(){
	this.worker.addEventListener('message', this.onMessage.bind(this), true);
};

Thread.prototype.initialize = function(){
	
};

Thread.prototype.postMessage = function(obj){
	if(!isArrayBuffer(obj)){
		this.worker.postMessage(obj);
	} else {
		this.worker.postMessage(obj,[obj]);
	}
};

Thread.prototype.onMessage = function(event){
	var data = event.data;
	console.log(data);
};

function Standard(name){
	this.name = name;
};

Standard.prototype = Object.create(Constructor.prototype, {
	constructor : {
		configurable : true,
		enumerable : true,
		value : Standard,
		writeable : true		
	}	
});

Standard.prototype.preinitialize = function(){
	
};

Standard.prototype.initialize = function(){
	
};

// todo : setup scope `this` .call(context)

Standard.prototype.open = function(focus){
	var self = this;
	if(self.cid){  console.error('');  } 
	else { 
		if(focus){
			self.thread = new Thread();			
			self.cid = window.open('about:blank',self.name,'width=600,height=400');
			self.cid.focus();
		}
		else {
			self.thread = new Thread();
			self.cid = window.open('about:blank',self.name,'width=600,height=400');
		}
	}
};

Standard.prototype.close = function(){
	var self = this;
	if(self.cid){
		self.thread.worker.terminate();
		self.cid.close();
		self.cid = '';
	}
};

Standard.prototype.write = function(html){
	var self = this;	
	self.cid.document.write(html);
};

Standard.prototype.refresh = function(html){
	var self = this;	
	self.cid.document.write('<iframe src="https://000455147.deployed.codepen.website"></iframe>');
};

Standard.prototype.message = function(obj){
	var self = this;	
	self.thread.postMessage(obj);
};

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
