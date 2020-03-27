let gameState = (function() {
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
        [EMPTY, EMPTY, SNAKE, EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
    ];
    // L’information sur le serpent est donc stockée de manière redondante dans ces deux tableaux. Cette redondance rendra la gestion du jeu plus simple par la suite.


    return {

    };
}());