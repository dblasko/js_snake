let gameSoundAssets = (function() {
    const cardiVirus = '/assets/audio/cardi.mp3'
    // const cough = new Audio('/assets/audio/cough.mp3');
    const cough = '/assets/audio/cough.mp3';
    const eatSounds = [cardiVirus, cough];

    const dead = '/assets/audio/roblox_death.mp3';

    function playEat() {
        let randomSound = eatSounds[Math.floor((Math.random()*eatSounds.length))];
        /*randomSound.currentTime = 0;
        randomSound.play();*/
        let sound = new buzz.sound(randomSound, {});
        sound.play.fadeIn();
    }

    function playDead() {
        /*console.log("playing");
        dead.currentTime = 0;
        dead.play();*/
        /*let source = document.getElementById("source");
        source.src = "/assets/audio/roblox_death.mp3";
        let audio = document.getElementById('player');
        audio.play();*/
        let sound = new buzz.sound(dead, {});
        sound.play().fadeIn();
    }

    return {
        playEat: playEat,
        playDead: playDead,
    };
}());