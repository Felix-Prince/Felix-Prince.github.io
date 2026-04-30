import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import photosData from '../data/photos.json';

interface Photo {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  tags: string[];
  date: string;
  camera: string;
  settings: string;
  description: string;
  collection: string;
}

const BackIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '24px', height: '24px' }}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ChevronIcon = ({ direction }: { direction: 'left' | 'right' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '24px', height: '24px', transform: direction === 'left' ? 'none' : 'rotate(180deg)' }}>
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

export function PhotoGallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    setPhotos(photosData.photos || []);
  }, []);

  useEffect(() => {
    if (photos.length === 0) return;

    const interval = setInterval(() => {
      const heroCount = Math.min(5, photos.length);
      setCurrentSlideIndex(prev => (prev + 1) % heroCount);
    }, 5000);

    return () => clearInterval(interval);
  }, [photos.length]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;

      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex(prev => prev !== null ? (prev - 1 + photos.length) % photos.length : null);
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex(prev => prev !== null ? (prev + 1) % photos.length : null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, photos.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      setLightboxIndex(prev => prev !== null ? (prev + (diff > 0 ? 1 : -1) + photos.length) % photos.length : null);
    }
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const getCollections = () => {
    const collections: Record<string, Photo[]> = {};
    photos.forEach(photo => {
      const collection = photo.collection || 'Uncategorized';
      if (!collections[collection]) {
        collections[collection] = [];
      }
      collections[collection].push(photo);
    });
    return collections;
  };

  const heroPhotos = photos.slice(0, Math.min(5, photos.length));
  const collections = getCollections();

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: '24px 40px',
          background: isScrolled
            ? 'rgba(17,17,17,0.98)'
            : 'linear-gradient(to bottom, rgba(17,17,17,0.95) 0%, rgba(17,17,17,0) 100%)',
          transition: 'background 0.4s cubic-bezier(0.4,0,0.2,1)',
          backdropFilter: isScrolled ? 'blur(20px)' : 'none'
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '20px',
            fontWeight: 500,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#f5f5f5'
          }}>Photography</div>
          <nav>
            <Link
              to="/"
              style={{
                fontSize: '13px',
                color: '#999999',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                transition: 'color 0.4s cubic-bezier(0.4,0,0.2,1)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#f5f5f5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#999999';
              }}
            >
              <BackIcon />
              <span>Back to Home</span>
            </Link>
          </nav>
        </div>
      </header>

      <section style={{ position: 'relative', height: '100vh', minHeight: '600px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          {heroPhotos.map((photo, index) => (
            <div
              key={photo.id}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: index === currentSlideIndex ? 1 : 0,
                transition: 'opacity 1.2s cubic-bezier(0.4,0,0.2,1)'
              }}
            >
              <img
                src={photo.url}
                alt={photo.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
          ))}
        </div>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(17,17,17,0.4) 0%, rgba(17,17,17,0.2) 40%, #111111 100%)'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '80px',
          left: '40px',
          right: '40px',
          maxWidth: '1400px',
          margin: '0 auto',
          zIndex: 10
        }}>
          <p style={{
            fontSize: '14px',
            color: '#777777',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            fontFamily: "'JetBrains Mono', monospace",
            marginBottom: '16px'
          }}>Personal Works</p>
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(32px, 6vw, 72px)',
            fontWeight: 400,
            lineHeight: 1.1,
            color: '#ffffff',
            letterSpacing: '-0.02em'
          }}>Selected Photography</h1>
        </div>
        <div style={{
          position: 'absolute',
          bottom: '80px',
          right: '40px',
          display: 'flex',
          gap: '12px',
          zIndex: 10
        }}>
          {heroPhotos.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlideIndex(index)}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: index === currentSlideIndex ? '#c9a76e' : '#777777',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
                transform: index === currentSlideIndex ? 'scale(1.3)' : 'none',
                border: 'none',
                padding: 0
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      <section style={{ position: 'relative', zIndex: 1, padding: '120px 40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ marginBottom: '80px', textAlign: 'center' }}>
            <p style={{
              fontSize: '11px',
              color: '#c9a76e',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontFamily: "'JetBrains Mono', monospace",
              marginBottom: '12px'
            }}>Collections</p>
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '42px',
              fontWeight: 400,
              color: '#f5f5f5',
              letterSpacing: '-0.02em'
            }}>Photo Books</h2>
          </div>

          {Object.entries(collections).map(([collectionName, collectionPhotos]) => (
            <div key={collectionName} style={{ marginBottom: '160px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                marginBottom: '32px',
                paddingBottom: '24px',
                borderBottom: '1px solid #333333'
              }}>
                <h3 style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: '28px',
                  fontWeight: 400,
                  color: '#f5f5f5',
                  letterSpacing: '-0.01em'
                }}>{collectionName}</h3>
                <span style={{
                  fontSize: '13px',
                  color: '#777777',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  fontFamily: "'JetBrains Mono', monospace"
                }}>{collectionPhotos.length} works</span>
              </div>

              <div style={{ position: 'relative', perspective: '2000px' }}>
                <div style={{ display: 'flex', gap: '4px', position: 'relative', transformStyle: 'preserve-3d' }}>
                  <div style={{
                    width: '24px',
                    background: 'linear-gradient(to right, #333333 0%, #1a1a1a 50%, #2a2a2a 100%)',
                    borderRadius: '2px 0 0 2px',
                    flexShrink: 0
                  }} />
                  <div style={{
                    flex: 1,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '4px',
                    background: '#1a1a1a',
                    borderRadius: '0 4px 4px 0',
                    padding: '4px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.4)'
                  }}>
                    {collectionPhotos.slice(0, 6).map((photo) => (
                      <div
                        key={photo.id}
                        onClick={() => openLightbox(photos.indexOf(photo))}
                        style={{
                          position: 'relative',
                          aspectRatio: '4/3',
                          overflow: 'hidden',
                          background: '#111111',
                          cursor: 'pointer'
                        }}
                      >
                        <img
                          src={photo.thumbnail || photo.url}
                          alt={photo.title}
                          loading="lazy"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.8s cubic-bezier(0.4,0,0.2,1), filter 0.5s ease',
                            filter: 'grayscale(30%)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.08)';
                            e.currentTarget.style.filter = 'grayscale(0%)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.filter = 'grayscale(30%)';
                          }}
                        />
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(to top, rgba(17,17,17,0.8) 0%, transparent 50%)',
                          opacity: 0,
                          transition: 'opacity 0.4s cubic-bezier(0.4,0,0.2,1)',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-end',
                          padding: '20px'
                        }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.opacity = '1';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.opacity = '0';
                          }}
                        >
                          <h4 style={{
                            fontFamily: "'Playfair Display', Georgia, serif",
                            fontSize: '16px',
                            color: '#ffffff',
                            fontWeight: 400
                          }}>{photo.title}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer style={{
        padding: '80px 40px',
        borderTop: '1px solid #333333'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <p style={{
            fontSize: '12px',
            color: '#777777',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontFamily: "'JetBrains Mono', monospace"
          }}>© 2024 Photography</p>
          <p style={{
            fontSize: '12px',
            color: '#777777',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontFamily: "'JetBrains Mono', monospace"
          }}>All Rights Reserved</p>
        </div>
      </footer>

      {lightboxIndex !== null && photos[lightboxIndex] && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.95)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px'
          }}
          onClick={(e) => e.target === e.currentTarget && closeLightbox()}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button
            onClick={closeLightbox}
            aria-label="Close"
            style={{
              position: 'absolute',
              top: '40px',
              right: '40px',
              width: '48px',
              height: '48px',
              color: '#999999',
              cursor: 'pointer',
              transition: 'color 0.4s cubic-bezier(0.4,0,0.2,1)',
              background: 'none',
              border: 'none',
              padding: 0
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#999999';
            }}
          >
            <CloseIcon />
          </button>

          <button
            onClick={() => setLightboxIndex(prev => prev !== null ? (prev - 1 + photos.length) % photos.length : null)}
            aria-label="Previous"
            style={{
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              left: '40px',
              width: '56px',
              height: '56px',
              color: '#999999',
              cursor: 'pointer',
              transition: 'color 0.4s cubic-bezier(0.4,0,0.2,1)',
              background: 'none',
              border: 'none',
              padding: 0
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#999999';
            }}
          >
            <ChevronIcon direction="left" />
          </button>

          <button
            onClick={() => setLightboxIndex(prev => prev !== null ? (prev + 1) % photos.length : null)}
            aria-label="Next"
            style={{
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              right: '40px',
              width: '56px',
              height: '56px',
              color: '#999999',
              cursor: 'pointer',
              transition: 'color 0.4s cubic-bezier(0.4,0,0.2,1)',
              background: 'none',
              border: 'none',
              padding: 0
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#999999';
            }}
          >
            <ChevronIcon direction="right" />
          </button>

          <img
            src={photos[lightboxIndex].url}
            alt={photos[lightboxIndex].title}
            style={{
              maxWidth: '100%',
              maxHeight: '90vh',
              objectFit: 'contain'
            }}
          />
        </div>
      )}
    </>
  );
}
