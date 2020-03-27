// Revealing module pattern - cf. https://addyosmani.com/resources/essentialjsdesignpatterns/book/#revealingmodulepatternjavascript
let viewHandler = (function() {
    const MENU = 'M';
    const GAME = 'G';
    const welcomeQuotes = [" : tu ne m'auras pas !", " : ces vacances, je voyage à ta place 🌎", " : t'es sûr qu'il t'en reste assez ? 🧻"];

    let contentZone = document.getElementById("contentZone");
    let quoteZone = document.getElementById("quote");
    let currentScreen = MENU; // current screen

    function cleanContentZone() {
        contentZone.innerHTML = "";
    }

    function updateWelcomeQuote() {
        if (currentScreen === GAME) {
            quoteZone.innerText = " ⬅ Le virus te ramène au menu !";
        } else {
            let quote = welcomeQuotes[Math.floor((Math.random()*welcomeQuotes.length))];
            quoteZone.innerText = quote;
        }
    }

    function loadScreen(screen) { // screen is either the MENU or GAME constant
        cleanContentZone();
        //let templateId = (screen === GAME)? "gameTemplate" : "menuTemplate";
        currentScreen = screen;
    
        let template = document.getElementById(currentScreen);
        let clone = document.importNode(template.content, true);
        contentZone.appendChild(clone);

        updateWelcomeQuote();
    }

    return {  // attr/méthodes publiques, le reste privé
        loadScreen: loadScreen,
        MENU: MENU,
        GAME: GAME,
    }
}());


function loadMenu(event) {
    viewHandler.loadScreen(viewHandler.MENU);
}

function loadGame(event) {
    viewHandler.loadScreen(viewHandler.GAME);
}
