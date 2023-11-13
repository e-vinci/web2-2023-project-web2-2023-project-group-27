const cardImagesContext = require.context('../img/cards', false, /\.png$/);
const cardIcon = require("../img/card_icon.png");
const userIcon = require("../img/user_icon.png");

function getCardIcon() {
    return cardIcon;
}

function getUserIcon() {
    return userIcon;
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
}