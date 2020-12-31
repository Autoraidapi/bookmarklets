
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