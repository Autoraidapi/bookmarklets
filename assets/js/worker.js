
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).Promise=e()}}(function(){return function e(t,n,r){function o(u,s){if(!n[u]){if(!t[u]){var c="function"==typeof require&&require;if(!s&&c)return c(u,!0);if(i)return i(u,!0);var f=new Error("Cannot find module '"+u+"'");throw f.code="MODULE_NOT_FOUND",f}var a=n[u]={exports:{}};t[u][0].call(a.exports,function(e){var n=t[u][1][e];return o(n||e)},a,a.exports,e,t,n,r)}return n[u].exports}for(var i="function"==typeof require&&require,u=0;u<r.length;u+=1)o(r[u]);return o}({1:[function(e,t,n){(function(e){"use strict";var n,r,o=e.MutationObserver||e.WebKitMutationObserver;if(o){var i=0,u=new o(a),s=e.document.createTextNode("");u.observe(s,{characterData:!0}),n=function(){s.data=i=++i%2}}else if(e.setImmediate||void 0===e.MessageChannel)n="document"in e&&"onreadystatechange"in e.document.createElement("script")?function(){var t=e.document.createElement("script");t.onreadystatechange=function(){a(),t.onreadystatechange=null,t.parentNode.removeChild(t),t=null},e.document.documentElement.appendChild(t)}:function(){setTimeout(a,0)};else{var c=new e.MessageChannel;c.port1.onmessage=a,n=function(){c.port2.postMessage(0)}}var f=[];function a(){var e,t;r=!0;for(var n=f.length;n;){for(t=f,f=[],e=-1;++e<n;)t[e]();n=f.length}r=!1}t.exports=function(e){1!==f.push(e)||r||n()}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],2:[function(e,t,n){"use strict";var r=e(1);function o(){}var i={},u=["REJECTED"],s=["FULFILLED"],c=["PENDING"];function f(e){if("function"!=typeof e)throw new TypeError("resolver must be a function");this.state=c,this.queue=[],this.outcome=void 0,e!==o&&p(this,e)}function a(e,t,n){this.promise=e,"function"==typeof t&&(this.onFulfilled=t,this.callFulfilled=this.otherCallFulfilled),"function"==typeof n&&(this.onRejected=n,this.callRejected=this.otherCallRejected)}function l(e,t,n){r(function(){var r;try{r=t(n)}catch(t){return i.reject(e,t)}r===e?i.reject(e,new TypeError("Cannot resolve promise with itself")):i.resolve(e,r)})}function h(e){var t=e&&e.then;if(e&&("object"==typeof e||"function"==typeof e)&&"function"==typeof t)return function(){t.apply(e,arguments)}}function p(e,t){var n=!1;function r(t){n||(n=!0,i.reject(e,t))}function o(t){n||(n=!0,i.resolve(e,t))}var u=d(function(){t(o,r)});"error"===u.status&&r(u.value)}function d(e,t){var n={};try{n.value=e(t),n.status="success"}catch(e){n.status="error",n.value=e}return n}t.exports=f,f.prototype.catch=function(e){return this.then(null,e)},f.prototype.then=function(e,t){if("function"!=typeof e&&this.state===s||"function"!=typeof t&&this.state===u)return this;var n=new this.constructor(o);this.state!==c?l(n,this.state===s?e:t,this.outcome):this.queue.push(new a(n,e,t));return n},a.prototype.callFulfilled=function(e){i.resolve(this.promise,e)},a.prototype.otherCallFulfilled=function(e){l(this.promise,this.onFulfilled,e)},a.prototype.callRejected=function(e){i.reject(this.promise,e)},a.prototype.otherCallRejected=function(e){l(this.promise,this.onRejected,e)},i.resolve=function(e,t){var n=d(h,t);if("error"===n.status)return i.reject(e,n.value);var r=n.value;if(r)p(e,r);else{e.state=s,e.outcome=t;for(var o=-1,u=e.queue.length;++o<u;)e.queue[o].callFulfilled(t)}return e},i.reject=function(e,t){e.state=u,e.outcome=t;for(var n=-1,r=e.queue.length;++n<r;)e.queue[n].callRejected(t);return e},f.resolve=function(e){if(e instanceof this)return e;return i.resolve(new this(o),e)},f.reject=function(e){var t=new this(o);return i.reject(t,e)},f.all=function(e){var t=this;if("[object Array]"!==Object.prototype.toString.call(e))return this.reject(new TypeError("must be an array"));var n=e.length,r=!1;if(!n)return this.resolve([]);var u=[n],s=0,c=-1,f=new this(o);for(;++c<n;)a(e[c],c);return f;function a(e,o){t.resolve(e).then(function(e){u[o]=e,++s!==n||r||(r=!0,i.resolve(f,u))},function(e){r||(r=!0,i.reject(f,e))})}},f.race=function(e){var t=this;if("[object Array]"!==Object.prototype.toString.call(e))return this.reject(new TypeError("must be an array"));var n=e.length,r=!1;if(!n)return this.resolve([]);var u=-1,s=new this(o);for(;++u<n;)c=e[u],t.resolve(c).then(function(e){r||(r=!0,i.resolve(s,e))},function(e){r||(r=!0,i.reject(s,e))});var c;return s}},{1:1}]},{},[2])(2)});

function loadResource() {
	return new Promise(function (resolve, reject) {		
		var request = new XMLHttpRequest();		
		request.open("GET", '../json/data.json', true);	
		request.responseType = 'text';
		request.onreadystatechange = function(){
			if(this.readyState === this.HEADERS_RECEIVED){
				postMessage(request.getAllResponseHeaders());
			}    
		}
		request.onload = function () {		
			if (request.status === 200) {			
				resolve(request.response);	
			} else {			
				reject( Error(request.statusText) );			
			}				
		};
		request.onerror = function () {
			reject(Error("request failed: "));
		};		
		request.send(null);		
	});	
}

onmessage = function(event){
    loadResource()
    .then(function(response){  
        var json = JSON.parse(response);
        var js = json.children[0].children;
        postMessage(js)
    })
    .catch(function(er){
        postMessage(er.stack)
    })
}

