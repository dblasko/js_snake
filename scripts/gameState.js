let gameState = (function() {
    const validKeys = ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"];
    const EMPTY = 'E';
    const SNAKE = 'S';
    const FOOD = 'F';

    // f° getLevel => choppe dans l'URL? avec le # cf le TP 
    // sinon au clic dans une var globale, ou un setter gameState => getLevel l'utilise

    let snake = [];
    let world = [
        [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY, EMPTY,  EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
    ];
    // L’information sur le serpent est donc stockée de manière redondante dans ces deux tableaux. Cette redondance rendra la gestion du jeu plus simple par la suite.
    let currentLevel;
    let key;

    function notifyLevelSelected(level) {
        fetch(`./assets/levels/${level}.json`).then(response=>{
            if (response.ok) {
                response.json().then(resp => {
                    currentLevel = resp;
                    startGame();
                });
            } else {
                console.log("Ce niveau n'existe pas !");
                viewHandler.popMessage("Je ne peux pas infecter ce pays !");
            }
        });
    }

    function startGame() { // private 
        viewHandler.loadScreen(viewHandler.GAME); // TODO : afficher après draw ?
        // initial draw (random apple...) + initial direction ... etc + delay step()
        // BIEN REMETTRE A 0 TOUTES VAL DE JEU ICI
    }

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
        notifyLevelSelected: notifyLevelSelected,  
    };
}());


document.addEventListener("keydown", (event) => {
    gameState.setKey(event.key);
});



// TODO !!! : SUPPR LA FONCTION STEP MISE EN TIMEOUT

// ACCUEIL : listener avec ids sur la liste niveaux
// au clic : appelle loadLevel de gameState avec en param° le nom du lvl (id)
// gameState appelle AJAX pour récupérer le JSON en objet, qu'il stocke en attr currentLevel


    // set le gameState, le laisser fetch puis loadGame lui même ? il fait viewHandler...
    // BIEN GERER SI PAS UN DES LVL