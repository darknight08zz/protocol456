// src/pages/Day1Page.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Day1Page() {
    const navigate = useNavigate();
    const FORMSPREE_URL = "https://formspree.io/f/movkwzpg";

    // 🔴 DEFAULT SLOTS (used only on first load)
    const DEFAULT_SLOTS = {
        circle: 10,
        triangle: 10,
        square: 10,
        umbrella: 10,
        total: 40
    };

    // 🔴 LOAD SLOTS FROM localStorage OR use defaults
    const loadSlots = () => {
        try {
            const saved = localStorage.getItem('protocol456_slots');
            return saved ? JSON.parse(saved) : DEFAULT_SLOTS;
        } catch (e) {
            console.warn('Failed to load slots, using defaults');
            return DEFAULT_SLOTS;
        }
    };

    const [slots, setSlots] = useState(loadSlots);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        university: ''
    });
    const [selectedShape, setSelectedShape] = useState(null);
    const [bookingStatus, setBookingStatus] = useState(null);
    const [error, setError] = useState('');

    // 🔴 SAVE SLOTS TO localStorage WHENEVER THEY CHANGE
    useEffect(() => {
        try {
            localStorage.setItem('protocol456_slots', JSON.stringify(slots));
        } catch (e) {
            console.error('Failed to save slots to localStorage');
        }
    }, [slots]);

    const shapes = [
        { id: 'circle', name: 'Circle', color: '#FF2A6D', symbol: '●' },
        { id: 'triangle', name: 'Triangle', color: '#00F5D4', symbol: '▲' },
        { id: 'square', name: 'Square', color: '#FF5E7D', symbol: '■' },
        { id: 'umbrella', name: 'Umbrella', color: '#FFD166', symbol: '☂' }
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
                // 🔴 DECREMENT SLOTS AND SAVE TO localStorage
                const newSlots = {
                    ...slots,
                    [selectedShape]: slots[selectedShape] - 1,
                    total: slots.total - 1
                };
                setSlots(newSlots);

                setBookingStatus('success');
                setTimeout(() => navigate('/'), 3000);
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
            <button
                onClick={() => navigate('/')}
                style={{
                    alignSelf: 'flex-start',
                    marginBottom: '1.5rem',
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

            <h1 className="neon-text" style={{ fontSize: '2.5rem', marginBottom: '1rem', fontFamily: "'Orbitron', sans-serif" }}>
                ROUND ONE: TRIALS
            </h1>

            {/* 🔴 SHOW TOTAL MEMBERS LEFT */}
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

            {/* Shape Selection — with PERSISTENT counts */}
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
                        onClick={() => {
                            if (slots[shape.id] > 0 && slots.total > 0) {
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
                                    : (slots[shape.id] > 0 && slots.total > 0) ? '#333' : '#555'
                                }`,
                            borderRadius: '12px',
                            cursor: (slots[shape.id] > 0 && slots.total > 0) ? 'pointer' : 'not-allowed',
                            opacity: (slots[shape.id] > 0 && slots.total > 0) ? 1 : 0.5,
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

                {error && (
                    <p style={{ color: 'var(--neon-red)', fontSize: '0.95rem', marginTop: '-0.5rem' }}>
                        ❌ {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={bookingStatus === 'submitting' || slots.total <= 0}
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
                    ✅ Path confirmed! Redirecting to home...
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
            {false && ( // 👈 SET THIS TO `true` TO ENABLE
                <button
                    onClick={() => {
                        localStorage.removeItem('protocol456_slots');
                        window.location.reload();
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