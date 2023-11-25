/* eslint-disable global-require */
/* eslint-disable no-loop-func */
/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
const io = require('../websockets/websockets');

const numberOfCardsToDraw = 7;

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
  const playerWhoPlay = lobby.players[lobby.currentPlayer];
  for (let i = 0; i < lobby.players.length; i += 1) {
    io.sendSocketToId(lobby.players[i].socketId, 'nextPlayer', playerWhoPlay.playerId);
  }
}

function giveCardsToPlayers(lobby) {
  let time = 0;

  for (let j = 0; j < numberOfCardsToDraw; j += 1) {
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
  }, ((numberOfCardsToDraw * 4) * 150) + 1000);
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

// Fonction pour jouer une carte
function playCard(lobby, joueur, card) {
  if (lobby.players[lobby.currentPlayer] !== joueur) return;
  if (lobby.isAwaitingForColorChoice === true) return;

  const cardIndex = joueur.deck[card];
  if (isCardPlayable(card, lobby.currentCard)) {
    lobby.currentCard = card;
    joueur.deck.splice(cardIndex, 1);
    joueur.numberOfCardsPlayed += 1;

    for (let i = 0; i < lobby.players.length; i += 1) {
      const player = lobby.players[i];
      io.sendSocketToId(player.socketId, 'cardPlayed', { toPlayer: joueur.playerId, card });
    }

    handleSpecialCardEffects(card, lobby);
    if (card.color !== 'black') {
      nextPlayer(lobby);
    }
    setTimeout(() => {
      socketWhoPlay(lobby);
    }, 1000);
  } else {
    io.sendSocketToId(joueur.socketId, 'invalidCard');
  }
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
    io.sendSocketToId(lobby.players[lobby.currentPlayer].socketId, 'colorChoice', { cardType: card.value });
  }
  if (card.value === '+2') {
    const currentPlayerIndex = lobby.players.indexOf(lobby.currentPlayer);
    let nextPlayerIndex;
    if (lobby.direction === 'clockwise') {
      nextPlayerIndex = currentPlayerIndex + 1;
    } else {
      nextPlayerIndex = currentPlayerIndex - 1;
    }
    if (nextPlayerIndex >= lobby.players.length) nextPlayerIndex = 0;
    if (nextPlayerIndex < 0) nextPlayerIndex = lobby.players.length - 1;

    const nextPlayer = lobby.players[nextPlayerIndex];
    for (let i = 0; i < 2; i += 1) {
      drawCard(lobby, nextPlayer);
    }
  } else if (card.value === 'stop') {
    const currentPlayerIndex = lobby.players.indexOf(lobby.currentPlayer);
    let nextPlayerIndex = currentPlayerIndex + 1;
    if (nextPlayerIndex >= lobby.players.length) {
      nextPlayerIndex = 0;
    }
    lobby.currentPlayer = lobby.players[nextPlayerIndex];
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

    const nextPlayer = lobby.players[nextPlayerIndex];
    for (let i = 0; i < 4; i += 1) {
      drawCard(lobby, nextPlayer);
    }
  }
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

module.exports = {
  generateCards,
  drawCard,
  playCard,
  nextPlayer,
  socketWhoPlay,
};
