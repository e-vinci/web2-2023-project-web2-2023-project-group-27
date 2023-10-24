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
    
    /* Obtenir le pseudo
    let nickname;
    if(nicknameForm.value === "" ||nicknameForm.value === undefined) nickname = nicknameForm.placeholder;
    else nickname = nicknameForm.value;

     nickname = nickname.replace(/\s/g, "_");
    */

     // Démarrer l'animation de chargement
    document.querySelector('.homepage').classList.add('slide-up');
    document.querySelector('.loadingScreen').classList.add('slide-up');
    document.querySelector('.background').classList.add('slide-up');
    loadingScreen.style.display = 'block';

    // démarrer connexion websocket
    connectWebSocket();
})

function randomNickName() {
    return uniqueNamesGenerator({
        dictionaries: [adjectives, animals, colors],
        length: 2
      });
}


function connectWebSocket() {
    ws = new WebSocket("ws://localhost:8082");
    ws.addEventListener('open', () => {
        console.log("Connecté au serveur");
    });
}