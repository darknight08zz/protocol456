// src/pages/CirclePage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// ⏱️ STATIC CONFIG — SAFE TO CHANGE
const AUTO_START_TIMER = false; // 🔑 Set to `true` to auto-start timer on page load
const TOTAL_SECONDS = 21 * 60; // 21 minutes = 1260 seconds
const ADMIN_PASSWORD = "protocol456"; // Admin password to start timer manually

export default function CirclePage() {
    const navigate = useNavigate();
    const shapeColor = '#FF2A6D';

    // ✅ Problem data: title + description (clean separation)
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
        },
        5: {
            title: "Missing in Array",
            description: `You are given an array of size (n - 1) containing distinct integers from 1 to n, with exactly one number missing. Find the missing number.

Examples:
  Input: [1, 2, 3, 5]
  Output: 4
  Explanation: 4 is missing from the sequence 1 to 5

  Input: [8, 2, 4, 5, 3, 7, 1]
  Output: 6
  Explanation: 6 is missing from the sequence 1 to 8

  Input: [1]
  Output: 2
  Explanation: Only 1 is present; 2 is missing`
        }
    };

    const [selectedProblem, setSelectedProblem] = useState(null);
    const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const timerRef = useRef(null);
    const hasAutoStarted = useRef(false);

    // 🔁 EFFECT: Auto-start on mount
    useEffect(() => {
        if (AUTO_START_TIMER && !hasAutoStarted.current) {
            setIsTimerActive(true);
            setTimeLeft(TOTAL_SECONDS);
            hasAutoStarted.current = true;
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    // 🔁 EFFECT: Manage active timer
    useEffect(() => {
        if (isTimerActive && timeLeft > 0) {
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

    const handleStartTimerClick = () => setShowPasswordPrompt(true);

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (passwordInput === ADMIN_PASSWORD) {
            setIsTimerActive(true);
            setTimeLeft(TOTAL_SECONDS);
            setShowPasswordPrompt(false);
            setPasswordInput('');
            setPasswordError('');
        } else {
            setPasswordError('Incorrect password. Try again.');
        }
    };

    const openCompiler = () => {
        window.open('https://www.programiz.com/c-programming/online-compiler/', '_blank');
    };

    const handleProblemClick = (num) => setSelectedProblem(num);

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

            <h1 className="neon-text" style={{ color: '#FF2A6D', fontSize: '3rem', marginBottom: '1rem' }}>
                ● CIRCLE: THE ENDLESS LOOP
            </h1>

            <div style={{
                marginBottom: '1.2rem',
                padding: '10px 24px',
                background: 'rgba(0, 0, 0, 0.4)',
                border: `2px solid ${isTimerActive ? (timeLeft <= 300 ? 'var(--neon-red)' : shapeColor) : '#555'}`,
                borderRadius: '8px',
                fontFamily: "'Orbitron', sans-serif",
                fontSize: '1.4rem',
                color: isTimerActive ? (timeLeft <= 300 ? 'var(--neon-red)' : shapeColor) : '#aaa'
            }}>
                TIME LEFT: {formatTime(timeLeft)}
            </div>

            {!isTimerActive && !AUTO_START_TIMER && (
                <button
                    onClick={handleStartTimerClick}
                    style={{
                        marginBottom: '1.2rem',
                        padding: '8px 20px',
                        background: 'transparent',
                        border: `2px solid ${shapeColor}`,
                        color: shapeColor,
                        borderRadius: '6px',
                        fontFamily: "'Orbitron', sans-serif",
                        fontSize: '1rem',
                        cursor: 'pointer'
                    }}
                >
                    ▶ START TIMER (Admin)
                </button>
            )}

            {showPasswordPrompt && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: '#0a0f1a',
                        padding: '2rem',
                        borderRadius: '12px',
                        border: `2px solid ${shapeColor}`,
                        width: '90%',
                        maxWidth: '400px'
                    }}>
                        <h3 style={{ color: shapeColor, fontFamily: "'Orbitron', sans-serif", marginBottom: '1rem' }}>
                            🔐 Enter Admin Password
                        </h3>
                        <form onSubmit={handlePasswordSubmit}>
                            <input
                                type="password"
                                value={passwordInput}
                                onChange={(e) => {
                                    setPasswordInput(e.target.value);
                                    if (passwordError) setPasswordError('');
                                }}
                                placeholder="Password"
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    marginBottom: '1rem',
                                    backgroundColor: 'rgba(10, 20, 30, 0.7)',
                                    border: '1px solid #555',
                                    color: 'white',
                                    borderRadius: '4px'
                                }}
                            />
                            {passwordError && (
                                <p style={{ color: 'var(--neon-red)', marginBottom: '1rem' }}>
                                    {passwordError}
                                </p>
                            )}
                            <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center' }}>
                                <button
                                    type="submit"
                                    style={{
                                        padding: '8px 16px',
                                        background: shapeColor,
                                        color: '#000',
                                        border: 'none',
                                        borderRadius: '4px',
                                        fontFamily: "'Orbitron', sans-serif",
                                        cursor: 'pointer'
                                    }}
                                >
                                    Start Timer
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordPrompt(false)}
                                    style={{
                                        padding: '8px 16px',
                                        background: 'transparent',
                                        color: '#aaa',
                                        border: '1px solid #555',
                                        borderRadius: '4px',
                                        fontFamily: "'Orbitron', sans-serif",
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <p style={{ fontSize: '1.3rem', color: '#ddd', marginBottom: '2rem', maxWidth: '650px', lineHeight: 1.6 }}>
                You have chosen the Circle. Your journey begins in symmetry.
                Select a problem below to begin your trial.
            </p>

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '0.7rem',
                flexWrap: 'wrap',
                width: '100%',
                maxWidth: '800px',
                marginBottom: selectedProblem ? '2rem' : '0'
            }}>
                {[1, 2, 3, 4, 5].map(num => (
                    <button
                        key={num}
                        onClick={() => handleProblemClick(num)}
                        style={{
                            padding: '10px 14px',
                            background: selectedProblem === num ? `${shapeColor}66` : 'rgba(10, 20, 30, 0.7)',
                            border: `2px solid ${shapeColor}`,
                            color: shapeColor,
                            borderRadius: '6px',
                            fontFamily: "'Orbitron', sans-serif",
                            fontSize: '0.95rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontWeight: 'bold',
                            minWidth: '110px'
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
                    {/* ✅ BOLD TITLE */}
                    <h3 style={{
                        color: shapeColor,
                        fontFamily: "'Orbitron', sans-serif",
                        marginBottom: '1.2rem',
                        fontSize: '1.8rem',
                        fontWeight: 'bold'
                    }}>
                        {problemData[selectedProblem].title}
                    </h3>

                    {/* ✅ FORMATTED DESCRIPTION */}
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

                    {/* Code Text Area */}
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
                            placeholder="// Write your C code here..."
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

                    {/* Answer Text Area */}
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{
                            display: 'block',
                            color: shapeColor,
                            fontFamily: "'Orbitron', sans-serif",
                            marginBottom: '0.6rem',
                            fontSize: '1.1rem'
                        }}>
                            📝 Write your answer / explanation here:
                        </label>
                        <textarea
                            placeholder="Describe your approach, output, or logic..."
                            style={{
                                width: '100%',
                                height: '100px',
                                padding: '12px',
                                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                                border: '1px solid #444',
                                borderRadius: '6px',
                                color: '#fff',
                                fontFamily: "'Roboto', sans-serif",
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
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ff5a8a'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = shapeColor}
                    >
                        ➤ OPEN COMPILER
                    </button>
                </div>
            )}
        </div>
    );
}