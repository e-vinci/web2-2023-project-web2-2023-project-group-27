const cardImagesContext = require.context('../img/cards', false, /\.png$/);
const cardIcon = require("../img/icons/card_icon.png");
const userIcon = require("../img/icons/user_icon.png");
const botIcon = require("../img/icons/bot_icon.png");
const imageUno = require("../img/vinci.png");
const imageContreUno = require("../img/contre_vinci.png");


function getCardIcon() {
    return cardIcon;
}

function getImageContreUno() {
    return imageContreUno;
}

function getUserIcon() {
    return userIcon;
}

function getBotIcon() {
    return botIcon;
}

function getImageUno(){
    return imageUno;
}

function getCardImage(color, value)  {
    const formattedValue = String(value).toLowerCase();
    const formattedColor = String(color).toLowerCase();
    const imagePath = `./${formattedValue}_${formattedColor}.png`;

    return cardImagesContext(imagePath);
  };

module.exports = {
    getCardImage,
    getCardIcon,
    getUserIcon,
    getBotIcon,
    getImageUno,
    getImageContreUno,
}