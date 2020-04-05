let gameSoundAssets = (function() {
    // const cough = new Audio('/assets/audio/cough.mp3');
    const audioPath = '/assets/audio/';
    const cardiVirus = audioPath + 'cardi.mp3'
    const cough = audioPath + 'cough.mp3';
    const eatSounds = [cardiVirus, cough];

    const dead = audioPath + 'roblox_death.mp3';

    const step = audioPath + 'step.mp3';

    function playEat() {
        let randomSound = eatSounds[Math.floor((Math.random()*eatSounds.length))];
        /*randomSound.currentTime = 0;
        randomSound.play();*/
        let sound = new buzz.sound(randomSound, {});
        sound.play().fadeIn();
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

    function playStep() {
        let sound = new buzz.sound(step, {});
        sound.play().fadeIn();
    }

    return {
        playEat: playEat,
        playDead: playDead,
    };
}());