(function () {
    var n_to_open, dl, dll, i;

    function linkIsSafe(u) {
        if (u.substr(0, 7) == 'mailto:') return false;
        if (u.substr(0, 11) == 'javascript:') return false;
        return true;
    }
    n_to_open = 0;
    dl = document.links;
    dll = dl.length;
    for (i = 0; i < dll; ++i) {
        if (linkIsSafe(dl[i].href)) ++n_to_open;
    }
    if (!n_to_open) alert('no links');
    else {
        if (confirm('Open ' + n_to_open + ' links in new windows?'))
            for (i = 0; i < dll; ++i)
                if (linkIsSafe(dl[i].href)) window.open(dl[i].href);
    }
})();