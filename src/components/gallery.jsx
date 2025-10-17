// src/components/Gallery.jsx
import React, { useState } from 'react';

// Placeholder image paths (replace with your actual image imports/URLs)
const placeholderImages = Array(8).fill(null).map((_, i) => `/event-photos/photo-${i + 1}.jpg`);

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const openLightbox = (imgSrc) => {
    setIsLoading(true);
    setSelectedImage(imgSrc);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    setIsLoading(false);
  };

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '4rem 2rem',
        backgroundColor: '#05080c',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Glowing "EVENT GALLERY" Header */}
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
        EVENT GALLERY
      </div>

      {/* Image Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '2rem',
          maxWidth: '1400px',
          width: '100%',
          padding: '0 1rem'
        }}
      >
        {placeholderImages.map((imgSrc, i) => (
          <div
            key={i}
            onClick={() => openLightbox(imgSrc)}
            style={{
              aspectRatio: '4/3',
              backgroundColor: 'rgba(10, 15, 25, 0.7)',
              border: '1px solid rgba(255, 42, 109, 0.3)',
              borderRadius: '8px',
              overflow: 'hidden',
              cursor: 'zoom-in',
              position: 'relative',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.03)';
              e.currentTarget.style.borderColor = 'rgba(255, 42, 109, 0.6)';
              e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 42, 109, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.borderColor = 'rgba(255, 42, 109, 0.3)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Placeholder content (replace with <img> when you have real images) */}
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#aaa',
                fontSize: '1.1rem',
                fontFamily: "'Roboto', sans-serif'",
                backgroundColor: 'rgba(5, 8, 12, 0.8)'
              }}
            >
              Event Photo {i + 1}
            </div>
            
            {/* Hover overlay */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 70%)',
                opacity: 0,
                transition: 'opacity 0.3s ease',
                pointerEvents: 'none'
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '10px',
                left: 0,
                width: '100%',
                textAlign: 'center',
                color: '#FF2A6D',
                fontFamily: "'Orbitron', sans-serif",
                fontSize: '0.9rem',
                opacity: 0,
                transition: 'opacity 0.3s ease',
                pointerEvents: 'none'
              }}
            >
              VIEW
            </div>
          </div>
        ))}
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

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '2rem',
            cursor: 'zoom-out'
          }}
          onClick={closeLightbox}
        >
          {/* Close button */}
          <div
            style={{
              position: 'absolute',
              top: '2rem',
              right: '2rem',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 42, 109, 0.2)',
              color: '#FF2A6D',
              fontSize: '1.5rem',
              cursor: 'pointer',
              border: '1px solid rgba(255, 42, 109, 0.5)',
              transition: 'background 0.3s ease'
            }}
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 42, 109, 0.4)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 42, 109, 0.2)'}
          >
            ✕
          </div>

          {/* Loading indicator */}
          {isLoading && (
            <div
              style={{
                position: 'absolute',
                color: '#FF2A6D',
                fontFamily: "'Orbitron', sans-serif",
                fontSize: '1.2rem'
              }}
            >
              LOADING...
            </div>
          )}

          {/* Image container */}
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}
          >
            {/* Replace placeholder with actual <img> when ready */}
            <div
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                display: isLoading ? 'none' : 'block'
              }}
              onLoad={() => setIsLoading(false)}
            >
              <div
                style={{
                  width: '80vw',
                  height: '80vh',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#aaa',
                  fontSize: '1.5rem',
                  fontFamily: "'Roboto', sans-serif",
                  backgroundColor: 'rgba(10, 15, 25, 0.8)',
                  border: '1px solid rgba(255, 42, 109, 0.3)'
                }}
              >
                Full-size preview of: {selectedImage}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}