/* eslint-disable import/no-import-module-exports */
/* eslint-disable no-loop-func */
/* eslint-disable global-require */
/* eslint-disable no-multi-assign */
/* eslint-disable no-param-reassign */

const { setLoadingBarPercentage, afficherDivQuiCacheLeChargement, afficherDivChargement } = require('./loadingGame');
const { getCardImage, getCardIcon, getUserIcon, getBotIcon, getImageUno, getImageContreUno } = require('./images');
const { afficherInformation } = require('./loadingGame');

const { playCardPickSound, playCardHoverSound } = require('./audio');

let cardCenterDiv;
let currentCard;
let cardStack;
let directionArrow;
let divColorChoice;
let colorBackground;

let cardChoiceType = null;

let playerDeck = [];

const divMainPlayer = {
  playerId: null,
  mainDiv: null,
  divCardIcon: null,
  textCardCount: null,
  textNickname: null,
  imageUserIcon: null,
  //--
  mainDivCards: null,
  divCardIconCards: [],
};

const divOpponentPlayers = [
  {
    playerId: null,
    mainDiv: null,
    divCardIcon: null,
    textCardCount: null,
    textNickname: null,
    imageUserIcon: null,
    mainDivCards: null,
    divCardIconCards: [],
  },
  {
    playerId: null,
    mainDiv: null,
    divCardIcon: null,
    textCardCount: null,
    textNickname: null,
    imageUserIcon: null,
    mainDivCards: null,
    divCardIconCards: [],
  }, {
    playerId: null,
    mainDiv: null,
    divCardIcon: null,
    textCardCount: null,
    textNickname: null,
    imageUserIcon: null,
    mainDivCards: null,
    divCardIconCards: [],
  },
]


function generatingGame(lobby) {
  // pour le debug, à modifier une fois fini
  document.getElementById('options').style.display = 'block';

  // carte actuelle
  cardCenterDiv = document.createElement('div');
    cardCenterDiv.className = 'cardCenterDiv';
  currentCard = document.createElement('div');
    currentCard.className = 'currentCard';
  if (lobby.currentCard === null) currentCard.src = '';
  setCardImage(currentCard, lobby.currentCard);
  currentCard.card = lobby.currentCard;

  // pioche
  cardStack = document.createElement('div');
  cardStack.className = 'cardStack';

  cardStack.addEventListener('click', () => {
    const { sendSocketToServer } = require('./websockets');
    sendSocketToServer('drawCard');
    cardStack.classList.remove('drawCard');
  });

  cardCenterDiv.appendChild(cardStack);
  cardCenterDiv.appendChild(currentCard);
  document.body.appendChild(cardCenterDiv);
  setLoadingBarPercentage(50);

  // affichage des joueurs

  let indexMainPlayer;
  let number = 2;
  for (let i = 0; i < lobby.players.length; i += 1) {
    const player = lobby.players[i];
    const { deck } = player;
    if (typeof deck !== 'number') { // joueur principal
      indexMainPlayer = i;
      createMainPlayerDiv(player);
      for(let j = indexMainPlayer+1; j < lobby.players.length; j += 1) {
        createOpponentPlayerDiv(lobby.players[j], number);
        number += 1;
      }
      for(let j = 0; j < indexMainPlayer; j += 1) {
        createOpponentPlayerDiv(lobby.players[j], number);
        number += 1;
      }
      break;
    }
  }

  // flèche de direction
  addDirectionArrow(lobby.direction);

  // logo vinci arrière plan
  const vinciLogo = document.createElement('div');
  vinciLogo.className = 'vinciLogo';
  document.body.appendChild(vinciLogo);
  setLoadingBarPercentage(80);

  generateCardChoice();
  setLoadingBarPercentage(90);

  setTimeout(() => {
  afficherInformation("Chargement d'autres joueurs");
  const {sendSocketToServer} = require('./websockets');
  sendSocketToServer('readyToStart');
  }, 500);
}

