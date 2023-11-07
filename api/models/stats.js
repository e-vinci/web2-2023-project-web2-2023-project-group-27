const db = require('./db_conf');

function findIDWithPseudo(username) {
  return db.prepare('SELECT id FROM users WHERE pseudo = ?').get(username);
}

function addWin(username) {
  const id = profile.findIDWithPseudo(username);
  return db.prepare('UPDATE stats SET wins_count = wins_count + 1 WHERE user = ?').get(id);
}

function addLoose(username) {
  const id = profile.findIDWithPseudo(username);
  return db.prepare('UPDATE stats SET loses_count = loses_count + 1 WHERE user = ?').get(id);
}

function addUno(username) {
  const id = profile.findIDWithPseudo(username);
  return db.prepare('UPDATE stats SET uno_count = uno_count + 1 WHERE user = ?').get(id);
}

function addCardPlayed(username) {
  const id = profile.findIDWithPseudo(username);
  return db.prepare('UPDATE stats SET cards_played = cards_played + 1 WHERE user = ?').get(id);
}

function addCardDrawned(username) {
  const id = profile.findIDWithPseudo(username);
  return db.prepare('UPDATE stats SET cards_drawned = cards_drawned + 1 WHERE user = ?').get(id);
}
function PointCount1(username) {
  const id = profile.findIDWithPseudo(username);
  return db.prepare('UPDATE stats SET point_count = point_count + 24 WHERE user = ?').get(id);
}
function PointCount2(username) {
  const id = profile.findIDWithPseudo(username);
  return db.prepare('UPDATE stats SET point_count = point_count + 11 WHERE user = ?').get(id);
}
function PointCount3(username) {
  const id = profile.findIDWithPseudo(username);
  return db.prepare('UPDATE stats SET point_count = point_count - 9 WHERE user = ?').get(id);
}
function PointCount4(username) {
  const id = profile.findIDWithPseudo(username);
  return db.prepare('UPDATE stats SET point_count = point_count - 16 WHERE user = ?').get(id);
}

module.exports = {
  findIDWithPseudo,
  addCardDrawned,
  addCardPlayed,
  addLoose,
  addUno,
  addWin,
  PointCount1,
  PointCount2,
  PointCount3,
  PointCount4,
};
