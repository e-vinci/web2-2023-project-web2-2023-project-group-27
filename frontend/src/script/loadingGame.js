/* eslint-disable camelcase */

let divColorBar;
let interval_Display;
let divLoadingBar;
let loadingInformation;
let loadingTitle;
let divChargement;
let divChargement2;
let loadingScreen;

/**
 * Anime un message en ajoutant des points sur un élément HTML. 
 * Il faut appeller cette méthode plusieurs fois pour à chaque fois ajouter un point. 
 * Se reset après 3 points
 * @param {*} element L'élément HTML (doit avoir un ID)
 * @param {*} text Le message à afficher
 * @returns The new String
 */
const displayLoadingStatus = (text) => {
    let textElement = loadingInformation.innerText;
    switch (textElement) {
        case `${text}.`:
            textElement = `${text}..`;
            break;
        case `${text}..`:
            textElement = `${text}...`;
            break;
        case `${text}...`:
            textElement = `${text}.`;
            break;
        default:
            textElement = `${text}.`;
            break;
    }
    loadingInformation.innerText = textElement;
}

const stopAfficherChargement = () => {
    clearInterval(interval_Display);
    interval_Display = undefined;
}

const afficherDivQuiCacheLeChargement = () => {
    document.body.appendChild(divChargement);
    document.body.appendChild(divChargement2);
}

const cacherDivQuiCacheLeChargement = () => {
    divChargement.style.animation = 'hideDivAnimation 5s forwards';
    divChargement2.style.animation = 'hideDivAnimation 5s forwards';

    setTimeout(() => {
        divChargement.style.display = "none";
        divChargement2.style.display = "none";
    }, 5000);
}

function fairePartirLeChargement() {
    loadingScreen.style.animation = 'readyToPlay 5s ease-in forwards';
}


const afficherChargement = (text) => {
    if (interval_Display !== undefined) {
        stopAfficherChargement();
    }
    interval_Display = setInterval(() => displayLoadingStatus(text), 1000);
}

const afficherInformation = (text) => {
    loadingInformation.innerText = text;
}

const setLoadingBarPercentage = (percentage) => {
    divColorBar.style.width = `${percentage}%`;
}

const afficherDivChargement = () => {
    loadingScreen = document.createElement('div');
        loadingScreen.className = 'loadingScreen';
        loadingScreen.style.animation = 'startingPlay2 3s forwards';

    loadingTitle = document.createElement('h1');
    loadingTitle.id = 'loadingTitle';
    loadingTitle.textContent = 'Nous recherchons une partie pour vous';

    loadingInformation = document.createElement('h2');
    loadingInformation.style.cursor = 'default';
    loadingInformation.id = 'loadingInformation';
    loadingInformation.innerText = "Connexion au serveur";

    divLoadingBar = document.createElement('div');
    divLoadingBar.id = 'loadingBar'

    divColorBar = document.createElement('div');
    divColorBar.id = 'loadingColorBar';
    divColorBar.style.width = '2%';

    divChargement = document.createElement('div');
    divChargement.id = 'divChargement';
    divChargement2 = document.createElement('div');
    divChargement2.id = 'divChargement2';

    loadingScreen.appendChild(loadingTitle);
    loadingScreen.appendChild(loadingInformation);
    divLoadingBar.appendChild(divColorBar)
    loadingScreen.appendChild(divLoadingBar);
    document.body.appendChild(loadingScreen);

    setTimeout(() => {
        loadingScreen.style.animation = 'logoMove 2s infinite';
        afficherDivQuiCacheLeChargement();
        afficherChargement('Connexion au serveur');
        document.querySelector(".homepage").style.display = "none";
}, 2900)
};

const updateLoadingTitle = (text) => {
    loadingTitle.textContent = text;
}


function debugCacherChargement() {
    loadingScreen.style.display = "none";
    divChargement.style.display = "none";
    divChargement2.style.display = "none";
}


module.exports = {
    afficherChargement,
    stopAfficherChargement,
    setLoadingBarPercentage,
    afficherInformation,
    afficherDivChargement,
    updateLoadingTitle,
    afficherDivQuiCacheLeChargement,
    cacherDivQuiCacheLeChargement,
    debugCacherChargement,
    fairePartirLeChargement,
};