function createMainPlayerDiv(player) {
  const { deck } = player;
  playerDeck = deck;
  sortDeck(playerDeck);

  divMainPlayer.playerId = player.playerId;

  divMainPlayer.mainDiv = document.createElement('div');
    divMainPlayer.mainDiv.className = 'card mainPlayer';

  // Create card icon
  divMainPlayer.divCardIcon = document.createElement('div');
    divMainPlayer.divCardIcon.title = `Nombre de cartes: ${deck.length}`;
    setCardIcon(divMainPlayer.divCardIcon);

  // Create card count
  divMainPlayer.textCardCount = document.createElement('div');
    divMainPlayer.textCardCount.className = 'card-count';
    divMainPlayer.textCardCount.textContent = deck.length;

  // Create nickname
  divMainPlayer.textNickname = document.createElement('div');
    divMainPlayer.textNickname.className = 'nickname';
    divMainPlayer.textNickname.style.marginLeft = `${calculateMargin(player.username.length)}px`;
    divMainPlayer.textNickname.textContent = player.username;
    divMainPlayer.textNickname.fontSize = `${calculateFontSize(player.username.length)}px`;

  // Create user icon
  divMainPlayer.imageUserIcon = document.createElement('img');
    setUserIcon(divMainPlayer.imageUserIcon);

  divMainPlayer.mainDiv.appendChild(divMainPlayer.divCardIcon);
  divMainPlayer.mainDiv.appendChild(divMainPlayer.textCardCount);
  divMainPlayer.mainDiv.appendChild(divMainPlayer.textNickname);
  divMainPlayer.mainDiv.appendChild(divMainPlayer.imageUserIcon);
  document.body.appendChild(divMainPlayer.mainDiv);

  divMainPlayer.mainDivCards = document.createElement('div');
    divMainPlayer.mainDivCards.className = 'mainPlayerCards';  
  

  // affichage des cartes du joueur principal
  for (let i = 0; i < playerDeck.length; i += 1) {
    // DEBUG à modifier plus tard
    // eslint-disable-next-line no-loop-func
    setTimeout(() => { addCard(player.playerId, playerDeck[i]) }, i * 500)
  } 

  setTimeout(() => {
    const {whoPlayIfALreadyStarted} = require('./websockets');
    whoPlayIfALreadyStarted();
  },playerDeck.length * 500 + 100);
  
  document.body.appendChild(divMainPlayer.mainDivCards);
}

function addCard(playerId, card){
  if(playerId === divMainPlayer.playerId) addCardToMainPlayer(card);
  else addCardToOpponent(playerId);
  playCardPickSound();
}

function addCardToOpponent(playerId) {
  const divOpponentPlayer = getOpponent(playerId);
  const playerIndex = getOpponentIndex(playerId);

  if(divOpponentPlayer === null) return;

  const card = { value: 'card', color: 'back' };

  const carddiv = document.createElement('div');
  carddiv.className = `cardOpponentPlayer cardOpponentPlayer${playerIndex}`;

  setCardImage(carddiv, card);
  carddiv.zIndex = divOpponentPlayer.divCardIconCards.length + 1;

  divOpponentPlayer.divCardIconCards.push(carddiv);
  divOpponentPlayer.mainDivCards.appendChild(carddiv);

  divOpponentPlayer.textCardCount.textContent = divOpponentPlayer.divCardIconCards.length;

  calculateMarginCards(divOpponentPlayer.divCardIconCards, playerIndex === 1);
  calculateWidthCards(divOpponentPlayer.divCardIconCards.length, divOpponentPlayer.mainDivCards, playerIndex === 1);

  divOpponentPlayer.divCardIcon.title = `Nombre de cartes: ${divOpponentPlayer.divCardIconCards.length}`;
}

