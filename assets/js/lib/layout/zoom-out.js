function zoomImage(image, amt) {
    if (image.initialHeight == null) {
        image.initialHeight = image.height;
        image.initialWidth = image.width;
        image.scalingFactor = 1;
    }
    image.scalingFactor *= amt;
    image.width = image.scalingFactor * image.initialWidth;
    image.height = image.scalingFactor * image.initialHeight;
}

function rZoomFont(n, node) {
    var i,
        len = node.childNodes.length;
    for (i = 0; i < len; i++) {
        if (node.childNodes[i].nodeType == 1) rZoomFont(n, node.childNodes[i]);
    }
    startSize = getComputedStyle(node, "").getPropertyValue("font-size");
    startSize = parseInt(startSize.substr(0, startSize.length - 2));
    lh = getComputedStyle(node, "").getPropertyValue("line-height");
    if (lh != "normal") {
        lh = parseInt(lh.substr(0, lh.length - 2)) * n + "px";
        node.style.lineHeight = lh;
    }
    newSize = startSize * n + "px";
    node.style.fontSize = newSize;
}


rZoomFont(0.75, document.body);

for (i = 0; i < document.images.length; ++i) zoomImage(document.images[i], 0.75);