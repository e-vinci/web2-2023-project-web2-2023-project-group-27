/* eslint-disable arrow-body-style */
/* eslint-disable no-param-reassign */

const socketio = require('socket.io-client');
const { generatingGame, displayPlayerWhoPlay, addCard, setLastCard, reverseDirection, displayColorChoice, displayDrawCard, imageContreUno, vinci, contreUnoDone } = require('./game');

const erreur = require('./erreur');
const { setLoadingBarPercentage, afficherChargement, afficherInformation, stopAfficherChargement, updateLoadingTitle, fairePartirLeChargement, cacherDivQuiCacheLeChargement } = require('./loadingGame');
const { updatePlayer, removeCard, imageUno, endGame } = require('./game');
const { generateChatBox, addMessage } = require('./chat');
const { playError, playCardPlaySound } = require('./audio');

// const link = 'srv03.wildzun.fr:25568';

// const link = 'ws://localhost:25568';

// const link = 'https://unovinci.webpubsub.azure.com';

let io;
let isGameStarted = false;
let hasStarted = false;

const isConnected = () => {
    return io.connected;
}

/**
 * Connexion au serveur websocket
 */
const connectWebSocket = (nickname) => {
     io = socketio.io("https://unovinci.webpubsub.azure.com", {
        path: "/clients/socketio/hubs/hub",
    }); 
    let timerPartie;
    // Afficher erreur si pas connecté dans les 15 secondes
    const interval = setTimeout(() => {
        if (!io.connected) {
            erreur.afficherErreur("Impossible de se connecter au serveur, veuillez réessayer", io);
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
            if (!isGameStarted) {
                if (infos.message === 'Partie trouvée') setLoadingBarPercentage(30);
                afficherChargement(infos.message);
            }
        });

        io.on('gameStart', (lobby) => {
            isGameStarted = true;
            hasStarted = lobby.hasStarted;
            if(!lobby.hasStarted) updateLoadingTitle('La partie va bientôt commencer');
            else updateLoadingTitle('Vous allez rejoindre une partie déjà commencée');
            afficherChargement('Chargement du terrain de jeu');
            io.emit('getLobbyInfo');
        });

        io.on('lobbyInfo', (lobby) => {
            generatingGame(lobby);
            generateChatBox();
            cacherDivQuiCacheLeChargement();
            setLoadingBarPercentage(100);

            setTimeout(() => {
            updateLoadingTitle('Bonne partie !');
            fairePartirLeChargement();
            }, 1000);

            setTimeout(() => {
                stopAfficherChargement();
            }, 5000);
        });

        io.on('newPlayer', (player) => {
            updatePlayer(player);
        })

        io.on('nextPlayer', (playerId) => {
            displayPlayerWhoPlay(playerId);
        })

        io.on('cardDrawn', (infos) => {
            addCard(infos.toPlayer, infos.card);
        })

        io.on('cardPlayed', (infos) => {
            setLastCard(infos.card);
            removeCard(infos.toPlayer, infos.card);
            playCardPlaySound();
        })

        io.on('chatMessage', (message) => {
            addMessage(message.message, message.isInformational);
        });

        io.on('invalidCard', () => {
           playError();
        });

        io.on('newDirection', (direction) => {
            reverseDirection(direction);
        });

        io.on('colorChoice', (infos) => {
            displayColorChoice(infos.cardType);
        });
        io.on('noCardPlayable', () => {
            displayDrawCard();
        });
        io.on('endGame', (infos) => {
            endGame(infos);
        });
        io.on('kicked', (message) => {
            erreur.afficherErreur(message, io);
        });
        io.on('uno', () => {
            imageUno();
        });
        io.on('contreUno', () => {
            imageContreUno();
        });
        io.on('vinci', (infos) => {
            vinci(infos.playerId);
        })
        io.on('contreUnoDone', (infos) => {
            contreUnoDone(infos.playerId);
            const element = document.querySelector('.image-uno');
            if(element !== null ) element.remove();
        });
});

setTimeout(() => {
    erreur.stopIgnoreError();
}, 1000);
return io;
}

function disconnectWebSocket() {
    if(io !== null) {
        io.disconnect();
    }
}

function whoPlayIfALreadyStarted() {
        if(hasStarted) sendSocketToServer('whoPlay');
}

function checkForConnection() {
    const connectionCheckInterval = setInterval(() => {
        if (!isConnected()) {
            erreur.afficherErreur("La connexion au serveur a été perdue", io);
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
    if (nickname === undefined) return;
    if (io.connected) io.emit('addPlayer', nickname, io.id);
}

function sendSocketToServer (type, value) {
    if(io === null ||type === null) return;
    io.emit(type, value);
}


module.exports = {
    connectWebSocket,
    checkForConnection,
    addPlayerToServer,
    sendSocketToServer,
    whoPlayIfALreadyStarted,
    disconnectWebSocket,
}