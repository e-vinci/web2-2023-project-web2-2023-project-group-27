import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';


const nicknameForm = document.getElementById("nickname");

nicknameForm.placeholder = randomNickName();



function randomNickName() {
    return uniqueNamesGenerator({
        dictionaries: [adjectives, animals, colors],
        length: 2
      });
}