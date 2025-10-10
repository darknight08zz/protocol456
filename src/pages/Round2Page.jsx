// src/pages/Round2Page.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, onValue, set, get, update } from 'firebase/database';
import { db } from '../firebase';

const TOTAL_TEAMS = 10;
const ROUNDS = 10;
const ROUND_DURATION = 120; // seconds
const ROOM_ID = 'main-room';

export default function Round2Page() {
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState('');
  const [teamMembers, setTeamMembers] = useState('');
  const [currentRound, setCurrentRound] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [roundResult, setRoundResult] = useState(null);
  const [choices, setChoices] = useState({});
  const [hasJoined, setHasJoined] = useState(false);
  const [timeLeft, setTimeLeft] = useState(ROUND_DURATION);
  const [timerActive, setTimerActive] = useState(false);
  const [finalScores, setFinalScores] = useState([]);
  const [allTeams, setAllTeams] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [roundData, setRoundData] = useState({});
  const [roundCompleted, setRoundCompleted] = useState(false);
  
  // Use refs to avoid stale closures in callbacks
  const allTeamsRef = useRef(allTeams);
  const currentRoundRef = useRef(currentRound);
  const teamNameRef = useRef(teamName);
  const roundResultRef = useRef(roundResult);
  const showResultsRef = useRef(showResults);
  const roundCompletedRef = useRef(roundCompleted);
  
  // Update refs when state changes
  useEffect(() => {
    allTeamsRef.current = allTeams;
    currentRoundRef.current = currentRound;
    teamNameRef.current = teamName;
    roundResultRef.current = roundResult;
    showResultsRef.current = showResults;
    roundCompletedRef.current = roundCompleted;
  }, [allTeams, currentRound, teamName, roundResult, showResults, roundCompleted]);

  // Real-time listener for teams
  useEffect(() => {
    const teamsRef = ref(db, `rooms/${ROOM_ID}/teams`);
    const unsubscribe = onValue(teamsRef, (snapshot) => {
      const teamsData = snapshot.val();
      const teams = teamsData ? Object.keys(teamsData) : [];
      setAllTeams(teams);
    });
    
    return () => unsubscribe();
  }, []);

  const joinGame = useCallback(async () => {
    const cleanName = teamName.trim();
    if (!cleanName) {
      alert('Please enter a team name.');
      return;
    }

    try {
      const teamsRef = ref(db, `rooms/${ROOM_ID}/teams`);
      const snapshot = await get(teamsRef);
      const existingTeams = snapshot.val() ? Object.keys(snapshot.val()) : [];

      if (existingTeams.length >= TOTAL_TEAMS) {
        alert('Game is full! Only 10 teams allowed.');
        return;
      }

      if (existingTeams.includes(cleanName)) {
        alert('Team name already taken!');
        return;
      }

      const members = teamMembers
        .split(',')
        .map(m => m.trim())
        .filter(m => m);

      // Add team to Firebase
      await set(ref(db, `rooms/${ROOM_ID}/teams/${cleanName}`), {
        name: cleanName,
        members: members,
        joinedAt: Date.now(),
      });

      setHasJoined(true);
    } catch (error) {
      console.error('Join failed:', error);
      alert('Failed to join. Check console for details.');
    }
  }, [teamName, teamMembers]);

  const submitChoice = useCallback(
    async (choice) => {
      if (!hasJoined || !allTeamsRef.current.includes(teamNameRef.current.trim())) return;
      const cleanName = teamNameRef.current.trim();
      await set(ref(db, `rooms/${ROOM_ID}/rounds/${currentRoundRef.current}/choices/${cleanName}`), {
        choice,
        submittedAt: Date.now(),
      });
    },
    [hasJoined]
  );

  const handleNextRound = useCallback(async () => {
    if (currentRoundRef.current === ROUNDS) {
      navigate('/');
      return;
    }
    
    // Reset round completion status
    await set(ref(db, `rooms/${ROOM_ID}/rounds/${currentRoundRef.current}/completed`), null);
    
    // Reset all states for the new round
    setCurrentRound(prev => prev + 1);
    setShowResults(false);
    setRoundResult(null);
    setIsProcessing(false);
    setChoices({});
    setRoundData({});
    setRoundCompleted(false);
  }, [navigate]);

  const processResults = useCallback(
    async (allChoices) => {
      // Prevent multiple processing attempts
      if (isProcessing) return;
      setIsProcessing(true);
      
      try {
        const currentAllTeams = allTeamsRef.current;
        const currentTeamName = teamNameRef.current.trim();
        const currentRoundNum = currentRoundRef.current;
        
        // Check if round is already completed
        const roundRef = ref(db, `rooms/${ROOM_ID}/rounds/${currentRoundNum}`);
        const roundSnapshot = await get(roundRef);
        const roundData = roundSnapshot.val() || {};
        
        if (roundData.completed) {
          console.log('Round already completed, skipping processing');
          setIsProcessing(false);
          return;
        }
        
        const validChoices = {};
        Object.keys(allChoices)
          .filter(team => currentAllTeams.includes(team))
          .forEach(team => {
            validChoices[team] = allChoices[team];
          });

        if (Object.keys(validChoices).length !== TOTAL_TEAMS) {
          console.log('Not all teams have submitted yet');
          setIsProcessing(false);
          return;
        }

        const selfishCount = Object.values(validChoices).filter(c => c.choice === 'selfish').length;
        const coopCount = TOTAL_TEAMS - selfishCount;
        const userChoiceHere = validChoices[currentTeamName]?.choice;

        let userPoints = 0;
        if (selfishCount === 0) {
          userPoints = 10;
        } else if (selfishCount <= TOTAL_TEAMS / 2) {
          if (userChoiceHere === 'selfish') {
            userPoints = 15;
          } else {
            const remaining = 100 - 15 * selfishCount;
            userPoints = coopCount > 0 ? Math.round(remaining / coopCount) : 0;
          }
        } else {
          if (userChoiceHere === 'selfish') userPoints = -10;
        }

        // Save round points only (no total score tracking)
        const roundPointsRef = ref(db, `rooms/${ROOM_ID}/rounds/${currentRoundNum}/points/${currentTeamName}`);
        await set(roundPointsRef, userPoints);

        // Mark the round as completed in Firebase
        await set(ref(db, `rooms/${ROOM_ID}/rounds/${currentRoundNum}/completed`), true);

        // Create round result object
        const newRoundResult = { 
          userChoice: userChoiceHere, 
          selfishCount, 
          userPoints
        };
        
        // Update state and ref
        setRoundResult(newRoundResult);
        roundResultRef.current = newRoundResult;
        setShowResults(true);
        showResultsRef.current = true;
        setRoundCompleted(true);
        roundCompletedRef.current = true;
      } catch (error) {
        console.error('Error processing results:', error);
        alert('An error occurred while processing results. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    },
    [isProcessing]
  );

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && hasJoined) {
      const cleanName = teamNameRef.current.trim();
      if (!choices[cleanName]) {
        submitChoice('cooperate');
      }
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, hasJoined, choices, submitChoice]);

  // Listen to round data
  useEffect(() => {
    if (!hasJoined) return;

    // Reset states when round changes
    setTimeLeft(ROUND_DURATION);
    setTimerActive(true);
    setShowResults(false);
    setRoundResult(null);
    setIsProcessing(false);
    setChoices({});
    setRoundData({});
    setRoundCompleted(false);

    const roundRef = ref(db, `rooms/${ROOM_ID}/rounds/${currentRoundRef.current}`);
    const unsubscribe = onValue(roundRef, (snapshot) => {
      try {
        const data = snapshot.val() || {};
        const currentChoices = data.choices || {};
        setChoices(currentChoices);
        setRoundData(data);

        const isCompleted = data.completed || false;
        
        // If round is completed, show results and stop timer
        if (isCompleted) {
          setTimerActive(false);
          
          // Only set showResults if it's not already true
          if (!showResultsRef.current) {
            setShowResults(true);
            showResultsRef.current = true;
            setRoundCompleted(true);
            roundCompletedRef.current = true;
            
            // If we don't have round result data yet, try to get it
            if (!roundResultRef.current) {
              const currentTeamName = teamNameRef.current.trim();
              const pointsRef = ref(db, `rooms/${ROOM_ID}/rounds/${currentRoundRef.current}/points/${currentTeamName}`);
              get(pointsRef).then(pointsSnap => {
                if (pointsSnap.exists()) {
                  const userPoints = pointsSnap.val();
                  const newRoundResult = {
                    userChoice: currentChoices[currentTeamName]?.choice || 'unknown',
                    selfishCount: Object.values(currentChoices).filter(c => c.choice === 'selfish').length,
                    userPoints
                  };
                  setRoundResult(newRoundResult);
                  roundResultRef.current = newRoundResult;
                }
              });
            }
          }
          return;
        }

        // If not completed, check if all teams have submitted
        const validSubmissions = Object.keys(currentChoices).filter(t => 
          allTeamsRef.current.includes(t)
        );
        
        if (validSubmissions.length === TOTAL_TEAMS && !isProcessing) {
          processResults(currentChoices);
        }
      } catch (error) {
        console.error('Error in round listener:', error);
      }
    });

    return () => {
      unsubscribe();
      setTimerActive(false);
    };
  }, [currentRound, hasJoined, processResults, isProcessing]);

  // Final scores after last round - calculate from all rounds
  useEffect(() => {
    if (currentRound === ROUNDS && roundCompletedRef.current) {
      const calculateFinalScores = async () => {
        const teamTotalScores = {};
        
        // Get all teams
        const teamsRef = ref(db, `rooms/${ROOM_ID}/teams`);
        const teamsSnapshot = await get(teamsRef);
        const teams = teamsSnapshot.val() ? Object.keys(teamsSnapshot.val()) : [];
        
        // Initialize all teams with 0 points
        teams.forEach(team => {
          teamTotalScores[team] = 0;
        });
        
        // Sum points from all rounds
        for (let round = 1; round <= ROUNDS; round++) {
          const roundPointsRef = ref(db, `rooms/${ROOM_ID}/rounds/${round}/points`);
          const roundPointsSnapshot = await get(roundPointsRef);
          const roundPoints = roundPointsSnapshot.val() || {};
          
          Object.entries(roundPoints).forEach(([team, points]) => {
            if (teamTotalScores[team] !== undefined) {
              teamTotalScores[team] += points;
            }
          });
        }
        
        // Convert to array and sort
        const scoresArray = Object.entries(teamTotalScores)
          .map(([team, score]) => ({ team, score }))
          .sort((a, b) => b.score - a.score);
        
        setFinalScores(scoresArray);
      };
      
      calculateFinalScores();
    }
  }, [currentRound, roundCompletedRef.current]);

  const cleanName = teamName.trim();
  const isMyChoiceSubmitted = choices[cleanName] !== undefined;
  const parsedMembers = teamMembers.split(',').map(m => m.trim()).filter(m => m);

  // Reusable back buttons component
  const BackButtons = () => (
    <div style={{
      display: 'flex',
      gap: '0.8rem'
    }}>
      <button
        onClick={() => navigate('/')}
        style={{
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
        onMouseEnter={(e) => e.currentTarget.style.borderColor = '#aaa'}
        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#555'}
      >
        ← Back to Home
      </button>

      <button
        onClick={() => navigate('/day1')}
        style={{
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
        onMouseEnter={(e) => e.currentTarget.style.borderColor = '#00F5D4'}
        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#555'}
      >
        ↺ Back to Rounds
      </button>
    </div>
  );

  // Registration screen
  if (!hasJoined) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#05080c', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        color: '#00F5D4', 
        fontFamily: "'Orbitron', sans-serif", 
        padding: '2rem',
        position: 'relative'
      }}>
        {/* Back buttons in top-left during registration */}
        <div style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem'
        }}>
          <BackButtons />
        </div>

        <h2>🌐 ROUND 2: NETWORK STRATEGY</h2>
        <p style={{ color: '#aaa', marginBottom: '1.5rem' }}>Only <strong>10 teams</strong> allowed.</p>

        <input
          type="text"
          placeholder="Team Name"
          value={teamName}
          onChange={e => setTeamName(e.target.value)}
          style={{ 
            padding: '12px 20px', 
            fontSize: '1.1rem', 
            backgroundColor: 'rgba(10, 20, 30, 0.7)', 
            border: '1px solid #00F5D4', 
            borderRadius: '8px', 
            color: 'white', 
            width: '300px', 
            textAlign: 'center', 
            marginBottom: '1rem' 
          }}
        />

        <textarea
          placeholder="Team Members (comma-separated)"
          value={teamMembers}
          onChange={e => setTeamMembers(e.target.value)}
          style={{ 
            padding: '12px', 
            fontSize: '1rem', 
            backgroundColor: 'rgba(10, 20, 30, 0.7)', 
            border: '1px solid #00F5D4', 
            borderRadius: '8px', 
            color: 'white', 
            width: '300px', 
            height: '80px', 
            textAlign: 'center', 
            resize: 'none', 
            marginBottom: '1.5rem' 
          }}
        />

        <button
          onClick={joinGame}
          disabled={!cleanName}
          style={{ 
            padding: '12px 30px', 
            backgroundColor: cleanName ? '#00F5D4' : '#555', 
            color: '#000', 
            border: 'none', 
            borderRadius: '6px', 
            fontFamily: "'Orbitron', sans-serif", 
            fontSize: '1.2rem', 
            cursor: cleanName ? 'pointer' : 'not-allowed' 
          }}
        >
          JOIN GAME → START ROUND 1
        </button>
      </div>
    );
  }

  // Game screen
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#05080c', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      color: '#00F5D4', 
      fontFamily: "'Orbitron', sans-serif", 
      padding: '2rem' 
    }}>
      {/* Back buttons at top-left during gameplay */}
      <div style={{
        alignSelf: 'flex-start',
        marginBottom: '1.5rem'
      }}>
        <BackButtons />
      </div>

      <h2>ROUND {currentRound} / {ROUNDS}</h2>
      <p><strong>Team:</strong> {cleanName}</p>
      {parsedMembers.length > 0 && (
        <p style={{ color: '#aaa', fontSize: '0.95rem', marginBottom: '1rem' }}>
          Members: {parsedMembers.join(', ')}
        </p>
      )}

      {timerActive && (
        <p style={{ 
          color: timeLeft <= 30 ? '#FF2A6D' : '#00F5D4', 
          fontSize: '1.3rem', 
          marginBottom: '1rem' 
        }}>
          ⏱️ Time left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
        </p>
      )}

      {!roundData.completed && !isMyChoiceSubmitted ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <p style={{ color: '#aaa', margin: '1rem 0' }}>
            Choose your network strategy:
          </p>

          <div style={{ 
            display: 'flex', 
            gap: '1.5rem', 
            justifyContent: 'center', 
            margin: '1rem 0' 
          }}>
            <button
              onClick={() => submitChoice('cooperate')}
              style={{ 
                padding: '14px 28px', 
                backgroundColor: '#00F5D4', 
                color: '#000', 
                border: '2px solid #00F5D4', 
                borderRadius: '8px', 
                fontSize: '1.2rem' 
              }}
            >
              🟩 COOPERATE
            </button>
            <button
              onClick={() => submitChoice('selfish')}
              style={{ 
                padding: '14px 28px', 
                backgroundColor: '#FF2A6D', 
                color: '#000', 
                border: '2px solid #FF2A6D', 
                borderRadius: '8px', 
                fontSize: '1.2rem' 
              }}
            >
              🟥 SELFISH
            </button>
          </div>

          <p style={{ color: '#aaa' }}>
            Teams submitted: <strong>{Object.keys(choices).filter(t => allTeams.includes(t)).length} / {TOTAL_TEAMS}</strong>
          </p>
          
          {isProcessing && (
            <p style={{ color: '#FFD700', marginTop: '1rem' }}>
              ⏳ Processing results...
            </p>
          )}
        </div>
      ) : (
        <>
          {!roundData.completed && isMyChoiceSubmitted && (
            <p style={{ color: '#aaa', margin: '1rem 0' }}>
              ✅ Submitted. Waiting for other teams...
            </p>
          )}
          
          {roundData.completed && currentRound <= 5 && roundResult && (
            <div style={{ 
              backgroundColor: 'rgba(10, 20, 30, 0.8)', 
              border: '2px solid #00F5D4', 
              borderRadius: '12px', 
              padding: '1.5rem', 
              margin: '1.5rem 0', 
              maxWidth: '550px', 
              textAlign: 'center' 
            }}>
              <p><strong>Your choice:</strong> {roundResult.userChoice === 'cooperate' ? '🟩 Cooperate' : '🟥 Selfish'}</p>
              <p><strong>Selfish teams:</strong> {roundResult.selfishCount} / {TOTAL_TEAMS}</p>
              <p style={{ 
                color: roundResult.userPoints >= 0 ? '#00F5D4' : '#FF2A6D' 
              }}>
                Points this round: {roundResult.userPoints}
              </p>
            </div>
          )}
        </>
      )}

      {roundData.completed && (
        <button
          onClick={handleNextRound}
          style={{ 
            padding: '12px 30px', 
            backgroundColor: '#00F5D4', 
            color: '#000', 
            border: 'none', 
            borderRadius: '6px', 
            fontSize: '1.2rem', 
            marginTop: '1rem' 
          }}
        >
          {currentRound === ROUNDS ? 'VIEW FINAL SCORE →' : 'NEXT ROUND →'}
        </button>
      )}

      {finalScores.length > 0 && (
        <div style={{ 
          marginTop: '2rem', 
          width: '100%', 
          maxWidth: '500px' 
        }}>
          <h3 style={{ color: '#00F5D4' }}>🏆 FINAL SCOREBOARD</h3>
          {finalScores.map(({ team, score }, i) => (
            <div
              key={team}
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '10px 0', 
                borderBottom: '1px solid #333', 
                fontSize: '1.1rem' 
              }}
            >
              <span>{i + 1}. {team}</span>
              <strong>{score} pts</strong>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}