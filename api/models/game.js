/* eslint-disable no-param-reassign */
const io = require('../websockets/websockets');

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
  const values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+2', 'stop', 'reverse'];

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
  setTimeout(() => {
    drawCardFromStack(lobby);
  }, 2000);
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
  for (let i = 0; i < lobby.players.length; i += 1) {
    const player = lobby.players[i];
    if (player === joueur) io.sendSocketToId(joueur.socketId, 'cardDrawn', { toPlayer: player, card });
    else io.sendSocketToId(joueur.socketId, 'cardDrawn', { toPlayer: player, card: null });
  }
}

// Fonction pour jouer une carte
function playCard (lobby, joueur, carteIndex){
  const card = joueur.deck[carteIndex];
  if(isCardPlayable(card,lobby.currentCard)) {
    lobby.currentCard = card;
    joueur.deck.splice(cardIndex,1);
    for (let i = 0; i < lobby.players.length; i += 1) {
      const player = lobby.players[i];
      io.sendSocketToId(joueur.socketId, 'cardPlayed', { toPlayer: player, card });
    }
    
    handleSpecialCardEffects(card, lobby);
  } else {
    
    io.sendSocketToId(joueur.socketId, 'invalidCard', { card });
  }
  }


module.exports = {
  generateCards,
  drawCard,
  playCard,
};

