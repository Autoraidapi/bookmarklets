(function () {
    function I(u) {
        var t = u.split('.'),
            e = t[t.length - 1].toLowerCase();
        return {
            gif: 1,
            jpg: 1,
            jpeg: 1,
            png: 1,
            mng: 1
        } [e]
    }

    function hE(s) {
        return s.replace(/&/g, '&').replace(/>/g, '>').replace(/</g, '<').replace(/"/g, '\"');
    }
    var q, h, i, z = open().document;
    z.write('<p>Images linked to by ' + hE(location.href) + ':</p><hr>');
    for (i = 0; q = document.links[i]; ++i) {
        h = q.href;
        if (h && I(h)) z.write('<p>' + q.innerHTML + ' (' + hE(h) + ')<br><img src="' + hE(h) + '">');
    }
    z.close();
})()