let gameState = (function() {
    const validKeys = ["ArrowRight", "ArrowUp", "ArrowLeft", "ArrowDown"];
    // CONCEPT : if index < 2 : can't change direction to index+2, if >= 2, can't change to index-2 for incoherent changes
    const EMPTY = 'E';
    const SNAKE = 'S';
    const FOOD = 'F';
    const WALL = 'W';

    let snake;
    let world;
    let levelData;
    let key; // current moving direction
    let keyPressed; // buffer => request for moving direction change
    let score = 0;
    let intervalId = -1; // to stop the interval when game is left

    let cHeight = undefined;
    let cWidth = undefined;

    function notifyLevelSelected(level) {
        fetch(`./assets/levels/${level}.json`).then(response=>{
            if (response.ok) {
                response.json().then(resp => {
                    console.log(resp);
                    levelData = resp;
                    startGame();
                });
            } else {
                console.log("Ce niveau n'existe pas !");
                viewHandler.popMessage("Je ne peux pas infecter ce pays !");
            }
        });
    }

    function drawGameState() {
        let canvas = document.getElementById("cnv");
        let ctx = canvas.getContext("2d");
        let ctZone = document.getElementById("contentZone");

        // clear the canvas
        ctx.fillStyle ="black";
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (cHeight == undefined) cHeight = ctZone.clientHeight*0.9;
        if (cWidth == undefined) cWidth = ctZone.clientWidth;
        canvas.width=cWidth;
        canvas.height=cHeight;

        const squareSize = Math.min(canvas.height/levelData.dimensions[0], canvas.width/levelData.dimensions[1]);

        // padding for the unused space, depending on the level dimensions
        let oX=(canvas.width-squareSize*levelData.dimensions[1])/2;
		let oY=(canvas.height-squareSize*levelData.dimensions[0])/2;
        ctx.fillStyle='#c8e65e';
        ctx.fillRect(0, 0, oX, canvas.height);
		ctx.fillRect(0, 0, canvas.width, oY);
		ctx.fillRect(oX+squareSize*levelData.dimensions[1], 0, oX, canvas.height);
		ctx.fillRect(0, oY+squareSize*levelData.dimensions[0], canvas.width, oY);

        for (i=0; i<world.length; i++) {
            for (j=0; j<world[i].length; j++) {
                let img = undefined;
                switch (world[i][j]) {
                    case SNAKE: img = gameImageAssets.cVirus;
                        break;
                    case WALL: img = gameImageAssets.sanitizer;
                        break;
                    case FOOD: img = gameImageAssets.paper;
                        break;
                }
                if (img != undefined) ctx.drawImage(img, oX+squareSize*j, oY+squareSize*i, squareSize, squareSize);
            }
        }
        
        
    }

    function showGameEnded() {
        // TODO IDEA  : leaderboard ?
        let modal = document.getElementById("modale");
        let leave = document.getElementsByClassName("close")[0];
        let scoreSpan = document.getElementById("scoreSpan");

        scoreSpan.innerHTML = score;
        modal.style.display = "block";

        leave.onclick = function() {
            modal.style.display = "none";
            loadMenu(null);
        }
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
                this.loadMenu(null);
            }
        }
    }

    function startGame() { // private 
        viewHandler.loadScreen(viewHandler.GAME); // TODO : afficher après draw ?
        
        // we make sure all game data is reinitialised (in case the user went back to the menu during a game)
        key = validKeys[1]; keyPressed = validKeys[1];
        score = 0;
        snake = levelData.snake; 
        console.log("GENERATING WORD : " + levelData.dimensions);
        world = Array(levelData.dimensions[0]).fill(EMPTY).map(x => Array(levelData.dimensions[1]).fill(EMPTY));
        for (snakePart of snake) world[snakePart[0]][snakePart[1]] = SNAKE;
        for (wall of levelData.walls) world[wall[0]][wall[1]] = WALL;
        for (food of levelData.food) world[food[0]][food[1]] = FOOD;

        // data is prepared, draw the initial screen and then launch the game
        drawGameState();

        intervalId = window.setInterval(step, levelData.delay);
    }

    function setKey(pressedKey) {
        if (validKeys.includes(pressedKey)) keyPressed = pressedKey;
    }

    function step() {
        // We check if we can validate user's direction change request - if not, the direction doesn't change
        if(validKeys.indexOf(keyPressed) < 2) { // for the logic, check the validKeys declaration
            if (validKeys.indexOf(key) !== validKeys.indexOf(keyPressed) + 2) key = keyPressed;
        } else { // index >= 2 
            if (validKeys.indexOf(key) !== validKeys.indexOf(keyPressed) - 2) key = keyPressed;
        }
        let x=0, y=0; // determine movement direction
        switch(key) {
            case "ArrowUp":     y=-1; break;
            case "ArrowDown":   y=1; break;
            case "ArrowLeft":   x=-1; break;
            default:            x=1; break;
        }
        console.log("DIRECTION: " + key);
        
        let futureHeadLocation;
        if((snake[snake.length-1][0] >= world.length -1 && y===1)) {
            futureHeadLocation = undefined;
        } else {
            futureHeadLocation = world[snake[snake.length-1][0]+y][snake[snake.length-1][1]+x]; // head is at the last position of the snake array
        }
        console.log("SNAK : " + snake[snake.length-1][1]);
        // undefined if gets out of map
        if (futureHeadLocation != undefined && (futureHeadLocation === FOOD || futureHeadLocation === EMPTY)) {
            if (futureHeadLocation === FOOD) {
                score++;
                let x1, y1;
                do { // generate random coordinates where the map is empty
                    y1 = Math.floor((Math.random()*world.length));
                    x1 = Math.floor((Math.random()*world[0].length));
                } while(world[y1][x1] != EMPTY); 
                world[y1][x1] = FOOD;
                // the head will override the old food
                snake.push([snake[snake.length-1][0]+y, snake[snake.length-1][1]+x]); // we don't remove the tail since he's eaten
                // WE ACCELERATE THE SNAKE IF POSSIBLE
                accelerateStepping();
            } else { // he just moves forward (empty)
                snake.push([snake[snake.length-1][0]+y, snake[snake.length-1][1]+x]);
                let poppedTail = snake.shift();
                world[poppedTail[0]][poppedTail[1]] = EMPTY; // remove the tail from world
            }
            world[snake[snake.length-1][0]][snake[snake.length-1][1]] = SNAKE; // head
            drawGameState(); // data is updated, update the game screen
        } else { // WALL or SNAKE : both cases, user has lost
            tryStopStepping();
            showGameEnded();
        }
        //update the score visually
        document.getElementById("score").innerHTML = score;
    }

    function tryStopStepping() { // to stop the game (when the user gets back to the menu)
        if (intervalId != -1) { // if -1, no interval is running
            clearInterval(intervalId);
            intervalId = -1; // to not re-try stopping if the user clicks on the button again
        }
    }

    function accelerateStepping() { // snake has eaten : he accelerates
        tryStopStepping();
        if(levelData.delay > levelData.minDelay) levelData.delay -= 50;
        intervalId = window.setInterval(step, levelData.delay);
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
// gameState appelle AJAX pour récupérer le JSON en objet, qu'il stocke en attr currentLevel puis affiche tout