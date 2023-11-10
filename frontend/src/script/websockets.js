/* eslint-disable arrow-body-style */
/* eslint-disable no-param-reassign */

const socketio = require('socket.io-client');
const erreur = require('./erreur');
const { setLoadingBarPercentage, afficherChargement, afficherInformation, stopAfficherChargement } = require('./loadingGame');

let socket;

const isConnected = () => {
    return socket.connected;
}

/**
 * Connexion au serveur websocket
 */
const connectWebSocket = (nickname) => {
    // return socketio.io('ws://unovinci.alwaysdata.net');
    const io = socketio.io('ws://localhost:8082');
    socket = io;
    let timerPartie;
    // Afficher erreur si pas connecté dans les 15 secondes
    const interval = setTimeout(() => {
        if(!socket.connected) {
            erreur.afficherErreur("Impossible de se connecter au serveur, veuillez réessayer", socket);
        }
    }, 15000);

    io.on("connected", () => {
        addPlayerToServer(nickname);
        stopAfficherChargement();
        clearInterval(interval);
        checkForConnection();
        afficherInformation("Connecté");
        setLoadingBarPercentage(10);

        afficherChargement("Recherche d'une partie");

        io.on('gameUpdate', (infos) => {
            clearInterval(timerPartie);
            
            if(infos.message === 'Partie trouvée') setLoadingBarPercentage(30);
            afficherChargement(infos.message);
        });
})
return io;
}

function checkForConnection() {
    const connectionCheckInterval = setInterval(() => {
        if(!isConnected()) {
            erreur.afficherErreur("La connexion au serveur a été perdue", socket);
            clearInterval(connectionCheckInterval);
        }
    }, 3000)
}

/**
 * Envoie au serveur WebSocket l'ajout d'un nouveau joueur
 * @param {*} nickname le pseudo du joueur
 * @returns rien
 */
function addPlayerToServer(nickname) {
    if(nickname === undefined) return;
    if(socket.connected) socket.emit('addPlayer', nickname, socket.id);
}


module.exports = {
    connectWebSocket,
    checkForConnection,
    addPlayerToServer,
}