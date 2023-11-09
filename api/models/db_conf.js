const info = require('../config');

// eslint-disable-next-line import/order
const db = require('better-sqlite3')(info.dbPath, { verbose: console.log });

module.exports = db;
