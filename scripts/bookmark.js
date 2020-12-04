(function () {

    /* SELECTOR */
    var fragment = new DocumentFragment();

    /* HTMLElement */
    var btn = document.createElement("button");
    var box = document.createElement("div");
    
    var bookmarklets = [];

    /* POPULATE */
    bookmarklets.forEach(function (bookmark) {
        var list = document.createElement("li");
        var link = document.createElement("a");

    });

    /* ID */
    btn.id = "bookmarklet-panel";

    /* ICON */
    btn.innerHTML = "<img src='' height='32' width='32'>";

    /* TOGGLE */
    btn.addEventListener("click", function () {
        if (boxS.display === "none") {
            boxS.display = "block";
        } else {
            boxS.display = "none";
        }
    });

    /* APPEND TO SHADOW */
    fragment.appendChild(btn);
    fragment.appendChild(box);

    /* APPEND TO DOM */
    document.body.appendChild(fragment);

})();