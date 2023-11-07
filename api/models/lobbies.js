/* eslint-disable no-param-reassign */

// Un lobby est un objet avec les propriétés suivantes :
// id: un identifiant unique
// players: un tableau de joueurs, contenant un tableau de cartes
// status: 'open' ou 'ingame', un lobby fermé est un lobby supprimé
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

const game = require('./game');

const lobbies = [];
const MAX_PLAYERS_PER_LOBBY = 2;

/**
 * Crée un lobby et l'ajoute au tableau de lobbies
 * @returns un lobby
 */
function addLobby() {
  lobbies.push({
    id: lobbies.length + 1,
    players: [],
    status: 'open',
    direction: 'clockwise',
    currentPlayer: Math.random() * MAX_PLAYERS_PER_LOBBY,
    currentCard: null,
    stack: [],
  });
  return lobbies[lobbies.length - 1];
}

function isPlayerInLobby(player) {
  return lobbies.some((lobby) => lobby.players.includes(player));
}

function getNextAvailableLobby() {
  let lobby = lobbies.find((lob) => lob.status === 'open');
  if (lobby === undefined) lobby = addLobby();
  return lobby;
}

function addPlayerToLobby(player) {
  if (isPlayerInLobby(player)) return false;
  const lobby = getNextAvailableLobby();
  lobby.players.push(player);

  if (lobby.players.length === MAX_PLAYERS_PER_LOBBY) {
    startGame(lobby);
  }
  return true;
}

function removePlayer(player) {
  const lobby = lobbies.find((lob) => lob.players.includes(player));
  const playerIndex = lobby.players.findIndex((ply) => ply === player);
  lobby.players.splice(playerIndex, 1);
}

function setLobbyIngame(lobbyId) {
  const lobby = getLobbyById(lobbyId);
  lobby.status = 'ingame';
}

function addDeckToLobby(lobbyId, deck) {
  const lobby = getLobbyById(lobbyId);
  lobby.decks.push(deck);
}

function getLobbyById(lobbyId) {
  return lobbies.find((lobby) => lobby.id === lobbyId);
}

function deleteLobby(lobbyId) {
  const lobbyIndex = getLobbyById(lobbyId).id;
  lobbies.splice(lobbyIndex, 1);
}

function getPlayers(lobbyId) {
  const lobby = getLobbyById(lobbyId);
  return lobby.players;
}

function startGame(lobby) {
  game.generateCards(lobby);
}

module.exports = {
  addPlayerToLobby,
  removePlayer,
  setLobbyIngame,
  addDeckToLobby,
  getLobbyById,
  deleteLobby,
  getPlayers,
};
