(function () {
    var w = window.open('about:blank'),
        s = w.document;
    s.write('<!DOCTYPE html><html><head><title>Source of ' + location.href + '</title><meta name=viewport content=width=device-width /></head><body></body></html>');
    s.close();
    var pre = s.body.appendChild(s.createElement('pre'));
    pre.style.overflow = 'auto';
    pre.style.whiteSpace = 'pre-wrap';
    pre.appendChild(s.createTextNode(document.documentElement.innerHTML));
})();