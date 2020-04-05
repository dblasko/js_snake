let gameSoundAssets = (function() {
    let cardiVirus = new Audio('/assets/audio/cardi.mp3');
    let cough = new Audio('/assets/audio/cough.mp3');
    let eatSounds = [cardiVirus, cough];

    let dead = new Audio('/assets/audio/roblox_death.mp3');

    function playEat() {
        let randomSound = eatSounds[Math.floor((Math.random()*eatSounds.length))];
        randomSound.currentTime = 0;
        randomSound.play();
    }

    function playDead() {
        console.log("playing");
        dead.currentTime = 0;
        dead.play();
    }

    return {
        playEat: playEat,
        playDead: playDead,
    };
}());