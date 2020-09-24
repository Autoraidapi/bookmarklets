

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
	)
	this.target = document.getElementById('tablebody');
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

// xhr('https://assets.codepen.io/1674766/developer.json');

function populate(json){
	json.children.forEach(function(object){
		new Tmp(object);
		document.getElementById('tablebody').appendChild(buffer);
	});
}


