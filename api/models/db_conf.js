const info = require('../../frontend/src/config.js');

const db = require('better-sqlite3')(info.dbPath, {verbose: console.log });

module.exports =db;