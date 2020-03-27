// Revealing module pattern - cf. https://addyosmani.com/resources/essentialjsdesignpatterns/book/#revealingmodulepatternjavascript
let viewHandler = (function() {
    // viewHandler handles the DOM to switch between game/menu screens (with all needed modifications)
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
        currentScreen = screen;
    
        let template = document.getElementById(currentScreen + "_template");
        let clone = document.importNode(template.content, true);
        contentZone.appendChild(clone);

        updateWelcomeQuote();
    }

    return {  // public attributs/methods, the reste is private 
        MENU: MENU,
        GAME: GAME,

        loadScreen: loadScreen,
    };
}());


function loadMenu(event) {
    viewHandler.loadScreen(viewHandler.MENU);
}

function loadGame(event) {
    viewHandler.loadScreen(viewHandler.GAME);
}