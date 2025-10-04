// src/components/Hero.jsx
import React, { useState, useEffect } from 'react';
import EventCard from './EventCard';

export default function Hero() {
  // 🔴 Registration closes: October 10, 2025 at 23:59:59
  const REGISTRATION_DEADLINE = "2025-10-10T23:59:59";

  // 🔴 Your actual Google Form URL
  const registrationUrl = "https://docs.google.com/forms/d/e/1FAIpQLSegL9IPAjlbHejKIZcQJQMzc7wFHV9TnLwvlsy75PXOBI0IxA/viewform?usp=header";

  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00'
  });
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(true);

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
        gap: '2.5rem'
      }}
    >
      {/* Main Tagline */}
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

      {/* Registration Button or Closed Notice */}
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
        <p style={{ color: 'var(--neon-red)', fontSize: '1.1rem', fontStyle: 'italic' }}>
          Registrations are now closed. See you at the event!
        </p>
      )}

      {/* EVENTS SECTION — Updated Dates */}
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
          {/* 🔴 MANUALLY CONTROL HERE */}
          <EventCard
            day="Day 1 • October 13, 2025"
            title="ROUND ONE: TRIALS"
            link="/day1"
            isLive={false} // 👈 CHANGE TO `true` WHEN YOU WANT IT LIVE
          />
          <EventCard
            day="Day 2 • October 18, 2025"
            title="ROUND TWO: FINAL SHOWDOWN"
            link="/day2"
            isLive={false} // 👈 CHANGE TO `true` WHEN YOU WANT IT LIVE
          />
        </div>
      </div>
    </section>
  );
}