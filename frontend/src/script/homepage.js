import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';
import { afficherDivChargement } from './loadingGame';
import { connectWebSocket } from './websockets';

const { playRandomMusic, setMusicVolume } = require('./audio');

const nicknameForm = document.getElementById("nickname");
const popupSettings = document.getElementById("popupSettings");
const popupLogin = document.getElementById("popupLogin");
const popupSignIn = document.getElementById("popupSignIn");
const popupRules = document.getElementById("popupRules")
const settingsButton = document.getElementById("options");
const loginPath = document.getElementById("loginPath");
const signInPath = document.getElementById("signInPath");
const RulesPath = document.getElementById("RulesPath");
const closeRules = document.getElementById("closeRules");
const playForm = document.getElementById("playForm");
const music = document.getElementById("music");
const volumeControlMusic = document.getElementById("volumeControlMusic");
const volumeControlSFX = document.getElementById("volumeControlSFX");
const volumeImageMusic = document.getElementById("volumeMusic");
const volumeImageSFX = document.getElementById("volumeSFX");
const popupCU = document.getElementById("popupCU");
const CUButton = document.getElementById("CUbutton");
const acceptButton = document.getElementById("acceptCU");
const refuseButton = document.getElementById("refuseCU");

let isPopUpDisplayed = false;
let isPopUpLoginDisplayed = false;
let isPopUpSignInDisplayed = false;
let isPopUpRulesDisplayed = false;
let socket;

nicknameForm.placeholder = uniqueNamesGenerator({
    dictionaries: [adjectives, animals, colors],
    length: 2
});

popupSettings.style.display = 'none';
popupLogin.style.display = 'none';
popupSignIn.style.display = 'none';
popupRules.style.display = 'none';

document.getElementById("fullscreen").addEventListener('click', () => {
    const elem = document.documentElement;
    if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
        document.exitFullscreen();
    }
    else if (elem.requestFullscreen) { // Général
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { // Firefox
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { // Chrome
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { // Edge
        elem.msRequestFullscreen();
    }
}
);

window.addEventListener('click', () => {
    playRandomMusic();     
});

volumeControlMusic.addEventListener('input', () => {
    setMusicVolume(parseFloat(volumeControlMusic.value));
});

volumeImageMusic.addEventListener('click', () => {
    if(music.volume === 0) {
        music.volume = parseFloat(volumeControlMusic.value);
    }else {
        music.volume = 0;
    }
});

volumeImageSFX.addEventListener('click', () => {
    if(music.volume === 0) {
        music.volume = parseFloat(volumeControlSFX.value);
    }else {
        music.volume = 0;
    }
});

settingsButton.addEventListener('click', () => {
    if (isPopUpDisplayed) {
        popupSettings.style.display = 'none';
    } else {
        popupSettings.style.display = 'block';
        popupLogin.style.display = 'none';
        popupSignIn.style.display = 'none';
        popupRules.style.display = 'none';
        popupCU.style.display = 'none';
    }
    isPopUpDisplayed = !isPopUpDisplayed;
    isPopUpLoginDisplayed = false;
    isPopUpSignInDisplayed = false;
    isPopUpRulesDisplayed = false;
    document.getElementById('signInCUError').innerText = '';
    document.getElementById('signInConfirmPasswordError').innerText = '';
    document.getElementById('signInPasswordError').innerText = '';
    document.getElementById('signInEmailError').innerText = '';
    document.getElementById('signInNicknameError').innerText = '';
    document.getElementById('loginPasswordError').innerText = '';
    document.getElementById('loginEmailError').innerText = '';
});

loginPath.addEventListener('click', () => {
    if (isPopUpLoginDisplayed) {
        popupLogin.style.display = 'none';
    } else {
        popupLogin.style.display = 'block';
        popupSettings.style.display = 'none';
        popupSignIn.style.display = 'none';
        popupRules.style.display = 'none';
    }
    isPopUpLoginDisplayed = !isPopUpLoginDisplayed;
    isPopUpDisplayed = false;
    isPopUpSignInDisplayed = false;
    isPopUpRulesDisplayed = false;
});

signInPath.addEventListener('click', () => {
    if (isPopUpSignInDisplayed) {
        popupSignIn.style.display = 'none';
    } else {
        popupSignIn.style.display = 'block';
        popupSettings.style.display = 'none';
        popupLogin.style.display = 'none';
        popupRules.style.display = 'none';
    }
    isPopUpSignInDisplayed = !isPopUpSignInDisplayed;
    isPopUpDisplayed = false;
    isPopUpLoginDisplayed = false;
    isPopUpRulesDisplayed = false;
});
RulesPath.addEventListener('click', () => {
    if (isPopUpRulesDisplayed) {
        popupRules.style.display = 'none';
    } else {
        popupRules.style.display = 'block';
        popupSettings.style.display = 'none';
        popupLogin.style.display = 'none';
        popupSignIn.style.display = 'none';
    }
    isPopUpRulesDisplayed = !isPopUpRulesDisplayed;
    isPopUpDisplayed = false;
    isPopUpLoginDisplayed = false;
    isPopUpRulesDisplayed = false;
});

closeRules.addEventListener('click', () => {
    popupRules.style.display = 'none';
    popupSettings.style.display = 'none';
});

CUButton.addEventListener('click', () => {
    settingsButton.style.display = 'none';
    popupCU.style.display = 'block';
});

acceptButton.addEventListener('click', () => {
    settingsButton.style.display = 'block';
    popupCU.style.display = 'none';
    document.getElementById('conditionsUtilisation').checked = true;
    resetErrors();
});

refuseButton.addEventListener('click', () => {
    settingsButton.style.display = 'block';
    popupCU.style.display = 'none';
    popupSignIn.style.display = 'none';
    popupSettings.style.display = 'block';
    resetErrors();
});

// Déconnecter le websocket en quittant la page
window.addEventListener('unload', () => {
    socket.disconnect();
});

/**
 * Démarrage d'une partie
 */
playForm.addEventListener('submit', (e) => {
    e.preventDefault();


    // Masquer le bouton des paramètres
    settingsButton.style.display = 'none';

    // Démarrer l'animation de chargement
    document.querySelector('.homepage').classList.add('slide-up');

    document.querySelector('.background').classList.add('slide-up');

    popupSettings.style.display = 'none';
    popupLogin.style.display = 'none';
    popupSignIn.style.display = 'none';
    popupRules.style.display = 'none';

    // Div chargement
    afficherDivChargement();


    setTimeout(() => {
        let nickname = nicknameForm.value;
        if (nickname === '' || nickname === undefined) nickname = nicknameForm.placeholder;
        connectWebSocket(nickname, null, null);
    }, 2900);
});

function resetErrors () {
    document.getElementById('signInCUError').innerText = '';
    document.getElementById('signInConfirmPasswordError').innerText = '';
    document.getElementById('signInPasswordError').innerText = '';
    document.getElementById('signInEmailError').innerText = '';
    document.getElementById('signInNicknameError').innerText = '';
    document.getElementById('loginPasswordError').innerText = '';
    document.getElementById('loginEmailError').innerText = '';
}