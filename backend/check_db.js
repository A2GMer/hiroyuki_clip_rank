const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'hiroyuki.db');
const db = new Database(dbPath);

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table';").all();
console.log("📋 テーブル一覧:", tables);
