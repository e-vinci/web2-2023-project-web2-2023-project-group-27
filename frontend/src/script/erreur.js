/* eslint-disable no-param-reassign */
/**
 * Afficher un message d'erreur forcant l'utilisateur à rafraichir la page
 * @param {*} message 
 */

let hasErrorDisplayed = false;

const afficherErreur = (message, socket) => {
    if(hasErrorDisplayed) return;
    const options = document.getElementById('options');
    const popupSettings = document.getElementById('popupSettings');
    const popupLogin = document.getElementById('popupLogin');
    const popupSignIn = document.getElementById('popupSignIn');

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
    divErreur.style.zIndex = 10000;
    overlay.style.zIndex = 2000;
    options.style.zIndex = 1100;

    popupSettings.style.display = 'none';
    popupLogin.style.display = 'none';
    popupSignIn.style.display = 'none';

    divErreur.appendChild(img);
    divErreur.appendChild(titre);
    divErreur.appendChild(messageText);
    divErreur.appendChild(boutonRecharger);
    document.body.appendChild(divErreur);
    document.body.appendChild(overlay);
    hasErrorDisplayed = true;
}

module.exports = {
    afficherErreur
};