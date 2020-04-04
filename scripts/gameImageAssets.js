let gameImageAssets = (function() {
    let cVirus = new Image;
    cVirus.src = "/assets/virus.png";

    let cVirusHead = new Image;
    cVirusHead.src = "/assets/virus_head.png";

    let sanitizer = new Image;
    sanitizer.src = "/assets/sanitizer.png";

    let paper = new Image;
    paper.src = "/assets/paper.png";

    return {
        cVirus: cVirus,
        cVirusHead: cVirusHead,
        sanitizer: sanitizer,
        paper: paper,
    };
}());