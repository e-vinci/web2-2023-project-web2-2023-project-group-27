/* eslint-disable no-console */
/* eslint-disable import/order */
/* eslint-disable no-continue */

// const http = require('http').createServer();
const { Server } = require('socket.io');
const { useAzureSocketIO } = require('@azure/web-pubsub-socket.io');
const config = require('../config');

const {
  playCard, pickACard, signalUno, contreUno,
} = require('../models/game');
const lobbies = require('../models/lobbies');
const players = require('../models/players');
const { Login, SignIn } = require('../models/users');
// Version localhost
// const io = require('socket.io')(http, { cors: { origin: '*' } });

// Version Azure
const io = new Server(process.env.PORT || 25568);

io.on('connection', (socket) => {
  socket.emit('connected');

  // Écoutez l'événement de connexion
  socket.on('login', ({ username, password }) => {
    Login({ username, password });
  });

  // Écoutez l'événement d'inscription
  socket.on('register', ({ username, password }) => {
    SignIn({ username, password });
  });

  // Quand un joueur souhaite rejoindre une partie
  socket.on('addPlayer', async (nickname, socketID) => {
    await socket.join(socketID);
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
    if (lobby.isEnded) return;
    const messageFormat = `${player.username} ➪ ${message}`;
    for (let i = 0; i < lobby.players.length; i += 1) {
      if (lobby.players[i].socketId === null || lobby.players[i].socketId === undefined) continue;
      io.to(lobby.players[i].socketId).emit('chatMessage', { message: messageFormat, isInformational: false });
    }
  });

  socket.on('playCard', (card) => {
    const player = players.getPlayerBySocket(socket.id);
    const lobby = lobbies.getLobbyByPlayer(players.getPlayerBySocket(socket.id));
    if (lobby.isEnded) return;
    playCard(lobby, player, card);
  });

  socket.on('colorChoice', (infos) => {
    const lobby = lobbies.getLobbyByPlayer(players.getPlayerBySocket(socket.id));
    if (lobby.isEnded) return;
    lobbies.changeColor(infos, lobby);
  });

  socket.on('drawCard', () => {
    /*
    const player = players.getPlayerBySocket(socket.id);
    const lobby = lobbies.getLobbyByPlayer(player);
    lobbies.drawCard(lobby, player);
    */
    const player = players.getPlayerBySocket(socket.id);
    const lobby = lobbies.getLobbyByPlayer(player);
    if (lobby.isEnded) return;
    pickACard(lobby, player);
  });

  socket.on('uno', () => {
    const player = players.getPlayerBySocket(socket.id);
    const lobby = lobbies.getLobbyByPlayer(player);
    if (lobby.isEnded) return;
    signalUno(player, lobby);
  });

  socket.on('contreUno', () => {
    const player = players.getPlayerBySocket(socket.id);
    const lobby = lobbies.getLobbyByPlayer(player);
    if (lobby.isEnded) return;
    contreUno(lobby, player);
  });

  socket.on('login', (infos) => {
    io.to(socket.socketId).emit('loginResult', { username: Login(infos.email, infos.password) });
  });

  socket.on('register', (infos) => {
    io.to(socket.socketId).emit('signInResult', { username: SignIn(infos.email, infos.pseudo, infos.password) });
  });
});

const sendSocketToId = (id, type, content) => {
  if (id !== null && id !== undefined) {
    io.to(id).emit(type, content);
  }
};

const loginSuccess = (socketId, username) => {
  sendSocketToId(socketId, 'login-success', { username });
};

// Version localhost
/*
http.listen(25568, () => console.log(`WebSockets server listening on port ${http.address().port}`));
*/

// Version Azure
useAzureSocketIO(io, {
  hub: 'hub', // The hub name can be any valid string.
  connectionString: config.azure,
});
console.log('WebSockets server listening on https://unovinci.webpubsub.azure.com');

exports.sendSocketToId = sendSocketToId;
exports.loginSuccess = loginSuccess;
