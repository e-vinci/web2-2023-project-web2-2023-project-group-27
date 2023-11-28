/* eslint-disable global-require */
/* eslint-disable no-loop-func */
/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
const io = require('../websockets/websockets');

const NUMBER_OF_CARDS_TO_DRAW = 7;
const NUMBER_OF_TIMES_BEFORE_KICK = 5;

function shuffleStack(lobby) {
  let currentIndex = lobby.stack.length;
  let temporaryValue;
  let randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = lobby.stack[currentIndex];
    lobby.stack[currentIndex] = lobby.stack[randomIndex];
    lobby.stack[randomIndex] = temporaryValue;
  }
}

function generateCards(lobby) {
  const colors = ['red', 'blue', 'green', 'yellow'];
  const values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+2', 'block', 'reverse'];

  for (let i = 0; i < colors.length; i += 1) {
    for (let j = 0; j < values.length; j += 1) {
      generateCard(lobby, colors[i], values[j]);
      if (values[j] !== '0') generateCard(lobby, colors[i], values[j]);
    }
  }

  for (let i = 0; i < 4; i += 1) {
    generateCard(lobby, 'black', '+4');
    generateCard(lobby, 'black', 'multicolor');
  }
  shuffleStack(lobby);
  beginningGame(lobby);
}

function beginningGame(lobby) {
  setTimeout(() => {
    giveCardsToPlayers(lobby);
  }, 500);
}

function socketWhoPlay(lobby) {
  if (lobby.currentCard.color === 'black') return;
  const playerWhoPlay = lobby.players[lobby.currentPlayer];
  for (let i = 0; i < lobby.players.length; i += 1) {
    io.sendSocketToId(lobby.players[i].socketId, 'nextPlayer', playerWhoPlay.playerId);
  }
  if (!hasACardPlayable(playerWhoPlay, lobby)) io.sendSocketToId(playerWhoPlay.socketId, 'noCardPlayable');
  timerBotPlayer(lobby, playerWhoPlay);
}

function timerBotPlayer(lobby, joueur) {
  if (joueur.isHuman) {
    lobby.timerChoice = setTimeout(() => {
      joueur.numbersOfTimesAFK += 1;
      if (joueur.numbersOfTimesAFK >= NUMBER_OF_TIMES_BEFORE_KICK) {
        if (joueur.socketId === null) return;
        const { socketId } = joueur;
        require('./lobbies').removePlayer(joueur.socketId);
        io.sendSocketToId(socketId, 'kicked', 'Vous avez été expulsé de la partie pour inactivité');
        botPlay(joueur, lobby);
        return;
      }
      pickACard(lobby, joueur, true);
    }, 10 * 1000);
  } else {
    lobby.timerChoice = setTimeout(() => {
      botPlay(joueur, lobby);
    }, 2 * 1000);
  }
}

function giveCardsToPlayers(lobby) {
  let time = 0;

  for (let j = 0; j < NUMBER_OF_CARDS_TO_DRAW; j += 1) {
    for (let i = 0; i < lobby.players.length; i += 1) {
      time += 1;
      setTimeout(() => {
        drawCard(lobby, lobby.players[i]);
      }, time * 150);
    }
  }

  setTimeout(() => {
    drawCardFromStack(lobby);
    for (let i = 0; i < lobby.players.length; i += 1) {
      const player = lobby.players[i];
      io.sendSocketToId(player.socketId, 'cardPlayed', { toPlayer: null, card: lobby.currentCard });
    }
    socketWhoPlay(lobby);
  }, NUMBER_OF_CARDS_TO_DRAW * 4 * 150 + 1000);
}

function generateCard(lobby, color, value) {
  lobby.stack.push({
    color,
    value,
  });
}

function drawCardFromStack(lobby) {
  lobby.currentCard = lobby.stack.pop();
}

// fonction distribuant les cartes aux joueurs debut de games
function drawCard(lobby, joueur) {
  const card = lobby.stack.pop();
  joueur.deck.push(card);
  joueur.numberOfCardsDrawned += 1;
  for (let i = 0; i < lobby.players.length; i += 1) {
    const player = lobby.players[i];
    if (player === joueur) io.sendSocketToId(player.socketId, 'cardDrawn', { toPlayer: joueur.playerId, card });
    else io.sendSocketToId(player.socketId, 'cardDrawn', { toPlayer: joueur.playerId, card: null });
  }
}

function pickACard(lobby, joueur, forceMode = false) {
  if (lobby.players[lobby.currentPlayer] !== joueur) return;
  if (lobby.isAwaitingForColorChoice === true) return;

  // Si le joueur a une carte jouable, il ne peut pas piocher
  // Sauf si on est en mode forcé
  if (!forceMode) {
    if (hasACardPlayable(joueur, lobby)) return;
  }

  let card;
  do {
    card = lobby.stack.pop();
  } while (card.color !== 'black' && (card.value === '+4' || card.value === 'multicolor'));
  joueur.deck.push(card);
  joueur.numberOfCardsDrawned += 1;

  clearTimeout(lobby.timerChoice);

  for (let i = 0; i < lobby.players.length; i += 1) {
    const player = lobby.players[i];
    if (player === joueur) io.sendSocketToId(player.socketId, 'cardDrawn', { toPlayer: joueur.playerId, card });
    else io.sendSocketToId(player.socketId, 'cardDrawn', { toPlayer: joueur.playerId, card: null });
  }

  nextPlayer(lobby);
  socketWhoPlay(lobby);
}

