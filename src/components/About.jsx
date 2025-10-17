// src/components/About.jsx
import React from 'react';

export default function About() {
  return (
    <section
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '4rem 2rem',
        backgroundColor: '#05080c',
        color: '#ddd',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Glowing "ABOUT" Header */}
      <div
        className="neon-text"
        style={{
          fontSize: '3.5rem',
          fontFamily: "'Orbitron', sans-serif",
          marginBottom: '3rem',
          color: '#FF2A6D',
          textShadow: '0 0 10px rgba(255, 42, 109, 0.8), 0 0 20px rgba(255, 42, 109, 0.6)',
          letterSpacing: '3px',
          position: 'relative',
          zIndex: 2
        }}
      >
        ABOUT US
      </div>

      {/* Main Content */}
      <div
        style={{
          maxWidth: '900px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '2.5rem'
        }}
      >
        {/* Mission Statement */}
        <div style={{ textAlign: 'center' }}>
          <h1
            style={{
              fontSize: '2.2rem',
              fontFamily: "'Orbitron', sans-serif",
              color: '#FF2A6D',
              marginBottom: '1.2rem',
              textShadow: '0 0 6px rgba(255, 42, 109, 0.5)'
            }}
          >
            PIONEERING EXCELLENCE IN ENGINEERING AND TECHNOLOGY
          </h1>
          <p style={{ fontSize: '1.2rem', lineHeight: 1.7, color: '#ccc' }}>
            IEEE-XIM Student Branch is a premier engineering student organization of <strong style={{ color: '#1355acff', fontWeight: 'bold' }}>School of Computer Science & Engineering, 
            XIM University, </strong>  
            dedicated to fostering innovation and technical excellence among aspiring engineers and 
            technology professionals.
          </p>
        </div>

        {/* Core Identity */}
        <div
          style={{
            backgroundColor: 'rgba(10, 15, 25, 0.6)',
            border: '1px solid rgba(255, 42, 109, 0.3)',
            borderRadius: '12px',
            padding: '2rem',
            backdropFilter: 'blur(4px)'
          }}
        >
          <h2
            style={{
              fontSize: '1.8rem',
              fontFamily: "'Orbitron', sans-serif",
              color: '#FF2A6D',
              marginBottom: '1.5rem',
              textShadow: '0 0 4px rgba(255, 42, 109, 0.4)'
            }}
          >
            OUR IDENTITY
          </h2>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '1rem' }}>
            Operating under the prestigious <strong>Institute of Electrical and Electronics Engineers (IEEE)</strong>, 
            the IEEE-XIM Student Branch has established itself as a cornerstone of engineering education and research 
            at XIM University.
          </p>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
            We draw together the most passionate and driven students from diverse engineering disciplines, 
            creating a collaborative ecosystem for innovation and growth.
          </p>
        </div>

        {/* Technical Domains */}
        <div
          style={{
            backgroundColor: 'rgba(10, 15, 25, 0.6)',
            border: '1px solid rgba(255, 42, 109, 0.3)',
            borderRadius: '12px',
            padding: '2rem',
            backdropFilter: 'blur(4px)'
          }}
        >
          <h2
            style={{
              fontSize: '1.8rem',
              fontFamily: "'Orbitron', sans-serif",
              color: '#FF2A6D',
              marginBottom: '1.5rem',
              textShadow: '0 0 4px rgba(255, 42, 109, 0.4)'
            }}
          >
            TECHNICAL FOCUS AREAS
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '1.2rem',
              marginTop: '1rem'
            }}
          >
            {[
              'Robotics',
              'Embedded Systems',
              'Signal Processing',
              'Power Electronics',
              'Telecommunications',
              'Emerging Technologies'
            ].map((domain, i) => (
              <div
                key={i}
                style={{
                  padding: '0.8rem',
                  backgroundColor: 'rgba(255, 42, 109, 0.1)',
                  border: '1px solid rgba(255, 42, 109, 0.2)',
                  borderRadius: '6px',
                  textAlign: 'center',
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: '1rem',
                  color: '#FF2A6D'
                }}
              >
                {domain}
              </div>
            ))}
          </div>
        </div>

        {/* Impact Statement */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '1.3rem', lineHeight: 1.8, fontStyle: 'italic', color: '#aaa' }}>
            "Through numerous impactful events and initiatives, we continue to shape the future of engineering 
            by empowering students to push boundaries and redefine what's possible."
          </p>
        </div>
      </div>

      {/* Decorative Grid Lines */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `
            linear-gradient(rgba(255, 42, 109, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 42, 109, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          zIndex: 0,
          pointerEvents: 'none'
        }}
      />
    </section>
  );
}