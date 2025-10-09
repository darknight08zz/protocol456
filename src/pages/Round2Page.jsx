// src/pages/Round2Page.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const TOTAL_TEAMS = 10;
const ROUNDS = 10;
const ROUND_DURATION = 2 * 60; // 2 minutes

// 🔧 TIMER CONTROL — SET TO true WHEN YOU WANT TIMER ACTIVE
const ENABLE_TIMER = false;

export default function Round2Page() {
    const navigate = useNavigate();

    const [teamName, setTeamName] = useState('');
    const [currentRound, setCurrentRound] = useState(1);
    const [timeLeft, setTimeLeft] = useState(ROUND_DURATION);
    const [userChoice, setUserChoice] = useState(null);
    const [isTimerActive, setIsTimerActive] = useState(ENABLE_TIMER);
    const [scores, setScores] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [roundResult, setRoundResult] = useState(null);

    const timerRef = useRef(null);

    // Initialize scores
    useEffect(() => {
        if (teamName && !scores[teamName]) {
            setScores(prev => ({ ...prev, [teamName]: 0 }));
        }
    }, [teamName]);

    // Timer effect (only if enabled)
    useEffect(() => {
        if (ENABLE_TIMER && isTimerActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => (prev <= 1 ? 0 : prev - 1));
            }, 1000);
        } else if (timeLeft === 0) {
            setIsTimerActive(false);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isTimerActive, timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const simulateOtherChoices = () => {
        const otherChoices = [];
        for (let i = 0; i < TOTAL_TEAMS - 1; i++) {
            otherChoices.push(Math.random() > 0.5 ? 'selfish' : 'cooperate');
        }
        return otherChoices;
    };

    const handleChoice = (choice) => {
        // If timer disabled, always allow choice
        if (!ENABLE_TIMER || timeLeft > 0) {
            setUserChoice(choice);
        }
    };

    const processRound = () => {
        if (!userChoice) return;

        const others = simulateOtherChoices();
        const allChoices = [userChoice, ...others];
        const selfishCount = allChoices.filter(c => c === 'selfish').length;
        const coopCount = TOTAL_TEAMS - selfishCount;

        let userPoints = 0;
        let resultMessage = '';

        if (selfishCount === 0) {
            userPoints = 10;
            resultMessage = `All teams cooperated! +10 points.`;
        } else if (selfishCount < TOTAL_TEAMS / 2) {
            if (userChoice === 'selfish') {
                userPoints = 15;
            } else {
                const remainingBandwidth = 100 - (15 * selfishCount);
                userPoints = coopCount > 0 ? Math.round(remainingBandwidth / coopCount) : 0;
            }
            resultMessage = `Selfish: ${selfishCount}, Cooperators: ${coopCount}. `;
            resultMessage += userChoice === 'selfish' ? '+15 points' : `+${userPoints} points`;
        } else {
            if (userChoice === 'selfish') {
                userPoints = -10;
                resultMessage = 'Bandwidth clash! Selfish teams lose 10 points.';
            } else {
                userPoints = 0;
                resultMessage = 'Bandwidth clash! Cooperators get 0 points.';
            }
        }

        const newTotal = (scores[teamName] || 0) + userPoints;
        setScores(prev => ({ ...prev, [teamName]: newTotal }));

        setRoundResult({
            userChoice,
            selfishCount,
            userPoints,
            totalScore: newTotal,
            message: resultMessage
        });

        setShowResults(true);
    };

    const handleNextRound = () => {
        if (currentRound === ROUNDS) {
            navigate('/');
            return;
        }

        setUserChoice(null);
        setTimeLeft(ROUND_DURATION);
        setIsTimerActive(ENABLE_TIMER);
        setShowResults(false);
        setRoundResult(null);
        setCurrentRound(prev => prev + 1);
    };

    const handleStart = () => {
        if (!teamName.trim()) return;
        setIsTimerActive(ENABLE_TIMER);
    };

    if (!teamName) {
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
                padding: '2rem'
            }}>
                <h2 style={{ fontSize: '2.2rem', marginBottom: '2rem' }}>🌐 ROUND 2: NETWORK STRATEGY</h2>
                <input
                    type="text"
                    placeholder="Enter your team name"
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
                        textAlign: 'center'
                    }}
                />
                <button
                    onClick={handleStart}
                    disabled={!teamName.trim()}
                    style={{
                        marginTop: '1.5rem',
                        padding: '12px 30px',
                        backgroundColor: teamName.trim() ? '#00F5D4' : '#555',
                        color: '#000',
                        border: 'none',
                        borderRadius: '6px',
                        fontFamily: "'Orbitron', sans-serif",
                        fontSize: '1.2rem',
                        cursor: teamName.trim() ? 'pointer' : 'not-allowed'
                    }}
                >
                    START ROUND 1
                </button>
            </div>
        );
    }

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
            {/* Top Navigation */}
            <div style={{
                alignSelf: 'flex-start',
                display: 'flex',
                gap: '0.8rem',
                marginBottom: '1.5rem'
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
                        fontSize: '0.95rem'
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
                        fontSize: '0.95rem'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#00F5D4'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#555'}
                >
                    ↺ Back to Rounds
                </button>
            </div>

            <h2 style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>
                ROUND {currentRound} / {ROUNDS}
            </h2>

            {/* ⏱️ TIMER DISPLAY — ADAPTS TO ENABLED/DISABLED */}
            <div style={{
                marginBottom: '1.5rem',
                padding: '10px 24px',
                background: 'rgba(0, 0, 0, 0.4)',
                border: `2px solid ${ENABLE_TIMER && timeLeft <= 30 ? '#FF2A6D' : '#00F5D4'}`,
                borderRadius: '8px',
                fontSize: '1.4rem'
            }}>
                {ENABLE_TIMER 
                    ? `TIME LEFT: ${formatTime(timeLeft)}` 
                    : "🕒 No timer (demo mode)"}
            </div>

            <p style={{ color: '#ddd', marginBottom: '1.5rem', maxWidth: '600px', lineHeight: 1.6 }}>
                You are team <strong>{teamName}</strong>. Choose wisely:  
                🟩 <strong>Cooperate</strong> or 🟥 <strong>Selfish</strong>
            </p>

            {!showResults && (
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                        <button
                            onClick={() => handleChoice('cooperate')}
                            disabled={ENABLE_TIMER && timeLeft === 0}
                            style={{
                                padding: '14px 28px',
                                backgroundColor: userChoice === 'cooperate' ? '#00F5D4' : 'rgba(10, 20, 30, 0.7)',
                                color: '#000',
                                border: '2px solid #00F5D4',
                                borderRadius: '8px',
                                fontFamily: "'Orbitron', sans-serif",
                                fontSize: '1.2rem',
                                cursor: (ENABLE_TIMER && timeLeft === 0) ? 'not-allowed' : 'pointer',
                                opacity: (ENABLE_TIMER && timeLeft === 0) ? 0.6 : 1
                            }}
                        >
                            🟩 COOPERATE
                        </button>

                        <button
                            onClick={() => handleChoice('selfish')}
                            disabled={ENABLE_TIMER && timeLeft === 0}
                            style={{
                                padding: '14px 28px',
                                backgroundColor: userChoice === 'selfish' ? '#FF2A6D' : 'rgba(10, 20, 30, 0.7)',
                                color: '#000',
                                border: '2px solid #FF2A6D',
                                borderRadius: '8px',
                                fontFamily: "'Orbitron', sans-serif",
                                fontSize: '1.2rem',
                                cursor: (ENABLE_TIMER && timeLeft === 0) ? 'not-allowed' : 'pointer',
                                opacity: (ENABLE_TIMER && timeLeft === 0) ? 0.6 : 1
                            }}
                        >
                            🟥 SELFISH
                        </button>
                    </div>
                </div>
            )}

            {showResults && roundResult && (
                <div style={{
                    backgroundColor: 'rgba(10, 20, 30, 0.8)',
                    border: '2px solid #00F5D4',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    marginBottom: '2rem',
                    maxWidth: '600px',
                    textAlign: 'center'
                }}>
                    <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                        <strong>Your choice:</strong> {roundResult.userChoice === 'cooperate' ? '🟩 Cooperate' : '🟥 Selfish'}
                    </p>
                    <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                        <strong>Selfish teams:</strong> {roundResult.selfishCount} / {TOTAL_TEAMS}
                    </p>
                    <p style={{ fontSize: '1.3rem', color: roundResult.userPoints >= 0 ? '#00F5D4' : '#FF2A6D' }}>
                        ➕ Points this round: {roundResult.userPoints}
                    </p>
                    <p style={{ fontSize: '1.1rem', color: '#aaa' }}>
                        Total Score: <strong>{roundResult.totalScore}</strong>
                    </p>
                    <p style={{ marginTop: '1rem', color: '#ddd' }}>
                        {roundResult.message}
                    </p>
                </div>
            )}

            <button
                onClick={showResults ? handleNextRound : processRound}
                disabled={!userChoice}
                style={{
                    padding: '12px 30px',
                    backgroundColor: !userChoice ? '#555' : '#00F5D4',
                    color: '#000',
                    border: 'none',
                    borderRadius: '6px',
                    fontFamily: "'Orbitron', sans-serif'",
                    fontSize: '1.2rem',
                    cursor: !userChoice ? 'not-allowed' : 'pointer',
                    opacity: !userChoice ? 0.6 : 1
                }}
            >
                {showResults 
                    ? (currentRound === ROUNDS ? 'VIEW FINAL SCORE →' : 'NEXT ROUND →') 
                    : 'SUBMIT CHOICE'}
            </button>

            <p style={{ color: '#777', marginTop: '2rem', fontSize: '0.95rem' }}>
                💡 {ENABLE_TIMER 
                    ? "After Round 5, scores are hidden. Strategy > luck." 
                    : "Timer disabled for testing. Enable via ENABLE_TIMER flag."}
            </p>
        </div>
    );
}