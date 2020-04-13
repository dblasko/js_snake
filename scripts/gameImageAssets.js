let gameImageAssets = (function() {
    let imageBasePath = "/assets/images/";

    let cVirus = new Image;
    cVirus.src = imageBasePath + "virus.png";

    let cVirusHead = new Image;
    cVirusHead.src = imageBasePath + "virus_head.png";

    let sanitizer = new Image;
    sanitizer.src = imageBasePath + "sanitizer.png";

    let paper = new Image;
    paper.src = imageBasePath + "paper.png";

    let vaccine = new Image;
    vaccine.src = imageBasePath + "vaccine.png";

    
    return {
        cVirus: cVirus,
        cVirusHead: cVirusHead,
        sanitizer: sanitizer,
        paper: paper,
        vaccine: vaccine,
    };
}());