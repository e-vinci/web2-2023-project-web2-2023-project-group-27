import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';

const nicknameForm = document.getElementById("nickname");
const popupSettings = document.getElementById("popupSettings");
const popupLogin = document.getElementById("popupLogin");
const popupSignIn = document.getElementById("popupSignIn");
const settingsButton = document.getElementById("options");
const loginPath = document.getElementById("loginPath");
const signInPath = document.getElementById("signInPath");
const playForm = document.getElementById("playForm");
const loadingScreen = document.querySelector(".loadingScreen");

let isPopUpDisplayed = false;
let isPopUpLoginDisplayed = false;
let isPopUpSignInDisplayed = false;
let ws;

nicknameForm.placeholder = randomNickName();
popupSettings.style.display = 'none';
loadingScreen.style.display = 'none';
popupLogin.style.display = 'none';
popupSignIn.style.display = 'none';

settingsButton.addEventListener('click', () => {
    if(isPopUpDisplayed) {
    popupSettings.style.display = 'none';
    } else {
    popupSettings.style.display = 'block';
    popupLogin.style.display = 'none';
    popupSignIn.style.display = 'none';
    }
    isPopUpDisplayed = !isPopUpDisplayed;
});

loginPath.addEventListener('click', () => {
    if(isPopUpLoginDisplayed) {
    popupLogin.style.display = 'none';
    } else {
    popupLogin.style.display = 'block';
    popupSettings.style.display = 'none';
    popupSignIn.style.display = 'none';
    }
    isPopUpLoginDisplayed = !isPopUpLoginDisplayed;
});

signInPath.addEventListener('click', () => {
    if(isPopUpSignInDisplayed) {
    popupSignIn.style.display = 'none';
    } else {
    popupSignIn.style.display = 'block';
    popupSettings.style.display = 'none';
    popupLogin.style.display = 'none';
    }
    isPopUpSignInDisplayed = !isPopUpSignInDisplayed;
});

playForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Démarrer l'animation de chargement
    document.querySelector('.homepage').classList.add('slide-up');
    document.querySelector('.loadingScreen').classList.add('slide-up');
    document.querySelector('.background').classList.add('slide-up');

    loadingScreen.style.display = 'block';
    popupSettings.style.display = 'none';
    popupLogin.style.display = 'none';
    popupSignIn.style.display = 'none';
    
    // Obtenir le pseudo
    let nickname;
    if(nicknameForm.value === "" || nicknameForm.value === undefined) nickname = nicknameForm.placeholder;
    else nickname = nicknameForm.value;
    nickname = nickname.replace(/\s/g, "_");

    // Démarrer connexion websocket
    connectWebSocket();

    ws.addEventListener('open', () => {
        addPlayerToServer(nickname);
      });
      
      ws.addEventListener('close', () => {
        // eslint-disable-next-line no-alert
        alert("La connexion au serveur a échoué\nPour le groupe => Faites npm start sur le dossier api");
        window.location.reload();
      });
   
})


/**
 * génère un pseudo aléatoire
 * @returns Le pseudo
 */
function randomNickName() {
    return uniqueNamesGenerator({
        dictionaries: [adjectives, animals, colors],
        length: 2
      });
}

/**
 * Connexion au serveur websocket
 */
function connectWebSocket() {
    ws = new WebSocket("ws://localhost:8082");

    ws.addEventListener('message', () => {
        // réception des messages venant du serveur
      });
}


/**
 * Envoie au serveur WebSocket l'ajout d'un nouveau joueur
 * @param {*} nickname le pseudo du joueur
 * @returns rien
 */
function addPlayerToServer(nickname) {
    if(nickname === undefined) return;
    if(ws.readyState === WebSocket.OPEN) ws.send(nickname);
}