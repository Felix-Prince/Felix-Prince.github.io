import { useRef, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

interface ProjectCardProps {
  to?: string;
  href?: string;
  type: string;
  title: string;
  emoji: string;
  gradientColors?: string[];
  ctaText?: string;
  isPlaceholder?: boolean;
  description?: string;
}

export function ProjectCard({
  to,
  href,
  type,
  title,
  description = '',
  emoji,
  gradientColors = ['#4f8fff', '#22d3ee', '#e8e8f0'],
  ctaText = '探索项目',
  isPlaceholder = false
}: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const targetTilt = useRef({ x: 0, y: 0 });
  const currentTilt = useRef({ x: 0, y: 0 });
  const animationFrameId = useRef<number | null>(null);
  const isHovering = useRef(false);

  useEffect(() => {
    const card = cardRef.current;
    const inner = innerRef.current;
    if (!card || !inner || isPlaceholder) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      targetTilt.current = { x: (y - centerY) / 20, y: (centerX - x) / 20 };
    };

    const handleMouseEnter = () => {
      isHovering.current = true;
      inner.style.borderColor = '#4f8fff';
      inner.style.boxShadow = '0 0 30px rgba(79, 143, 255, 0.4), 0 0 60px rgba(139, 92, 246, 0.15)';
    };

    const handleMouseLeave = () => {
      isHovering.current = false;
      targetTilt.current = { x: 0, y: 0 };
      inner.style.borderColor = 'rgba(232, 232, 240, 0.2)';
      inner.style.boxShadow = '';
    };

    const animate = () => {
      const current = currentTilt.current;
      const target = targetTilt.current;

      current.x += (target.x - current.x) * 0.15;
      current.y += (target.y - current.y) * 0.15;

      if (isHovering.current) {
        inner.style.transform = `perspective(1000px) rotateX(${current.x + 2}deg) rotateY(${current.y}deg) translateY(-8px) scale(1.02)`;
      } else {
        inner.style.transform = `perspective(1000px) rotateX(${current.x}deg) rotateY(${current.y}deg)`;
      }

      animationFrameId.current = requestAnimationFrame(animate);
    };

    card.addEventListener('mousemove', handleMouseMove, { passive: true });
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);
    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isPlaceholder]);

  const cardContent = useMemo(() => (
    <div
      style={{
        perspective: '1000px',
        position: 'relative'
      }}
      ref={cardRef}
    >
      <div
        ref={innerRef}
        style={{
          position: 'relative',
          background: isPlaceholder
            ? 'transparent'
            : 'linear-gradient(135deg, rgba(79, 143, 255, 0.15) 0%, rgba(5, 8, 16, 0.95) 100%)',
          border: isPlaceholder
            ? '1px dashed rgba(232, 232, 240, 0.2)'
            : '1px solid rgba(232, 232, 240, 0.2)',
          borderRadius: '20px',
          overflow: 'hidden',
          transition: 'border-color 0.3s, box-shadow 0.3s, transform 0.3s',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
          minHeight: isPlaceholder ? '340px' : undefined
        }}
      >
        {/* Tech corner decorations */}
        {!isPlaceholder && (
          <>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '20px',
              height: '20px',
              borderTop: '2px solid #4f8fff',
              borderLeft: '2px solid #4f8fff',
              opacity: 0.7,
              zIndex: 10
            }} />
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '20px',
              height: '20px',
              borderTop: '2px solid #4f8fff',
              borderRight: '2px solid #4f8fff',
              opacity: 0.7,
              zIndex: 10
            }} />
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '20px',
              height: '20px',
              borderBottom: '2px solid #4f8fff',
              borderLeft: '2px solid #4f8fff',
              opacity: 0.7,
              zIndex: 10
            }} />
            <div style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: '20px',
              height: '20px',
              borderBottom: '2px solid #4f8fff',
              borderRight: '2px solid #4f8fff',
              opacity: 0.7,
              zIndex: 10
            }} />
          </>
        )}

        {/* Scanline effect */}
        {!isPlaceholder && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(232, 232, 240, 0.03) 2px, rgba(232, 232, 240, 0.03) 4px)',
            pointerEvents: 'none',
            zIndex: 5
          }} />
        )}

        {isPlaceholder ? (
          <div style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '340px',
            textAlign: 'center',
            color: 'var(--color-text-muted)'
          }}>
            <div style={{
              position: 'absolute',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(79, 143, 255, 0.2) 0%, transparent 70%)',
              animation: 'placeholder-pulse 3s ease-in-out infinite'
            }} />
            <span style={{
              position: 'relative',
              fontSize: '40px',
              marginBottom: '16px',
              opacity: 0.8,
              textShadow: '0 0 20px rgba(232, 232, 240, 0.3)'
            }}>{emoji}</span>
            <p style={{
              position: 'relative',
              fontSize: '14px',
              lineHeight: 1.7
            }}>{description}</p>
          </div>
        ) : (
          <>
            <div style={{ position: 'relative', height: '180px', overflow: 'hidden', background: '#0a0a0d' }}>
              {/* Circuit board grid */}
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `
                  linear-gradient(rgba(79, 143, 255, 0.08) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(79, 143, 255, 0.08) 1px, transparent 1px)
                `,
                backgroundSize: '15px 15px'
              }} />

              {/* SVG circuit traces */}
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                <defs>
                  <filter id="card-glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <g filter="url(#card-glow)" opacity="0.6">
                  {/* Top left trace */}
                  <path d="M0 30 L60 30 L60 60" stroke="#4f8fff" strokeWidth="2" fill="none" />
                  {/* Top right trace */}
                  <path d="M100% 40 L100%-50 40 L100%-50 80 L100%-80 80" stroke="#8b5cf6" strokeWidth="2" fill="none" />
                  {/* Bottom trace */}
                  <path d="M40 100% L40 100%-30 L100%-40 100%-30" stroke="#4f8fff" strokeWidth="2" fill="none" />
                  {/* Center cross */}
                  <path d="M50% 0 L50% 50" stroke="#0ff" strokeWidth="1.5" fill="none" opacity="0.5" />
                  <path d="M0 50% L50 50%" stroke="#0ff" strokeWidth="1.5" fill="none" opacity="0.5" />
                </g>
                {/* Circuit nodes */}
                <circle cx="60" cy="30" r="3" fill="#4f8fff" />
                <circle cx="60" cy="60" r="3" fill="#4f8fff" />
                <circle cx="100%-80" cy="80" r="3" fill="#8b5cf6" />
                <circle cx="40" cy="100%-30" r="3" fill="#4f8fff" />
              </svg>

              {/* Center chip module */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #0f1820 0%, #05080d 100%)',
                  border: '1px solid rgba(0, 255, 255, 0.4)',
                  boxShadow: '0 0 15px rgba(0, 255, 255, 0.3), inset 0 0 10px rgba(0, 255, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px'
                }}>{emoji}</div>
              </div>

              {/* Corner accents */}
              <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                width: '30px',
                height: '30px',
                borderTop: '1px solid rgba(139, 92, 246, 0.3)',
                borderLeft: '1px solid rgba(139, 92, 246, 0.3)'
              }} />
              <div style={{
                position: 'absolute',
                bottom: '12px',
                right: '12px',
                width: '30px',
                height: '30px',
                borderBottom: '1px solid rgba(139, 92, 246, 0.3)',
                borderRight: '1px solid rgba(139, 92, 246, 0.3)'
              }} />
            </div>
            <div style={{ padding: '24px', position: 'relative', zIndex: 1 }}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                marginBottom: '10px',
                background: 'linear-gradient(135deg, #ffffff 0%, #4f8fff 50%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent',
              }}>{type}</div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                marginBottom: '10px',
                color: '#e8e8f0',
                textShadow: '0 0 10px rgba(232, 232, 240, 0.3)'
              }}>{title}</h3>
              <p style={{
                fontSize: '14px',
                color: 'rgba(232, 232, 240, 0.7)',
                lineHeight: 1.7,
                marginBottom: '20px'
              }}>{description}</p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '12px',
                borderTop: '1px solid rgba(232, 232, 240, 0.1)'
              }}>
                <span style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  position: 'relative',
                  background: 'linear-gradient(135deg, #ffffff 0%, #4f8fff 50%, #8b5cf6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}>
                  {ctaText}
                </span>
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(79, 143, 255, 0.2)',
                  border: '1px solid rgba(79, 143, 255, 0.5)',
                  transition: 'all 0.4s var(--transition-smooth)',
                  color: '#e8e8f0'
                }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  ), [type, title, description, emoji, ctaText, gradientColors, isPlaceholder]);

  if (to) {
    return (
      <Link to={to} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
        {cardContent}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
        {cardContent}
      </a>
    );
  }

  return cardContent;
}
