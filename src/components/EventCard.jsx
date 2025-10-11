// src/components/EventCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function EventCard({ day, title, link, isLive = false, isEnded = false }) {
  const cardContent = (
    <div
      style={{
        backgroundColor: 'rgba(10, 20, 30, 0.6)',
        border: '1px solid #333',
        borderRadius: '12px',
        padding: '1.8rem 1.5rem',
        textAlign: 'center',
        cursor: isLive ? 'pointer' : 'not-allowed',
        opacity: isLive ? 1 : 0.6,
        position: 'relative',
        overflow: 'hidden',
        transition: 'opacity 0.3s',
        minWidth: '320px',
        minHeight: '220px',
        pointerEvents: isLive ? 'auto' : 'none'
      }}
    >
      <div  
        style={{
          position: 'absolute',
          top: '12px',
          right: '-30px',
          backgroundColor: isLive ? 'var(--neon-teal)' : (isEnded ? '#666' : 'var(--neon-red)'),
          color: 'black',
          padding: '4px 30px',
          transform: 'rotate(45deg)',
          fontSize: '0.85rem',
          fontWeight: 'bold',
          fontFamily: "'Orbitron', sans-serif",
          letterSpacing: '1px'
        }}
      >
        {isLive ? 'LIVE NOW' : (isEnded ? 'EVENT ENDED' : 'COMING SOON')}
      </div>

      <h3
        className="neon-text"
        style={{
          fontSize: '1.6rem',
          marginBottom: '1rem',
          fontFamily: "'Orbitron', sans-serif",
          opacity: isLive ? 1 : 0.7
        }}
      >
        {title}
      </h3>

      <p style={{ color: '#aaa', fontSize: '1.1rem', opacity: isLive ? 1 : 0.7 }}>
        {day}
      </p>
    </div>
  );

  if (isLive) {
    return (
      <Link
        to={link}
        style={{ textDecoration: 'none', color: 'inherit', width: '320px' }}
      >
        {cardContent}
      </Link>
    );
  }

  return <div style={{ width: '320px' }}>{cardContent}</div>;
}