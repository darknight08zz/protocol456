// src/pages/Day1Page.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Day1Page() {
    const navigate = useNavigate();
    const FORMSPREE_URL = "https://formspree.io/f/xvgwwwqd";

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        university: '',
        playerId: ''
    });
    const [selectedShape, setSelectedShape] = useState(null);
    const [bookingStatus, setBookingStatus] = useState(null);
    const [error, setError] = useState('');
    const [currentRound, setCurrentRound] = useState('round1');

    // Shape definitions
    const shapes = [
        { id: 'circle', name: 'Circle', color: '#FF2A6D', symbol: '●' },
        { id: 'triangle', name: 'Triangle', color: '#1221cdff', symbol: '▲' },
        { id: 'square', name: 'Square', color: '#00FFA3', symbol: '■' },
        { id: 'star', name: 'Star', color: '#FFD166', symbol: '★' }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
    };

    const validateForm = () => {
        if (!selectedShape) {
            setError('Please select a shape.');
            return false;
        }
        if (!formData.name.trim()) {
            setError('Please enter your name.');
            return false;
        }
        if (!formData.email.trim()) {
            setError('Please enter your email.');
            return false;
        }
        if (!formData.phone.trim()) {
            setError('Please enter your phone number.');
            return false;
        }
        if (!formData.university.trim()) {
            setError('Please enter your university.');
            return false;
        }
        if (!formData.playerId.trim()) {
            setError('Please enter your Player ID.');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setBookingStatus('submitting');
        setError('');

        try {
            const submissionData = {
                ...formData,
                shape: selectedShape,
                timestamp: new Date().toISOString()
            };

            const response = await fetch(FORMSPREE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify(submissionData)
            });

            if (response.ok) {
                setBookingStatus('success');

                // Redirect to shape-specific page after success
                const shapeRoutes = {
                    circle: '/circle',
                    triangle: '/triangle',
                    square: '/square',
                    star: '/star'
                };
                const redirectPath = shapeRoutes[selectedShape];
                setTimeout(() => navigate(redirectPath), 3000);
            } else {
                setError('Booking failed. Please try again.');
                setBookingStatus('error');
            }
        } catch (err) {
            setError('Network error. Please check your connection.');
            setBookingStatus('error');
        }
    };

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

            {/* 🔁 ROUND TOGGLE BUTTONS */}
            <div style={{
                display: 'flex',
                gap: '1rem',
                alignSelf: 'flex-start',
                marginBottom: '1.5rem'
            }}>
                <button
                    onClick={() => setCurrentRound('round1')}
                    style={{
                        background: currentRound === 'round1' ? 'var(--neon-red)' : 'transparent',
                        color: currentRound === 'round1' ? '#000' : 'var(--neon-red)',
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
                    ROUND 1: SHAPE OF FATE
                </button>

                <button
                    onClick={() => navigate('/round2')}
                    style={{
                        background: currentRound === 'round2' ? 'var(--neon-teal)' : 'transparent',
                        color: currentRound === 'round2' ? '#000' : 'var(--neon-teal)',
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
                    ROUND 2: PRISONER'S PROTOCOL DILEMMA
                </button>
            </div>

            {/* === ROUND 1: SHAPE SELECTION & BOOKING === */}
            {currentRound === 'round1' && (
                <>
                    <h1 className="neon-text" style={{
                        fontSize: '2.5rem', marginBottom: '1rem', fontFamily: "'Orbitron', sans-serif",
                        margin: 0,
                        letterSpacing: '1.5px',
                        transition: 'font-size 0.3s ease',
                        color: '#FF2A6D',
                        textShadow: '0 0 4px rgba(214, 34, 70, 0.5), 0 0 8px rgba(214, 34, 70, 0.3)'
                    }}>
                        ROUND ONE: SHAPE OF FATE
                    </h1>

                    <p style={{ color: '#ddd', fontSize: '1.3rem', maxWidth: '650px', marginBottom: '2rem', lineHeight: 1.6 }}>
                        Choose your path. Each shape represents a different journey.
                    </p>

                    {/* SHAPE CARDS */}
                    <div style={{
                        display: 'flex',
                        gap: '1.8rem',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        marginBottom: '2.5rem'
                    }}>
                        {shapes.map(shape => (
                            <div
                                key={shape.id}
                                onClick={() => setSelectedShape(shape.id)}
                                style={{
                                    width: '130px',
                                    height: '130px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: selectedShape === shape.id
                                        ? `${shape.color}33`
                                        : 'rgba(10, 20, 30, 0.6)',
                                    border: `2px solid ${selectedShape === shape.id
                                        ? shape.color
                                        : '#333'
                                        }`,
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    color: shape.color,
                                    fontFamily: "'Orbitron', sans-serif",
                                    fontSize: '1.1rem'
                                }}
                            >
                                <div style={{ fontSize: '2.8rem', marginBottom: '0.4rem' }}>
                                    {shape.symbol}
                                </div>
                                <div>{shape.name}</div>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} style={{
                        width: '100%',
                        maxWidth: '500px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        marginBottom: '1.5rem'
                    }}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleInputChange}
                            style={inputStyle}
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleInputChange}
                            style={inputStyle}
                            required
                        />
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={handleInputChange}
                            style={inputStyle}
                            required
                        />
                        <input
                            type="text"
                            name="university"
                            placeholder="University"
                            value={formData.university}
                            onChange={handleInputChange}
                            style={inputStyle}
                            required
                        />
                        <input
                            type="text"
                            name="playerId"
                            placeholder="Player ID"
                            value={formData.playerId}
                            onChange={handleInputChange}
                            style={inputStyle}
                            required
                        />

                        {error && (
                            <p style={{ color: 'var(--neon-red)', fontSize: '0.95rem', marginTop: '-0.5rem' }}>
                                ❌ {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={bookingStatus === 'submitting' || !selectedShape}
                            className="glow-button"
                            style={{
                                padding: '14px 40px',
                                fontSize: '1.2rem',
                                opacity: (selectedShape && bookingStatus !== 'submitting') ? 1 : 0.6
                            }}
                        >
                            {bookingStatus === 'submitting' ? 'CONFIRMING...' : 'CONFIRM PATH'}
                        </button>
                    </form>

                    {bookingStatus === 'success' && (
                        <p style={{
                            color: 'var(--neon-teal)',
                            fontSize: '1.2rem',
                            marginTop: '1.5rem',
                            fontWeight: 'bold'
                        }}>
                            ✅ Path confirmed! Redirecting to your destiny...
                        </p>
                    )}
                    {bookingStatus === 'error' && (
                        <p style={{
                            color: 'var(--neon-red)',
                            marginTop: '1.5rem'
                        }}>
                            ❌ Booking failed. Please try again.
                        </p>
                    )}

                    <p style={{ color: '#777', marginTop: '2rem', fontSize: '0.95rem' }}>
                        ⚠️ You can only choose one path. Choose wisely.
                    </p>
                </>
            )}

            {/* === ROUND 2: PLACEHOLDER === */}
            {currentRound === 'round2' && (
                <div style={{
                    textAlign: 'center',
                    fontSize: '1.3rem',
                    fontFamily: "'Orbitron', sans-serif",
                    maxWidth: '650px',
                    lineHeight: 1.6,
                    margin: 0,
                    letterSpacing: '1.5px',
                    transition: 'font-size 0.3s ease',
                    color: '#FF2A6D',
                    textShadow: '0 0 4px rgba(214, 34, 70, 0.5), 0 0 8px rgba(214, 34, 70, 0.3)'
                }}>
                    <button
                        onClick={() => navigate('/round2')}
                        style={{
                            background: 'var(--neon-teal)',
                            color: '#000',
                            border: '2px solid var(--neon-teal)',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontFamily: "'Orbitron', sans-serif'",
                            fontSize: '1.1rem',
                            fontWeight: 'bold'
                        }}
                    >
                        GO TO ROUND 2
                    </button>
                </div>
            )}
        </section>
    );
}

const inputStyle = {
    padding: '14px',
    backgroundColor: 'rgba(10, 15, 20, 0.7)',
    border: '1px solid #333',
    borderRadius: '6px',
    color: 'white',
    fontFamily: "'Roboto', sans-serif'",
    fontSize: '1rem',
    outline: 'none'
};