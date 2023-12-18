/* eslint-disable global-require */
// eslint-disable-next-line no-unused-vars

const onlinePlayers = [];

let numberOfPlayersSinceStart = 0;
let highestPlayersPeak = 0;

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

  if (isHuman) numberOfPlayersSinceStart += 1;
  if (getPlayerCount() > highestPlayersPeak) highestPlayersPeak = getPlayerCount();
  return profile;
}

function deleteProfile(playerId) {
  const index = onlinePlayers.findIndex((player) => player.playerId === playerId);
  if (index === -1) return;
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

function getPlayerCount() {
  const humanPlayersCount = onlinePlayers.filter((player) => player.isHuman).length;
  return humanPlayersCount;
}

setInterval(() => {
  const lobbies = require('./lobbies');
  const lobbiesCount = lobbies.getLobbiesCount();
  const playersCount = getPlayerCount();
  console.log(`Lobbies: ${lobbiesCount} | Players online: ${playersCount} | Players since start: ${numberOfPlayersSinceStart} | Highest players peak: ${highestPlayersPeak}`);
}, 20000);

module.exports = {
  createProfile,
  getPlayerById,
  getPlayerBySocket,
  readyToStart,
  deleteProfile,
  getPlayerCount,
};
