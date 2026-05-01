import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface ProjectCardProps {
  to?: string;
  href?: string;
  type: string;
  title: string;
  description: string;
  emoji: string;
  gradientColors?: string[];
  ctaText?: string;
  isPlaceholder?: boolean;
}

export function ProjectCard({
  to,
  href,
  type,
  title,
  description,
  emoji,
  gradientColors = ['var(--color-gradient-1)', 'var(--color-gradient-2)', 'var(--color-gradient-3)'],
  ctaText = '探索项目',
  isPlaceholder = false
}: ProjectCardProps) {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const targetTiltRef = useRef({ x: 0, y: 0 });
  const currentTiltRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | null>(null);
  const isHoveringRef = useRef(false);

  const handleClick = (e: React.MouseEvent) => {
    if (isPlaceholder) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples(prev => [...prev, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 700);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPlaceholder || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    targetTiltRef.current = { x: (y - centerY) / 20, y: (centerX - x) / 20 };
  };

  const handleMouseEnter = () => {
    if (isPlaceholder) return;
    isHoveringRef.current = true;
    if (innerRef.current) {
      innerRef.current.style.borderColor = 'var(--color-border-strong)';
      innerRef.current.style.boxShadow = 'var(--shadow-strong)';
    }
  };

  const handleMouseLeave = () => {
    isHoveringRef.current = false;
    targetTiltRef.current = { x: 0, y: 0 };
    if (innerRef.current) {
      innerRef.current.style.borderColor = 'var(--color-border)';
      innerRef.current.style.boxShadow = '';
    }
  };

  useEffect(() => {
    const animate = () => {
      const current = currentTiltRef.current;
      const target = targetTiltRef.current;

      // Smooth interpolation
      current.x += (target.x - current.x) * 0.15;
      current.y += (target.y - current.y) * 0.15;

      // Only update state if change is meaningful or returning to zero
      const isReturningToZero = target.x === 0 && target.y === 0;
      const hasChanged = Math.abs(current.x - tilt.x) > 0.1 || Math.abs(current.y - tilt.y) > 0.1;

      if (isReturningToZero || hasChanged) {
        setTilt({ ...current });
      }

      // Direct DOM update for hover lift
      if (innerRef.current && isHoveringRef.current) {
        innerRef.current.style.transform = `perspective(1000px) rotateX(${current.x + 2}deg) rotateY(${current.y}deg) translateY(-8px)`;
      } else if (innerRef.current) {
        innerRef.current.style.transform = `perspective(1000px) rotateX(${current.x}deg) rotateY(${current.y}deg)`;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [tilt]);

  const CardContent = () => (
    <div
      style={{
        perspective: '1000px',
        position: 'relative'
      }}
      ref={cardRef}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={innerRef}
        style={{
          position: 'relative',
          background: isPlaceholder ? 'transparent' : 'var(--color-bg-elevated)',
          border: isPlaceholder ? '1px dashed var(--color-border)' : '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          transition: 'border-color 0.3s, box-shadow 0.3s',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
          minHeight: isPlaceholder ? '340px' : undefined
        }}
      >
        {ripples.map(ripple => (
          <div
            key={ripple.id}
            style={{
              position: 'absolute',
              left: ripple.x,
              top: ripple.y,
              marginLeft: '-50px',
              marginTop: '-50px',
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
              transform: 'scale(0)',
              animation: 'ripple-animation 0.7s var(--transition-ease)',
              pointerEvents: 'none',
              zIndex: 10
            }}
          />
        ))}

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
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
              animation: 'placeholder-pulse 3s ease-in-out infinite'
            }} />
            <span style={{
              position: 'relative',
              fontSize: '40px',
              marginBottom: '16px',
              opacity: 0.8
            }}>{emoji}</span>
            <p style={{
              position: 'relative',
              fontSize: '14px',
              lineHeight: 1.7
            }}>{description}</p>
          </div>
        ) : (
          <>
            <div style={{
              position: 'relative',
              height: '180px',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(135deg, ${gradientColors.join(', ')})`,
                opacity: 0.9,
                transition: 'transform 0.6s var(--transition-smooth)'
              }} className="visual-gradient" />
              <span style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '56px',
                filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.3))',
                transition: 'transform 0.5s var(--transition-smooth)'
              }} className="project-emoji">{emoji}</span>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                marginBottom: '10px'
              }}>{type}</div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                marginBottom: '10px'
              }}>{title}</h3>
              <p style={{
                fontSize: '14px',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.7,
                marginBottom: '20px'
              }}>{description}</p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--color-text-primary)',
                  position: 'relative'
                }} className="project-cta">
                  {ctaText}
                  <span style={{
                    content: '',
                    position: 'absolute',
                    bottom: '-2px',
                    left: 0,
                    width: 0,
                    height: '1px',
                    background: 'var(--color-text-primary)',
                    transition: 'width 0.3s var(--transition-ease)'
                  }} className="project-cta-line" />
                </span>
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--color-bg-elevated-hover)',
                  transition: 'all 0.4s var(--transition-smooth)',
                  color: 'var(--color-text-secondary)'
                }} className="project-arrow">
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
  );

  if (to) {
    return (
      <Link to={to} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
        <CardContent />
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
        <CardContent />
      </a>
    );
  }

  return <CardContent />;
}
