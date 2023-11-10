/* eslint-disable no-param-reassign */

// Un lobby est un objet avec les propriétés suivantes :
// id: un identifiant unique
// players: un tableau de joueurs, contenant un tableau de cartes
// direction: 'clockwise' ou 'counterclockwise', le sens de rotation du jeu
// currentPlayer: l'index du joueur actuel dans le tableau des joueurs
// currentCard: la dernière carte jouée
// stack: La pioche de cartes

// Actions possible:
// - Créer un lobby => addLobby()
// - Ajouter un joueur à un lobby => addPlayerToLobby(player)
// - Supprimer un joueur d'un lobby => removePlayer(player)
// - Mettre un lobby en jeu => setLobbyIngame(lobbyId)
// - Ajouter un deck à un lobby => addDeckToLobby(lobbyId, deck)
// - Récupérer un lobby par son id => getLobbyById(lobbyId)
// - Supprimer un lobby => deleteLobby(lobbyId)
// - Récupérer les joueurs d'un lobby => getPlayers(lobbyId)

const io = require('../websockets/websockets');
const game = require('./game');
const players = require('./players');

const lobbies = [];
const MAX_PLAYERS_PER_LOBBY = 4;

/**
 * Crée un lobby et l'ajoute au tableau de lobbies
 * @returns un lobby
 */
function addLobby() {
  lobbies.push({
    id: lobbies.length + 1,
    players: [],
    direction: 'clockwise',
    currentPlayer: Math.random() * MAX_PLAYERS_PER_LOBBY,
    currentCard: null,
    stack: [],
    maxPlayers: MAX_PLAYERS_PER_LOBBY,
    humanPlayersCount: 0,
  });
  return lobbies[lobbies.length - 1];
}

function deleteLobby(lobby) {
  const index = lobbies.indexOf(lobby);
  if (index !== -1) {
    lobbies.splice(index, 1);
  }
}

function isPlayerInLobby(player) {
  return lobbies.some((lobby) => lobby.players.includes(player));
}

function getNextAvailableLobby() {
  let lobby = lobbies.find((lob) => lob.humanPlayersCount < MAX_PLAYERS_PER_LOBBY);
  if (lobby === undefined) lobby = addLobby();
  return lobby;
}

function addPlayerToLobby(player) {
  if (isPlayerInLobby(player)) return false;
  const lobby = getNextAvailableLobby();
  if (lobby.players.length !== lobby.humanPlayersCount) {
    const playerToUpdate = lobby.players.find((play) => !play.isHuman);
    playerToUpdate.isHuman = true;
    playerToUpdate.socketId = player.socketId;
    playerToUpdate.username = player.username;
    playerToUpdate.isReady = false;
  } else {
    lobby.players.push(player);
  }
  lobby.humanPlayersCount += 1;

  for (let i = 0; i < lobby.players.length; i += 1) {
    io.sendSocketToId(lobby.players[i].socketId, 'gameUpdate', { message: `En attente d'autre joueurs (${lobby.humanPlayersCount}/${MAX_PLAYERS_PER_LOBBY})` });
  }
  if (lobby.players.length === MAX_PLAYERS_PER_LOBBY) {
    startGame(lobby);
  }
  return lobby;
}

function removePlayer(socketId) {
  const player = players.getPlayerBySocket(socketId);
  const lobby = lobbies.find((lob) => lob.players.includes(player));
  if (lobby === undefined) return;

  player.isHuman = false;
  player.socketId = null;

  lobby.humanPlayersCount -= 1;
  for (let i = 0; i < lobby.players.length; i += 1) {
    io.sendSocketToId(lobby.players[i].socketId, 'gameUpdate', { message: `En attente d'autre joueurs (${lobby.humanPlayersCount}/${MAX_PLAYERS_PER_LOBBY})` });
  }
  if (lobby.humanPlayersCount === 0) deleteLobby(lobby);
}

function addDeckToLobby(lobbyId, deck) {
  const lobby = getLobbyById(lobbyId);
  lobby.decks.push(deck);
}

function getLobbyById(lobbyId) {
  return lobbies.find((lobby) => lobby.id === lobbyId);
}

function getPlayers(lobbyId) {
  const lobby = getLobbyById(lobbyId);
  return lobby.players;
}

function startGame(lobby) {
  for (let i = 0; i < lobby.players.length; i += 1) {
    io.sendSocketToId(lobby.players[i].socketId, 'gameUpdate', { message: 'Partie trouvée' });
  }
  // Attend que tous les joueurs soient prêts
  let isEveryPlayersReady = false;

  const interval = setInterval(() => {
    isEveryPlayersReady = true;
    for (let i = 0; i < lobby.players.length; i += 1) {
      if (!lobby.players[i].isReady) isEveryPlayersReady = false;
    }

    if (isEveryPlayersReady) {
      clearInterval(interval);
      game.generateCards(lobby);
    }
  }, 1000);
}

module.exports = {
  addPlayerToLobby,
  removePlayer,
  addDeckToLobby,
  getLobbyById,
  deleteLobby,
  getPlayers,
};
