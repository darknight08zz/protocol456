// src/components/Header.jsx
import React from 'react';

export default function Header() {
  return (
    <header
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '1rem 2rem',
        backgroundColor: 'rgba(10, 15, 20, 0.85)',
        backdropFilter: 'blur(6px)',
        borderBottom: '1px solid #222',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        fontFamily: "'Roboto', sans-serif",
        boxSizing: 'border-box',
        width: '100%'
      }}
    >
      {/* Logo Row — left-aligned */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '0.2rem' }}>
        {/* XIM University Logo */}
        <img
          src={`${process.env.PUBLIC_URL}/ximlogo1.png`}
          alt="XIM University"
          style={{
            height: '60px',
            width: 'auto',
            objectFit: 'contain',
            borderRadius: '4px',
            transition: 'filter 0.3s ease'
          }}
          onError={(e) => {
            e.target.style.display = 'none';
            const fallback = document.createElement('span');
            fallback.textContent = 'XIM';
            Object.assign(fallback.style, {
              color: '#0077B5',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              display: 'inline-block',
              padding: '4px 8px',
              borderRadius: '4px',
              backgroundColor: 'rgba(0, 119, 181, 0.1)'
            });
            e.target.parentNode.appendChild(fallback);
          }}
          onMouseEnter={(e) => (e.currentTarget.style.filter = 'drop-shadow(0 0 6px rgba(0, 119, 181, 0.8))')}
          onMouseLeave={(e) => (e.currentTarget.style.filter = 'none')}
        />

        {/* IEEE Day Logo */}
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
              height: '60px',
              width: 'auto',
              objectFit: 'contain',
              borderRadius: '4px',
              transition: 'filter 0.3s ease'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
              const fallback = document.createElement('span');
              fallback.textContent = 'IEEE DAY';
              Object.assign(fallback.style, {
                color: '#0077B5',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                display: 'inline-block',
                padding: '4px 8px',
                borderRadius: '4px',
                backgroundColor: 'rgba(0, 119, 181, 0.1)'
              });
              e.target.parentNode.appendChild(fallback);
            }}
            onMouseEnter={(e) => (e.currentTarget.style.filter = 'drop-shadow(0 0 6px rgba(0, 119, 181, 0.8))')}
            onMouseLeave={(e) => (e.currentTarget.style.filter = 'none')}
          />
        </a>

        {/* IEEE XIM Student Branch Logo */}
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
              display: 'block'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
              const fallback = document.createElement('span');
              fallback.textContent = 'IEEE XIM';
              Object.assign(fallback.style, {
                color: '#0077B5',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                display: 'inline-block',
                padding: '8px 12px',
                borderRadius: '4px',
                backgroundColor: 'rgba(0, 119, 181, 0.1)'
              });
              e.target.parentNode.appendChild(fallback);
            }}
          />
        </a>
      </div>

      {/* Centered Title Block */}
      <div
        style={{
          alignSelf: 'center',
          textAlign: 'center',
          marginTop: '0.1rem'
        }}
      >
        <p
          style={{
            fontSize: '1.25rem', // 🔺 INCREASED TEXT SIZE HERE (was 1.15rem)
            color: '#ccc',
            margin: '0 0 0.15rem',
            fontWeight: 300,
            letterSpacing: '0.5px'
          }}
        >
          IEEE XIM Student Branch Presents
        </p>
        <h1
          className="neon-text"
          style={{
            fontSize: '2.3rem', // 🔺 INCREASED TEXT SIZE HERE (was 2.1rem)
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