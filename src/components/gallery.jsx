// src/components/Gallery.jsx
import React, { useState, useEffect } from 'react';

// Generate image paths for Day 1 (1.jpg to 15.jpg)
const day1Images = Array.from({ length: 16 }, (_, i) => `/images/day1/${i + 1}.jpg`);
const day2Images = Array.from({ length: 15 }, (_, i) => `/images/day2/${i + 1}.jpg`);

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
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Render a grid of images for a given day
  const renderImageGrid = (images, dayLabel) => (
    <>
      <h2
        style={{
          fontSize: '2.2rem',
          fontFamily: "'Orbitron', sans-serif",
          color: '#FF2A6D',
          margin: '2.5rem 0 1.5rem',
          textShadow: '0 0 8px rgba(255, 42, 109, 0.7)',
          width: '100%',
          textAlign: 'center',
        }}
      >
        {dayLabel}
      </h2>
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
        {images.map((imgSrc, i) => (
          <div
            key={`${dayLabel}-${i}`}
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
            <img
              src={imgSrc}
              alt={`${dayLabel} - Photo ${i + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block'
              }}
              loading="lazy"
            />

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
        {images.length === 0 && (
          <p
            style={{
              gridColumn: '1 / -1',
              color: '#aaa',
              fontStyle: 'italic',
              textAlign: 'center',
              padding: '2rem'
            }}
          >
            No photos available for {dayLabel} yet.
          </p>
        )}
      </div>
    </>
  );

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
          marginBottom: '2rem',
          color: '#FF2A6D',
          textShadow: '0 0 10px rgba(255, 42, 109, 0.8), 0 0 20px rgba(255, 42, 109, 0.6)',
          letterSpacing: '3px',
          position: 'relative',
          zIndex: 2
        }}
      >
        EVENT GALLERY
      </div>

      {/* Day 1 Section */}
      {renderImageGrid(day1Images, 'DAY 1')}

      {/* Day 2 Section */}
      {renderImageGrid(day2Images, 'DAY 2')}

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
            <img
              src={selectedImage}
              alt="Enlarged view"
              onLoad={() => setIsLoading(false)}
              style={{
                maxWidth: '90vw',
                maxHeight: '90vh',
                objectFit: 'contain',
                display: isLoading ? 'none' : 'block',
                border: '1px solid rgba(255, 42, 109, 0.3)',
                borderRadius: '4px'
              }}
            />
          </div>
        </div>
      )}
    </section>
  );
}