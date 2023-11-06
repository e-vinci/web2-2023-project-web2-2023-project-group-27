import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';

const socketio = require('socket.io-client');

const nicknameForm = document.getElementById("nickname");
const popupSettings = document.getElementById("popupSettings");
const popupLogin = document.getElementById("popupLogin");
const popupSignIn = document.getElementById("popupSignIn");
const settingsButton = document.getElementById("options");
const loginPath = document.getElementById("loginPath");
const signInPath = document.getElementById("signInPath");
const playForm = document.getElementById("playForm");
const options = document.getElementById("options");

let isPopUpDisplayed = false;
let isPopUpLoginDisplayed = false;
let isPopUpSignInDisplayed = false;
let socket;
let divColorBar;

nicknameForm.placeholder = randomNickName();
popupSettings.style.display = 'none';
popupLogin.style.display = 'none';
popupSignIn.style.display = 'none';

document.getElementById("fullscreen").addEventListener('click', () => {
const elem = document.documentElement;
if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
    document.exitFullscreen();
  }
else if(elem.requestFullscreen) { // Général
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
    if(isPopUpDisplayed) {
        popupSettings.style.display = 'none';
    } else {
        popupSettings.style.display = 'block';
        popupLogin.style.display = 'none';
        popupSignIn.style.display = 'none';
    }
    isPopUpDisplayed = !isPopUpDisplayed;
    isPopUpLoginDisplayed = false;
    isPopUpSignInDisplayed = false;
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
    isPopUpDisplayed = false;
    isPopUpSignInDisplayed = false;
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
    isPopUpDisplayed = false;
    isPopUpLoginDisplayed = false;
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

    // Démarrer l'animation de chargement
    document.querySelector('.homepage').classList.add('slide-up');

    document.querySelector('.background').classList.add('slide-up');

    popupSettings.style.display = 'none';
    popupLogin.style.display = 'none';
    popupSignIn.style.display = 'none';
    
    // Obtenir le pseudo
    let nickname;
    if(nicknameForm.value === "" || nicknameForm.value === undefined) nickname = nicknameForm.placeholder;
    else nickname = nicknameForm.value;
    nickname = nickname.replace(/\s/g, "_");

    // Div chargement
    const loadingScreen = document.createElement('div');
        loadingScreen.className = 'loadingScreen';
        loadingScreen.classList.add('slide-up');

    const loadingTitle = document.createElement('h1');
        loadingTitle.id = 'loadingTitle';
        loadingTitle.textContent = 'Nous recherchons une partie pour vous';

    const loadingInformation = document.createElement('h2');
        loadingInformation.id = 'loadingInformation';

    const divLoadingBar = document.createElement('div');
        divLoadingBar.id = 'loadingBar'

        divColorBar = document.createElement('div');
        divColorBar.id = 'loadingColorBar';
        divColorBar.style.width = '2%';

    loadingScreen.appendChild(loadingTitle);
    loadingScreen.appendChild(loadingInformation);
    divLoadingBar.appendChild(divColorBar)
    loadingScreen.appendChild(divLoadingBar);
    document.body.appendChild(loadingScreen);
    loopConnection();


    setTimeout(() => {
        loadingScreen.classList.remove('slide-up');
        // Démarrer connexion websocket
        const timerConnection = setInterval(() => loopConnection(), 1000);
        connectWebSocket();

        // Afficher erreur si pas connecté dans les 10 secondes
        const timerConnection2 = setTimeout(() => {
            if(!socket.connected) {
                afficherErreur("Impossible de se connecter au serveur, veuillez réessayer");
            }
        }, 10000);

        // évènement quand le socket est connecté
        socket.on("connected", () => {
            addPlayerToServer(nickname);
            clearInterval(timerConnection)
            clearTimeout(timerConnection2);
            checkForConnection();
            loadingInformation.textContent = "Connecté";
            divColorBar.style.width = '10%';
        });

    }, 2900)
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
    socket = socketio.io('ws://localhost:8082');
}

function checkForConnection() {
    const interval = setInterval(() => {
        if(!socket.connected) {
            afficherErreur("La connexion au serveur a été perdue");
            clearInterval(interval);
        }
    }, 5000)
}


/**
 * Envoie au serveur WebSocket l'ajout d'un nouveau joueur
 * @param {*} nickname le pseudo du joueur
 * @returns rien
 */
function addPlayerToServer(nickname) {
    if(nickname === undefined) return;
    if(socket.connected) socket.emit('addPlayer', nickname);
}


/**
 * Afficher un message d'erreur forcant l'utilisateur à rafraichir la page
 * @param {*} message 
 */
function afficherErreur(message) {
    socket.disconnect();
    
    const divErreur = document.createElement('div');
    divErreur.className = 'erreur-message';
    divErreur.style.zIndex = 100;

    const titre = document.createElement('h1');
    titre.textContent = 'Une erreur est survenue';

    const messageText = document.createElement('p');
    messageText.textContent = message;

    const img = document.createElement("div");
    img.className = "error-image";

    const boutonRecharger = document.createElement('button');
    boutonRecharger.textContent = 'Recharger la page';
    boutonRecharger.addEventListener('click', () => {
        window.location.reload();
    });

    const overlay = document.createElement('div');
    overlay.className = 'overlay';

    document.body.style.zIndex = -1;
    divErreur.style.zIndex = 1;
    overlay.style.zIndex = 0;
    options.style.zIndex = -12;

    popupSettings.style.display = 'none';
    popupLogin.style.display = 'none';
    popupSignIn.style.display = 'none';

    divErreur.appendChild(img);
    divErreur.appendChild(titre);
    divErreur.appendChild(messageText);
    divErreur.appendChild(boutonRecharger);

    document.body.appendChild(divErreur);
    document.body.appendChild(overlay);
}

function loopConnection() {
    const text = document.getElementById("loadingInformation");
    switch(text.innerText) {
    case 'Connexion au serveur...':
        text.innerText = 'Connexion au serveur.';
        break;
    case 'Connexion au serveur.':
        text.innerText = 'Connexion au serveur..';
        break;
    case 'Connexion au serveur..':
        text.innerText = 'Connexion au serveur...';
        break;
    default:
        text.innerText = 'Connexion au serveur.';
        break;
    }
}