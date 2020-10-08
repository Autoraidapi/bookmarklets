(function (fragment) {

    const button = document.createElement("button"),
        section = document.createElement("section");

    const links = ['Hello World!'],
        length = links.length;

    var index;

    for (index = 0; index < length; index++) {
        var list = document.createElement("li"),
            link = document.createElement("a");
        list.appendChild(link);
        section.appendChild(list);
    };

    button.innerHTML = "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"> <path d=\"M17,3H7A2,2 0 0,0 5,5V21L12,18L19,21V5C19,3.89 18.1,3 17,3Z\" /></svg>";
    button.style.cssText = '\
        position:fixed;\
        bottom:2%;\
        right:1%;'

    section.style.cssText = 'display:none;position:fixed;top:0;left:0;width:250px;height:100vh;border-right:1px solid #333;';

    button.addEventListener("click", function () {
        if (section.style.display === "none") {
            section.style.display = "block";
        } else {
            section.style.display = "none";
        }
    });

    fragment.appendChild(button);
    fragment.appendChild(section);
    document.body.appendChild(fragment);
})(new DocumentFragment());