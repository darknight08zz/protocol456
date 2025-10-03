// src/components/Footer.jsx
import React, { useState } from 'react';
import { FaLinkedin, FaInstagram, FaTwitter } from 'react-icons/fa';

// 🔴 REPLACE WITH YOUR ACTUAL LINKS
const SOCIAL_LINKS = {
  linkedin: "https://www.linkedin.com/company/your-ieee-branch",
  instagram: "https://www.instagram.com/your_ieee_handle",
  x: "https://x.com/ieee_xim"
};

// 🔴 REPLACE WITH YOUR FORMSPREE ENDPOINT
const FORMSPREE_URL = "https://formspree.io/f/mwprbzkj";

export default function Footer() {
  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');

    const formData = new FormData(e.target);

    try {
      const response = await fetch(FORMSPREE_URL, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json'
        }
      });

      if (response.ok) {
        setStatus('success');
        e.target.reset();
        // Auto-hide success after 4 seconds
        setTimeout(() => setStatus('idle'), 4000);
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <footer
      style={{
        padding: '3rem 2rem 2rem',
        backgroundColor: '#03060a',
        borderTop: '1px solid #1a1a2e',
        color: '#aaa',
        fontFamily: "'Roboto', sans-serif"
      }}
    >
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '2.5rem',
        justifyContent: 'space-between'
      }}>

        {/* Contact Form */}
        <div style={{ flex: '1', minWidth: '300px', maxWidth: '500px' }}>
          <h3 className="neon-text" style={{
            fontSize: '1.6rem',
            marginBottom: '1.2rem',
            fontFamily: "'Orbitron', sans-serif"
          }}>
            CONTACT US
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: 'rgba(10, 15, 20, 0.7)',
                  border: '1px solid #333',
                  borderRadius: '6px',
                  color: 'white',
                  fontFamily: 'inherit'
                }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: 'rgba(10, 15, 20, 0.7)',
                  border: '1px solid #333',
                  borderRadius: '6px',
                  color: 'white',
                  fontFamily: 'inherit'
                }}
              />
            </div>
            <div style={{ marginBottom: '1.2rem' }}>
              <textarea
                name="message"
                placeholder="Your Message"
                required
                rows="4"
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: 'rgba(10, 15, 20, 0.7)',
                  border: '1px solid #333',
                  borderRadius: '6px',
                  color: 'white',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="glow-button"
              style={{
                padding: '12px 28px',
                fontSize: '1rem',
                width: '100%',
                opacity: status === 'submitting' ? 0.7 : 1
              }}
            >
              {status === 'submitting' ? 'SENDING...' : 'SEND MESSAGE'}
            </button>

            {/* Feedback Messages */}
            {status === 'success' && (
              <p style={{
                color: 'var(--neon-teal)',
                marginTop: '1rem',
                fontWeight: 'bold'
              }}>
                ✅ Message sent! We’ll get back to you soon.
              </p>
            )}
            {status === 'error' && (
              <p style={{
                color: 'var(--neon-red)',
                marginTop: '1rem'
              }}>
                ❌ Failed to send. Please try again.
              </p>
            )}
          </form>
        </div>

        {/* Social + Info */}
        <div style={{
          flex: '1',
          minWidth: '250px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.8rem'
        }}>
          {/* Social Links */}
          <div>
            <div style={{
              display: 'flex',
              gap: '1.2rem',
              fontSize: '2rem'
            }}>
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#0077B5', textDecoration: 'none' }}
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#E1306C', textDecoration: 'none' }}
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href={SOCIAL_LINKS.x}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#396cd4ff', textDecoration: 'none' }}  // X uses black
                aria-label="X (Twitter)"
              >
                <FaTwitter />
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div>
            <p>© {new Date().getFullYear()} IEEE XIM Student Branch</p>
            <p style={{ marginTop: '0.4rem', fontSize: '0.9rem', color: '#777' }}>
              Protocol 456 is a student-organized technical event.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}