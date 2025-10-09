// src/pages/Day1Page.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Day1Page() {
    const navigate = useNavigate();
    const FORMSPREE_URL = "https://formspree.io/f/movkwzpg"; // Ensure no trailing spaces

    // 🔴 DEFAULT SLOTS — ONLY circle, triangle, square, star
    const DEFAULT_SLOTS = {
        circle: 10,
        triangle: 10,
        square: 10,
        star: 10,
        total: 40
    };

    // Load slots from localStorage or use defaults
    const loadSlots = () => {
        try {
            const saved = localStorage.getItem('protocol456_slots');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Ensure 'star' exists (in case old data had 'umbrella')
                if (parsed.star === undefined) {
                    return DEFAULT_SLOTS;
                }
                return parsed;
            }
        } catch (e) {
            console.warn('Failed to parse slots, using defaults');
        }
        return DEFAULT_SLOTS;
    };

    const [slots, setSlots] = useState(loadSlots());
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        university: ''
    });
    const [selectedShape, setSelectedShape] = useState(null);
    const [bookingStatus, setBookingStatus] = useState(null);
    const [error, setError] = useState('');
    const [currentRound, setCurrentRound] = useState('round1'); // 'round1' or 'round2'

    // Save slots to localStorage on change
    useEffect(() => {
        try {
            localStorage.setItem('protocol456_slots', JSON.stringify(slots));
        } catch (e) {
            console.error('Failed to save slots');
        }
    }, [slots]);

    // Shape definitions — STAR INCLUDED
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
        if (slots.total <= 0) {
            setError('Event is fully booked.');
            return false;
        }
        if (slots[selectedShape] <= 0) {
            setError('This shape is fully booked.');
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
                const newSlots = {
                    ...slots,
                    [selectedShape]: slots[selectedShape] - 1,
                    total: slots.total - 1
                };
                setSlots(newSlots);
                setBookingStatus('success');

                // 🔁 Redirect to shape-specific page after success
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
                    ROUND 2: NEXT PHASE
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
                        color: '#FF2A6D', // or var(--neon-red)
                        textShadow: '0 0 4px rgba(214, 34, 70, 0.5), 0 0 8px rgba(214, 34, 70, 0.3)'
                    }}>
                        ROUND ONE: SHAPE OF FATE
                    </h1>

                    <p style={{
                        color: '#ddd',
                        fontSize: '1.2rem',
                        marginBottom: '1.5rem',
                        fontFamily: "'Orbitron', sans-serif"
                    }}>
                        Total members left: <span className="neon-text">{slots.total}</span>
                    </p>

                    <p style={{ color: '#ddd', fontSize: '1.3rem', maxWidth: '650px', marginBottom: '2rem', lineHeight: 1.6 }}>
                        Choose your path. Each shape has limited slots.
                    </p>

                    {/* SHAPE CARDS */}
                    <div style={{
                        display: 'flex',
                        gap: '1.8rem',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        marginBottom: '2.5rem'
                    }}>
                        {shapes.map(shape => {
                            const isAvailable = slots[shape.id] > 0 && slots.total > 0;
                            return (
                                <div
                                    key={shape.id}
                                    onClick={() => {
                                        if (isAvailable) {
                                            setSelectedShape(shape.id);
                                        }
                                    }}
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
                                            : isAvailable ? '#333' : '#555'
                                            }`,
                                        borderRadius: '12px',
                                        cursor: isAvailable ? 'pointer' : 'not-allowed',
                                        opacity: isAvailable ? 1 : 0.5,
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
                                    <div style={{
                                        fontSize: '0.75rem',
                                        marginTop: '0.3rem',
                                        color: '#aaa',
                                        opacity: 0.9
                                    }}>
                                        ({slots[shape.id]} left)
                                    </div>
                                </div>
                            );
                        })}
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

                        {error && (
                            <p style={{ color: 'var(--neon-red)', fontSize: '0.95rem', marginTop: '-0.5rem' }}>
                                ❌ {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={bookingStatus === 'submitting' || !selectedShape || slots.total <= 0}
                            className="glow-button"
                            style={{
                                padding: '14px 40px',
                                fontSize: '1.2rem',
                                opacity: (selectedShape && slots.total > 0 && bookingStatus !== 'submitting') ? 1 : 0.6
                            }}
                        >
                            {bookingStatus === 'submitting' ? 'BOOKING...' : 'CONFIRM PATH'}
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
                    color: '#FF2A6D', // or var(--neon-red)
                    textShadow: '0 0 4px rgba(214, 34, 70, 0.5), 0 0 8px rgba(214, 34, 70, 0.3)'
                }}>
                    <button
                        onClick={() => navigate('/round2')}
                        style={{ /* same style */ }}
                    >
                        ROUND 2: NEXT PHASE
                    </button>
                </div>
            )}

            {/* 🔑 ADMIN RESET BUTTON — ENABLED FOR TESTING */}
            {true && (
                <button
                    onClick={() => {
                        if (window.confirm('Reset all slots to default?')) {
                            localStorage.removeItem('protocol456_slots');
                            window.location.reload();
                        }
                    }}
                    style={{
                        marginTop: '2rem',
                        padding: '8px 16px',
                        backgroundColor: 'var(--neon-red)',
                        color: 'black',
                        border: 'none',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontFamily: "'Orbitron', sans-serif",
                        fontSize: '0.9rem'
                    }}
                >
                    🔑 RESET ALL SLOTS (Admin)
                </button>
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
    fontFamily: "'Roboto', sans-serif",
    fontSize: '1rem',
    outline: 'none'
};