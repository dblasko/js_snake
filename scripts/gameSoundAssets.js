let gameSoundAssets = (function() {
    const audioPath = '/assets/audio/';
    const cardiVirus = new buzz.sound(audioPath + 'cardi.mp3', {});
    const cough = new buzz.sound(audioPath + 'cough.mp3', {});
    const eatSounds = [cardiVirus, cough];

    const dead = new buzz.sound(audioPath + 'roblox_death.mp3', {});

    const step = new buzz.sound(audioPath + 'step.mp3', {});

    function playEat() {
        let randomSound = eatSounds[Math.floor((Math.random()*eatSounds.length))];
        randomSound.play().fadeIn();
    }

    function playDead() {
        dead.play().fadeIn();
    }

    function playStep() {
        step.play().fadeIn();
    }

    return {
        playEat: playEat,
        playDead: playDead,
        playStep: playStep,
    };
}());