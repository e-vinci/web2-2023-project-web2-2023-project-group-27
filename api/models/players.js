// eslint-disable-next-line no-unused-vars
const db = require('./db_conf');

const onlinePlayers = [];

function createProfile(username, socketId, isHuman) {
  const profile = {
    playerId: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
    username,
    socketId,
    deck: [],
    numberOfCardsPlayed: 0,
    numberOfCardsDrawned: 0,
    score: 0,
    isReady: false,
    isHuman,
    numbersOfTimesAFK: 0,
  };
  onlinePlayers.push(profile);
  return profile;
}

function deleteProfile(playerId) {
  const index = onlinePlayers.findIndex((player) => player.playerId === playerId);
  onlinePlayers.splice(index, 1);
}

function readyToStart(socketId) {
  const player = getPlayerBySocket(socketId);
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
  deleteProfile,
};
