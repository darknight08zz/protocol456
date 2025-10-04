// src/components/Header.jsx
import React from 'react';

export default function Header() {
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '1rem 2rem',
        backgroundColor: 'rgba(10, 15, 20, 0.85)',
        backdropFilter: 'blur(6px)',
        borderBottom: '1px solid #222',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        fontFamily: "'Roboto', sans-serif",
        gap: '16px',
        boxSizing: 'border-box'
      }}
    >
      {/* XIM Logo */}
      <img
        src={`${process.env.PUBLIC_URL}/ximlogo1.png`}
        alt="XIM"
        style={{
          height: '60px', // 🔴 Set to 60px
          width: 'auto',   // Auto width to maintain aspect ratio
          objectFit: 'contain', // Keep proportions
          borderRadius: '4px',
          transition: 'filter 0.3s ease'
        }}
        onError={(e) => {
          e.target.style.display = 'none';
          const fallback = document.createElement('span');
          fallback.innerText = 'IEEE';
          fallback.style.color = '#0077B5';
          fallback.style.fontSize = '0.9rem';
          fallback.style.fontWeight = 'bold';
          fallback.style.display = 'inline-block';
          fallback.style.padding = '4px 8px';
          fallback.style.borderRadius = '4px';
          fallback.style.backgroundColor = 'rgba(0, 119, 181, 0.1)';
          e.target.parentNode.appendChild(fallback);
        }}
        onMouseEnter={(e) => e.currentTarget.style.filter = 'drop-shadow(0 0 6px rgba(0, 119, 181, 0.8))'}
        onMouseLeave={(e) => e.currentTarget.style.filter = 'none'}
      />

      {/* IEEE Day Logo with Clickable Link */}
      <a
        href="https://ieeeday.org/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-block',
          transition: 'transform 0.25s ease, filter 0.25s ease',
          borderRadius: '6px',
          overflow: 'hidden'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.04)';
          e.currentTarget.style.filter = 'drop-shadow(0 0 10px rgba(0, 119, 181, 0.8))';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.filter = 'none';
        }}
      >
        <img
          src={`${process.env.PUBLIC_URL}/ieee-day.png`}
          alt="IEEE Day"
          style={{
            height: '60px', // 🔴 Set to 60px
            width: 'auto',   // Auto width to maintain aspect ratio
            objectFit: 'contain', // Keep proportions
            borderRadius: '4px',
            transition: 'filter 0.3s ease'
          }}
          onError={(e) => {
            e.target.style.display = 'none';
            const fallback = document.createElement('span');
            fallback.innerText = 'IEEE DAY';
            fallback.style.color = '#0077B5';
            fallback.style.fontSize = '0.9rem';
            fallback.style.fontWeight = 'bold';
            fallback.style.display = 'inline-block';
            fallback.style.padding = '4px 8px';
            fallback.style.borderRadius = '4px';
            fallback.style.backgroundColor = 'rgba(0, 119, 181, 0.1)';
            e.target.parentNode.appendChild(fallback);
          }}
          onMouseEnter={(e) => e.currentTarget.style.filter = 'drop-shadow(0 0 6px rgba(0, 119, 181, 0.8))'}
          onMouseLeave={(e) => e.currentTarget.style.filter = 'none'}
        />
      </a>

      {/* Clickable Logo */}
      <a
        href="https://edu.ieee.org/in-ximub/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-block',
          transition: 'transform 0.25s ease, filter 0.25s ease',
          borderRadius: '6px',
          overflow: 'hidden'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.04)';
          e.currentTarget.style.filter = 'drop-shadow(0 0 10px rgba(0, 119, 181, 0.8))';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.filter = 'none';
        }}
      >
        <img
          src={`${process.env.PUBLIC_URL}/ieee-xim-logo.png`}
          alt="IEEE XIM Student Branch"
          style={{
            height: '120px',
            width: '120px',
            objectFit: 'contain',
            display: 'block',
            transition: 'none'
          }}
          onError={(e) => {
            e.target.style.display = 'none';
            const fallback = document.createElement('span');
            fallback.innerText = 'IEEE XIM';
            fallback.style.color = '#0077B5';
            fallback.style.fontSize = '1.1rem';
            fallback.style.fontWeight = 'bold';
            fallback.style.display = 'inline-block';
            fallback.style.padding = '8px 12px';
            fallback.style.borderRadius = '4px';
            fallback.style.backgroundColor = 'rgba(0, 119, 181, 0.1)';
            e.target.parentNode.appendChild(fallback);
          }}
        />
      </a>

      {/* Text Group */}
      <div>
        <p
          style={{
            fontSize: '1.15rem',
            color: '#ccc',
            margin: '0 0 0.3rem',
            fontWeight: 300,
            letterSpacing: '0.5px'
          }}
        >
          IEEE XIM Student Branch Presents
        </p>
        <h1
          className="neon-text"
          style={{
            fontSize: '2.1rem',
            margin: 0,
            fontFamily: "'Orbitron', sans-serif",
            letterSpacing: '1.5px'
          }}
        >
          PROTOCOL 456
        </h1>
      </div>
    </header>
  );
}