function addCardToMainPlayer(card) {
    const carddiv = document.createElement('div');
    carddiv.className = 'cardMainPlayer';
    // carddiv.style.zIndex = divMainPlayer.divCardIconCards.length + 1;
    carddiv.addEventListener('mouseover', () => {
        if(!carddiv.classList.contains('notTheTimeToPlay')) {
          carddiv.style.top = '-40px';
          carddiv.style.marginRight = '25px';
          playCardHoverSound();
        }
    });

    carddiv.addEventListener('click', () => {
      if(!carddiv.classList.contains('notTheTimeToPlay')) {
       const {sendSocketToServer} = require('./websockets');
        sendSocketToServer('playCard', carddiv.card);
      }
    });

    carddiv.addEventListener('mouseout', () => {
    if (carddiv.classList.contains('notTheTimeToPlay')) {
      carddiv.style.top= '90px';
      carddiv.style.marginRight = '0px';
    }else{
      carddiv.style.top = '0px';
      carddiv.style.marginRight = '0px';
    }
    });

    setCardImage(carddiv, card);
    carddiv.card = card;

    const index = findInsertIndex(card);
    divMainPlayer.divCardIconCards.splice(index, 0, carddiv);
    divMainPlayer.mainDivCards.insertBefore(carddiv, divMainPlayer.mainDivCards.children[index]);

    carddiv.zIndex = index + 1;

    divMainPlayer.textCardCount.textContent = divMainPlayer.divCardIconCards.length;

    calculateMarginCards(divMainPlayer.divCardIconCards, true);
    calculateWidthCards(divMainPlayer.divCardIconCards.length, divMainPlayer.mainDivCards, true);

    divMainPlayer.divCardIcon.title = `Nombre de cartes: ${divMainPlayer.divCardIconCards.length}`;
}



function findInsertIndex(newCard) {
  const colorOrder = ['red', 'blue', 'green', 'yellow', 'black'];
  const valueOrder = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'block', 'reverse', '+2', '+4 black', 'multicolor black', ];

  for (let i = 0; i < divMainPlayer.divCardIconCards.length; i += 1) {
      const {card} = divMainPlayer.divCardIconCards[i];

      const colorComparison = colorOrder.indexOf(newCard.color) - colorOrder.indexOf(card.color);
      if (colorComparison < 0) {
          return i;
      } if (colorComparison === 0) {
          const valueComparison = valueOrder.indexOf(newCard.value) - valueOrder.indexOf(card.value);
          if (valueComparison < 0) {
              return i;
          }
      }
  }
  return divMainPlayer.divCardIconCards.length;
}

function setTimeToPlay(boolean) {
  if(!boolean) {
    for(let i = 0; i < divMainPlayer.divCardIconCards.length; i += 1) {
      
      divMainPlayer.divCardIconCards[i].classList.add('notTheTimeToPlay');
      divMainPlayer.divCardIconCards[i].style.top = '90px';
    }
  } else {
    for(let i = 0; i < divMainPlayer.divCardIconCards.length; i += 1) {
      divMainPlayer.divCardIconCards[i].classList.remove('notTheTimeToPlay');
      divMainPlayer.divCardIconCards[i].style.top= '0px';
    }
  }
}

function displayDrawCard() {
  cardStack.classList.add('drawCard');
}

function removeCardToMainPlayer(index) {
  const cardDiv = divMainPlayer.divCardIconCards[index];
  if(cardDiv === undefined) return; 
  divMainPlayer.mainDivCards.removeChild(cardDiv);
  divMainPlayer.divCardIconCards.splice(index, 1);

  divMainPlayer.textCardCount.textContent = divMainPlayer.divCardIconCards.length;

  calculateMarginCards(divMainPlayer.divCardIconCards, true);
  calculateWidthCards(divMainPlayer.divCardIconCards.length, divMainPlayer.mainDivCards, true);
}

function generateCardChoice() {
  divColorChoice = document.createElement('div');
  divColorChoice.className = 'colorChoice';

  colorBackground = document.createElement('div');
  colorBackground.className = `colorChoiceBackground`;

  const colors = ['red', 'blue', 'green', 'yellow'];
  for(let i = 0; i < colors.length; i += 1) {
    const color = document.createElement('div');
    color.className = `colorChoice${colors[i]}`;
    color.addEventListener('click', () => {
      const {sendSocketToServer} = require('./websockets');
      sendSocketToServer('colorChoice', { color: colors[i], type: cardChoiceType });

      divColorChoice.style.display = 'none';
      colorBackground.style.display = 'none';
    });

    divColorChoice.style.display = 'none';
    colorBackground.style.display = 'none';
    divColorChoice.appendChild(color);

  }
  document.body.appendChild(colorBackground);
  document.body.appendChild(divColorChoice);
}

