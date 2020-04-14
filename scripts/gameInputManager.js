let gameInputManager = (function() {
    const validKeys = ["ArrowRight", "ArrowUp", "ArrowLeft", "ArrowDown"];
    // CONCEPT : if index < 2 : can't change direction to index+2, if >= 2, can't change to index-2 for incoherent changes

    /* KEYBOARD */
    let key;// current moving direction (validated)
    let keyPressed; // buffer => key the user has requested for the moving direction to change
    
    /* TOUCH */
    let touchstartX = 0, touchstartY = 0, touchendX = 0, touchendY = 0;


    function setTouchStart(x, y) {
        touchstartX = x;
        touchstartY = y;
    }

    function setTouchEnd(x, y) {
        touchendX = x;
        touchendY = y;
    }

    function handleGesture() {
        const { width, height } = gestureZone.getBoundingClientRect();
    
        const ratio_horizontal = (touchendX - touchstartX) / width;
        const ratio_vertical = (touchendY - touchstartY) / height;
        
        if (ratio_horizontal > ratio_vertical && ratio_horizontal > 0.25) {
            setKey("ArrowRight");
        }
        if (ratio_vertical > ratio_horizontal && ratio_vertical > 0.25) {
            setKey("ArrowDown");
        }
        if (ratio_horizontal < ratio_vertical && ratio_horizontal < -0.25) {
            setKey("ArrowLeft");
        }
        if (ratio_vertical < ratio_horizontal && ratio_vertical < -0.25) {
            setKey("ArrowUp");
        }
    }

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
        setTouchEnd: setTouchEnd,
        setTouchStart: setTouchStart,
        handleGesture: handleGesture,
    };
}());


/* KEYBOARD EVENTS */
document.addEventListener("keydown", (event) => {
    gameInputManager.setKey(event.key);
});


/* TOUCH EVENTS */ 
const gestureZone = document.getElementById('contentZone');
gestureZone.addEventListener('touchstart', function(event) {
    gameInputManager.setTouchStart(event.changedTouches[0].screenX, event.changedTouches[0].screenY);
}, false);

gestureZone.addEventListener('touchend', function(event) {
    gameInputManager.setTouchEnd(event.changedTouches[0].screenX, event.changedTouches[0].screenY);
    gameInputManager.handleGesture();
}, false); 
