/* eslint-disable global-require */
const cardHoverSFX = require('../sound/card_hover.mp3');
const cardPickSFX = require('../sound/card_pick.mp3');

const volumeImageSrc = require("../img/options/volume.png");
const volumeImageMuteSrc = require("../img/options/volume_mute.png");
const volumeImageSrc1 = require("../img/options/volume_1.png");
const volumeImageSrc2 = require("../img/options/volume_2.png");

const musics = [
    {source : require('../sound/soundtrack/wondrous-waters.mp3')}, 
    {source : require('../sound/soundtrack/elevator-music-jazz.mp3')}, 
    {source : require('../sound/soundtrack/lounge-of-groove.mp3')}, 
    {source : require('../sound/soundtrack/better.mp3')}, 
    {source : require('../sound/soundtrack/jazz-cafe.mp3')}, 
]

let isMusicPlaying = false;
let lastPlayedMusic = null;

const music = document.getElementById('musicSource');
const source = document.getElementById('music');
const volumeControlSFX = document.getElementById('volumeControlSFX');
const volumeImageSFX = document.getElementById("volumeSFX");
volumeControlSFX.value = 0.1;
let value = 0.1;

source.addEventListener("ended", () => {
    source.currentTime = 0;
    isMusicPlaying = false;
   playRandomMusic();
}); 



function playMusic(audioSource) {
    if(isMusicPlaying) return;
    music.src = audioSource;

    source.load();
    source.play();

    isMusicPlaying = true;
    lastPlayedMusic = audioSource;
}

volumeImageSFX.addEventListener('click', () => {
    if(volumeControlSFX.value === '0') {
      volumeControlSFX.value = value.toString();
      volumeImageSFX.src = volumeImageSrc;
    }else {
      value = volumeControlSFX.value;
      volumeControlSFX.value = 0;
      volumeImageSFX.src = volumeImageMuteSrc;
    }
});

volumeControlSFX.addEventListener('input', () => {
  // Mise à jour de la valeur affichée
  if (volumeControlSFX.value === '0') {
    volumeImageSFX.src = volumeImageMuteSrc;
  } else if (volumeControlSFX.value <= '0.2'){
    volumeImageSFX.src = volumeImageSrc1;
} else if (volumeControlSFX.value <= '0.5') {
  volumeImageSFX.src = volumeImageSrc2;
} else {
  volumeImageSFX.src = volumeImageSrc;
}
});

function playSoundEffect(audioSource) {
    const soundEffect = new Audio(audioSource);
    soundEffect.volume = 0.1;
    soundEffect.volume = volumeControlSFX.value;
    document.body.appendChild(soundEffect);
    soundEffect.play();
  
    soundEffect.addEventListener('ended', () => {
        soundEffect.pause();
        document.body.removeChild(soundEffect);
    });
  }

  function setMusicVolume(volume) {
    document.getElementById('music').volume = volume;
  }

  function playRandomMusic() {
    let randomMusic;
    do{
       randomMusic = Math.floor(Math.random() * musics.length); 
    } while(randomMusic.source === lastPlayedMusic);
    playMusic(musics[randomMusic].source);
  }

  function playCardHoverSound() {
    playSoundEffect(cardHoverSFX);
  }

  function playCardPickSound() {
    playSoundEffect(cardPickSFX);
  }


  module.exports = {
    playCardHoverSound,
    playCardPickSound,
    playRandomMusic,
    setMusicVolume,
  };