// src/components/EventCard.jsx
import React from 'react';

export default function EventCard({ day, title }) {
  return (
    <div
      style={{
        backgroundColor: 'rgba(10, 20, 30, 0.6)',
        border: '1px solid #333',
        borderRadius: '12px',
        padding: '1.8rem 1.5rem',
        textAlign: 'center',
        maxWidth: '320px',
        width: '100%',
        backdropFilter: 'blur(4px)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* "Coming Soon" Badge */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          right: '-30px',
          backgroundColor: 'var(--neon-red)',
          color: 'black',
          padding: '4px 30px',
          transform: 'rotate(45deg)',
          fontSize: '0.85rem',
          fontWeight: 'bold',
          fontFamily: "'Orbitron', sans-serif",
          letterSpacing: '1px'
        }}
      >
        COMING SOON
      </div>

      <h3
        className="neon-text"
        style={{
          fontSize: '1.6rem',
          marginBottom: '1rem',
          fontFamily: "'Orbitron', sans-serif"
        }}
      >
        {title}
      </h3>

      <p style={{ color: '#aaa', fontSize: '1.1rem' }}>
        {day}
      </p>

      <p style={{ color: '#777', marginTop: '1rem', fontSize: '0.95rem' }}>
        Details will be revealed soon. Stay alert.
      </p>
    </div>
  );
}