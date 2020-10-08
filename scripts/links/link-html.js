for (var imCt = 0; document.links[imCt]; imCt++) {
    void(document.links[imCt].onclick = function () {
        return (typeof (prompt('Link HTML:\\n(Click OK to follow the link)', this.outerHTML)) == typeof ('boo'));
    });
}