// src/components/Hero.jsx
import React, { useState, useEffect, useCallback } from 'react';
import EventCard from './EventCard';

export default function Hero() {
  // ====== 🛠 MANUAL OVERRIDE FOR DEVELOPMENT ====
  const DAY_ONE_LIVE_OVERRIDE = false;
  const DAY_TWO_LIVE_OVERRIDE = false;
  // ================================================

  const REGISTRATION_DEADLINE = "2025-10-10T23:59:59";
  const registrationUrl = "https://docs.google.com/forms/d/e/1FAIpQLSegL9IPAjlbHejKIZcQJQMzc7wFHV9TnLwvlsy75PXOBI0IxA/viewform?usp=header";

  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00'
  });
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(true);
  
  const [isDayOneLive, setIsDayOneLive] = useState(false);
  const [isDayTwoLive, setIsDayTwoLive] = useState(false);

  const DAY_ONE_DATE = "2025-10-10";
  const DAY_TWO_DATE = "2025-10-18";
  const DAY_ONE_ACTIVATION_TIME = "2025-10-11T09:00:00";

  const checkLiveStatus = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const activationTime = new Date(DAY_ONE_ACTIVATION_TIME);
    
    const dayOneLive = DAY_ONE_LIVE_OVERRIDE || (
      today === DAY_ONE_DATE && 
      now >= activationTime
    );
    
    const dayTwoLive = DAY_TWO_LIVE_OVERRIDE || today === DAY_TWO_DATE;
    
    setIsDayOneLive(dayOneLive);
    setIsDayTwoLive(dayTwoLive);
  }, [DAY_ONE_LIVE_OVERRIDE, DAY_TWO_LIVE_OVERRIDE, DAY_ONE_DATE, DAY_TWO_DATE, DAY_ONE_ACTIVATION_TIME]);

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

    checkLiveStatus();
    setTimeLeft(calculateTimeLeft());
    
    const timer = setInterval(() => {
      checkLiveStatus();
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [REGISTRATION_DEADLINE, checkLiveStatus]);


  // 🔐 Password-protected navigation for Day One
  const handleDayOneClick = (e) => {
    e.preventDefault();
    const password = prompt("🔐 Enter access password for Day One:");
    if (password === "protocol456") {
      window.location.href = "/day1";
    } else if (password !== null) {
      alert("❌ Incorrect password. Access denied.");
    }
  };

  const isDayOneEnded = () => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const activationTime = new Date(DAY_ONE_ACTIVATION_TIME);
    
    if (today > DAY_ONE_DATE) {
      return true;
    } else if (today === DAY_ONE_DATE && now >= activationTime) {
      return !isDayOneLive;
    }
    return false;
  };

  const isDayTwoEnded = () => {
    const today = new Date().toISOString().split('T')[0];
    
    if (today > DAY_TWO_DATE) {
      return true;
    } else if (today === DAY_TWO_DATE) {
      return !isDayTwoLive;
    }
    return false;
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

      <div
        style={{
          width: '100%',
          maxWidth: '900px',
          marginTop: '2rem',
          padding: '0 2rem',
        }}
      >
        <div
          style={{
            marginBottom: '2rem',
            fontSize: '1.2rem',
            color: '#bbb',
            lineHeight: 1.6,
            fontWeight: '500'
          }}
        >
          <h3 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1rem' }}>
            Ready to take on the challenge?
          </h3>
          <p>
            Join us as we unlock the next level of excitement. Whether you're a strategist, a coder, or simply love a good challenge, this event is designed to test your limits and push your skills to the edge.
          </p>
        </div>

        <div
          style={{
            marginTop: '2rem',
            fontSize: '1.2rem',
            color: '#bbb',
            lineHeight: 1.6,
            fontWeight: '500'
          }}
        >
          <p>
            <strong>But it's not just about the game</strong> – it's about the journey, the learning, and the community you'll be part of. We believe that the most thrilling experiences are the ones that bring together the brightest minds, and we want <em>you</em> to be a part of it.
          </p>
          <p>
            So, what are you waiting for? Dive in, take your shot, and let's make this an event to remember.
          </p>
        </div>
      </div>

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
              flexWrap: 'wrap',
              fontFamily: "'Orbitron', sans-serif",
              letterSpacing: '1.5px',
              transition: 'font-size 0.3s ease',
              color: '#FF2A6D',
              textShadow: '0 0 4px rgba(214, 34, 70, 0.5), 0 0 8px rgba(214, 34, 70, 0.3)'
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
          {/* SEASON 2 COMING SOON SECTION */}
          <div
            style={{
              padding: '2.5rem 1.5rem',
              borderRadius: '12px',
              border: '1px solid var(--neon-red)',
              background: 'linear-gradient(145deg, rgba(10, 5, 15, 0.7), rgba(20, 10, 30, 0.9))',
              backdropFilter: 'blur(4px)',
              boxShadow: '0 0 20px rgba(255, 42, 109, 0.3)',
              maxWidth: '600px',
              margin: '0 auto'
            }}
          >
            <div
              className="neon-text"
              style={{
                fontSize: '2.8rem',
                fontFamily: "'Orbitron', sans-serif",
                marginBottom: '1rem',
                color: '#FF2A6D',
                textShadow: '0 0 8px rgba(255, 42, 109, 0.7)',
                letterSpacing: '2px'
              }}
            >
              SEASON 2
            </div>
            <div
              style={{
                fontSize: '1.8rem',
                fontFamily: "'Orbitron', sans-serif",
                color: '#FF2A6D',
                textShadow: '0 0 6px rgba(255, 42, 109, 0.5)',
                letterSpacing: '3px'
              }}
            >
              COMING SOON
            </div>
            <div
              style={{
                marginTop: '1.5rem',
                color: '#aaa',
                fontSize: '1.1rem',
                fontStyle: 'italic',
                maxWidth: '500px',
                margin: '0 auto'
              }}
            >
              The Protocol continues. Prepare for new challenges, deeper mysteries, and higher stakes.
            </div>
          </div>
        </div>
      )}

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
      ) : null}

      <div style={{ width: '100%', maxWidth: '950px', paddingTop: '3rem', borderTop: '1px solid #222' }}>
        <h2
          className="neon-text"
          style={{
            fontSize: '2.2rem',
            marginBottom: '2rem',
            fontFamily: "'Orbitron', sans-serif",
            letterSpacing: '1.5px',
            transition: 'font-size 0.3s ease',
            color: '#FF2A6D',
            textShadow: '0 0 4px rgba(214, 34, 70, 0.5), 0 0 8px rgba(214, 34, 70, 0.3)'
          }}
        >
          EVENT SCHEDULE
        </h2>
        <div
          style={{
            display: 'flex',
            gap: '2.2rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            margin: 0,
            color: '#FF2A6D',
          }}
        >
          <div style={{ width: '320px' }}>
            <div
              onClick={isDayOneLive ? handleDayOneClick : undefined}
              style={{
                cursor: isDayOneLive ? 'pointer' : 'not-allowed',
                opacity: isDayOneLive ? 1 : 0.5,
                pointerEvents: isDayOneLive ? 'auto' : 'none'
              }}
            >
              <EventCard
                day="October 11, 2025"
                title={
                  <>
                    <span>DAY ONE:</span>
                    <br />
                    THE INITIAL PROTOCOL
                  </>
                }
                link="#"
                isLive={isDayOneLive}
                isEnded={isDayOneEnded()}
              />
            </div>
            {!isDayOneLive && !isDayOneEnded() && (
              <p style={{ color: '#aaa', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                {new Date() < new Date(DAY_ONE_ACTIVATION_TIME) ? "Activates at 9:00 AM" : "Coming soon"}
              </p>
            )}
          </div>

          <div style={{ width: '320px' }}>
            <a
              href={isDayTwoLive ? "/day2" : "#"}
              style={{
                textDecoration: 'none',
                cursor: isDayTwoLive ? 'pointer' : 'not-allowed',
                opacity: isDayTwoLive ? 1 : 0.5,
                pointerEvents: isDayTwoLive ? 'auto' : 'none',
                display: 'block',
                color: '#FF2A6D',
              }}
            >
              <EventCard
                day="October 18, 2025"
                title={
                  <>
                    <span>DAY TWO:</span>
                    <br />
                    THE FINAL PROTOCOL
                  </>
                }
                link={isDayTwoLive ? "/day2" : "#"}
                isLive={isDayTwoLive}
                isEnded={isDayTwoEnded()}
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}