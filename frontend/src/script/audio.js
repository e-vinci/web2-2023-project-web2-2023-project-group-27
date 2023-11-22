/* eslint-disable global-require */
const cardHoverSFX = require('../sound/card_hover.mp3');
const cardPickSFX = require('../sound/card_pick.mp3');

const musics = [
    {source : require('../sound/soundtrack/wondrous-waters.mp3')}, 
    {source : require('../sound/soundtrack/elevator-music-jazz.mp3')}, 
    {source : require('../sound/soundtrack/lounge-of-groove.mp3')}, 
    {source : require('../sound/soundtrack/better.mp3')}, 
]

let isMusicPlaying = false;
let lastPlayedMusic = null;

function playMusic(audioSource) {
    if(isMusicPlaying) return;
    const music = document.getElementById('musicSource');
    music.src = audioSource;

    const source = document.getElementById('music')
    source.load();
    source.play();

    source.addEventListener("ended", () => {
        source.currentTime = 0;
        isMusicPlaying = false;
       playRandomMusic();
    }); 
    isMusicPlaying = true;
    lastPlayedMusic = audioSource;
}

function playSoundEffect(audioSource) {
    const soundEffect = new Audio(audioSource);
    soundEffect.volume = document.getElementById('volumeControlSFX').value;
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
    } while(randomMusic === lastPlayedMusic);
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