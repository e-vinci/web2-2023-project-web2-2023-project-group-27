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
  const lobby = {
    id: lobbies.length + 1,
    players: [],
    direction: 'clockwise',
    // currentPlayer: Math.floor(Math.random() * MAX_PLAYERS_PER_LOBBY),
    currentPlayer: 0,
    currentCard: null,
    stack: [],
    maxPlayers: MAX_PLAYERS_PER_LOBBY,
    humanPlayersCount: 0,
    hasStarted: false,
    isAwaitingForColorChoice: false,
    timerChoice: null,
  };
  lobbies.push(lobby);

  setTimeout(() => {
    if (getLobbyById(lobby.id) !== undefined) {
      if (lobby.hasStarted) return;
      for (let i = 0; i < MAX_PLAYERS_PER_LOBBY - lobby.humanPlayersCount; i += 1) {
        const profile = players.createProfile('Bot', null, false);
        lobby.players.push(profile);
        profile.isReady = true;
      }
      startGame(lobby);
    }
  }, 5 * 1000);
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
  const playerToUpdate = lobby.players.find((play) => !play.isHuman);
  if (lobby.players.length !== lobby.humanPlayersCount) {
    playerToUpdate.isHuman = true;
    playerToUpdate.socketId = player.socketId;
    playerToUpdate.username = player.username;
    playerToUpdate.isReady = false;
  } else {
    lobby.players.push(player);
  }
  lobby.humanPlayersCount += 1;

  if (!lobby.hasStarted) {
    for (let i = 0; i < lobby.players.length; i += 1) {
      io.sendSocketToId(lobby.players[i].socketId, 'gameUpdate', { message: `En attente d'autre joueurs (${lobby.humanPlayersCount}/${MAX_PLAYERS_PER_LOBBY})` });
    }
    if (lobby.players.length === MAX_PLAYERS_PER_LOBBY) {
      startGame(lobby);
    }
  } else {
    io.sendSocketToId(player.socketId, 'gameStart', { hasStarted: lobby.hasStarted });

    for (let i = 0; i < lobby.players.length; i += 1) {
      if (lobby.players[i].socketId !== player.socketId) {
        io.sendSocketToId(lobby.players[i].socketId, 'newPlayer', {
          player: {
            username: player.username,
            isHuman: player.isHuman,
            playerId: playerToUpdate.playerId,
            color: 'lime',
          },
        });
      }
    }

    for (let i = 0; i < lobby.players.length; i += 1) {
      if (lobby.players[i].socketId !== player.socketId) io.sendSocketToId(lobby.players[i].socketId, 'chatMessage', { message: `${player.username} a rejoint la partie`, isInformational: true });
    }
  }
  return lobby;
}

function changeColor(infos, socketId, playerId) {
  let player = players.getPlayerBySocket(socketId);
  if (player === undefined) player = players.getPlayerById(playerId);
  const lobby = getLobbyByPlayer(player);

  if (!lobby.isAwaitingForColorChoice) return;

  lobby.isAwaitingForColorChoice = false;
  lobby.currentCard = { value: infos.type, color: infos.color };

  for (let i = 0; i < lobby.players.length; i += 1) {
    io.sendSocketToId(lobby.players[i].socketId, 'cardPlayed', { toPlayer: null, card: lobby.currentCard });
  }
  game.nextPlayer(lobby);
  game.socketWhoPlay(lobby);
}

function removePlayer(socketId) {
  const player = players.getPlayerBySocket(socketId);
  const playerUsername = player.username;
  const lobby = lobbies.find((lob) => lob.players.includes(player));
  if (lobby === undefined) return;

  player.isHuman = false;
  player.socketId = null;
  player.isReady = true;
  player.username = 'Bot';

  lobby.humanPlayersCount -= 1;
  for (let i = 0; i < lobby.players.length; i += 1) {
    if (!lobby.hasStarted) io.sendSocketToId(lobby.players[i].socketId, 'gameUpdate', { message: `En attente d'autre joueurs (${lobby.humanPlayersCount}/${MAX_PLAYERS_PER_LOBBY})` });
    io.sendSocketToId(lobby.players[i].socketId, 'newPlayer', {
      player: {
        username: 'Bot', isHuman: false, playerId: player.playerId, color: 'red',
      },
    });
  }

  for (let i = 0; i < lobby.players.length; i += 1) {
    io.sendSocketToId(lobby.players[i].socketId, 'chatMessage', { message: `${playerUsername} a quitté la partie`, isInformational: true });
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

function getLobbyByPlayer(player) {
  return lobbies.find((lobby) => lobby.players.includes(player));
}

function getPlayers(lobbyId) {
  const lobby = getLobbyById(lobbyId);
  return lobby.players;
}

function startGame(lobby) {
  for (let i = 0; i < lobby.players.length; i += 1) {
    io.sendSocketToId(lobby.players[i].socketId, 'gameStart', { hasStarted: lobby.hasStarted });
  }
  lobby.hasStarted = true;
  // Attend que tous les joueurs soient prêts
  let isEveryPlayersReady = false;

  const interval = setInterval(() => {
    isEveryPlayersReady = true;
    for (let i = 0; i < lobby.players.length; i += 1) {
      if (!lobby.players[i].isReady) isEveryPlayersReady = false;
    }
    if (isEveryPlayersReady) {
      game.generateCards(lobby);
      clearInterval(interval);
    }
  }, 1000);
}

/**
 * Affiche toute les infos de la partie, en masquant les cartes des adversaires
 * @param {*} player Le joueur
 * @returns les informations de la partie
 */
function getLobbyInformation(player) {
  const lobby = getLobbyByPlayer(player);
  if (lobby === undefined) return undefined;
  const informations = {
    players: [],
    direction: lobby.direction,
    currentPlayer: lobby.currentPlayer,
    currentCard: lobby.currentCard,
  };

  for (let i = 0; i < lobby.players.length; i += 1) {
    const plr = lobby.players[i];
    if (plr === player) {
      informations.players.push({
        playerId: plr.playerId,
        username: plr.username,
        deck: plr.deck,
        numberOfCardsPlayed: plr.numberOfCardsPlayed,
        numberOfCardsDrawned: plr.numberOfCardsDrawned,
        score: plr.score,
        isReady: plr.isReady,
        isHuman: plr.isHuman,
      });
    } else {
      informations.players.push({
        playerId: plr.playerId,
        username: plr.username,
        deck: plr.deck.length,
        numberOfCardsPlayed: plr.numberOfCardsPlayed,
        numberOfCardsDrawned: plr.numberOfCardsDrawned,
        score: plr.score,
        isReady: plr.isReady,
        isHuman: plr.isHuman,
      });
    }
  }
  return informations;
}

function reverse(lobby) {
  if (lobby.direction === 'clockwise') lobby.direction = 'anticlockwise';
  else lobby.direction = 'clockwise';
  for (let i = 0; i < lobby.players.length; i += 1) {
    io.sendSocketToId(lobby.players[i].socketId, 'newDirection', lobby.direction);
  }
}

module.exports = {
  addPlayerToLobby,
  removePlayer,
  addDeckToLobby,
  getLobbyById,
  deleteLobby,
  getPlayers,
  getLobbyInformation,
  getLobbyByPlayer,
  reverse,
  changeColor,
};
