const MENU = 'M';
const GAME = 'G';
const welcomeQuotes = [" : tu ne m'auras pas !", " : ces vacances, je voyage à ta place 🌎", " : t'es sûr qu'il t'en reste assez ? 🧻"];

function cleanContentZone() {
    document.getElementById("contentZone").innerHTML = "";
}

function loadScreen(screen) { // screen is either the MENU or GAME constant
    cleanContentZone();
    
    let templateId = (screen === GAME)? "gameTemplate" : "menuTemplate";

    let template = document.getElementById(templateId);
    let clone = document.importNode(template.content, true);
    document.getElementById("contentZone").appendChild(clone);
}


function loadMenu(event) {
    // EVENTUELLEMENT RESET VARIABLES DE JEU ICI OU LOADGAME
    let quote = welcomeQuotes[Math.floor((Math.random()*welcomeQuotes.length))];
    document.getElementById("quote").innerText = quote;
    
    loadScreen(MENU);
}

function loadGame(event) {
    document.getElementById("quote").innerText = " ⬅ Le virus te ramène au menu !";
    loadScreen(GAME);
}

