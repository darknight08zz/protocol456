// src/pages/Round2Page.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'https://game-backend-r9w8.onrender.com/api/round2';

export default function Round2Page() {
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState('');
  const [teamId, setTeamId] = useState('');
  const [currentRound, setCurrentRound] = useState(1);
  const [userChoice, setUserChoice] = useState(null);
  const [status, setStatus] = useState('idle'); // 'idle', 'submitted', 'round_complete'
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleJoin = async () => {
    if (!teamName.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamName: teamName.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setTeamId(data.teamId);
        setCurrentRound(data.currentRound);
      } else {
        setError(data.message || 'Failed to join');
      }
    } catch (err) {
      setError('Network error. Is backend running?');
    }
  };

  const handleSubmit = async () => {
    if (!userChoice || !teamId) return;
    try {
      const res = await fetch(`${API_BASE}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId, choice: userChoice })
      });
      const data = await res.json();
      if (data.status === 'round_complete') {
        setResult(data);
        setStatus('round_complete');
      } else {
        setStatus('submitted');
      }
    } catch (err) {
      setError('Submission failed');
    }
  };

  const handleNextRound = () => {
    if (currentRound >= 10) {
      navigate('/');
      return;
    }
    setUserChoice(null);
    setStatus('idle');
    setResult(null);
    setCurrentRound(prev => prev + 1);
  };

  const pageStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '1rem',
    backgroundColor: '#05080c',
    fontFamily: 'Orbitron, monospace',
    color: 'white',
    boxSizing: 'border-box'
  };

  const cardStyle = {
    backgroundColor: '#0a1422',
    border: '1px solid #00F5D4',
    borderRadius: '16px',
    padding: '2rem',
    width: '95%',
    maxWidth: '600px',
    textAlign: 'center',
    boxShadow: '0 0 20px rgba(0, 245, 212, 0.15)'
  };

  // Join screen
  if (!teamId) {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <h2>🌐 ROUND 2: NETWORK STRATEGY</h2>
          <p>Enter your team name to join (10 teams total):</p>
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Team Name"
            style={{
              padding: '12px 20px',
              fontSize: '1.2rem',
              backgroundColor: '#111',
              color: 'white',
              border: '1px solid #00F5D4',
              borderRadius: '8px',
              width: '100%',
              margin: '1.5rem 0',
              textAlign: 'center'
            }}
          />
          <button
            onClick={handleJoin}
            disabled={!teamName.trim()}
            style={{
              padding: '12px 32px',
              fontSize: '1.1rem',
              backgroundColor: teamName.trim() ? '#00F5D4' : '#555',
              color: '#000',
              border: 'none',
              borderRadius: '8px',
              fontFamily: 'Orbitron',
              cursor: teamName.trim() ? 'pointer' : 'not-allowed'
            }}
          >
            JOIN GAME
          </button>
          {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <button
        onClick={() => navigate('/')}
        style={{
          alignSelf: 'flex-start',
          marginBottom: '1.5rem',
          padding: '6px 12px',
          color: '#00F5D4',
          background: 'transparent',
          border: '1px solid #00F5D4',
          borderRadius: '4px',
          fontFamily: 'Orbitron',
          cursor: 'pointer'
        }}
      >
        ← Home
      </button>

      <div style={cardStyle}>
        <h2>ROUND {currentRound} / 10</h2>
        <p>Team: <strong>{teamName}</strong></p>

        {status === 'idle' && (
          <div style={{ marginTop: '1.5rem' }}>
            <p style={{ marginBottom: '1.2rem' }}>Choose your action:</p>
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => setUserChoice('cooperate')}
                style={{
                  padding: '24px 32px',
                  fontSize: '1.3rem',
                  backgroundColor: userChoice === 'cooperate' ? '#00d0b0' : '#00F5D4',
                  color: '#000',
                  border: 'none',
                  borderRadius: '12px',
                  fontFamily: 'Orbitron',
                  cursor: 'pointer',
                  minWidth: '180px',
                  boxShadow: '0 4px 8px rgba(0, 245, 212, 0.3)'
                }}
              >
                🟩 Cooperate
              </button>
              <button
                onClick={() => setUserChoice('selfish')}
                style={{
                  padding: '24px 32px',
                  fontSize: '1.3rem',
                  backgroundColor: userChoice === 'selfish' ? '#ff0a4d' : '#FF2A6D',
                  color: '#000',
                  border: 'none',
                  borderRadius: '12px',
                  fontFamily: 'Orbitron',
                  cursor: 'pointer',
                  minWidth: '180px',
                  boxShadow: '0 4px 8px rgba(255, 42, 109, 0.3)'
                }}
              >
                🟥 Selfish
              </button>
            </div>
            <button
              onClick={handleSubmit}
              disabled={!userChoice}
              style={{
                marginTop: '2rem',
                padding: '12px 36px',
                fontSize: '1.1rem',
                backgroundColor: userChoice ? '#00F5D4' : '#555',
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                fontFamily: 'Orbitron',
                cursor: userChoice ? 'pointer' : 'not-allowed'
              }}
            >
              Submit Choice
            </button>
          </div>
        )}

        {status === 'submitted' && (
          <p style={{ marginTop: '2rem', fontSize: '1.2rem' }}>✅ Submitted! Waiting for other teams...</p>
        )}

        {status === 'round_complete' && result && (
          <div style={{ marginTop: '1.5rem' }}>
            <p>Selfish teams: <strong>{result.selfishCount}</strong> / 10</p>

            {currentRound <= 5 ? (
              <>
                <p>Points this round: <strong>{result.pointsThisRound}</strong></p>
                {result.showScore && <p>Total Score: <strong>{result.totalScore}</strong></p>}
              </>
            ) : (
              <p style={{ fontStyle: 'italic', color: '#aaa' }}>
                (Score details hidden from Round 6 onward)
              </p>
            )}

            <button
              onClick={handleNextRound}
              style={{
                marginTop: '1.5rem',
                padding: '10px 24px',
                backgroundColor: '#00F5D4',
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                fontFamily: 'Orbitron',
                cursor: 'pointer'
              }}
            >
              {currentRound === 10 ? 'Finish Game' : 'Next Round →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}