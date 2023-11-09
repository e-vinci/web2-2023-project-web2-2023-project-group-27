// eslint-disable-next-line no-unused-vars
const db = require('./db_conf');

const onlinePlayers = [];

function createProfile(username, isConnected, socketId) {
  const profile = {
    username,
    isConnected,
    socketId,
    deck: [],
    numberOfCardsPlayed: 0,
    numberOfCardsDrawned: 0,
    score: 0,
    isReady: false,
  };
  onlinePlayers.push(profile);
  return profile;
}

function readyToStart(socketId) {
  const player = getPlayer(socketId);
  player.isReady = true;
}

function getPlayer(socketId) {
  return onlinePlayers.find((player) => player.socketId === socketId);
}

module.exports = {
  createProfile,
  getPlayer,
  readyToStart,
};
