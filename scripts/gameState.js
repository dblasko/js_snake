let gameState = (function() {
    const validKeys = ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"];
    const EMPTY = 'E';
    const SNAKE = 'S';
    const FOOD = 'F';
    const WALL = 'W';

    let snake;
    let world;
    let levelData;
    let key;
    let score = 0;
    let intervalId = -1; // to stop the interval when game is left

    function notifyLevelSelected(level) {
        fetch(`./assets/levels/${level}.json`).then(response=>{
            if (response.ok) {
                response.json().then(resp => {
                    levelData = resp;
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
        // we make sure all game data is reinitialised (in case the user went back to the menu during a game)
        key = validKeys[0];
        score = 0;
        snake = levelData.snake; 
        world = Array(levelData.dimensions[0]).fill(EMPTY).map(x => Array(levelData.dimensions[1]).fill(EMPTY));
        for (snakePart of snake) world[snakePart[0]][snakePart[1]] = SNAKE;
        for (wall of levelData.walls) world[wall[0]][wall[1]] = WALL;
        for (food of levelData.food) world[food[0]][food[1]] = FOOD;

        // TODO : initial draw 
        intervalId = window.setInterval(step, levelData.delay);
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
        // TODO : maintain le score
    }

    function tryStopStepping() { // to stop the game (when the user gets back to the menu)
        if (intervalId != -1) {
            clearInterval(intervalId);
            intervalId = -1; // to not re-try stopping if the user clicks on the button again
        }
    }

    return { // public attributes / methods
        setKey: setKey,
        notifyLevelSelected: notifyLevelSelected,
        tryStopStepping: tryStopStepping,  
    };
}());


document.addEventListener("keydown", (event) => {
    gameState.setKey(event.key);
});



// ACCUEIL : listener avec ids sur la liste niveaux
// au clic : appelle loadLevel de gameState avec en param° le nom du lvl (id)
// gameState appelle AJAX pour récupérer le JSON en objet, qu'il stocke en attr currentLevel


    // set le gameState, le laisser fetch puis loadGame lui même ? il fait viewHandler...
    // BIEN GERER SI PAS UN DES LVL