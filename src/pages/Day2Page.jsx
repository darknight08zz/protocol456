// src/pages/Day2Page.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Day2Page() {
  const navigate = useNavigate();
  const [currentRound, setCurrentRound] = useState('round3');

  // ===== ROUND 4 STATE =====
  const [numTeamsR4, setNumTeamsR4] = useState('');
  const [password, setPassword] = useState(''); // 🔐 New: admin password
  const [teamIdsR4, setTeamIdsR4] = useState([]);
  const [rankingsR4, setRankingsR4] = useState([]);
  const [stepR4, setStepR4] = useState('input'); // 'input' | 'auth' | 'ranking' | 'eliminate' | 'final'
  const [selectedTeamR4, setSelectedTeamR4] = useState(null);
  const [errorR4, setErrorR4] = useState('');

  // Start Round 4: first validate team count, then go to auth step
  const handleStartR4 = () => {
    const n = parseInt(numTeamsR4, 10);
    if (isNaN(n) || n < 3 || n > 8) {
      setErrorR4('Please enter a number between 3 and 8.');
      return;
    }
    setErrorR4('');
    setStepR4('auth'); // Go to password step
  };

  // Handle password submission
  const handlePasswordSubmit = () => {
    if (password.trim() !== '456protocol') {
      setErrorR4('Incorrect admin password.');
      return;
    }

    // Password correct → initialize teams and go to ranking
    const n = parseInt(numTeamsR4, 10);
    const ids = Array.from({ length: n }, (_, i) => i + 1);
    setTeamIdsR4(ids);
    setRankingsR4([]);
    setSelectedTeamR4(null);
    setStepR4('ranking');
    setErrorR4('');
  };

  // Handle ranking input in Round 4
  const handleRankSubmitR4 = () => {
    if (rankingsR4.length !== teamIdsR4.length) {
      setErrorR4('Please rank all players.');
      return;
    }

    const baseWeightsFor8 = [49, 18, 10, 9, 8, 7];
    const weights = baseWeightsFor8.slice(0, teamIdsR4.length);

    let weightedPool = [];
    for (let i = 0; i < rankingsR4.length; i++) {
      const playerId = rankingsR4[i];
      const count = weights[i] || 1;
      weightedPool = weightedPool.concat(Array(count).fill(playerId));
    }

    const randomIndex = Math.floor(Math.random() * weightedPool.length);
    const randomSelection = weightedPool[randomIndex];

    setSelectedTeamR4(randomSelection);
    setStepR4('eliminate');
    setErrorR4('');
  };

  // Handle player removal in Round 4
  const handleRemoveTeamR4 = (playerIdToRemove) => {
    const updated = teamIdsR4.filter(id => id !== playerIdToRemove);
    if (updated.length <= 2) {
      setTeamIdsR4(updated);
      setStepR4('final');
    } else {
      setTeamIdsR4(updated);
      setRankingsR4([]);
      setSelectedTeamR4(null);
      setStepR4('ranking');
    }
  };

  // Reset Round 4
  const resetRound4 = () => {
    setNumTeamsR4('');
    setPassword('');
    setTeamIdsR4([]);
    setRankingsR4([]);
    setStepR4('input');
    setSelectedTeamR4(null);
    setErrorR4('');
  };

  // ===== ROUND 3 SHAPES DATA WITH SYMBOLS =====
  const shapes = [
    { name: 'Circle', symbol: '●', color: '#FF2A6D' },
    { name: 'Triangle', symbol: '▲', color: '#007BFF' },
    { name: 'Square', symbol: '■', color: '#00FFA3' },
    { name: 'Star', symbol: '★', color: '#FFD166' },
  ];

  return (
    <section style={{
      minHeight: '100vh',
      padding: '3rem 2rem',
      backgroundColor: '#05080c',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center'
    }}>
      {/* ← BACK TO HOME BUTTON */}
      <button
        onClick={() => navigate('/')}
        style={{
          alignSelf: 'flex-start',
          marginBottom: '0.8rem',
          background: 'transparent',
          border: '1px solid #555',
          color: '#aaa',
          padding: '8px 16px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontFamily: "'Roboto', sans-serif",
          fontSize: '0.95rem',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--neon-red)'}
        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#555'}
      >
        ← Back to Home
      </button>

      {/* ROUND TOGGLE BUTTONS */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        alignSelf: 'flex-start',
        marginBottom: '1.5rem'
      }}>
        <button
          onClick={() => setCurrentRound('round3')}
          style={{
            background: currentRound === 'round3' ? 'var(--neon-red)' : 'transparent',
            color: currentRound === 'round3' ? '#000' : 'var(--neon-red)',
            border: `2px solid var(--neon-red)`,
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontFamily: "'Orbitron', sans-serif",
            fontSize: '1.1rem',
            fontWeight: 'bold',
            transition: 'all 0.2s'
          }}
        >
          ROUND 3: PROTOCOL IN THE BORDERLAND
        </button>

        <button
          onClick={() => setCurrentRound('round4')}
          style={{
            background: currentRound === 'round4' ? 'var(--neon-teal)' : 'transparent',
            color: currentRound === 'round4' ? '#000' : 'var(--neon-teal)',
            border: `2px solid var(--neon-teal)`,
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontFamily: "'Orbitron', sans-serif",
            fontSize: '1.1rem',
            fontWeight: 'bold',
            transition: 'all 0.2s'
          }}
        >
          ROUND 4: CIRCUIT OF DECEPTION
        </button>
      </div>

      {/* ROUND 3: RULES CARD */}
      {currentRound === 'round3' && (
        <div style={{ width: '100%', maxWidth: '700px', marginTop: '1.5rem' }}>
          <h1 className="neon-text" style={{
            fontSize: '2.5rem',
            marginBottom: '1.5rem',
            fontFamily: "'Orbitron', sans-serif",
            color: '#FF2A6D',
            textShadow: '0 0 4px rgba(214, 34, 70, 0.5), 0 0 8px rgba(214, 34, 70, 0.3)'
          }}>
            ROUND THREE: PROTOCOL IN THE BORDERLAND
          </h1>

          <div style={{ marginBottom: '2rem' }}>
            <p style={{ color: '#ddd', fontSize: '1.2rem', marginBottom: '1rem' }}>
              <strong>Four Shapes:</strong>
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.8rem', flexWrap: 'wrap' }}>
              {shapes.map((shape, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}>
                  <span style={{
                    fontSize: '2.4rem',
                    color: shape.color,
                    lineHeight: 1
                  }}>{shape.symbol}</span>
                  <span style={{
                    color: shape.color,
                    fontFamily: "'Orbitron', sans-serif",
                    fontWeight: 'bold',
                    marginTop: '0.4rem'
                  }}>{shape.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            backgroundColor: 'rgba(10, 20, 25, 0.6)',
            border: '1px solid #444',
            borderRadius: '12px',
            padding: '1.8rem',
            textAlign: 'left',
            color: '#ddd',
            fontFamily: "'Roboto', sans-serif",
            fontSize: '1.05rem',
            lineHeight: 1.6
          }}>
            <h2 style={{
              color: '#FF2A6D',
              fontFamily: "'Orbitron', sans-serif",
              fontSize: '1.8rem',
              marginBottom: '1.2rem',
              textAlign: 'center'
            }}>
              📜 RULES
            </h2>

            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
              <li>There are <strong>10 rounds</strong> in total.</li>
              <li>Before each round begins, every player is secretly assigned <strong>one of the four shapes</strong> (unknown to them).</li>
              <li>Each player draws <strong>one card</strong> from a deck of 11 cards:
                <ul style={{ paddingLeft: '1.2rem', marginTop: '0.4rem' }}>
                  <li>1 <span style={{ color: '#FF2A6D' }}>Virus Card</span></li>
                  <li><span style={{ color: '#00FFA3' }}>Defence Cards</span></li>
                  <li><span style={{ color: '#007BFF' }}>Normal Cards</span></li>
                </ul>
              </li>
              <li>Players have <strong>5 minutes</strong> to discuss and try to guess their own shape.</li>
            </ul>

            <h3 style={{
              color: '#FF2A6D',
              fontFamily: "'Orbitron', sans-serif",
              fontSize: '1.3rem',
              marginTop: '1.5rem',
              marginBottom: '0.8rem'
            }}>
              🦠 Virus Card Player
            </h3>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.2rem' }}>
              <li>Does <strong>not guess</strong> their shape.</li>
              <li>Must secretly <strong>choose one Normal Card player</strong> to infect.</li>
              <li>If they infect a Normal player → that player gets a <strong>❌</strong>.</li>
              <li>If they infect a Defence player → the Virus player gets a <strong>❌</strong>, and the Defence player gets a <strong>✅</strong>.</li>
              <li>The Virus player themselves get a <strong>✅</strong> only if they successfully infect a Normal player.</li>
            </ul>

            <h3 style={{
              color: '#00FFA3',
              fontFamily: "'Orbitron', sans-serif",
              fontSize: '1.3rem',
              marginTop: '1.5rem',
              marginBottom: '0.8rem'
            }}>
              🛡️ Defence Card Player
            </h3>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.2rem' }}>
              <li>If <strong>chosen by the Virus player</strong> → automatically gets a <strong>✅</strong>.</li>
              <li>If <strong>not chosen</strong> → must guess their shape like others to earn a <strong>✅</strong> or <strong>❌</strong>.</li>
            </ul>

            <h3 style={{
              color: '#007BFF',
              fontFamily: "'Orbitron', sans-serif",
              fontSize: '1.3rem',
              marginTop: '1.5rem',
              marginBottom: '0.8rem'
            }}>
              👤 Normal Card Player
            </h3>
            <ul style={{ paddingLeft: '1.5rem' }}>
              <li>If <strong>chosen by the Virus player</strong> → gets a <strong>❌</strong> (no guessing).</li>
              <li>If <strong>not chosen</strong> → must guess their shape to earn a <strong>✅</strong> or <strong>❌</strong>.</li>
            </ul>

            <p style={{ fontStyle: 'italic', color: '#aaa', marginTop: '1.5rem', textAlign: 'center' }}>
              Only the player directly targeted by the Virus (if Normal) is penalized. All others must rely on deduction.
            </p>
          </div>
        </div>
      )}

      {/* ROUND 4: Full elimination game */}
      {currentRound === 'round4' && (
        <div style={{ width: '100%', maxWidth: '800px', marginTop: '1.5rem' }}>
          <h1 className="neon-text" style={{
            fontSize: '2.5rem',
            marginBottom: '1.5rem',
            fontFamily: "'Orbitron', sans-serif",
            color: '#00FFA3',
            textShadow: '0 0 4px rgba(0, 255, 163, 0.5), 0 0 8px rgba(0, 255, 163, 0.3)'
          }}>
            ROUND FOUR: CIRCUIT OF DECEPTION
          </h1>

          {/* SET BUTTONS */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.2rem',
            marginBottom: '2.5rem'
          }}>
            {Array.from({ length: 6 }, (_, i) => {
              const setId = i + 1;
              const circUrl = `/circuits/round4/set${setId}.circ`;
              const pdfUrl = `/circuits/round4/set${setId}.pdf`;
              return (
                <div
                  key={setId}
                  style={{
                    backgroundColor: 'rgba(10, 20, 25, 0.6)',
                    border: '1px solid #333',
                    borderRadius: '10px',
                    padding: '1.2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.8rem',
                    alignItems: 'center'
                  }}
                >
                  <h3 style={{
                    color: '#00FFA3',
                    margin: 0,
                    fontSize: '1.3rem',
                    fontFamily: "'Orbitron', sans-serif'"
                  }}>
                    SET {setId}
                  </h3>

                  <a
                    href={circUrl}
                    download={`set${setId}_circuit.circ`}
                    className="glow-button"
                    style={{
                      width: '100%',
                      padding: '10px',
                      fontSize: '1rem',
                      textAlign: 'center',
                      textDecoration: 'none',
                      display: 'block'
                    }}
                  >
                    📥 Download .circ
                  </a>

                  <a
                    href={pdfUrl}
                    download={`set${setId}_guide.pdf`}
                    className="glow-button"
                    style={{
                      width: '100%',
                      padding: '10px',
                      fontSize: '1rem',
                      textAlign: 'center',
                      textDecoration: 'none',
                      display: 'block',
                      background: 'var(--neon-purple)',
                      borderColor: 'var(--neon-purple)'
                    }}
                  >
                    📄 Download .pdf
                  </a>
                </div>
              );
            })}
          </div>

          <p style={{ color: '#aaa', fontSize: '1.05rem', marginTop: '1rem', fontStyle: 'italic', marginBottom: '2rem' }}>
            Study the cipher. Predict the outcome. Survive the protocol.
          </p>

          {/* STEP: INPUT NUMBER OF PLAYERS */}
          {stepR4 === 'input' && (
            <div>
              <p style={{ color: '#ddd', fontSize: '1.2rem', marginBottom: '1.5rem' }}>
                Enter the number of players to begin the elimination protocol.
              </p>
              <input
                type="number"
                min="3"
                max="8"
                value={numTeamsR4}
                onChange={(e) => setNumTeamsR4(e.target.value)}
                placeholder="e.g., 6"
                style={{
                  padding: '12px',
                  fontSize: '1.1rem',
                  backgroundColor: 'rgba(10, 15, 20, 0.7)',
                  border: '1px solid #444',
                  borderRadius: '6px',
                  color: 'white',
                  width: '100%',
                  maxWidth: '200px',
                  textAlign: 'center'
                }}
              />
              {errorR4 && <p style={{ color: 'var(--neon-red)', marginTop: '0.5rem' }}>{errorR4}</p>}
              <br />
              <button
                onClick={handleStartR4}
                className="glow-button"
                style={{ marginTop: '1.2rem', padding: '12px 30px', fontSize: '1.1rem' }}
              >
                START PROTOCOL
              </button>
            </div>
          )}

          {/* STEP: ADMIN PASSWORD AUTHENTICATION */}
          {stepR4 === 'auth' && (
            <div>
              <p style={{ color: '#ddd', fontSize: '1.2rem', marginBottom: '1rem' }}>
                Admin authentication required to proceed.
              </p>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                style={{
                  padding: '12px',
                  fontSize: '1.1rem',
                  backgroundColor: 'rgba(10, 15, 20, 0.7)',
                  border: '1px solid #444',
                  borderRadius: '6px',
                  color: 'white',
                  width: '100%',
                  maxWidth: '250px',
                  textAlign: 'center'
                }}
              />
              {errorR4 && <p style={{ color: 'var(--neon-red)', marginTop: '0.5rem' }}>{errorR4}</p>}
              <br />
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
                <button
                  onClick={handlePasswordSubmit}
                  className="glow-button"
                  style={{ padding: '12px 24px', fontSize: '1.1rem' }}
                >
                  SUBMIT
                </button>
                <button
                  onClick={() => {
                    setStepR4('input');
                    setPassword('');
                    setErrorR4('');
                  }}
                  style={{
                    padding: '12px 24px',
                    fontSize: '1.1rem',
                    background: 'transparent',
                    border: '1px solid #555',
                    color: '#aaa',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  ← Back
                </button>
              </div>
            </div>
          )}

          {/* STEP: RANKING */}
          {stepR4 === 'ranking' && (
            <div>
              <p style={{ color: '#ddd', fontSize: '1.2rem', marginBottom: '1rem' }}>
                Current Players: {teamIdsR4.join(', ')}
              </p>
              <p style={{ color: '#aaa', marginBottom: '1.2rem' }}>
                Rank players from <strong>fastest (1st)</strong> to <strong>slowest</strong>.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', alignItems: 'center' }}>
                {teamIdsR4.map((_, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <span style={{ color: '#00FFA3', fontWeight: 'bold', minWidth: '80px' }}>
                      Rank {idx + 1}:
                    </span>
                    <select
                      value={rankingsR4[idx] || ''}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (isNaN(val)) return;
                        if (rankingsR4.includes(val) && rankingsR4[idx] !== val) return;
                        const newRankings = [...rankingsR4];
                        newRankings[idx] = val;
                        setRankingsR4(newRankings);
                      }}
                      style={{
                        padding: '8px',
                        backgroundColor: 'rgba(10, 15, 20, 0.7)',
                        border: '1px solid #444',
                        borderRadius: '4px',
                        color: 'white',
                        minWidth: '120px'
                      }}
                    >
                      <option value="">-- Select --</option>
                      {teamIdsR4
                        .filter(id => !rankingsR4.includes(id) || rankingsR4[idx] === id)
                        .map(id => (
                          <option key={id} value={id}>Player {id}</option>
                        ))}
                    </select>
                  </div>
                ))}
              </div>

              {errorR4 && <p style={{ color: 'var(--neon-red)', marginTop: '1rem' }}>{errorR4}</p>}
              <button
                onClick={handleRankSubmitR4}
                className="glow-button"
                style={{ marginTop: '1.5rem', padding: '12px 30px', fontSize: '1.1rem' }}
                disabled={rankingsR4.length !== teamIdsR4.length}
              >
                CONFIRM RANKING
              </button>
            </div>
          )}

          {/* STEP: ELIMINATE */}
          {stepR4 === 'eliminate' && selectedTeamR4 !== null && (
            <div>
              <p style={{ color: '#FFD166', fontSize: '1.3rem', marginBottom: '1rem' }}>
                🎯 Weighted random selection: <strong>Player {selectedTeamR4}</strong>
              </p>
              <p style={{ color: '#ddd', marginBottom: '1.5rem' }}>
                Choose a player to eliminate (you may eliminate any player).
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', justifyContent: 'center' }}>
                {teamIdsR4.map(id => (
                  <button
                    key={id}
                    onClick={() => handleRemoveTeamR4(id)}
                    className="glow-button"
                    style={{
                      padding: '10px 16px',
                      fontSize: '1rem',
                      backgroundColor: 'rgba(0, 255, 163, 0.2)',
                      border: '1px solid var(--neon-teal)'
                    }}
                  >
                    Eliminate Player {id}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP: FINAL */}
          {stepR4 === 'final' && (
            <div>
              <p style={{ color: 'var(--neon-teal)', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                ✅ FINAL PLAYERS: {teamIdsR4.join(' and ')}
              </p>
              <p style={{ color: '#ddd', marginBottom: '1.5rem' }}>
                The cipher is broken. Only two remain.
              </p>
              <button
                onClick={resetRound4}
                className="glow-button"
                style={{ padding: '12px 30px', fontSize: '1.1rem' }}
              >
                RUN AGAIN
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}