/* eslint-disable no-continue */
const http = require('http').createServer();
const io = require('socket.io')(http, { cors: { origin: 'http://localhost:8080' } });

const { playCard } = require('../models/game');
const lobbies = require('../models/lobbies');
const players = require('../models/players');

io.on('connection', (socket) => {
  socket.emit('connected');

  // Quand un joueur souhaite rejoindre une partie
  socket.on('addPlayer', (nickname, socketID) => {
    socket.join(socketID);
    lobbies.addPlayerToLobby(players.createProfile(nickname, socketID, true));
  });

  socket.on('readyToStart', () => {
    players.readyToStart(socket.id);
  });

  // Quand un joueur se déconnecte
  socket.on('disconnect', () => {
    lobbies.removePlayer(socket.id);
  });

  socket.on('getLobbyInfo', () => {
    const infos = lobbies.getLobbyInformation(players.getPlayerBySocket(socket.id));
    socket.emit('lobbyInfo', infos);
  });

  socket.on('whoPlay', () => {
    const lobby = lobbies.getLobbyByPlayer(players.getPlayerBySocket(socket.id));
    io.to(socket.id).emit('nextPlayer', lobby.players[lobby.currentPlayer].playerId);
  });

  socket.on('messageSent', (message) => {
    const player = players.getPlayerBySocket(socket.id);
    const lobby = lobbies.getLobbyByPlayer(player);
    const messageFormat = `${player.username} ➪ ${message}`;
    for (let i = 0; i < lobby.players.length; i += 1) {
      if (lobby.players[i].socketId === null || lobby.players[i].socketId === undefined) continue;
      io.to(lobby.players[i].socketId).emit('chatMessage', { message: messageFormat });
    }
  });

  socket.on('playCard', (card) => {
    const player = players.getPlayerBySocket(socket.id);
    const lobby = lobbies.getLobbyByPlayer(players.getPlayerBySocket(socket.id));
    playCard(lobby, player, card);
  });

  socket.on('colorChoice', (color) => {
    const player = players.getPlayerBySocket(socket.id);
    const lobby = lobbies.getLobbyByPlayer(player);

    lobby.currentCard = { value: 'multicolor', color };

    for (let i = 0; i < lobby.players.length; i += 1) {
      io.to(lobby.players[i].socketId).emit('cardPlayed', { toPlayer: player.playerId, card: lobby.currentCard });
    }
  });
});
// Ouverture du serveur sur le port 25568 (celui du serveur)
// eslint-disable-next-line no-console
http.listen(25568, () => console.log(`WebSockets server listening on ${http.address().address}:${http.address().port}`));

exports.sendSocketToId = (id, type, content) => {
  if (id !== null || id !== undefined) {
    io.to(id).emit(type, content);
  }
};
