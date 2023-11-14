/* eslint-disable no-multi-assign */
/* eslint-disable no-param-reassign */
const { debugCacherChargement } = require('./loadingGame');
const { getCardImage, getCardIcon, getUserIcon } = require('./images');

let cardCenterDiv;
let currentCard;
let cardStack;

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

function generatingGame(lobby) {
  debugCacherChargement();
  cardCenterDiv = document.createElement('div');
  cardCenterDiv.className = 'cardCenterDiv';

  currentCard = document.createElement('div');
  currentCard.className = 'currentCard';
  if (lobby.currentCard === null) currentCard.src = '';
  setCardImage(currentCard, lobby.currentCard);

  cardStack = document.createElement('div');
  cardStack.className = 'cardStack';

  cardCenterDiv.appendChild(cardStack);
  cardCenterDiv.appendChild(currentCard);
  document.body.appendChild(cardCenterDiv);
  // setLoadingBarPercentage(mettreLePourcentIci);

  for (let i = 0; i < lobby.players.length; i += 1) {
    const player = lobby.players[i];
    const { deck } = player;
    if (typeof deck !== 'number') {
      createMainPlayerDiv(player);
    }
  }
}

function createMainPlayerDiv(player) {
  const { deck } = player;
  playerDeck = deck;
  sortDeck(playerDeck);
  for (let j = 0; j < deck.length; j += 1) {
    /*
        const card = document.createElement('div');
            card.className = 'cardMainPlayer';
            setCardImage(card, deck[j]);
        divMainPlayer.appendChild(card);
        */
  }

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
  
  calculateWidthCards(deck.length, divMainPlayer.mainDivCards);

  for (let i = 0; i < playerDeck.length; i += 1) {
    const card = document.createElement('div');
    card.className = 'cardMainPlayer';
    card.addEventListener('mouseover', () => {
        card.style.zIndex = i;
        if(!card.classList.contains('notTheTimeToPlay')) {
          card.style.top = '-40px';
          card.style.marginRight = '20px';
        }
    });

    card.addEventListener('mouseout', () => {
        card.style.zIndex = i;
    if (card.classList.contains('notTheTimeToPlay')) {
      card.style.top= '70px';
      card.style.marginRight = '0px';
    }else{
      card.style.top = '0px';
      card.style.marginRight = '0px';
    }
    });

    card.style.zIndex = i;
    calculateMarginCards(deck.length, card);
    setCardImage(card, playerDeck[i]);

    divMainPlayer.divCardIconCards.push(card);
    divMainPlayer.mainDivCards.appendChild(card);
  }
  document.body.appendChild(divMainPlayer.mainDivCards);
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

function setCardIcon(element) {
  element.className = 'card-icon';
  element.style.backgroundImage = `url("${getCardIcon()}")`;
}

function setUserIcon(element) {
  element.className = 'user-icon';
  element.src = getUserIcon();
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

function calculateWidthCards(cardsNumber, element) {
    const maxWidth = 800;
    const minWidth = 50;
    let width = maxWidth - cardsNumber * 21;
    width = width < minWidth ? minWidth : width;
    element.style.marginLeft = `${width}px`;
}

function calculateMarginCards(cardsNumber, element) {
    const maxMargin = -55;
    const minMargin = -20;
    let margin = minMargin + (cardsNumber * 1.2);
    margin = margin > maxMargin ? maxMargin : margin;
    element.style.marginLeft = `${margin}px`;
}

module.exports = {
  generatingGame,
};