const http = require('http').createServer();
const io = require('socket.io')(http, { cors: { origin: 'http://localhost:8080' } });

const lobbies = require('../models/lobbies');
const players = require('../models/players');

io.on('connection', (socket) => {
  socket.emit('connected');

  // Quand un joueur souhaite rejoindre une partie
  socket.on('addPlayer', (nickname, socketID) => {
    socket.join(socketID);
    lobbies.addPlayerToLobby(players.createProfile(nickname, false, socketID));
  });

  // Quand un joueur se déconnecte
  socket.on('disconnect', () => {
    lobbies.removePlayer(socket.id);
  });
});

// Ouverture du serveur sur le port 8082
// eslint-disable-next-line no-console
http.listen(8082, () => console.log(`WebSockets server listening on ${http.address().address}:${http.address().port}`));

exports.sendSocketToId = (id, type, content) => io.to(id).emit(type, content);
