let gameState = (function() {
    const validKeys = ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"];
    const EMPTY = 'E';
    const SNAKE = 'S';
    const FOOD = 'F';

    // f° getLevel => choppe dans l'URL? avec le # cf le TP 
    // sinon au clic dans une var globale, ou un setter gameState => getLevel l'utilise

    let SNAKE = [];
    let WORLD = [
        [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY, EMPTY,  EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
    ];
    // L’information sur le serpent est donc stockée de manière redondante dans ces deux tableaux. Cette redondance rendra la gestion du jeu plus simple par la suite.
    let key;


    function setKey(pressedKey) {
        if (validKeys.includes(pressedKey)) key = pressedKey;
    }

    function step() {
        // 1. modif° direction si besoin 
        // 2. tête rencontre nourriture / mur / morceau corps ?
            // aug° score + nourriture dans case vide aléatoire 
            // Sinon, fin partie : score + menu 
        // MAJ tab SNAKE -> avancer (cf énoncé) + aug° taille si mangé (= pas réduire queue) + MAJ WORLD
        // effacer & redessiner canvas en corresp° avec WORLD
    }

    return { // public attributes / methods
        setKey: setKey,
        step: step,
    };
}());


document.addEventListener("keydown", (event) => {
    gameState.setKey(event.key);
});

// TODO : delay step 