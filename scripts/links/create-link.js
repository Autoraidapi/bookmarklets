function htmlEscape(s) {
    s = s.replace(/&/g, '&');
    s = s.replace(/>/g, '>');
    s = s.replace(/</g, '<');
    return s;
}
function linkEscape(s) {
    s = s.replace(/&/g, '&');
    s = s.replace(/%22/, '"');
    return s
}
h = '<a href=%22' + linkEscape(location.href) + '%22>' + htmlEscape(document.title) + '</a>';
with(window.open().document) {
    write(h + '<form name=f><textarea  name=a rows=5 cols=80 wrap=hard>' + htmlEscape(h) + '</textarea></form>');
    close();
    f.a.select();
}
void 0