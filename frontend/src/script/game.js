/* eslint-disable no-multi-assign */
/* eslint-disable no-param-reassign */
const { debugCacherChargement, setLoadingBarPercentage } = require('./loadingGame');
const { getCardImage, getCardIcon, getUserIcon, getBotIcon } = require('./images');

const cardSoundEffect = require('../sound/card.mp3')

let cardCenterDiv;
let currentCard;
let cardStack;
let directionArrow;

let playerDeck = [];

const divMainPlayer = {
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
  debugCacherChargement();

  // carte actuelle
  cardCenterDiv = document.createElement('div');
    cardCenterDiv.className = 'cardCenterDiv';
  currentCard = document.createElement('div');
    currentCard.className = 'currentCard';
  if (lobby.currentCard === null) currentCard.src = '';
  setCardImage(currentCard, lobby.currentCard);

  // pioche
  cardStack = document.createElement('div');
  cardStack.className = 'cardStack';

  cardCenterDiv.appendChild(cardStack);
  cardCenterDiv.appendChild(currentCard);
  document.body.appendChild(cardCenterDiv);
  setLoadingBarPercentage(50);

  // affichage des joueurs

  let number = 2;

  for (let i = 0; i < lobby.players.length; i += 1) {
    const player = lobby.players[i];
    const { deck } = player;
    if (typeof deck !== 'number') { // joueur principal
      createMainPlayerDiv(player);
    }else{
      createOpponentPlayerDiv(player, number);
      number += 1;
    }
  }

  // flèche de direction
  addDirectionArrow();

  // logo vinci arrière plan
  const vinciLogo = document.createElement('div');
  vinciLogo.className = 'vinciLogo';
  document.body.appendChild(vinciLogo);
  setLoadingBarPercentage(55);

}

function createMainPlayerDiv(player) {
  const { deck } = player;
  playerDeck = deck;
  sortDeck(playerDeck);

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
    setTimeout(() => {
      addCardToMainPlayer(playerDeck[i]);
    }, i * 200)
  } 

  setTimeout(() => {
    setTimeToPlay(false);
  }, 2000)

  setTimeout(() => {
    setTimeToPlay(true);
  }, 6000)

  document.body.appendChild(divMainPlayer.mainDivCards);
}

function addCardToMainPlayer(card) {
    const carddiv = document.createElement('div');
    carddiv.className = 'cardMainPlayer';
    carddiv.style.zIndex = divMainPlayer.divCardIconCards.length + 1;
    carddiv.addEventListener('mouseover', () => {
        if(!carddiv.classList.contains('notTheTimeToPlay')) {
          carddiv.style.top = '-40px';
          carddiv.style.marginRight = '25px';
          playSoundEffect(cardSoundEffect);
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

    divMainPlayer.divCardIconCards.push(carddiv);
    divMainPlayer.mainDivCards.appendChild(carddiv);

    calculateMarginCards(divMainPlayer.divCardIconCards, true);
    calculateWidthCards(divMainPlayer.divCardIconCards.length, divMainPlayer.mainDivCards, true);
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

function removeCardToMainPlayer(index) {
  const cardDiv = divMainPlayer.divCardIconCards[index];
  divMainPlayer.mainDivCards.removeChild(cardDiv);
  divMainPlayer.divCardIconCards.splice(index, 1);

  calculateMarginCards(divMainPlayer.divCardIconCards, true);
  calculateWidthCards(divMainPlayer.divCardIconCards.length, divMainPlayer.mainDivCards, true);
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
document.body.appendChild(divOpponentPlayer .mainDiv);

divOpponentPlayer.mainDivCards = document.createElement('div');
divOpponentPlayer.mainDivCards.className = 'mainPlayerCards';  
/*

// affichage des cartes du joueur principal
for (let i = 0; i < playerDeck.length; i += 1) {
  // DEBUG à modifier plus tard
  // eslint-disable-next-line no-loop-func
  setTimeout(() => {
    addCardToMainPlayer(playerDeck[i]);
  }, i * 200)
} 

document.body.appendChild(divMainPlayer.mainDivCards);
*/
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
  element.title = `${card.value} ${card.color}`;
}

function getOpponent(id) {
  for (let i = 0; i < divOpponentPlayers.length; i += 1) {
    if (divOpponentPlayers[i].playerId === id) {
      return divOpponentPlayers[i];
    }
  }
  return null;
}

function addDirectionArrow() {
  directionArrow = document.createElement('div');
    directionArrow.className = 'direction-arrow';
    directionArrow.classList.add('clockwise');
  document.body.appendChild(directionArrow);
}

function reverseDirection() {
  if (directionArrow.classList.contains('clockwise')) {
    directionArrow.classList.remove('clockwise');
    directionArrow.classList.add('anticlockwise');
  }
  else {
    directionArrow.classList.remove('anticlockwise');
    directionArrow.classList.add('clockwise');
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

  divPlayer.mainDiv.style.backgroundColor = opponent.player.color;
  setTimeout(() => { divPlayer.mainDiv.style.backgroundColor = 'orange';}, 1000)
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
      const minWidth = 10;
      let width = maxWidth - cardsNumber * 1.1;
      width = width < minWidth ? minWidth : width;
      element.style.marginLeft = `${width}%`;
    }
}

function calculateMarginCards(cardsDiv, isHorizontal) {
  if(isHorizontal) {
    const maxMargin = -63;
    const minMargin = -30;
    let margin = minMargin - (cardsDiv.length * 1.5);
    margin = margin < maxMargin ? maxMargin : margin;

    for(let i = 0; i < cardsDiv.length ; i += 1) {
      cardsDiv[i].style.marginLeft = `${margin}px`
    }
      
  }
}


function playSoundEffect(audioSource) {
  const soundEffect = new Audio(audioSource);
  soundEffect.volume = document.getElementById('volumeControlSFX').value;
  document.body.appendChild(soundEffect);
  soundEffect.play();

  soundEffect.addEventListener('ended', () => {
      soundEffect.pause();
      document.body.removeChild(soundEffect);
  });
}


module.exports = {
  generatingGame,
  reverseDirection,
  addCardToMainPlayer,
  removeCardToMainPlayer,
  updatePlayer,
};
