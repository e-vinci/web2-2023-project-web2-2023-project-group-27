import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';

const nicknameForm = document.getElementById("nickname");
const popupSettings = document.getElementById("popupSettings");
const settingsButton = document.getElementById("options");
const playForm = document.getElementById("playForm");
const loadingScreen = document.querySelector(".loadingScreen");

let isPopUpDisplayed = false;
let ws;

nicknameForm.placeholder = randomNickName();
popupSettings.style.display = 'none';
loadingScreen.style.display = 'none';

settingsButton.addEventListener('click', () => {
    if(isPopUpDisplayed) {
    popupSettings.style.display = 'none';
    } else {
    popupSettings.style.display = 'block';
    }
    isPopUpDisplayed = !isPopUpDisplayed;
});


playForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Démarrer l'animation de chargement
    document.querySelector('.homepage').classList.add('slide-up');
    document.querySelector('.loadingScreen').classList.add('slide-up');
    document.querySelector('.background').classList.add('slide-up');

    loadingScreen.style.display = 'block';
    popupSettings.style.display = 'none';

    // Obtenir le pseudo
    let nickname;
    if(nicknameForm.value === "" || nicknameForm.value === undefined) nickname = nicknameForm.placeholder;
    else nickname = nicknameForm.value;
    nickname = nickname.replace(/\s/g, "_");

    // Démarrer connexion websocket
    connectWebSocket();

    const interval = setInterval(() => {
        if(ws.readyState === WebSocket.OPEN) {
            addPlayerToServer(nickname);
            clearInterval(interval);
        }
        if(ws.readyState === WebSocket.CLOSED) {
            // eslint-disable-next-line no-alert
            alert("La connexion au serveur a échoué\nPour le groupe => Faites npm start sur le dossier api");
            window.location.reload();
            clearInterval(interval);
        }
    }, 2000)
   
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