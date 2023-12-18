/* eslint-disable no-restricted-syntax */
/* eslint-disable global-require */
let chatbox;
let chatForm;
let messageInput;
let divMessages;

function generateChatBox() {
  // Supprimez l'ancien formulaire s'il existe
  if (chatbox) {
    chatbox.remove();
  }

  divMessages = document.createElement('div');
  divMessages.id = 'divMessages';
  document.body.appendChild(divMessages);

  chatbox = document.createElement('div');
  chatbox.className = 'chatbox';
  chatForm = document.createElement('form');
  chatForm.className = 'chatText';
  messageInput = document.createElement('input');
  messageInput.id = 'chatInput';
  messageInput.style.zIndex = '30';
  messageInput.placeholder = 'Envoyer un message';
  messageInput.type = 'text';
  messageInput.style.marginBottom = '10px';
  messageInput.style.position = 'absolute';
  messageInput.style.bottom = '10px';
  messageInput.style.left = '10px';
  messageInput.style.width = '450px';
  chatForm.appendChild(messageInput);
  chatbox.appendChild(chatForm);

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    messageInput.value = '';
    sendMessage(message);

    setTimeout(() => {
      messageInput.focus();
    }, 10);

  });

  document.body.appendChild(chatbox);
}

function sendMessage(message) {
  if (message === null || message === '') return;
  const { sendSocketToServer } = require('./websockets');
  sendSocketToServer('messageSent', message);
}

// Définir une limite pour le nombre de messages à afficher
const maxMessages = 5;
const messages = [];

function addMessage(message, isInformational) {
  messages.push({message, isInformational});

  if (messages.length > maxMessages) {
    messages.shift(); // Supprime le message le plus ancien
  }
  renderMessages();
}

function renderMessages() {
  chatbox.innerHTML = ''; // Effacer le contenu actuel de la boîte de chat

  for (const message of messages) {
    const chatText = document.createElement('h5');
    chatText.className = 'chatMessage';
    chatText.innerText = message.message;
    if (message.isInformational) chatText.style.color = 'grey';
    chatbox.appendChild(chatText);

    // Supprimer le message après 10 secondes
    setTimeout(() => {
      chatText.remove();
    }, 10000);
  }

  divMessages.appendChild(chatForm); // Réajouter le formulaire
  divMessages.scrollTop = divMessages.scrollHeight; // Faire défiler jusqu'au bas
}

module.exports = {
  generateChatBox,
  addMessage,
};
