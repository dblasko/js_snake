let gameState = (function() {
    const EMPTY = 'E', SNAKE = 'S', FOOD = 'F', FOOD_ALT = 'FA', WALL = 'W';

    let snake, world, levelData, score, ticksWithoutEating;
    let x, y;
    let intervalId = -1; // to stop the interval when game is left

    let cHeight = undefined, cWidth = undefined;


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

    function drawGameState() {
        let canvas = document.getElementById("cnv");
        let ctx = canvas.getContext("2d");
        let ctZone = document.getElementById("contentZone");

        // clear the canvas
        ctx.fillStyle ="black";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillRect(0,0,canvas.width, canvas.height);

        if (cHeight == undefined) cHeight = ctZone.clientHeight; //*0.9;
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
                    case SNAKE: if (i === snake[snake.length - 1][0] && j === snake[snake.length - 1][1]) img = gameImageAssets.cVirusHead;
                                else img = gameImageAssets.cVirus;
                        break;
                    case WALL: img = gameImageAssets.sanitizer;
                        break;
                    case FOOD: img = gameImageAssets.paper;
                        break;
                    case FOOD_ALT: img = gameImageAssets.vaccine;
                        break;
                }
                if (img != undefined) ctx.drawImage(img, oX+squareSize*j, oY+squareSize*i, squareSize, squareSize);
                // Draw the tile outline
                ctx.beginPath();
                ctx.strokeStyle = '#c8e65e';
                ctx.rect(oX+squareSize*j, oY+squareSize*i, squareSize, squareSize);
                ctx.stroke();
            }
        }
        
        
    }

    function showGameEnded() {
        let modal = document.getElementById("modale");
        let leave = document.getElementsByClassName("close")[0];
        let scoreSpan = document.getElementById("scoreSpan");

        scoreSpan.innerText = score;
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

    function startGame() { 
        viewHandler.loadScreen(viewHandler.GAME); 
        
        // we make sure all game data is reinitialised (in case the user went back to the menu during a game)
        x = undefined; y = undefined;
        gameInputManager.notifyNewGame();
        score = 0; ticksWithoutEating = 0;
        snake = levelData.snake; 
        world = Array(levelData.dimensions[0]).fill(EMPTY).map(x => Array(levelData.dimensions[1]).fill(EMPTY));
        for (snakePart of snake) world[snakePart[0]][snakePart[1]] = SNAKE;
        for (wall of levelData.walls) world[wall[0]][wall[1]] = WALL;
        for (food of levelData.food) world[food[0]][food[1]] = FOOD;

        drawGameState(); // data is prepared, draw the initial screen and then launch the game

        intervalId = window.setInterval(step, levelData.delay);
    }

    function updateDirection(newX, newY) {
        x = newX;
        y = newY;
    }

    function generateRandomFoodOnMap() {
        do { // generate random coordinates where the map is empty
            y1 = Math.floor((Math.random()*world.length));
            x1 = Math.floor((Math.random()*world[0].length));
        } while(world[y1][x1] != EMPTY); 
        world[y1][x1] = (Math.floor(Math.random() * 10) <=2)? FOOD_ALT : FOOD; // 0.3% chance of having FOOD_ALT
        ticksWithoutEating = 0;
    }

    function removeFoodFromMap() {
        world.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (cell === FOOD || cell === FOOD_ALT) world[rowIndex][colIndex] = EMPTY;
            })
        });
    }

    function popSnakeTail(size) {
        if (size > 1 && snake.length <= 3) size = (snake.length - size <= -1)? 1 : 2;
        for(i=0; i < size; i++) {
            let poppedTail = snake.shift(); // remove the tail from the snake
            world[poppedTail[0]][poppedTail[1]] = EMPTY; // remove the tail from the map
        }
    }

    function step() {
        gameInputManager.askForDirectionRefresh(); // We ask the gameInputManager module to refresh our direction attributes 
        if (x == undefined && y == undefined) return; // We then verify if the user has chosen an initial direction already, else the game doesn't start
        
        let futureHeadLocation; // undefined if gets out of map, else the next block the head will be at
        if((snake[snake.length-1][0] >= world.length -1 && y===1) || (y===-1 && snake[snake.length-1][0] <= 0)) {
            futureHeadLocation = undefined;
        } else {
            futureHeadLocation = world[snake[snake.length-1][0]+y][snake[snake.length-1][1]+x]; // head is at the last position of the snake array
        }

        if (futureHeadLocation != undefined && (futureHeadLocation === FOOD || futureHeadLocation === FOOD_ALT || futureHeadLocation === EMPTY)) {
            if (futureHeadLocation === FOOD || futureHeadLocation === FOOD_ALT) {
                score++; ticksWithoutEating = 0; 
                let x1, y1;
                generateRandomFoodOnMap(); // the head will override the old food, no need to delete it
                if (futureHeadLocation === FOOD_ALT) popSnakeTail(3); // if food_alt, the snake moves + shrinks (=> 2 pops)
                snake.push([snake[snake.length-1][0]+y, snake[snake.length-1][1]+x]); // else, normal food, we don't pop the tail to make him grow
                gameSoundAssets.playEat(); // play sound
                accelerateStepping(); // accelerate if below the limit
            } else { // he just moves forward (EMPTY)
                gameSoundAssets.playStep();
                snake.push([snake[snake.length-1][0]+y, snake[snake.length-1][1]+x]); // add new head to snake
                popSnakeTail(1);
                if (++ticksWithoutEating >= levelData.maxTicksWithoutEating) { // to repop food after a while
                    removeFoodFromMap();
                    generateRandomFoodOnMap(); 
                }
            }
            world[snake[snake.length-1][0]][snake[snake.length-1][1]] = SNAKE; // add new head to map in both cases
            drawGameState(); // data is updated, we can update the game screen 
        } else { // WALL or SNAKE : both cases, user has lost
            gameSoundAssets.playDead();
            tryStopStepping();
            showGameEnded();
        }
        
        document.getElementById("score").innerText = score; //update the score visually
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
        updateDirection: updateDirection,
        notifyLevelSelected: notifyLevelSelected,
        tryStopStepping: tryStopStepping,  
    };
}());