/* eslint-disable no-param-reassign */
const { debugCacherChargement } = require('./loadingGame') ;
const {getCardImage} = require("./images");


let cardCenterDiv;
let currentCard;
let cardStack;
let divMainPlayer;

function generatingGame(lobby) {
    debugCacherChargement();
    cardCenterDiv = document.createElement('div');
        cardCenterDiv.className = 'cardCenterDiv';

    currentCard = document.createElement('div');
        currentCard.className = 'currentCard';
        if(lobby.currentCard === null) currentCard.src = '';
        setImage(currentCard, lobby.currentCard);

    cardStack = document.createElement('div');
        cardStack.className = 'cardStack';

    cardCenterDiv.appendChild(cardStack);
    cardCenterDiv.appendChild(currentCard);
    document.body.appendChild(cardCenterDiv);
    // setLoadingBarPercentage(mettreLePourcentIci);

    for(let i = 0; i < lobby.players.length; i+=1) {
        const {deck} = lobby.players[i];
        if (typeof deck !== 'number') {
            divMainPlayer = document.createElement('div');
                divMainPlayer.className = 'mainPlayer';
            for(let j = 0; j < deck.length; j+=1) {
                const card = document.createElement('div');
                    card.className = 'cardMainPlayer';
                    setImage(card, deck[j]);
                divMainPlayer.appendChild(card);
            }
            document.body.appendChild(divMainPlayer);
        }
    }
    
}


function setImage(element, card) {
    if(card === null) card = {value: 'card', color: 'back'};
    element.style.backgroundImage = `url("${getCardImage(card.color, card.value)}")`;
    element.title = `${card.value} ${card.color}`;
};


module.exports = {
    generatingGame,
}