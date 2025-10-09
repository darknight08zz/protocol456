// backend/init-db.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./game.db');

db.serialize(() => {
  // Teams table
  db.run(`CREATE TABLE IF NOT EXISTS teams (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    total_score INTEGER DEFAULT 0
  )`);

  // Submissions table
  db.run(`CREATE TABLE IF NOT EXISTS submissions (
    team_id TEXT,
    round_num INTEGER NOT NULL,
    choice TEXT CHECK(choice IN ('cooperate', 'selfish')) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams (id)
  )`);

  // Game state table (only one row)
  db.run(`CREATE TABLE IF NOT EXISTS game_state (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    current_round INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT 1
  )`);

  // Insert initial game state if not exists
  db.run(`INSERT OR IGNORE INTO game_state (id, current_round, is_active) VALUES (1, 1, 1)`);
});

db.close();
console.log("Database initialized: game.db");