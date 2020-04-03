let gameImageAssets = (function() {
    let cVirus = new Image;
    cVirus.src = "/assets/virus.png";

    let sanitizer = new Image;
    sanitizer.src = "/assets/sanitizer.png";

    let paper = new Image;
    paper.src = "/assets/paper.png";

    return {
        cVirus: cVirus,
        sanitizer: sanitizer,
        paper: paper,
    };
}());