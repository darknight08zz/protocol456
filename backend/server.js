// backend/server.js
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();

// ✅ Explicitly allow your frontend domains
app.use(cors({
  origin: [
    'https://protocol456.vercel.app', // Your live Vercel frontend
    'http://localhost:5173',          // Vite default dev server
    'http://127.0.0.1:5173',
    'http://localhost:3000',          // Create React App fallback
    'http://127.0.0.1:3000'
  ]
}));

app.use(express.json());

// Database setup
const dbPath = path.join(__dirname, 'game.db');
const db = new sqlite3.Database(dbPath);

const TOTAL_TEAMS = 5; // Adjust as needed

// Initialize database tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS game_state (
      id INTEGER PRIMARY KEY,
      current_round INTEGER DEFAULT 1,
      is_active BOOLEAN DEFAULT 1
    )
  `);
  db.run(`
    INSERT OR IGNORE INTO game_state (id, current_round) VALUES (1, 1)
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS teams (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      total_score INTEGER DEFAULT 0
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      team_id TEXT,
      round_num INTEGER,
      choice TEXT CHECK(choice IN ('cooperate', 'selfish')),
      FOREIGN KEY(team_id) REFERENCES teams(id)
    )
  `);
});

const generateId = () => Math.random().toString(36).substr(2, 9);

// GET current round
app.get('/api/round2/state', (req, res) => {
  db.get('SELECT current_round FROM game_state WHERE id = 1', (err, row) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json({ currentRound: row?.current_round || 1 });
  });
});

// POST /join
app.post('/api/round2/join', (req, res) => {
  const { teamName } = req.body;
  if (!teamName || typeof teamName !== 'string' || teamName.trim().length < 1) {
    return res.status(400).json({ success: false, message: 'Valid team name required' });
  }

  const cleanName = teamName.trim();
  const teamId = generateId();

  db.run('INSERT INTO teams (id, name) VALUES (?, ?)', [teamId, cleanName], function (err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ success: false, message: 'Team name already taken' });
      }
      return res.status(500).json({ success: false, message: 'DB error' });
    }

    db.get('SELECT current_round FROM game_state WHERE id = 1', (err, row) => {
      res.json({
        success: true,
        teamId,
        currentRound: row?.current_round || 1
      });
    });
  });
});

// POST /submit
app.post('/api/round2/submit', (req, res) => {
  const { teamId, choice } = req.body;
  if (!teamId || !['cooperate', 'selfish'].includes(choice)) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  db.get('SELECT current_round FROM game_state WHERE id = 1', (err, state) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    const round = state.current_round;

    // Check duplicate submission
    db.get('SELECT 1 FROM submissions WHERE team_id = ? AND round_num = ?', [teamId, round], (err, existing) => {
      if (existing) {
        return res.json({ status: 'already_submitted' });
      }

      // Save choice
      db.run('INSERT INTO submissions (team_id, round_num, choice) VALUES (?, ?, ?)', [teamId, round, choice], (err) => {
        if (err) return res.status(500).json({ message: 'Submission failed' });

        // Check if round is complete
        db.get('SELECT COUNT(*) as count FROM submissions WHERE round_num = ?', [round], (err, result) => {
          if (result.count >= TOTAL_TEAMS) {
            // Calculate scores and get detailed results
            calculateAndApplyScores(round, (roundResults) => {
              // Advance round if not final
              if (round < 10) {
                db.run('UPDATE game_state SET current_round = current_round + 1 WHERE id = 1');
              }

              // Fetch updated total score
              db.get('SELECT total_score FROM teams WHERE id = ?', [teamId], (err, teamRow) => {
                const thisTeam = roundResults.find(r => r.teamId === teamId);
                const selfishCount = roundResults.filter(r => r.choice === 'selfish').length;

                res.json({
                  status: 'round_complete',
                  selfishCount,
                  pointsThisRound: thisTeam?.points || 0,
                  totalScore: teamRow?.total_score || 0,
                  showScore: round <= 5
                });
              });
            });
          } else {
            res.json({ status: 'submitted' });
          }
        });
      });
    });
  });
});

// Score engine — returns round results
function calculateAndApplyScores(round, callback) {
  db.all('SELECT team_id, choice FROM submissions WHERE round_num = ?', [round], (err, submissions) => {
    if (err || !submissions.length) return callback([]);

    const selfishCount = submissions.filter(s => s.choice === 'selfish').length;
    const coopCount = TOTAL_TEAMS - selfishCount;
    const roundResults = [];

    submissions.forEach(sub => {
      let points = 0;
      if (selfishCount === 0) {
        points = 10;
      } else if (selfishCount < TOTAL_TEAMS / 2) {
        if (sub.choice === 'selfish') {
          points = 15;
        } else {
          const remaining = 100 - (15 * selfishCount);
          points = coopCount > 0 ? Math.round(remaining / coopCount) : 0;
        }
      } else {
        if (sub.choice === 'selfish') points = -10;
        else points = 0;
      }

      roundResults.push({ teamId: sub.team_id, choice: sub.choice, points });

      db.run('UPDATE teams SET total_score = total_score + ? WHERE id = ?', [points, sub.team_id]);
    });

    callback(roundResults);
  });
}

// 🔑 ADMIN: Reset all game data
app.post('/api/admin/reset', (req, res) => {
  db.run('DELETE FROM teams');
  db.run('DELETE FROM submissions');
  db.run('UPDATE game_state SET current_round = 1, is_active = 1 WHERE id = 1');
  res.json({ success: true, message: 'Game reset successfully' });
});

// Debug endpoint (safe to keep in dev; remove in prod if needed)
app.get('/api/debug/teams', (req, res) => {
  db.all('SELECT * FROM teams', (err, rows) => {
    res.json(err ? { error: 'DB error' } : rows);
  });
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend is running' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🎮 Game backend running on port ${PORT}`);
});