function displayColorChoice(cardType) {
  cardChoiceType = cardType;
  divColorChoice.style.display = 'block';
  colorBackground.style.display = 'block';
}

function createOpponentPlayerDiv(player, number) {
  const divOpponentPlayer = divOpponentPlayers[number - 2];

   divOpponentPlayer.playerId = player.playerId;
   divOpponentPlayer.mainDiv = document.createElement('div');
    divOpponentPlayer.mainDiv.className = `card player${number}`;

  // Create card icon
  divOpponentPlayer.divCardIcon = document.createElement('div');
  divOpponentPlayer.divCardIcon.title = `Nombre de cartes: ${player.deck}`;
    setCardIcon(divOpponentPlayer.divCardIcon);

  // Create card count
  divOpponentPlayer.textCardCount = document.createElement('div');
  divOpponentPlayer.textCardCount.className = 'card-count';
  divOpponentPlayer.textCardCount.textContent = player.deck;

  // Create nickname
  divOpponentPlayer.textNickname = document.createElement('div');
    divOpponentPlayer.textNickname.className = 'nickname';
    divOpponentPlayer.textNickname.style.marginLeft = `${calculateMargin(player.username.length)}px`;
    divOpponentPlayer.textNickname.textContent = player.username;
    divOpponentPlayer.textNickname.fontSize = `${calculateFontSize(player.username.length)}px`;

// Create user icon
divOpponentPlayer.imageUserIcon = document.createElement('img');
  if(player.isHuman) setUserIcon(divOpponentPlayer.imageUserIcon);
  else setBotIcon(divOpponentPlayer.imageUserIcon);

  divOpponentPlayer.mainDiv.appendChild(divOpponentPlayer.divCardIcon);
  divOpponentPlayer.mainDiv.appendChild(divOpponentPlayer.textCardCount);
  divOpponentPlayer.mainDiv.appendChild(divOpponentPlayer.textNickname);
  divOpponentPlayer.mainDiv.appendChild(divOpponentPlayer.imageUserIcon);
document.body.appendChild(divOpponentPlayer.mainDiv);

divOpponentPlayer.mainDivCards = document.createElement('div');
divOpponentPlayer.mainDivCards.className = `opponentPlayerCards${number}`;  

document.body.appendChild(divOpponentPlayer.mainDivCards)

// affichage des cartes du joueur
for (let i = 0; i < player.deck; i += 1) {
  // eslint-disable-next-line no-loop-func
  setTimeout(() => {
    addCardToOpponent(player.playerId);
  }, i * 500)
} 
document.body.appendChild(divMainPlayer.mainDivCards);

}

function displayPlayerWhoPlay(playerId) {
  let playerDiv;
  if(divMainPlayer.playerId === playerId) playerDiv = divMainPlayer
  else playerDiv = getOpponent(playerId);

  if(playerDiv !== divMainPlayer) divMainPlayer.mainDiv.style.backgroundColor = "gray";
  else divMainPlayer.mainDiv.style.backgroundColor = "orange";

  for(let i = 0; i < divOpponentPlayers.length; i += 1) {
    if(divOpponentPlayers[i] !== playerDiv) divOpponentPlayers[i].mainDiv.style.backgroundColor = "gray";
    else divOpponentPlayers[i].mainDiv.style.backgroundColor = "orange";
  }
    setTimeToPlay(playerDiv === divMainPlayer);
}

function getOpponentIndex(playerId) {
  for(let i = 0; i < divOpponentPlayers.length; i += 1) {
    if(divOpponentPlayers[i].playerId === playerId) return i;
  }
  return null;
}

function sortDeck(deck) {
    const colorOrder = ['red', 'blue', 'green', 'yellow', 'black'];
    const valueOrder = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'block', 'reverse', '+2', 'multicolor black', '+4 black'];
  
    deck.sort((a, b) => {
      const colorA = a.color;
      const colorB = b.color
      const valueA = a.value;
      const valueB = b.value;
  
      const colorComparison = colorOrder.indexOf(colorA) - colorOrder.indexOf(colorB);
      if (colorComparison !== 0) {
        return colorComparison;
      }
  
      const valueComparison = valueOrder.indexOf(valueA) - valueOrder.indexOf(valueB);
      return valueComparison;
    });
  
    return deck;
  }

