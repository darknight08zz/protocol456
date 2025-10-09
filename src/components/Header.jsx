// src/components/Header.jsx
import React, { useState, useEffect } from 'react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;

    const updateScrollState = () => {
      const currentScrollY = window.scrollY;
      const shouldBeScrolled = currentScrollY > 50; // Threshold for minimizing

      if (shouldBeScrolled !== isScrolled) {
        setIsScrolled(shouldBeScrolled);
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollState);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

  // Dynamic style values
  const paddingY = isScrolled ? '0.3rem' : '1rem';
  const titleFontSize = isScrolled ? '1.6rem' : '2.3rem';
  const subtitleFontSize = isScrolled ? '0.95rem' : '1.25rem';
  const logoHeightOthers = isScrolled ? '36px' : '60px';
  const ximLogoHeight = isScrolled ? '70px' : '120px';
  const ximLogoMaxWidth = isScrolled ? '100px' : '120px';

  // Helper to create fallback text for missing images
  const createFallback = (text, sizeScrolled, sizeDefault, padding = '4px 8px') => {
    const span = document.createElement('span');
    span.textContent = text;
    Object.assign(span.style, {
      color: '#0077B5',
      fontSize: isScrolled ? sizeScrolled : sizeDefault,
      fontWeight: 'bold',
      display: 'inline-block',
      padding,
      borderRadius: '4px',
      backgroundColor: 'rgba(0, 119, 181, 0.1)',
    });
    return span;
  };

  return (
    <header
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: `${paddingY} 2rem`,
        backgroundColor: 'rgba(10, 15, 20, 0.85)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)', // Safari support
        borderBottom: '1px solid #222',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        fontFamily: "'Roboto', sans-serif",
        boxSizing: 'border-box',
        width: '100%',
        willChange: 'transform, padding',
        transform: isScrolled ? 'translateY(-2px)' : 'none',
        transition:
          'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), padding 0.35s ease',
      }}
    >
      {/* Logo Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: isScrolled ? '12px' : '16px',
          marginBottom: isScrolled ? '0.1rem' : '0.2rem',
          transition: 'gap 0.3s ease',
        }}
      >
        {/* XIM University Logo */}
        <img
          src={`${process.env.PUBLIC_URL}/ximlogo1.png`}
          alt="XIM University"
          style={{
            height: logoHeightOthers,
            width: 'auto',
            objectFit: 'contain',
            borderRadius: '4px',
            transition: 'height 0.3s ease, filter 0.3s ease',
          }}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentNode.appendChild(
              createFallback('XIM', '0.8rem', '0.9rem')
            );
          }}
          onMouseEnter={(e) =>
          (e.currentTarget.style.filter =
            'drop-shadow(0 0 6px rgba(0, 119, 181, 0.8))')
          }
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
            overflow: 'hidden',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.04)';
            e.currentTarget.style.filter =
              'drop-shadow(0 0 10px rgba(0, 119, 181, 0.8))';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.filter = 'none';
          }}
        >
          <img
            src={`${process.env.PUBLIC_URL}/ieee-day.png`}
            alt="IEEE Day – Celebrating global collaboration since 1884"
            style={{
              height: logoHeightOthers,
              width: 'auto',
              objectFit: 'contain',
              borderRadius: '4px',
              transition: 'height 0.3s ease, filter 0.3s ease',
            }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentNode.appendChild(
                createFallback('IEEE DAY', '0.8rem', '0.9rem')
              );
            }}
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
            overflow: 'hidden',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.04)';
            e.currentTarget.style.filter =
              'drop-shadow(0 0 10px rgba(0, 119, 181, 0.8))';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.filter = 'none';
          }}
        >
          <img
            src={`${process.env.PUBLIC_URL}/ieee-xim-logo.png`}
            alt="IEEE XIM Student Branch – Pioneering Excellence in Engineering and Technology"
            style={{
              height: ximLogoHeight,
              width: 'auto',
              maxWidth: ximLogoMaxWidth,
              objectFit: 'contain',
              display: 'block',
              transition: 'height 0.3s ease, max-width 0.3s ease',
            }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentNode.appendChild(
                createFallback('IEEE XIM', '1.0rem', '1.1rem', '8px 12px')
              );
            }}
          />
        </a>
      </div>

      {/* Title Block */}
      <div
        style={{
          alignSelf: 'center',
          textAlign: 'center',
          marginTop: isScrolled ? '0.05rem' : '0.1rem',
          transition: 'margin-top 0.3s ease',
        }}
      >
        <p
          style={{
            fontSize: subtitleFontSize,
            color: '#ccc',
            margin: '0 0 0.15rem',
            fontWeight: 300,
            letterSpacing: '0.5px',
            transition: 'font-size 0.3s ease',
          }}
        >
          IEEE XIM Student Branch Presents
        </p>
        <h1
          style={{
            fontSize: titleFontSize,
            margin: 0,
            fontFamily: "'Orbitron', sans-serif",
            letterSpacing: '1.5px',
            transition: 'font-size 0.3s ease',
            color: '#FF2A6D', // or var(--neon-red)
            textShadow: '0 0 4px rgba(214, 34, 70, 0.5), 0 0 8px rgba(214, 34, 70, 0.3)'
          }}
        >
          PROTOCOL 456
        </h1>
      </div>
    </header>
  );
}