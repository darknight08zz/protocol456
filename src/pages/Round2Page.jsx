// src/pages/Round2Page.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ✅ Changed: relative path for Vercel API
const API_BASE = '/api/round2';

export default function Round2Page() {
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState('');
  const [members, setMembers] = useState(['']); // Start with one member input
  const [teamId, setTeamId] = useState('');
  const [currentRound, setCurrentRound] = useState(1);
  const [userChoice, setUserChoice] = useState(null);
  const [status, setStatus] = useState('idle'); // 'idle', 'submitted', 'round_complete', 'timed_out'
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Add/remove/update members
  const addMember = () => setMembers([...members, '']);
  const removeMember = (index) => {
    if (members.length > 1) {
      setMembers(members.filter((_, i) => i !== index));
    }
  };
  const updateMember = (index, value) => {
    const newMembers = [...members];
    newMembers[index] = value;
    setMembers(newMembers);
  };

  // Join team
  const handleJoin = async () => {
    const validMembers = members.map(m => m.trim()).filter(Boolean);
    if (!teamName.trim() || validMembers.length === 0) {
      setError('Team name and at least one member required');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamName: teamName.trim(), members: validMembers })
      });
      const data = await res.json();
      if (data.success) {
        setTeamId(data.teamId);
        setCurrentRound(data.currentRound);
        setError('');
      } else {
        setError(data.error || 'Failed to join');
      }
    } catch (err) {
      setError('Network error. Make sure you’re on Vercel or using `vercel dev`.');
    }
  };

  // Submit choice
  const handleSubmit = async () => {
    if (!userChoice || !teamId) return;
    try {
      const res = await fetch(`${API_BASE}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId, choice: userChoice, roundNumber: currentRound })
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        return;
      }
      setStatus('submitted');
      setError('');
    } catch (err) {
      setError('Submission failed');
    }
  };

  // Auto-check round status every 8 seconds
  useEffect(() => {
    let interval;
    if (teamId && status === 'submitted') {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`${API_BASE}/check-round?roundNumber=${currentRound}&teamId=${teamId}`);
          const data = await res.json();
          if (data.status === 'round_complete') {
            setResult(data);
            setStatus('round_complete');
            clearInterval(interval);
          } else if (data.error) {
            console.warn('Check-round error:', data.error);
          }
        } catch (err) {
          console.error('Auto-check failed');
        }
      }, 8000);
    }
    return () => clearInterval(interval);
  }, [teamId, status, currentRound]);

  // 2-minute auto-lock
  useEffect(() => {
    let timer;
    if (status === 'idle' && teamId) {
      timer = setTimeout(() => {
        setStatus('timed_out');
        // Auto-submit "cooperate" or just disable — we disable
      }, 2 * 60 * 1000); // 2 minutes
    }
    return () => clearTimeout(timer);
  }, [status, teamId]);

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

  // === STYLES (unchanged) ===
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

  const inputStyle = {
    padding: '12px 20px',
    fontSize: '1.2rem',
    backgroundColor: '#111',
    color: 'white',
    border: '1px solid #00F5D4',
    borderRadius: '8px',
    width: '100%',
    margin: '0.5rem 0',
    textAlign: 'center'
  };

  // === JOIN SCREEN ===
  if (!teamId) {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <h2>🌐 ROUND 2: NETWORK STRATEGY</h2>
          <p>Enter your team name and members (max 5 members):</p>
          
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Team Name"
            style={inputStyle}
          />
          
          <div style={{ marginTop: '1rem' }}>
            {members.map((member, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  value={member}
                  onChange={(e) => updateMember(i, e.target.value)}
                  placeholder={`Member ${i + 1}`}
                  style={inputStyle}
                />
                {members.length > 1 && (
                  <button
                    onClick={() => removeMember(i)}
                    style={{
                      background: 'none',
                      border: '1px solid red',
                      color: 'red',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      minWidth: '30px'
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            {members.length < 5 && (
              <button
                onClick={addMember}
                style={{
                  color: '#00F5D4',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  marginTop: '8px',
                  fontSize: '1rem'
                }}
              >
                + Add Member
              </button>
            )}
          </div>

          <button
            onClick={handleJoin}
            disabled={!teamName.trim() || members.some(m => !m.trim())}
            style={{
              padding: '12px 32px',
              fontSize: '1.1rem',
              backgroundColor: teamName.trim() && members.every(m => m.trim()) ? '#00F5D4' : '#555',
              color: '#000',
              border: 'none',
              borderRadius: '8px',
              fontFamily: 'Orbitron',
              cursor: teamName.trim() && members.every(m => m.trim()) ? 'pointer' : 'not-allowed',
              marginTop: '1.5rem'
            }}
          >
            JOIN GAME
          </button>
          {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
        </div>
      </div>
    );
  }

  // === GAME SCREEN ===
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
            <p style={{ marginBottom: '1.2rem' }}>Choose your action (2 minutes):</p>
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
            {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
          </div>
        )}

        {status === 'submitted' && (
          <p style={{ marginTop: '2rem', fontSize: '1.2rem' }}>✅ Submitted! Waiting for other teams or timeout...</p>
        )}

        {status === 'timed_out' && (
          <p style={{ marginTop: '2rem', fontSize: '1.2rem', color: 'orange' }}>⏰ Time's up! Choice locked.</p>
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