function setCardImage(element, card) {
  if (card === null) card = { value: 'card', color: 'back' };
  element.style.backgroundImage = `url("${getCardImage(card.color, card.value)}")`;
  if(card.color !== 'back') element.title = `${card.value} ${card.color}`;
}

function getOpponent(id) {
  for (let i = 0; i < divOpponentPlayers.length; i += 1) {
    if (divOpponentPlayers[i].playerId === id) {
      return divOpponentPlayers[i];
    }
  }
  return null;
}

function addDirectionArrow(direction) {
  directionArrow = document.createElement('div');
    directionArrow.className = 'direction-arrow';
    reverseDirection(direction);
  document.body.appendChild(directionArrow);
}

function reverseDirection(newDirection) {
  if (newDirection === 'clockwise') {
    directionArrow.classList.remove('anticlockwise');
    directionArrow.classList.add('clockwise');
  }
  else {
    directionArrow.classList.remove('clockwise');
    directionArrow.classList.add('anticlockwise');
  }
}


function updatePlayer(opponent) {
  const divPlayer = getOpponent(opponent.player.playerId);
  if(divPlayer === null) return;

  if(opponent.player.isHuman) setUserIcon(divPlayer.imageUserIcon);
  else setBotIcon(divPlayer.imageUserIcon);

  divPlayer.textNickname.style.marginLeft = `${calculateMargin(opponent.player.username.length)}px`;
  divPlayer.textNickname.textContent = opponent.player.username;
  divPlayer.textNickname.fontSize = `${calculateFontSize(opponent.player.username.length)}px`;

  const color = divPlayer.mainDiv.style.backgroundColor;
  divPlayer.mainDiv.style.backgroundColor = opponent.player.color;
  setTimeout(() => { divPlayer.mainDiv.style.backgroundColor = color }, 1000)
}


function setCardIcon(element) {
  element.className = 'card-icon';
  element.style.backgroundImage = `url("${getCardIcon()}")`;
}

function setUserIcon(element) {
  element.className = 'icon';
  element.src = getUserIcon();
}

function setBotIcon(element) {
  element.className = 'icon';
  element.src = getBotIcon();
}

function setLastCard(card){
  setCardImage(currentCard, card);
}

function calculateMargin(length) {
  const maxMargin = 20;
  const reductionPerChar = 1;
  let margin = maxMargin - length * reductionPerChar;
  margin = margin < 0 ? 0 : margin;
  return margin;
}

function calculateFontSize(length) {
  const baseFontSize = 40;
  const minFontSize = 10;
  const fontSize = baseFontSize - length;
  return fontSize < minFontSize ? minFontSize : fontSize;
}

function calculateWidthCards(cardsNumber, element, isHorizontal) {
    if(isHorizontal) {
      const maxWidth = 50;
      const minWidth = 43;
      let width = maxWidth - cardsNumber * 1.1;
      width = width < minWidth ? minWidth : width;
      element.style.marginLeft = `${width}%`;
    } else {
      const maxWidth = 40;
      const minWidth = 23;
      let width = maxWidth - cardsNumber * 1.1;
      width = width < minWidth ? minWidth : width;
      element.style.top = `${width}%`;
    }
}

function calculateMarginCards(cardsDiv, isHorizontal) {
  if(isHorizontal) {
    const maxMargin = -70;
    const minMargin = -30;
    let margin = minMargin - (cardsDiv.length * 1.6);
    margin = margin < maxMargin ? maxMargin : margin;

    for(let i = 0; i < cardsDiv.length ; i += 1) {
      cardsDiv[i].style.marginLeft = `${margin}px`
    }
  } else {
    const maxMargin = -115;
    const minMargin = -90;
    let margin = minMargin - (cardsDiv.length * 1.6);
    margin = margin < maxMargin ? maxMargin : margin;

    for(let i = 0; i < cardsDiv.length ; i += 1) {
      cardsDiv[i].style.marginBottom = `${margin}px`
    }
  }
}

