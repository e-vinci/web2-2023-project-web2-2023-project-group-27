/* eslint-disable global-require */
const cardHoverSFX = require('../sound/card_hover.mp3');
const cardPickSFX = require('../sound/card_pick.mp3');

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
  const defaultValue = 0.5
  
    if(volumeControlSFX.value === '0') {
      volumeControlSFX.value = defaultValue.toString();
    }else {
      volumeControlSFX.value = 0;
    }
    console.log(typeof(volumeControlSFX.value));
    console.log(typeof(defaultValue));
});


function playSoundEffect(audioSource) {
    const soundEffect = new Audio(audioSource);
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