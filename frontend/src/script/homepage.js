import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';
import { afficherDivChargement } from './loadingGame';
import { connectWebSocket } from './websockets';


const nicknameForm = document.getElementById("nickname");
const popupSettings = document.getElementById("popupSettings");
const popupLogin = document.getElementById("popupLogin");
const popupSignIn = document.getElementById("popupSignIn");
const popupRules = document.getElementById("popupRules")
const settingsButton = document.getElementById("options");
const loginPath = document.getElementById("loginPath");
const signInPath = document.getElementById("signInPath");
const RulesPath = document.getElementById("RulesPath");
const playForm = document.getElementById("playForm");

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

settingsButton.addEventListener('click', () => {
    if (isPopUpDisplayed) {
        popupSettings.style.display = 'none';
    } else {
        popupSettings.style.display = 'block';
        popupLogin.style.display = 'none';
        popupSignIn.style.display = 'none';
        popupRules.style.display = 'none';
    }
    isPopUpDisplayed = !isPopUpDisplayed;
    isPopUpLoginDisplayed = false;
    isPopUpSignInDisplayed = false;
    isPopUpRulesDisplayed = false;
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
    loginPath.style.display = 'none';
    signInPath.style.display = 'none';

    // Div chargement
    afficherDivChargement();

    
    setTimeout(() => {
        let nickname = nicknameForm.value;
        if(nickname === '' || nickname === undefined) nickname = nicknameForm.placeholder;
        connectWebSocket(nickname, null, null);
    }, 2900);
});