function removeCard(playerId, card) {
  if(playerId === null) return;
  if(playerId === divMainPlayer.playerId) {
    const index = divMainPlayer.divCardIconCards.findIndex((cardDiv) => cardDiv.title === `${card.value} ${card.color}`);
    removeCardToMainPlayer(index);
  } else {
      const divPlayer = divOpponentPlayers.find((div) => div.playerId === playerId);
      removeCardToOpponent(divPlayer);
  }
}

function removeCardToOpponent(divPlayer) {
  if(divPlayer === null) return;
  divPlayer.mainDivCards.removeChild(divPlayer.divCardIconCards[0]);
  divPlayer.divCardIconCards.splice(0, 1);

  divPlayer.textCardCount.textContent = divPlayer.divCardIconCards.length;

  const index = divOpponentPlayers.findIndex((div) => div.playerId === divPlayer.playerId);
  calculateMarginCards(divPlayer.divCardIconCards, index === 1);
  // TODO : Spéficier si le deck est horizontal, sinon ca met un margin top au lieu d'un margin left
  calculateWidthCards(divPlayer.divCardIconCards.length, divPlayer.mainDivCards, index === 1);
}

function imageUno(){
  const image = document.createElement("img");
  image.src = getImageUno();
  image.className = "image-uno";
  document.body.appendChild(image);

  const timer = setTimeout(() => {
    document.body.removeChild(image);
  }, 5000);

  image.addEventListener('click', () => {
    document.body.removeChild(image);
    const io = require('./websockets');
    io.sendSocketToServer('uno');
    clearTimeout(timer);
  })
}

function imageContreUno(){
  const image = document.createElement("img");
  image.src = getImageContreUno();
  image.className = "image-uno";
  document.body.appendChild(image);

  const timer = setTimeout(() => {
    document.body.removeChild(image);
  }, 5000);

  image.addEventListener('click', () => {
    document.body.removeChild(image);
    const io = require('./websockets');
    io.sendSocketToServer('contreUno');
    clearTimeout(timer);
  })
}

