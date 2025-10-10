// src/pages/Round2Page.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, onValue, set, get, serverTimestamp, remove } from 'firebase/database';
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
  const [userChoice, setUserChoice] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [roundResult, setRoundResult] = useState(null);
  const [choices, setChoices] = useState({});
  const [hasJoined, setHasJoined] = useState(false);
  const [timeLeft, setTimeLeft] = useState(ROUND_DURATION);
  const [timerActive, setTimerActive] = useState(false);
  const [finalScores, setFinalScores] = useState([]);
  const [allTeams, setAllTeams] = useState([]); // Track actual joined teams

  // Fetch all teams once on join
  const fetchAllTeams = useCallback(async () => {
    const teamsRef = ref(db, `rooms/${ROOM_ID}/teams`);
    const snapshot = await get(teamsRef);
    const teams = snapshot.val() ? Object.keys(snapshot.val()) : [];
    setAllTeams(teams);
  }, []);

  // Join game with team limit enforcement
  const joinGame = useCallback(async () => {
    if (!teamName.trim()) return;
    const cleanName = teamName.trim();

    // Fetch current teams
    const teamsRef = ref(db, `rooms/${ROOM_ID}/teams`);
    const snapshot = await get(teamsRef);
    const existingTeams = snapshot.val() ? Object.keys(snapshot.val()) : [];

    if (existingTeams.length >= TOTAL_TEAMS) {
      alert('Game is full! Only 10 teams allowed.');
      return;
    }

    if (existingTeams.includes(cleanName)) {
      alert('Team name already taken! Please choose a unique name.');
      return;
    }

    const teamData = {
      name: cleanName,
      members: teamMembers
        .split(',')
        .map(m => m.trim())
        .filter(m => m),
      joinedAt: serverTimestamp(),
    };
    await set(ref(db, `rooms/${ROOM_ID}/teams/${cleanName}`), teamData);
    setHasJoined(true);
    setAllTeams([...existingTeams, cleanName]);
  }, [teamName, teamMembers]);

  const submitChoice = useCallback(
    async (choice) => {
      if (!hasJoined || !allTeams.includes(teamName)) return;
      const choiceRef = ref(db, `rooms/${ROOM_ID}/rounds/${currentRound}/choices/${teamName}`);
      await set(choiceRef, {
        choice,
        submittedAt: serverTimestamp(),
      });
      setUserChoice(choice);
    },
    [teamName, currentRound, hasJoined, allTeams]
  );

  // Process results (only called when exactly 10 valid choices exist)
  const processResults = useCallback(
    async (allChoices) => {
      // Only consider choices from valid teams
      const validChoices = {};
      Object.keys(allChoices)
        .filter(team => allTeams.includes(team))
        .forEach(team => {
          validChoices[team] = allChoices[team];
        });

      if (Object.keys(validChoices).length !== TOTAL_TEAMS) return;

      const selfishCount = Object.values(validChoices).filter(c => c.choice === 'selfish').length;
      const coopCount = TOTAL_TEAMS - selfishCount;
      const userChoiceHere = validChoices[teamName]?.choice;

      let userPoints = 0;
      let resultMessage = '';

      if (selfishCount === 0) {
        userPoints = 10;
        resultMessage = `All teams cooperated! +10 points.`;
      } else if (selfishCount <= TOTAL_TEAMS / 2) {
        if (userChoiceHere === 'selfish') {
          userPoints = 15;
          resultMessage = `You chose selfish. +15 points.`;
        } else {
          const remainingBandwidth = 100 - 15 * selfishCount;
          userPoints = coopCount > 0 ? Math.round(remainingBandwidth / coopCount) : 0;
          resultMessage = `Bandwidth shared among ${coopCount} cooperators. +${userPoints} points.`;
        }
      } else {
        if (userChoiceHere === 'selfish') {
          userPoints = -10;
          resultMessage = 'Bandwidth clash! Selfish teams lose 10 points.';
        } else {
          userPoints = 0;
          resultMessage = 'Bandwidth clash! Cooperators get 0 points.';
        }
      }

      // Save round points (for debugging, even if hidden)
      const roundPointsRef = ref(db, `rooms/${ROOM_ID}/rounds/${currentRound}/points/${teamName}`);
      await set(roundPointsRef, userPoints);

      // Update total score
      const totalScoreRef = ref(db, `rooms/${ROOM_ID}/scores/${teamName}`);
      const totalSnap = await get(totalScoreRef);
      const currentTotal = totalSnap.exists() ? totalSnap.val() : 0;
      const newTotal = currentTotal + userPoints;
      await set(totalScoreRef, newTotal);

      // Only show results for rounds 1–5
      if (currentRound <= 5) {
        setRoundResult({
          userChoice: userChoiceHere,
          selfishCount,
          userPoints,
          message: resultMessage,
        });
        setShowResults(true);
      } else {
        // For rounds 6–10: auto-proceed without showing results
        setTimeout(() => {
          handleNextRound();
        }, 2000); // Brief pause before next round
      }
    },
    [teamName, currentRound, allTeams]
  );

  // Timer logic
  useEffect(() => {
    let interval = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && hasJoined) {
      if (!choices[teamName]) {
        submitChoice('cooperate');
      }
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, hasJoined, choices, teamName, submitChoice]);

  // Listen to round choices
  useEffect(() => {
    if (!hasJoined) return;

    setTimeLeft(ROUND_DURATION);
    setTimerActive(true);
    setUserChoice(choices[teamName]?.choice || null);
    setShowResults(false);
    setRoundResult(null);

    const roundRef = ref(db, `rooms/${ROOM_ID}/rounds/${currentRound}`);
    const unsubscribe = onValue(roundRef, (snapshot) => {
      const data = snapshot.val();
      const currentChoices = data?.choices || {};
      setChoices(currentChoices);

      // Count only valid team submissions
      const validSubmissions = Object.keys(currentChoices).filter(team => allTeams.includes(team));
      if (validSubmissions.length === TOTAL_TEAMS && !showResults) {
        processResults(currentChoices);
      }
    });

    return () => {
      unsubscribe();
      setTimerActive(false);
    };
  }, [currentRound, showResults, hasJoined, allTeams, processResults, teamName, choices]);

  // Final scores after Round 10
  useEffect(() => {
    if (currentRound === ROUNDS && showResults) {
      const scoresRef = ref(db, `rooms/${ROOM_ID}/scores`);
      const unsubscribe = onValue(scoresRef, (snapshot) => {
        const data = snapshot.val() || {};
        const scoresArray = Object.entries(data)
          .map(([team, score]) => ({ team, score }))
          .sort((a, b) => b.score - a.score);
        setFinalScores(scoresArray);
      });
      return () => unsubscribe();
    }
  }, [currentRound, showResults]);

  const handleNextRound = () => {
    if (currentRound === ROUNDS) {
      navigate('/');
      return;
    }
    setCurrentRound(prev => prev + 1);
    setUserChoice(null);
    setShowResults(false);
    setRoundResult(null);
  };

  const isMyChoiceSubmitted = choices[teamName] !== undefined;
  const parsedMembers = teamMembers
    .split(',')
    .map(m => m.trim())
    .filter(m => m);

  // Registration screen
  if (!hasJoined) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#05080c',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#00F5D4',
          fontFamily: "'Orbitron', sans-serif",
          padding: '2rem',
        }}
      >
        <h2>🌐 ROUND 2: NETWORK STRATEGY</h2>
        <p style={{ color: '#aaa', marginBottom: '1.5rem' }}>
          Only <strong>10 teams</strong> allowed. Enter your team info to join.
        </p>

        <input
          type="text"
          placeholder="Team Name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          style={{
            padding: '12px 20px',
            fontSize: '1.1rem',
            backgroundColor: 'rgba(10, 20, 30, 0.7)',
            border: '1px solid #00F5D4',
            borderRadius: '8px',
            color: 'white',
            width: '300px',
            textAlign: 'center',
            marginBottom: '1rem',
          }}
        />

        <textarea
          placeholder="Team Members (comma-separated)"
          value={teamMembers}
          onChange={(e) => setTeamMembers(e.target.value)}
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
            marginBottom: '1.5rem',
          }}
        />

        <button
          onClick={joinGame}
          disabled={!teamName.trim()}
          style={{
            padding: '12px 30px',
            backgroundColor: teamName.trim() ? '#00F5D4' : '#555',
            color: '#000',
            border: 'none',
            borderRadius: '6px',
            fontFamily: "'Orbitron', sans-serif",
            fontSize: '1.2rem',
            cursor: teamName.trim() ? 'pointer' : 'not-allowed',
          }}
        >
          JOIN GAME → START ROUND 1
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#05080c',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: '#00F5D4',
        fontFamily: "'Orbitron', sans-serif",
        padding: '2rem',
      }}
    >
      <h2>ROUND {currentRound} / {ROUNDS}</h2>
      <p style={{ color: '#ddd', marginBottom: '0.5rem' }}>
        <strong>Team:</strong> {teamName}
      </p>
      {parsedMembers.length > 0 && (
        <p style={{ color: '#aaa', fontSize: '0.95rem', marginBottom: '1rem' }}>
          Members: {parsedMembers.join(', ')}
        </p>
      )}

      {timerActive && (
        <p
          style={{
            color: timeLeft <= 30 ? '#FF2A6D' : '#00F5D4',
            fontSize: '1.3rem',
            marginBottom: '1rem',
          }}
        >
          ⏱️ Time left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
        </p>
      )}

      {!showResults ? (
        <>
          <p style={{ color: '#aaa', margin: '1rem 0' }}>
            {isMyChoiceSubmitted
              ? '✅ Submitted. Waiting for other teams...'
              : 'Choose your network strategy:'}
          </p>

          {!isMyChoiceSubmitted && (
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', margin: '1rem 0' }}>
              <button
                onClick={() => submitChoice('cooperate')}
                style={{
                  padding: '14px 28px',
                  backgroundColor: '#00F5D4',
                  color: '#000',
                  border: '2px solid #00F5D4',
                  borderRadius: '8px',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
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
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                }}
              >
                🟥 SELFISH
              </button>
            </div>
          )}

          <p style={{ color: '#aaa' }}>
            Teams submitted: <strong>{Object.keys(choices).filter(t => allTeams.includes(t)).length} / {TOTAL_TEAMS}</strong>
          </p>
        </>
      ) : (
        // Only show this for Rounds 1–5
        currentRound <= 5 && (
          <div
            style={{
              backgroundColor: 'rgba(10, 20, 30, 0.8)',
              border: '2px solid #00F5D4',
              borderRadius: '12px',
              padding: '1.5rem',
              margin: '1.5rem 0',
              maxWidth: '550px',
              textAlign: 'center',
            }}
          >
            <p>
              <strong>Your choice:</strong>{' '}
              {roundResult.userChoice === 'cooperate' ? '🟩 Cooperate' : '🟥 Selfish'}
            </p>
            <p>
              <strong>Selfish teams:</strong> {roundResult.selfishCount} / {TOTAL_TEAMS}
            </p>
            <p style={{ color: roundResult.userPoints >= 0 ? '#00F5D4' : '#FF2A6D' }}>
              Points this round: {roundResult.userPoints}
            </p>
            <p>{roundResult.message}</p>
          </div>
        )
      )}

      {/* Show "Next Round" button only when results are ready */}
      {(showResults || (currentRound > 5 && Object.keys(choices).filter(t => allTeams.includes(t)).length === TOTAL_TEAMS)) && (
        <button
          onClick={handleNextRound}
          style={{
            padding: '12px 30px',
            backgroundColor: '#00F5D4',
            color: '#000',
            border: 'none',
            borderRadius: '6px',
            fontSize: '1.2rem',
            marginTop: '1rem',
            cursor: 'pointer',
          }}
        >
          {currentRound === ROUNDS ? 'VIEW FINAL SCORE →' : 'NEXT ROUND →'}
        </button>
      )}

      {finalScores.length > 0 && (
        <div style={{ marginTop: '2rem', width: '100%', maxWidth: '500px' }}>
          <h3 style={{ color: '#00F5D4' }}>🏆 FINAL SCOREBOARD</h3>
          {finalScores.map(({ team, score }, i) => (
            <div
              key={team}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: '1px solid #333',
                fontSize: '1.1rem',
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