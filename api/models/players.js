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
  };
  onlinePlayers.push(profile);
  return profile;
}

function getPlayer(socketId) {
  return onlinePlayers.find((player) => player.socketId === socketId);
}

module.exports = {
  createProfile,
  getPlayer,
};
