const { debugCacherChargement } = require('./loadingGame') ;
const {getCardImage} = require("./images");


let cardCenterDiv;
let currentCard;
let cardStack;

function generatingGame(lobby) {
    debugCacherChargement();
    cardCenterDiv = document.createElement('div');
        cardCenterDiv.className = 'cardCenterDiv';

    currentCard = document.createElement('div');
        currentCard.className = 'currentCard';
        if(lobby.currentCard === null) currentCard.src = '';
        currentCard.style.backgroundImage = `url("${getCardImage("back", "card")}")`;

    cardStack = document.createElement('div');
        cardStack.className = 'cardStack';

    cardCenterDiv.appendChild(cardStack);
    cardCenterDiv.appendChild(currentCard);
    document.body.appendChild(cardCenterDiv);
}


module.exports = {
    generatingGame,
}