function endGame(infos) {
  const popupScoreboard = document.createElement('div');
  popupScoreboard.className = 'finalScoreboard';

  const divResultBackground = document.createElement('div');
  divResultBackground.className = 'resultBackground';

  const titre = document.createElement('h1');
  titre.innerText = 'Partie Terminée';
  popupScoreboard.appendChild(titre);

  infos.forEach((playerInfo, index) => {
    const divPlayer = document.createElement('div');
      divPlayer.className = `leaderboard${index + 1}`;
  const nickname = document.createElement('h2');
    nickname.innerText = `${playerInfo.username}`;
    
    const divUserIcon = document.createElement('img');
      divUserIcon.className = 'userIconLeaderBoard';
      if(playerInfo.isHuman) setUserIcon(divUserIcon);
      else setBotIcon(divUserIcon);


    const divRank = document.createElement('div');
    if(index === 0) divRank.className = "rankGold";
    if(index === 1) divRank.className = "rankSilver";
    if(index === 2) divRank.className = "rankBronze";
    if(index > 2) divRank.className = "rankLast";

    const divScore = document.createElement('div');
      divScore.className = 'score';	
      divScore.innerText = `${playerInfo.score} points`;
      if(playerInfo.score <= 1) divScore.innerText = `${playerInfo.score} point`;

    const divCardsLeft = document.createElement('div');
      divCardsLeft.className = 'cardsLeft';
      divCardsLeft.innerText = `${playerInfo.numberOfCards} cartes restantes`; 
      if(playerInfo.numberOfCards <= 1) divCardsLeft.innerText = `${playerInfo.numberOfCards} carte restante`;

    const divCardsDrawn = document.createElement('div');
      divCardsDrawn.className = 'cardsDrawn';
      divCardsDrawn.innerText = `${playerInfo.numberOfCardsDrawned} cartes piochées`;
      if(playerInfo.numberOfCardsDrawned <= 1) divCardsDrawn.innerText = `${playerInfo.numberOfCardsDrawned} carte piochée`;

    const divCardsPlayed = document.createElement('div');
      divCardsPlayed.className = 'cardsPlayed';
      divCardsPlayed.innerText = `${playerInfo.numberOfCardsPlayed} cartes jouées`;
      if(playerInfo.numberOfCardsPlayed <= 1) divCardsPlayed.innerText = `${playerInfo.numberOfCardsPlayed} carte jouée`;


    divPlayer.appendChild(divRank);
    divPlayer.appendChild(nickname);
    divPlayer.appendChild(divUserIcon);
    
    divPlayer.appendChild(divScore);
    divPlayer.appendChild(divCardsLeft);
    divPlayer.appendChild(divCardsPlayed);
    divPlayer.appendChild(divCardsDrawn);

    popupScoreboard.appendChild(divPlayer);
    document.body.appendChild(divResultBackground);
  });

  document.body.appendChild(popupScoreboard);

  setTimeout(() => {
      const button = document.createElement('button');
      button.className = 'replayButton';
      button.innerText = 'Rejouer';

      button.addEventListener('click', () => {
      
      const background = document.createElement('div');
        background.className = 'replayLoadingScreen';
        background.style.background = 'linear-gradient(110.1deg, rgb(241, 115, 30) 18.9%, rgb(231, 29, 54) 90.7%)';
        background.style.animation = 'fadeInOut 2.5s ease-in-out forwards';
        background.style.zIndex = '2000';
        background.style.height = '100%';
        background.style.width = '100%';
        background.style.position = 'absolute';
        document.body.appendChild(background);

        afficherDivChargement();

        setTimeout(() => {
          removeEverything();
          clearCardTables();
          background.remove();
          afficherDivQuiCacheLeChargement();
          setLoadingBarPercentage(5);
            document.querySelectorAll('.replayLoadingScreen').forEach((element) => {
              element.remove();
            });

            let pseudo = document.querySelector('#nickname').value;
            if(pseudo === '') pseudo = document.querySelector('#nickname').placeholder;
            setTimeout(() => {
              require('./websockets').connectWebSocket(pseudo);
            }, 1000);
        }, 1000);
      });
      document.body.appendChild(button);
  }, 3000);

  require('./erreur').ignoreError();
  require('./websockets').disconnectWebSocket();
}

function removeEverything() {
  document.body.removeChild(cardCenterDiv);
  document.body.removeChild(directionArrow);
  document.body.removeChild(divColorChoice);
  document.body.removeChild(colorBackground);
  document.body.removeChild(divMainPlayer.mainDiv);
  document.body.removeChild(divMainPlayer.mainDivCards);
  document.body.removeChild(divOpponentPlayers[0].mainDiv);
  document.body.removeChild(divOpponentPlayers[0].mainDivCards);
  document.body.removeChild(divOpponentPlayers[1].mainDiv);
  document.body.removeChild(divOpponentPlayers[1].mainDivCards);
  document.body.removeChild(divOpponentPlayers[2].mainDiv);
  document.body.removeChild(divOpponentPlayers[2].mainDivCards);
  document.querySelector('.vinciLogo').remove();
  document.querySelector('.finalScoreboard').remove();
  document.querySelector('.resultBackground').remove();
  document.querySelector('.replayButton').remove();
  document.querySelector('.chatbox').remove();
  document.querySelector('#divChargement').remove();
  document.querySelector('#divChargement2').remove();
  document.querySelector('#divMessages').remove();
}

function clearCardTables() {
  divMainPlayer.divCardIconCards = [];
  divOpponentPlayers[0].divCardIconCards = [];
  divOpponentPlayers[1].divCardIconCards = [];
  divOpponentPlayers[2].divCardIconCards = [];
}


module.exports = {
  generatingGame,
  reverseDirection,
  removeCardToMainPlayer,
  updatePlayer,
  displayPlayerWhoPlay,
  addCard,
  setLastCard,
  removeCard,
  displayColorChoice,
  displayDrawCard,
  endGame,
  imageUno,
  imageContreUno,
  removeEverything,
};