// src/components/Hero.jsx
import React, { useState, useEffect } from 'react';
import EventCard from './EventCard';

export default function Hero() {
  // 🔴 Registration closes: October 12, 2025 at 23:59:59
  const REGISTRATION_DEADLINE = "2025-10-12T23:59:59";

  // 🔴 Your actual Google Form URL
  const registrationUrl = "https://docs.google.com/forms/d/e/1FAIpQLSegL9IPAjlbHejKIZcQJQMzc7wFHV9TnLwvlsy75PXOBI0IxA/viewform?usp=header";

  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00'
  });
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(true);
  const [isEventLive, setIsEventLive] = useState(false);

  // 👇 FIXED: EVENT_DAYS defined inside useEffect → no ESLint warning
  useEffect(() => {
    const EVENT_DAYS = ["2025-10-13", "2025-10-18"];
    const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
    setIsEventLive(EVENT_DAYS.includes(today));
  }, []); // ✅ Safe empty dependency array

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const deadline = new Date(REGISTRATION_DEADLINE).getTime();
      const diff = deadline - now;

      setIsRegistrationOpen(diff > 0);

      if (diff <= 0) {
        return { days: '00', hours: '00', minutes: '00', seconds: '00' };
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      return {
        days: days.toString().padStart(2, '0'),
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0')
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [REGISTRATION_DEADLINE]);

  // Waitlist state
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistStatus, setWaitlistStatus] = useState('idle');

  const handleWaitlistSubmit = async (e) => {
    e.preventDefault();
    setWaitlistStatus('submitting');
    // Simulate API call
    setTimeout(() => {
      setWaitlistStatus('success');
      setWaitlistEmail('');
      setTimeout(() => setWaitlistStatus('idle'), 3000);
    }, 800);
  };

  return (
    <section
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '2rem',
        marginTop: '80px',
        backgroundColor: '#05080c',
        gap: '2.5rem',
        position: 'relative'
      }}
    >
      {/* LIVE NOW Badge */}
      {isEventLive && (
        <div
          style={{
            position: 'absolute',
            top: '90px',
            right: '2rem',
            backgroundColor: 'var(--neon-red)',
            color: 'black',
            padding: '6px 18px',
            borderRadius: '20px',
            fontWeight: 'bold',
            fontFamily: "'Orbitron', sans-serif",
            fontSize: '1.1rem',
            letterSpacing: '1px',
            boxShadow: '0 0 10px rgba(255, 42, 109, 0.7)',
            zIndex: 10
          }}
        >
          LIVE NOW
        </div>
      )}

      {/* Main Tagline */}
      <p
        style={{
          fontSize: '1.8rem',
          color: '#ddd',
          maxWidth: '750px',
          lineHeight: 1.7,
          fontFamily: "'Roboto', sans-serif",
          fontWeight: 700
        }}
      >
        The game begins. Only the sharpest minds survive.
        Are you ready to play?
      </p>

      {/* Short Event Description */}
      <div
        style={{
          maxWidth: '700px',
          color: '#bbb',
          fontSize: '1.15rem',
          lineHeight: 1.6,
          marginTop: '-0.5rem',
          marginBottom: '1.5rem',
          fontStyle: 'italic'
        }}
      >
        An immersive technical event by IEEE XIM Student Branch.
        Two days. One mission. Will you make it to the end?
      </div>

      {/* Countdown or Closed Message */}
      {isRegistrationOpen ? (
        <div style={{ width: '100%', maxWidth: '800px' }}>
          <p style={{ color: '#aaa', marginBottom: '1rem', fontSize: '1.3rem' }}>
            REGISTRATION CLOSES IN:
          </p>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '0.8rem',
              flexWrap: 'wrap'
            }}
          >
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div
                key={unit}
                style={{
                  backgroundColor: 'rgba(10, 15, 20, 0.6)',
                  border: '1px solid rgba(214, 34, 70, 0.5)',
                  borderRadius: '8px',
                  padding: '0.8rem 0.5rem',
                  minWidth: '70px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  backdropFilter: 'blur(2px)'
                }}
              >
                <div
                  className="neon-text"
                  style={{
                    fontSize: '1.8rem',
                    fontFamily: "'Orbitron', sans-serif",
                    fontWeight: 'bold'
                  }}
                >
                  {value}
                </div>
                <div
                  style={{
                    color: '#999',
                    fontSize: '0.75rem',
                    marginTop: '0.3rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}
                >
                  {unit}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ width: '100%', maxWidth: '800px' }}>
          <div
            className="neon-text"
            style={{
              fontSize: '2rem',
              fontFamily: "'Orbitron', sans-serif",
              marginBottom: '0.8rem'
            }}
          >
            REGISTRATION CLOSED
          </div>
          <p style={{ color: '#777', fontSize: '1.1rem' }}>
            Thank you for your interest! The event schedule is below.
          </p>
        </div>
      )}

      {/* Registration Button or Waitlist */}
      {isRegistrationOpen ? (
        <a
          href={registrationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="glow-button"
          style={{
            display: 'inline-block',
            padding: '14px 36px',
            fontSize: '1.2rem',
            textDecoration: 'none'
          }}
        >
          REGISTER NOW
        </a>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <p style={{ color: 'var(--neon-red)', fontSize: '1.1rem', fontStyle: 'italic' }}>
            Registrations are now closed. See you at the event!
          </p>
          <div style={{ marginTop: '1rem', maxWidth: '400px', width: '100%' }}>
            <p style={{ color: '#ccc', marginBottom: '0.8rem', fontSize: '1rem' }}>
              Missed the deadline? Join our waitlist for future events:
            </p>
            <form onSubmit={handleWaitlistSubmit} style={{ display: 'flex', gap: '0.6rem', flexDirection: 'column' }}>
              <input
                type="email"
                value={waitlistEmail}
                onChange={(e) => setWaitlistEmail(e.target.value)}
                placeholder="Your email"
                required
                style={{
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #444',
                  backgroundColor: 'rgba(20, 30, 40, 0.7)',
                  color: 'white',
                  fontSize: '1rem'
                }}
              />
              <button
                type="submit"
                disabled={waitlistStatus === 'submitting'}
                className="glow-button"
                style={{
                  padding: '10px',
                  fontSize: '1rem',
                  width: '100%',
                  opacity: waitlistStatus === 'submitting' ? 0.7 : 1
                }}
              >
                {waitlistStatus === 'submitting' ? 'JOINING...' : 'JOIN WAITLIST'}
              </button>
            </form>
            {waitlistStatus === 'success' && (
              <p style={{ color: 'var(--neon-teal)', marginTop: '0.6rem', fontWeight: 'bold' }}>
                ✅ Added to waitlist!
              </p>
            )}
          </div>
        </div>
      )}

      {/* EVENTS SECTION */}
      <div style={{ width: '100%', maxWidth: '950px', paddingTop: '3rem', borderTop: '1px solid #222' }}>
        <h2
          className="neon-text"
          style={{
            fontSize: '2.2rem',
            marginBottom: '2rem',
            fontFamily: "'Orbitron', sans-serif",
            letterSpacing: '1.5px'
          }}
        >
          EVENT SCHEDULE
        </h2>
        <div
          style={{
            display: 'flex',
            gap: '2.2rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}
        >
          <EventCard
            day="Day 1 • October 13, 2025"
            title={<><span>ROUND ONE:</span><br />THE BEGINNING</>}
            link="/day1"
            isLive={false}
          />
          <EventCard
            day="Day 2 • October 18, 2025"
            title={<><span>ROUND TWO:</span><br />FINAL SHOWDOWN</>}
            link="/day2"
            isLive={false}
          />
        </div>
      </div>
    </section>
  );
}