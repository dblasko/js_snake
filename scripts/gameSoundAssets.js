let gameImageAssets = (function() {
    let cardiVirus = new Audio('/assets/audio/cardi.mp3');
    let cough = new Audio('/assets/audio/cough.mp3');
    let eatSounds = [cardiVirus, cough];

    let dead = new Audio('/assets/audio/roblox_death.mp');

    function playEat() {
        let randomSound = eatSounds[Math.floor((Math.random()*eatSounds.length))];
        randomSound.play();
    }

    function playDead() {
        dead.play();
    }

    return {
        playEat: playEat,
        playDead: playDead,
    };
}());