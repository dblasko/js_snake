function loadMenu(event) {
    console.log("load");
    let template = document.getElementById("menuTemplate");
    let clone = document.importNode(template.content, true);

    document.getElementsByTagName("body")[0].appendChild(clone);
}