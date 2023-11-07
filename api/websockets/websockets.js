const http = require('http').createServer();
const io = require('socket.io')(http, { cors: ['http://localhost:8082', 'https://e-baron.github.io'] });

const lobbies = require('../models/lobbies');
const players = require('../models/players');

io.on('connection', (socket) => {
  // Envoi automatique d'une réponse disant qu'il est connecté au serveur
  socket.emit('connected');

  // Quand un joueur souhaite rejoindre une partie
  socket.on('addPlayer', (nickname) => {
    if (lobbies.addPlayerToLobby(players.createProfile(nickname, false, socket.id))) socket.emit('playerAdded');
  });

  // Quand un joueur se déconnecte
  socket.on('disconnect', () => {
    players.removePlayer(socket.id);
  });
});

// Ouverture du serveur sur le port 8082
http.listen(8082, () => console.log('WebSockets server listening on http://localhost:8082'));
