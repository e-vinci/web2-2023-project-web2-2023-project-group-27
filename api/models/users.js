const db = require("./db_conf");

function Save(data) {
  const stmt = db.prepare('INSERT INTO users(pseudo, email, password) VALUES (?, ?, ?)');
  const info = stmt.run(data.pseudo, data.email, data.password);
}

module.exports = {
    Save
  };