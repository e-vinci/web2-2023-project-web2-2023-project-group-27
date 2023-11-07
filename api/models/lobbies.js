// Un lobby est un objet avec les propriétés suivantes :
// id: un identifiant unique
// players: un tableau de joueurs, contenant un tableau de cartes
// status: 'open' ou 'ingame', un lobby fermé est un lobby supprimé

// Actions possible:
// - Créer un lobby => addLobby()
// - Ajouter un joueur à un lobby => addPlayerToLobby(player)
// - Supprimer un joueur d'un lobby => removePlayer(player)
// - Mettre un lobby en jeu => setLobbyIngame(lobbyId)
// - Ajouter un deck à un lobby => addDeckToLobby(lobbyId, deck)
// - Récupérer un lobby par son id => getLobbyById(lobbyId)
// - Supprimer un lobby => deleteLobby(lobbyId)
// - Récupérer les joueurs d'un lobby => getPlayers(lobbyId)

const lobbies = [];

/**
 * Crée un lobby et l'ajoute au tableau de lobbies
 * @returns un lobby
 */
function addLobby() {
  lobbies.push({
    id: lobbies.length + 1,
    players: [],
    status: 'open',
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
  console.log(`added ${player.username} to lobby ${lobby.id}`);
  return true;
}

function removePlayer(player) {
  const lobby = lobbies.find((lob) => lob.players.includes(player));
  const playerIndex = lobby.players.findIndex((ply) => ply === player);
  lobby.players.splice(playerIndex, 1);
}

function setLobbyIngame(lobbyId) {
  const lobby = lobbies.find((lob) => lob.id === lobbyId);
  lobby.status = 'ingame';
}

function addDeckToLobby(lobbyId, deck) {
  const lobby = lobbies.find((lob) => lob.id === lobbyId);
  lobby.decks.push(deck);
}

function getLobbyById(lobbyId) {
  return lobbies.find((lobby) => lobby.id === lobbyId);
}

function deleteLobby(lobbyId) {
  const lobbyIndex = lobbies.findIndex((lobby) => lobby.id === lobbyId);
  lobbies.splice(lobbyIndex, 1);
}

function getPlayers(lobbyId) {
  const lobby = lobbies.find((lob) => lob.id === lobbyId);
  return lobby.players;
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
