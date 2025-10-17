// src/components/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Handle scroll effect for header
  useEffect(() => {
    let ticking = false;
    const updateScrollState = () => {
      const currentScrollY = window.scrollY;
      const shouldBeScrolled = currentScrollY > 50;
      if (shouldBeScrolled !== isScrolled) setIsScrolled(shouldBeScrolled);
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

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Dynamic header styles
  const paddingY = isScrolled ? '0.3rem' : '1rem';
  const titleFontSize = isScrolled ? '1.6rem' : '2.3rem';
  const subtitleFontSize = isScrolled ? '0.95rem' : '1.25rem';
  const logoHeightOthers = isScrolled ? '36px' : '60px';
  const ximLogoHeight = isScrolled ? '70px' : '120px';
  const ximLogoMaxWidth = isScrolled ? '100px' : '120px';

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
    <>
      {/* Subtle blurred backdrop – faded background shadow */}
      {isMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(5, 8, 12, 0.25)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            zIndex: 101,
            pointerEvents: 'none',
          }}
        />
      )}

      <header
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: `${paddingY} 2rem`,
          backgroundColor: 'rgba(10, 15, 20, 0.88)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          borderBottom: '1px solid #2a2f3a',
          position: 'sticky',
          top: 0,
          zIndex: 102,
          fontFamily: "'Roboto', sans-serif",
          boxSizing: 'border-box',
          width: '100%',
          willChange: 'transform, padding',
          transform: isScrolled ? 'translateY(-2px)' : 'none',
          transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), padding 0.35s ease',
        }}
      >
        {/* Logo Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            gap: isScrolled ? '12px' : '16px',
            marginBottom: isScrolled ? '0.1rem' : '0.2rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'inherit' }}>
            <img
              src={`${process.env.PUBLIC_URL}/ximlogo1.png`}
              alt="XIM University"
              style={{
                height: logoHeightOthers,
                width: 'auto',
                objectFit: 'contain',
                borderRadius: '4px',
                transition: 'filter 0.3s ease',
              }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentNode.appendChild(createFallback('XIM', '0.8rem', '0.9rem'));
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.filter = 'drop-shadow(0 0 6px rgba(0, 119, 181, 0.8))')
              }
              onMouseLeave={(e) => (e.currentTarget.style.filter = 'none')}
            />

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
                e.currentTarget.style.filter = 'drop-shadow(0 0 10px rgba(0, 119, 181, 0.8))';
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
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.appendChild(createFallback('IEEE DAY', '0.8rem', '0.9rem'));
                }}
              />
            </a>

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
                e.currentTarget.style.filter = 'drop-shadow(0 0 10px rgba(0, 119, 181, 0.8))';
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

          {/* Hamburger Button – ONLY opens menu */}
          <button
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open navigation menu"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '32px',
              height: '32px',
            }}
          >
            <span style={{ width: '100%', height: '3px', backgroundColor: '#0077B5', borderRadius: '2px', marginBottom: '5px' }} />
            <span style={{ width: '100%', height: '3px', backgroundColor: '#0077B5', borderRadius: '2px', marginBottom: '5px' }} />
            <span style={{ width: '100%', height: '3px', backgroundColor: '#0077B5', borderRadius: '2px' }} />
          </button>
        </div>

        {/* Title Block – Bold, glowing, clickable PROTOCOL 456 */}
        <div
          style={{
            alignSelf: 'center',
            textAlign: 'center',
            marginTop: isScrolled ? '0.05rem' : '0.1rem',
          }}
        >
          <p
            style={{
              fontSize: subtitleFontSize,
              color: '#ccc',
              margin: '0 0 0.15rem',
              fontWeight: 300,
              letterSpacing: '0.5px',
            }}
          >
            IEEE XIM Student Branch Presents
          </p>
          <Link
            to="/"
            style={{
              fontSize: titleFontSize,
              margin: 0,
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: '800',
              letterSpacing: '2px',
              color: '#FF2A6D',
              textShadow: `
                0 0 8px rgba(255, 42, 109, 0.9),
                0 0 16px rgba(255, 42, 109, 0.7),
                0 0 24px rgba(255, 42, 109, 0.5),
                0 0 32px rgba(255, 42, 109, 0.3)
              `,
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'inline-block',
              WebkitTextStroke: '0.5px rgba(255, 255, 255, 0.1)',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.textShadow = `
                0 0 12px rgba(255, 42, 109, 1),
                0 0 24px rgba(255, 42, 109, 0.8),
                0 0 36px rgba(255, 42, 109, 0.6),
                0 0 48px rgba(255, 42, 109, 0.4)
              `;
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.textShadow = `
                0 0 8px rgba(255, 42, 109, 0.9),
                0 0 16px rgba(255, 42, 109, 0.7),
                0 0 24px rgba(255, 42, 109, 0.5),
                0 0 32px rgba(255, 42, 109, 0.3)
              `;
            }}
          >
            PROTOCOL 456
          </Link>
        </div>
      </header>

      {/* Navigation Pane – Controlled open/close */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            height: '100vh',
            width: '300px',
            backgroundColor: '#0a0f16',
            borderLeft: '1px solid #1e2a3a',
            zIndex: 103,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingTop: '100px',
            boxSizing: 'border-box',
            transform: 'translateX(0)',
            opacity: 1,
            transition: 'transform 0.5s cubic-bezier(0.22, 0.61, 0.36, 1)',
          }}
        >
          {/* Close Button – ONLY way to close */}
          <button
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close navigation menu"
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              background: 'transparent',
              border: 'none',
              color: '#FF2A6D',
              fontSize: '2rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              transition: 'background 0.2s, transform 0.2s',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 42, 109, 0.15)';
              e.target.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.transform = 'scale(1)';
            }}
          >
            &times;
          </button>

          {/* Event Gallery Button */}
          <Link
            to="/gallery"
            onClick={() => setIsMenuOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '230px',
              padding: '16px 20px',
              margin: '0 0 16px 0',
              textDecoration: 'none',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0a1929, #003a66)',
              border: '1px solid #0077B5',
              color: '#e0f0ff',
              fontSize: '1.35rem',
              fontWeight: '600',
              letterSpacing: '0.6px',
              textShadow: '0 0 4px rgba(0, 119, 181, 0.6)',
              boxShadow: '0 0 12px rgba(0, 119, 181, 0.2)',
              transition: 'all 0.35s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.boxShadow = '0 0 20px rgba(0, 119, 181, 0.5), 0 0 30px rgba(255, 42, 109, 0.2)';
              e.target.style.transform = 'scale(1.03)';
            }}
            onMouseLeave={(e) => {
              e.target.style.boxShadow = '0 0 12px rgba(0, 119, 181, 0.2)';
              e.target.style.transform = 'scale(1)';
            }}
          >
            <span style={{ marginRight: '10px', fontSize: '1.5rem' }}>📷</span>
            Event Gallery
          </Link>

          {/* About Us Button – themed with IEEE XIM mission */}
          <Link
            to="/about"
            onClick={() => setIsMenuOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '230px',
              padding: '16px 20px',
              textDecoration: 'none',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0c1b28, #002a4d)',
              border: '1px solid #005a8a',
              color: '#d0e8ff',
              fontSize: '1.35rem',
              fontWeight: '600',
              letterSpacing: '0.6px',
              textShadow: '0 0 4px rgba(0, 90, 138, 0.5)',
              boxShadow: '0 0 12px rgba(0, 90, 138, 0.2)',
              transition: 'all 0.35s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.boxShadow = '0 0 20px rgba(0, 90, 138, 0.5), 0 0 30px rgba(255, 42, 109, 0.15)';
              e.target.style.transform = 'scale(1.03)';
            }}
            onMouseLeave={(e) => {
              e.target.style.boxShadow = '0 0 12px rgba(0, 90, 138, 0.2)';
              e.target.style.transform = 'scale(1)';
            }}
          >
            <span style={{ marginRight: '10px', fontSize: '1.5rem' }}>ℹ️</span>
            About Us
          </Link>
        </div>
      )}
    </>
  );
}