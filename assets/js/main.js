
var _ = (function(_){
	
	_.defaults = function (object) {  
		if (!object) { return object }    
		for (var argsIndex = 1, argsLength = arguments.length; argsIndex < argsLength; argsIndex += 1) {    
			var iterable = arguments[argsIndex];      
			if (iterable) {      
				for (var key in iterable) {        
					if (object[key] == null) {          
						object[key] = iterable[key]            
					}          
				}        
			}      
		}    
		return object    
	};
  
	_.templateSettings = {  
		evaluate: /<%([\s\S]+?)%>/g,    
		interpolate: /<%=([\s\S]+?)%>/g,    
		escape: /<%-([\s\S]+?)%>/g    
	};
  
	var noMatch = /(.)^/;
  
	var escapes = {  
		"'": "'",    
		'\\': '\\',    
		'\r': 'r',    
		'\n': 'n',    
		'\t': 't',    
		'\u2028': 'u2028',    
		'\u2029': 'u2029'    
	};
    
	var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
  
	_.template = function (text, data, settings) {  
		var render;    
		settings = _.defaults({}, settings, _.templateSettings);    
		var matcher = new RegExp([    
			(settings.escape || noMatch).source,      		
			(settings.interpolate || noMatch).source,      
			(settings.evaluate || noMatch).source      
		].join('|') + '|$', 'g');    
		var index = 0;    
		var source = "__p+='";    
		text.replace(matcher, function (match, escape, interpolate, evaluate, offset) {    
			source += text      
				.slice(index, offset)        
				.replace(escaper, function (match) {        
				return '\\' + escapes[match]        		
			});      
			if (escape) {
				source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'"        
			}
			if (interpolate) {
				source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'"        
			}                
			if (evaluate) {
				source += "';\n" + evaluate + "\n__p+='"
			}
			index = offset + match.length;
			return match
		});
		source += "';\n";    
		if (!settings.variable) {
			source = 'with(obj||{}){\n' + source + '}\n'
		}
		source = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments" +
			",'');};\n" + source + "return __p;\n";
		try {
			render = new Function(settings.variable || 'obj', '_', source)
		} catch (e) {
			e.source = source;
			throw e
		}
		if (data) { return render(data, _) }
		var template = function (data) {
			return render.call(this, data, _)
		};
		template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';
		return template
	};
	return _
})({});


function Model(text){
	this.text = text;
}

const buffer = new DocumentFragment();

function Tmp(options){
	options = (options || {});
	this.title = options.title;
	this.uri = options.uri;
	this.template = _.template(
		'<td><a href="<%= this.uri %>"><%= this.title %></a><div class="container-fluid">lorem</div></td>'+
		'<td></td>'+
		'<td></td>'
	);
	this.fragment = document.createDocumentFragment();
	this.node = document.createElement('tr');
	this.initialize();
}

Tmp.prototype = {
	initialize : function(){
		this.node.innerHTML = this.template();
		this.fragment.appendChild(this.node);
		this.render();
	},
	render : function(){
		buffer.appendChild(this.fragment);
	}
}

function xhr(url){
	var request = new XMLHttpRequest();
	request.open('GET', url, true);
	request.responseType = 'text';
	request.onload = function(){
		populate(JSON.parse(request.response))
	}
	request.send();
}

function populate(json){
	json.children.forEach(function(object){
		new Tmp(object);		
	});
	document.getElementById('tablebody').appendChild(buffer);
}