// Fonction pour jouer une carte
function playCard(lobby, joueur, card) {
  if (lobby === undefined) lobby = require('./lobbies').getLobbyByPlayer(joueur);
  if (lobby === undefined) return;

  if (lobby.players[lobby.currentPlayer] !== joueur) return;
  if (lobby.isAwaitingForColorChoice === true) return;

  if (isCardPlayable(card, lobby.currentCard)) {
    const { deck } = joueur;
    const cardIndex = deck.findIndex((c) => c.color === card.color && c.value === card.value);
    lobby.currentCard = card;
    deck.splice(cardIndex, 1);

    joueur.numberOfCardsPlayed += 1;
    clearTimeout(lobby.timerChoice);

    for (let i = 0; i < lobby.players.length; i += 1) {
      const player = lobby.players[i];
      io.sendSocketToId(player.socketId, 'cardPlayed', { toPlayer: joueur.playerId, card });
    }

    giveScore(joueur, card);

    if (joueur.deck.length === 0) {
      setTimeout(() => {
        for (let i = 0; i < lobby.players.length; i += 1) {
          const player = lobby.players[i];
          const infos = {
            winner: joueur.playerId,
            numberOfCardsDrawned: player.numberOfCardsDrawned,
            numberOfCardsPlayed: player.numberOfCardsPlayed,
            score: player.score,
          };
          io.sendSocketToId(lobby.players[i].socketId, 'endGame', infos);
        }
      }, 1500);
    }

    handleSpecialCardEffects(card, lobby);

    if (card.color !== 'black') {
      nextPlayer(lobby);
    }

    if (card.value === '+4' || card.value === '+2') {
      setTimeout(() => {
        socketWhoPlay(lobby);
      }, 1500);
    } else socketWhoPlay(lobby);
    insertCardInStack(lobby, card);
  } else {
    io.sendSocketToId(joueur.socketId, 'invalidCard');
  }
}

function giveScore(player, card) {
  if (player === null) return;
  if (card === null) return;
  if (card.color === null || card.value === null) return;
  if (card.color === 'black') player.score += 25;
  else if (card.value === '+2' || card.value === 'reverse' || card.value === 'block') player.score += 15;
  else player.score += Number(card.value);
}

function insertCardInStack(lobby, card) {
  const randomIndex = Math.floor(Math.random() * lobby.stack.length);
  lobby.stack.splice(randomIndex, 0, card);
}
// Fonction pour vérifier si une carte est jouable
function isCardPlayable(card, currentCard) {
  if (currentCard === null) return true;
  if (card.color === 'black') {
    return true;
  }
  return card.color === currentCard.color || card.value === currentCard.value;
}

// Fonction pour gérer les effets spéciaux des cartes
function handleSpecialCardEffects(card, lobby) {
  if (card.color === 'black') {
    lobby.isAwaitingForColorChoice = true;
    io.sendSocketToId(lobby.players[lobby.currentPlayer].socketId, 'colorChoice', {
      cardType: card.value,
    });
  }
  if (card.value === '+2') {
    const currentPlayerIndex = lobby.currentPlayer;
    let nextPlayerIndex;
    if (lobby.direction === 'clockwise') {
      nextPlayerIndex = currentPlayerIndex + 1;
    } else {
      nextPlayerIndex = currentPlayerIndex - 1;
    }
    if (nextPlayerIndex >= lobby.players.length) nextPlayerIndex = 0;
    if (nextPlayerIndex < 0) nextPlayerIndex = lobby.players.length - 1;

    for (let i = 0; i < 2; i += 1) {
      drawCard(lobby, lobby.players[nextPlayerIndex]);
    }
    nextPlayer(lobby);
  } else if (card.value === 'block') {
    nextPlayer(lobby);
  } else if (card.value === 'reverse') {
    const { reverse } = require('./lobbies');
    reverse(lobby);
  } else if (card.value === '+4') {
    const currentPlayerIndex = lobby.currentPlayer;
    let nextPlayerIndex;
    if (lobby.direction === 'clockwise') {
      nextPlayerIndex = currentPlayerIndex + 1;
    } else {
      nextPlayerIndex = currentPlayerIndex - 1;
    }
    if (nextPlayerIndex >= lobby.players.length) nextPlayerIndex = 0;
    if (nextPlayerIndex < 0) nextPlayerIndex = lobby.players.length - 1;

    for (let i = 0; i < 4; i += 1) {
      drawCard(lobby, lobby.players[nextPlayerIndex]);
    }
    nextPlayer(lobby);
  }
}

function hasACardPlayable(player, lobby) {
  for (let i = 0; i < player.deck.length; i += 1) {
    if (isCardPlayable(player.deck[i], lobby.currentCard)) return true;
  }
  return false;
}

// Fonction pour passer au joueur suivant
function nextPlayer(lobby) {
  if (lobby.direction === 'clockwise') {
    lobby.currentPlayer += 1;
    if (lobby.currentPlayer >= lobby.players.length) lobby.currentPlayer = 0;
  } else {
    lobby.currentPlayer -= 1;
    if (lobby.currentPlayer < 0) lobby.currentPlayer = lobby.players.length - 1;
  }
}

function botPlay(player, lobby) {
  for (let i = 0; i < player.deck.length; i += 1) {
    const card = player.deck[i];
    if (isCardPlayable(card, lobby.currentCard)) {
      playCard(lobby, player, player.deck[i]);
      if (card.color === 'black') {
        setTimeout(() => {
          const colors = ['red', 'blue', 'green', 'yellow'];
          const randomIndex = Math.floor(Math.random() * colors.length);
          card.color = colors[randomIndex];
          require('./lobbies').changeColor({ type: card.value, color: card.color }, lobby);
        }, 2000);
      }
      return;
    }
  }
  pickACard(lobby, player);
}

module.exports = {
  generateCards,
  drawCard,
  playCard,
  nextPlayer,
  socketWhoPlay,
  pickACard,
};
