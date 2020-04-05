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
        /*console.log("playing");
        dead.currentTime = 0;
        dead.play();*/
        /*let source = document.getElementById("source");
        source.src = "/assets/audio/roblox_death.mp3";
        let audio = document.getElementById('player');
        audio.play();*/
        var mySound = new buzz.sound( "/assets/audio/roblox_death.mp3", {});

        mySound.play()
    .fadeIn()
    .loop()
    .bind( "timeupdate", function() {
       var timer = buzz.toTimer( this.getTime() );
       document.getElementById( "timer" ).innerHTML = timer;
    });
    }

    return {
        playEat: playEat,
        playDead: playDead,
    };
}());