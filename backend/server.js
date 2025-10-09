// backend/server.js
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

// ✅ Allow only your frontend domains
app.use(cors({
  origin: [
    'https://protocol456.vercel.app', // Your live Vercel app
    'http://localhost:5173',          // Vite dev server
    'http://127.0.0.1:5173'
  ]
}));

app.use(express.json());

// 🔌 PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test DB connection on startup
pool.query('SELECT NOW()', (err) => {
  if (err) {
    console.error('❌ Failed to connect to PostgreSQL:', err.message);
  } else {
    console.log('✅ Connected to PostgreSQL');
  }
});

// Initialize database tables
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
    await pool.query(`
      CREATE TABLE IF NOT EXISTS submissions (
        id SERIAL PRIMARY KEY,
        team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
        round_num INTEGER NOT NULL,
        choice TEXT CHECK (choice IN ('cooperate', 'selfish'))
      );
    `);
    console.log('✅ Database tables initialized');
  } catch (err) {
    console.error('❌ DB init error:', err);
  }
}

initializeDB();

const generateId = () => Math.random().toString(36).substr(2, 9);
const TOTAL_TEAMS = 5;

// GET current round
app.get('/api/round2/state', async (req, res) => {
  try {
    const result = await pool.query('SELECT current_round FROM game_state WHERE id = 1');
    const currentRound = result.rows[0]?.current_round || 1;
    res.json({ currentRound });
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
    console.error('Join error:', err);
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
    // Get current round
    const roundResult = await pool.query('SELECT current_round FROM game_state WHERE id = 1');
    const round = roundResult.rows[0].current_round;

    // Check duplicate
    const existing = await pool.query(
      'SELECT 1 FROM submissions WHERE team_id = $1 AND round_num = $2',
      [teamId, round]
    );
    if (existing.rows.length > 0) {
      return res.json({ status: 'already_submitted' });
    }

    // Save submission
    await pool.query(
      'INSERT INTO submissions (team_id, round_num, choice) VALUES ($1, $2, $3)',
      [teamId, round, choice]
    );

    // Check if round is complete
    const countResult = await pool.query(
      'SELECT COUNT(*) as count FROM submissions WHERE round_num = $1',
      [round]
    );
    const count = parseInt(countResult.rows[0].count);

    if (count >= TOTAL_TEAMS) {
      // Fetch all submissions this round
      const submissions = await pool.query(
        'SELECT team_id, choice FROM submissions WHERE round_num = $1',
        [round]
      );
      const choices = submissions.rows;
      const selfishCount = choices.filter(c => c.choice === 'selfish').length;
      const coopCount = TOTAL_TEAMS - selfishCount;

      // Calculate and apply scores
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

      // Advance round (if not final)
      if (round < 10) {
        await pool.query('UPDATE game_state SET current_round = current_round + 1 WHERE id = 1');
      }

      // Get updated total score for this team
      const teamScore = await pool.query('SELECT total_score FROM teams WHERE id = $1', [teamId]);
      const thisTeam = roundResults.find(r => r.teamId === teamId);

      res.json({
        status: 'round_complete',
        selfishCount,
        pointsThisRound: thisTeam?.points || 0,
        totalScore: teamScore.rows[0]?.total_score || 0,
        showScore: round <= 5
      });
    } else {
      res.json({ status: 'submitted' });
    }
  } catch (err) {
    console.error('Submit error:', err);
    res.status(500).json({ message: 'Submission failed' });
  }
});

// 🔑 ADMIN: Reset game
app.post('/api/admin/reset', async (req, res) => {
  try {
    await pool.query('DELETE FROM submissions');
    await pool.query('DELETE FROM teams');
    await pool.query('UPDATE game_state SET current_round = 1 WHERE id = 1');
    res.json({ success: true, message: 'Game reset successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Reset failed' });
  }
});

// 🔍 Debug endpoints
app.get('/api/debug/teams', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM teams ORDER BY total_score DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'DB error' });
  }
});

app.get('/api/debug/submissions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM submissions ORDER BY id DESC LIMIT 50');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'DB error' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', time: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🎮 Game backend running on port ${PORT}`);
});