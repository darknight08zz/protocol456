// backend/server.js
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

// ✅ Allow your frontend
app.use(cors({
  origin: [
    'https://protocol456.vercel.app',
    'http://localhost:5173',
    'http://127.0.0.1:5173'
  ]
}));
app.use(express.json());

// 🔑 PostgreSQL connection
const DATABASE_URL = process.env.DATABASE_URL || 'postgres://...'; // Replace with your Render URL in dev
const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const TOTAL_TEAMS = 5;

// Initialize tables on startup
async function initializeDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS game_state (
        id SERIAL PRIMARY KEY,
        current_round INTEGER DEFAULT 1,
        is_active BOOLEAN DEFAULT true
      );
    `);
    await pool.query(`
      INSERT INTO game_state (id, current_round) 
      VALUES (1, 1) 
      ON CONFLICT (id) DO NOTHING;
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS teams (
        id TEXT PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        total_score INTEGER DEFAULT 0
      );
    `);
    await pool(query(`
      CREATE TABLE IF NOT EXISTS submissions (
        id SERIAL PRIMARY KEY,
        team_id TEXT REFERENCES teams(id),
        round_num INTEGER NOT NULL,
        choice TEXT CHECK (choice IN ('cooperate', 'selfish'))
      );
    `));
    console.log('✅ Database initialized');
  } catch (err) {
    console.error('❌ DB init error:', err);
  }
}

initializeDB();

const generateId = () => Math.random().toString(36).substr(2, 9);

// GET current round
app.get('/api/round2/state', async (req, res) => {
  try {
    const result = await pool.query('SELECT current_round FROM game_state WHERE id = 1');
    const row = result.rows[0];
    res.json({ currentRound: row?.current_round || 1 });
  } catch (err) {
    res.status(500).json({ error: 'DB error' });
  }
});

// POST /join
app.post('/api/round2/join', async (req, res) => {
  const { teamName } = req.body;
  if (!teamName || typeof teamName !== 'string' || teamName.trim().length < 1) {
    return res.status(400).json({ success: false, message: 'Valid team name required' });
  }

  const cleanName = teamName.trim();
  const teamId = generateId();

  try {
    await pool.query('INSERT INTO teams (id, name) VALUES ($1, $2)', [teamId, cleanName]);
    const result = await pool.query('SELECT current_round FROM game_state WHERE id = 1');
    res.json({
      success: true,
      teamId,
      currentRound: result.rows[0]?.current_round || 1
    });
  } catch (err) {
    if (err.message.includes('duplicate key value violates unique constraint')) {
      return res.status(409).json({ success: false, message: 'Team name already taken' });
    }
    res.status(500).json({ success: false, message: 'DB error' });
  }
});

// POST /submit
app.post('/api/round2/submit', async (req, res) => {
  const { teamId, choice } = req.body;
  if (!teamId || !['cooperate', 'selfish'].includes(choice)) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  try {
    const roundResult = await pool.query('SELECT current_round FROM game_state WHERE id = 1');
    const round = roundResult.rows[0].current_round;

    const existing = await pool.query(
      'SELECT 1 FROM submissions WHERE team_id = $1 AND round_num = $2',
      [teamId, round]
    );
    if (existing.rows.length > 0) {
      return res.json({ status: 'already_submitted' });
    }

    await pool.query(
      'INSERT INTO submissions (team_id, round_num, choice) VALUES ($1, $2, $3)',
      [teamId, round, choice]
    );

    const countResult = await pool.query(
      'SELECT COUNT(*) FROM submissions WHERE round_num = $1',
      [round]
    );
    const count = parseInt(countResult.rows[0].count);

    if (count >= TOTAL_TEAMS) {
      // Calculate scores
      const submissions = await pool.query(
        'SELECT team_id, choice FROM submissions WHERE round_num = $1',
        [round]
      );
      const choices = submissions.rows;
      const selfishCount = choices.filter(c => c.choice === 'selfish').length;
      const coopCount = TOTAL_TEAMS - selfishCount;

      const roundResults = [];
      for (const sub of choices) {
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
        await pool.query(
          'UPDATE teams SET total_score = total_score + $1 WHERE id = $2',
          [points, sub.team_id]
        );
      }

      // Advance round
      if (round < 10) {
        await pool.query('UPDATE game_state SET current_round = current_round + 1 WHERE id = 1');
      }

      const teamScore = await pool.query('SELECT total_score FROM teams WHERE id = $1', [teamId]);
      const selfishCountFinal = roundResults.filter(r => r.choice === 'selfish').length;
      const thisTeam = roundResults.find(r => r.teamId === teamId);

      res.json({
        status: 'round_complete',
        selfishCount: selfishCountFinal,
        pointsThisRound: thisTeam?.points || 0,
        totalScore: teamScore.rows[0]?.total_score || 0,
        showScore: round <= 5
      });
    } else {
      res.json({ status: 'submitted' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Submission failed' });
  }
});

// 🔑 Reset endpoint
app.post('/api/admin/reset', async (req, res) => {
  try {
    await pool.query('DELETE FROM teams');
    await pool.query('DELETE FROM submissions');
    await pool.query('UPDATE game_state SET current_round = 1 WHERE id = 1');
    res.json({ success: true, message: 'Game reset' });
  } catch (err) {
    res.status(500).json({ error: 'Reset failed' });
  }
});

// Debug endpoints
app.get('/api/debug/teams', async (req, res) => {
  const result = await pool.query('SELECT * FROM teams');
  res.json(result.rows);
});

app.get('/api/debug/submissions', async (req, res) => {
  const result = await pool.query('SELECT * FROM submissions ORDER BY id DESC');
  res.json(result.rows);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🎮 Game backend running on port ${PORT}`);
});