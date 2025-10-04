// src/components/Header.jsx
import React, { useState, useEffect } from 'react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setIsScrolled(true);
        } else if (currentScrollY < lastScrollY || currentScrollY <= 100) {
          setIsScrolled(false);
        }
        setLastScrollY(currentScrollY);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, setIsScrolled]); // ✅ All dependencies declared

  // 👇 Dynamic styles based on scroll
  const paddingY = isScrolled ? '0.3rem' : '1rem';
  const titleFontSize = isScrolled ? '1.6rem' : '2.3rem';
  const subtitleFontSize = isScrolled ? '0.95rem' : '1.25rem';
  const logoHeightXIM = isScrolled ? '70px' : '120px'; // Only XIM logo scales (others stay readable)
  const logoHeightOthers = isScrolled ? '36px' : '60px';

  return (
    <header
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: `${paddingY} 2rem`,
        backgroundColor: 'rgba(10, 15, 20, 0.85)',
        backdropFilter: 'blur(6px)',
        borderBottom: '1px solid #222',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        fontFamily: "'Roboto', sans-serif",
        boxSizing: 'border-box',
        width: '100%',
        transition: 'padding 0.3s ease'
      }}
    >
      {/* Logo Row — left-aligned */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: isScrolled ? '12px' : '16px',
        marginBottom: isScrolled ? '0.1rem' : '0.2rem',
        transition: 'gap 0.3s ease'
      }}>
        {/* XIM University Logo */}
        <img
          src={`${process.env.PUBLIC_URL}/ximlogo1.png`}
          alt="XIM University"
          style={{
            height: logoHeightOthers,
            width: 'auto',
            objectFit: 'contain',
            borderRadius: '4px',
            transition: 'height 0.3s ease, filter 0.3s ease'
          }}
          onError={(e) => {
            e.target.style.display = 'none';
            const fallback = document.createElement('span');
            fallback.textContent = 'XIM';
            Object.assign(fallback.style, {
              color: '#0077B5',
              fontSize: isScrolled ? '0.8rem' : '0.9rem',
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
              height: logoHeightOthers,
              width: 'auto',
              objectFit: 'contain',
              borderRadius: '4px',
              transition: 'height 0.3s ease, filter 0.3s ease'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
              const fallback = document.createElement('span');
              fallback.textContent = 'IEEE DAY';
              Object.assign(fallback.style, {
                color: '#0077B5',
                fontSize: isScrolled ? '0.8rem' : '0.9rem',
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
              height: logoHeightXIM,
              width: 'auto',
              maxWidth: isScrolled ? '100px' : '120px',
              objectFit: 'contain',
              display: 'block',
              transition: 'height 0.3s ease, max-width 0.3s ease'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
              const fallback = document.createElement('span');
              fallback.textContent = 'IEEE XIM';
              Object.assign(fallback.style, {
                color: '#0077B5',
                fontSize: isScrolled ? '1.0rem' : '1.1rem',
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
          marginTop: isScrolled ? '0.05rem' : '0.1rem',
          transition: 'margin-top 0.3s ease'
        }}
      >
        <p
          style={{
            fontSize: subtitleFontSize,
            color: '#ccc',
            margin: '0 0 0.15rem',
            fontWeight: 300,
            letterSpacing: '0.5px',
            transition: 'font-size 0.3s ease'
          }}
        >
          IEEE XIM Student Branch Presents
        </p>
        <h1
          className="neon-text"
          style={{
            fontSize: titleFontSize,
            margin: 0,
            fontFamily: "'Orbitron', sans-serif",
            letterSpacing: '1.5px',
            transition: 'font-size 0.3s ease'
          }}
        >
          PROTOCOL 456
        </h1>
      </div>
    </header>
  );
}