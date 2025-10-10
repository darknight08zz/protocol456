// src/pages/TrianglePage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// ⏱️ STATIC CONFIG FOR TRIANGLE
const TOTAL_SECONDS = 17 * 60; // 1020 seconds

export default function TrianglePage() {
    const navigate = useNavigate();
    const shapeColor = '#1221cdff';

    const problemData = {
        1: {
            title: "Digital Root (Repeated Digital Sum)",
            description: `The digital root of a positive integer is found by summing its digits. If the result is a single digit, that is the digital root. If not, repeat the process until a single digit is obtained.

Given a large number (as a string), find its digital root.

Examples:
  Input: "1234"
  Output: 1
  Explanation: 1 + 2 + 3 + 4 = 10 → 1 + 0 = 1

  Input: "5674"
  Output: 4
  Explanation: 5 + 6 + 7 + 4 = 22 → 2 + 2 = 4`
        },
        2: {
            title: "The Dice Problem",
            description: `You are given a standard cubic dice with faces numbered 1 to 6. For any given face value, determine the number on the opposite face.

Rule: Opposite faces always sum to 7.

Examples:
  Input: 2
  Output: 5
  Explanation: 2 is opposite to 5 (since 2 + 5 = 7)

  Input: 6
  Output: 1
  Explanation: 6 is opposite to 1 (since 6 + 1 = 7)`
        },
        3: {
            title: "Find Day of the Week for a Given Date",
            description: `Given a date (day, month, year), determine the day of the week it falls on.
Return an integer from 0 to 6, where:
  0 = Sunday, 1 = Monday, 2 = Tuesday, ..., 6 = Saturday

Examples:
  Input: d = 30, m = 8, y = 2010
  Output: 1
  Explanation: 30th August 2010 was a Monday

  Input: d = 15, m = 6, y = 1995
  Output: 4
  Explanation: 15th June 1995 was a Thursday

  Input: d = 29, m = 2, y = 2016
  Output: 1
  Explanation: 29th February 2016 was a Monday`
        },
        4: {
            title: "Largest Element in Array",
            description: `Given an array of integers, find and return the largest element.

Constraints:
  1 ≤ arr.length ≤ 10⁶
  0 ≤ arr[i] ≤ 10⁶

Examples:
  Input: [1, 8, 7, 56, 90]
  Output: 90

  Input: [5, 5, 5, 5]
  Output: 5

  Input: [10]
  Output: 10`
        }
    };

    const [selectedProblem, setSelectedProblem] = useState(null);
    const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [timeUp, setTimeUp] = useState(false); // Track if time is up

    // Submission state
    const [playerId, setPlayerId] = useState('');
    const [playerName, setPlayerName] = useState('');
    const [codeInputs, setCodeInputs] = useState({
        1: '',
        2: '',
        3: '',
        4: ''
    });

    const timerRef = useRef(null);

    // Auto-start timer when component mounts
    useEffect(() => {
        setIsTimerActive(true);
        setTimeLeft(TOTAL_SECONDS);
        
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    // Modified useEffect to handle time up
    useEffect(() => {
        if (isTimerActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        // Time is up
                        setIsTimerActive(false);
                        setTimeUp(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else if (timeLeft === 0) {
            setIsTimerActive(false);
            setTimeUp(true);
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

    const openCompiler = () => {
        window.open('https://www.programiz.com/c-programming/online-compiler/', '_blank');
    };

    const handleProblemClick = (num) => setSelectedProblem(num);

    const handleCodeChange = (problemNum, value) => {
        setCodeInputs(prev => ({
            ...prev,
            [problemNum]: value
        }));
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#05080c',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            textAlign: 'center',
            color: shapeColor,
            fontFamily: "'Orbitron', sans-serif",
            padding: '2rem'
        }}>
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
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = shapeColor}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#555'}
                >
                    ↺ Back to Rounds
                </button>
            </div>

            <h1 className="neon-text" style={{ color: '#1221cdff', fontSize: '3rem', marginBottom: '1rem' }}>
                ▲ TRIANGLE: THE SHARP EDGE
            </h1>

            <div style={{
                marginBottom: '1.2rem',
                padding: '10px 24px',
                background: 'rgba(0, 0, 0, 0.4)',
                border: `2px solid ${isTimerActive ? (timeLeft <= 300 ? 'var(--neon-red)' : shapeColor) : '#555'}`,
                borderRadius: '8px',
                fontFamily: "'Orbitron', sans-serif'",
                fontSize: '1.4rem',
                color: isTimerActive ? (timeLeft <= 300 ? 'var(--neon-red)' : shapeColor) : '#aaa'
            }}>
                TIME LEFT: {formatTime(timeLeft)}
            </div>

            <p style={{ fontSize: '1.3rem', color: '#ddd', marginBottom: '2rem', maxWidth: '650px', lineHeight: 1.6 }}>
                You have chosen the Triangle. Stability guides your fate.
                Select a problem below to begin your trial.
            </p>

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '0.8rem',
                flexWrap: 'wrap',
                width: '100%',
                maxWidth: '700px',
                marginBottom: selectedProblem ? '2rem' : '0'
            }}>
                {[1, 2, 3, 4].map(num => (
                    <button
                        key={num}
                        onClick={() => handleProblemClick(num)}
                        style={{
                            padding: '10px 16px',
                            background: selectedProblem === num ? `${shapeColor}66` : 'rgba(10, 20, 30, 0.7)',
                            border: `2px solid ${shapeColor}`,
                            color: shapeColor,
                            borderRadius: '6px',
                            fontFamily: "'Orbitron', sans-serif",
                            fontSize: '1rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontWeight: 'bold',
                            minWidth: '120px'
                        }}
                    >
                        PROBLEM {num}
                    </button>
                ))}
            </div>

            {selectedProblem && (
                <div style={{
                    width: '100%',
                    maxWidth: '800px',
                    backgroundColor: 'rgba(10, 20, 30, 0.85)',
                    border: `2px solid ${shapeColor}`,
                    borderRadius: '12px',
                    padding: '2rem',
                    marginTop: '1.5rem',
                    textAlign: 'left'
                }}>
                    <h3 style={{
                        color: shapeColor,
                        fontFamily: "'Orbitron', sans-serif",
                        marginBottom: '1.2rem',
                        fontSize: '1.8rem',
                        fontWeight: 'bold'
                    }}>
                        {problemData[selectedProblem].title}
                    </h3>

                    <pre style={{
                        color: '#eee',
                        fontSize: '1.15rem',
                        lineHeight: 1.7,
                        fontFamily: "'Roboto', monospace",
                        marginBottom: '2rem',
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word',
                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                        padding: '1rem',
                        borderRadius: '8px',
                        border: '1px solid #333'
                    }}>
                        {problemData[selectedProblem].description}
                    </pre>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{
                            display: 'block',
                            color: shapeColor,
                            fontFamily: "'Orbitron', sans-serif",
                            marginBottom: '0.6rem',
                            fontSize: '1.1rem'
                        }}>
                            ✍️ Write your code here:
                        </label>
                        <textarea
                            value={codeInputs[selectedProblem]}
                            onChange={(e) => handleCodeChange(selectedProblem, e.target.value)}
                            placeholder="// Write your code here..."
                            style={{
                                width: '100%',
                                height: '120px',
                                padding: '12px',
                                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                                border: '1px solid #444',
                                borderRadius: '6px',
                                color: '#fff',
                                fontFamily: "'Fira Code', monospace",
                                fontSize: '1rem',
                                resize: 'vertical'
                            }}
                        />
                    </div>

                    <button
                        onClick={openCompiler}
                        style={{
                            padding: '12px 28px',
                            backgroundColor: shapeColor,
                            color: '#000',
                            border: 'none',
                            borderRadius: '6px',
                            fontFamily: "'Orbitron', sans-serif",
                            fontSize: '1.15rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#33fff0'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = shapeColor}
                    >
                        ➤ OPEN COMPILER
                    </button>
                </div>
            )}

            {/* SUBMISSION FORM FOR ALL 4 PROBLEMS */}
            {Object.values(codeInputs).every(code => code.trim() !== '') && (
                <div style={{
                    width: '100%',
                    maxWidth: '800px',
                    backgroundColor: 'rgba(10, 20, 30, 0.85)',
                    border: `2px solid ${shapeColor}`,
                    borderRadius: '12px',
                    padding: '2rem',
                    marginTop: '2rem',
                    textAlign: 'left'
                }}>
                    <h3 style={{
                        color: shapeColor,
                        fontFamily: "'Orbitron', sans-serif",
                        marginBottom: '1.5rem',
                        fontSize: '1.8rem',
                        fontWeight: 'bold'
                    }}>
                        📤 SUBMIT ALL SOLUTIONS
                    </h3>

                    <form action="https://formspree.io/f/xvgwwrzl" method="POST">
                        {/* Redirect to Rounds page after submit */}
                        <input type="hidden" name="_next" value="/day1" />

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{
                                display: 'block',
                                color: shapeColor,
                                fontFamily: "'Orbitron', sans-serif",
                                marginBottom: '0.6rem',
                                fontSize: '1.1rem'
                            }}>
                                🆔 Player ID:
                            </label>
                            <input
                                type="text"
                                name="player_id"
                                value={playerId}
                                onChange={(e) => setPlayerId(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                                    border: '1px solid #444',
                                    borderRadius: '6px',
                                    color: '#fff',
                                    fontFamily: "'Roboto', sans-serif",
                                    fontSize: '1rem'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{
                                display: 'block',
                                color: shapeColor,
                                fontFamily: "'Orbitron', sans-serif'",
                                marginBottom: '0.6rem',
                                fontSize: '1.1rem'
                            }}>
                                👤 Name:
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={playerName}
                                onChange={(e) => setPlayerName(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                                    border: '1px solid #444',
                                    borderRadius: '6px',
                                    color: '#fff',
                                    fontFamily: "'Roboto', sans-serif",
                                    fontSize: '1rem'
                                }}
                            />
                        </div>

                        {/* Hidden code inputs for all 4 problems */}
                        {Object.entries(codeInputs).map(([problemNum, code]) => (
                            <input
                                key={problemNum}
                                type="hidden"
                                name={`problem_${problemNum}_code`}
                                value={code}
                            />
                        ))}

                        <button
                            type="submit"
                            disabled={timeUp} // Only disable submit button when time is up
                            style={{
                                padding: '12px 28px',
                                backgroundColor: timeUp ? '#666' : '#00FF00',
                                color: '#000',
                                border: 'none',
                                borderRadius: '6px',
                                fontFamily: "'Orbitron', sans-serif",
                                fontSize: '1.15rem',
                                fontWeight: 'bold',
                                cursor: timeUp ? 'not-allowed' : 'pointer',
                                transition: 'background 0.2s',
                                opacity: timeUp ? 0.5 : 1
                            }}
                            onMouseEnter={(e) => {
                                if (!timeUp) e.currentTarget.style.backgroundColor = '#33ff33';
                            }}
                            onMouseLeave={(e) => {
                                if (!timeUp) e.currentTarget.style.backgroundColor = '#00FF00';
                            }}
                        >
                            {timeUp ? 'TIME EXPIRED' : '✅ SUBMIT ALL SOLUTIONS'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}