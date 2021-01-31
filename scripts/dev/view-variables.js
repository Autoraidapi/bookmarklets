
function viewVariables() {
	var scope, doc, key, val, str;
	scope = open();
	doc = scope.document;
	doc.open();
	function htmlEscape(s) {
		s = s
			.replace(/\\"/g, '"')
			.replace(/&/g, "&amp;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#39;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;");
		return s;
	}
	doc.write(
		"<!DOCTYPE html><html><head><style>td{vertical-align:top; white-space:pre; } table,td,th { font-family: monospace; padding:3px; margin: auto; border-radius:2px; border: 1px solid rgba(0,0,0,0.15); } div.er { color:red }</style></head><body><table border=1><thead><tr><th>Variable</th><th>Type</th><th>Value as string</th></tr></thead>"
	);
	for (key in window) {
		if (!(key in scope)) {
			val = window[key];
			doc.write( "<tr><td>" + htmlEscape(key) + "</td><td>" + htmlEscape(typeof window[key]) + "</td><td>" );
			if (val === null) doc.write("null");
			else if (val === undefined) doc.write("undefined");
			else
				try {
					str = val.toString();
					if (str.length) doc.write(htmlEscape(val.toString()));
					else doc.write(" ");
				} catch (er) {
					doc.write("<div class=er>" + htmlEscape(er.toString()) + "</div>");
				}
			doc.write("</pre></td></tr>");
		}
	}
	doc.write("</table></body></html>");
	doc.close();
}
