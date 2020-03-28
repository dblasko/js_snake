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

        // TODO : initial draw : f° DRAW WORLD réutilisé dans step

        intervalId = window.setInterval(step, levelData.delay);
    }

    function setKey(pressedKey) {
        if (validKeys.includes(pressedKey)) key = pressedKey;
    }

    function step() {
        let x=0, y=0; // determine movement direction
        switch(key) {
            case "ArrowUp":     x=-1; break;
            case "ArrowDown":   x=1; break;
            case "ArrowLeft":   y=-1; break;
            default:            y=1; break;
        }
     
        let futureHeadLocation = world[snake[snake.length-1][0]+x][snake[snake.length-1][1]+y]; // head is at the last position of the snake array
        if (futureHeadLocation === FOOD || futureHeadLocation === EMPTY) {
            if (futureHeadLocation === FOOD) {
                score++;
                let x1, y1;
                do { // generate random coordinates where the map is empty
                    x1 = Math.floor((Math.random()*world.length));
                    y1 = Math.floor((Math.random()*world[0].length));
                } while(world[x1][y1] != EMPTY); 
                world[x1][y1] = FOOD;
                // the head will override the old food
                snake.push([snake[snake.length-1][0]+x, snake[snake.length-1][1]+y]); // we don't remove the tail since he's eaten
            } else { // he just moves forward (empty)
                snake.push([snake[snake.length-1][0]+x, snake[snake.length-1][1]+y]);
                let poppedTail = snake.shift();
                world[poppedTail[0]][poppedTail[1]] = EMPTY; // remove the tail from world
            }
            world[snake[snake.length-1][0]+x][snake[snake.length-1][1]+y] = SNAKE; // head
            // TODO : reste traitement commun : re-draw canvas en se basant sur WORD : CALL FONCTION DRAW WORLD
        } else { // WALL ou SNAKE : perdu dans les deux cas
            // TODO : fin partie : score + menu 
            tryStopStepping();
        }
        // TODO : maintain le score dans l'ui
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