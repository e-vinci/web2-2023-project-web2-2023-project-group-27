import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';


const nicknameForm = document.getElementById("nickname");
const popupSettings = document.getElementById("popupSettings");
const settingsButton = document.getElementById("options");

let isPopUpDisplayed = false;

nicknameForm.placeholder = randomNickName();
popupSettings.style.display = 'none';

settingsButton.addEventListener('click', () => {
    if(isPopUpDisplayed) {
    popupSettings.style.display = 'none';
    } else {
    popupSettings.style.display = 'block';
    }
    isPopUpDisplayed = !isPopUpDisplayed;
})




function randomNickName() {
    return uniqueNamesGenerator({
        dictionaries: [adjectives, animals, colors],
        length: 2
      });
}