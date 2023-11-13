const cardImagesContext = require.context('../img/cards', false, /\.png$/);


exports.getCardImage = (color, value) => {
    const formattedValue = String(value).toLowerCase();
    const formattedColor = String(color).toLowerCase();
    const imagePath = `./${formattedValue}_${formattedColor}.png`;
    
    return cardImagesContext(imagePath);
  };