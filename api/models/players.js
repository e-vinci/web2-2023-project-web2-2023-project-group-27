// eslint-disable-next-line no-unused-vars
const db = require('./db_conf');

const onlinePlayers = [];

function createProfile(username, socketId, isHuman) {
  const profile = {
    playerId: Math.floor(Math.random() * 9999999),
    username,
    socketId,
    deck: [],
    numberOfCardsPlayed: 0,
    numberOfCardsDrawned: 0,
    score: 0,
    isReady: false,
    isHuman,
  };
  onlinePlayers.push(profile);
  return profile;
}

function readyToStart(player) {
  // eslint-disable-next-line no-param-reassign
  player.isReady = true;
}

function getPlayerBySocket(socketId) {
  return onlinePlayers.find((player) => player.socketId === socketId);
}

function getPlayerById(playerId) {
  return onlinePlayers.find((player) => player.playerId === playerId);
}

module.exports = {
  createProfile,
  getPlayerById,
  getPlayerBySocket,
  readyToStart,
};
