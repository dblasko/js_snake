let gameInputManager = (function() {
    const validKeys = ["ArrowRight", "ArrowUp", "ArrowLeft", "ArrowDown"];
    // CONCEPT : if index < 2 : can't change direction to index+2, if >= 2, can't change to index-2 for incoherent changes

    let key;// current moving direction (validated)
    let keyPressed; // buffer => key the user has requested for the moving direction to change
    
    
    function setKey(pressedKey) {
        if (validKeys.includes(pressedKey)) keyPressed = pressedKey;
    }

    function notifyNewGame() { // we reset the pressed keys at the beginning of the game to make sure to wait for the initial direction input
        key = undefined;
        keyPressed = undefined;
    }

    function askForDirectionRefresh() {
        if(validKeys.indexOf(keyPressed) < 2) { // for the logic, check the validKeys declaration
            if (validKeys.indexOf(key) !== validKeys.indexOf(keyPressed) + 2) key = keyPressed;
        } else { // index >= 2 
            if (validKeys.indexOf(key) !== validKeys.indexOf(keyPressed) - 2) key = keyPressed;
        }

        if (key == undefined) return; // we wait for the user to choose a direction to start the game
        // so until he chooses, we leave x & y at undefined

        let x=0, y=0; // determine movement direction
        switch(key) {
            case "ArrowUp":     y=-1; break;
            case "ArrowDown":   y=1; break;
            case "ArrowLeft":   x=-1; break;
            default:            x=1; break;
        }
        gameState.updateDirection(x,y);
    }
    
    return {
        setKey: setKey,
        notifyNewGame: notifyNewGame,
        askForDirectionRefresh: askForDirectionRefresh,
    };
}());


document.addEventListener("keydown", (event) => {
    gameInputManager.setKey(event.key);
});