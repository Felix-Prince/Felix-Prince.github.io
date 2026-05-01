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
  gradientColors = ['var(--color-gradient-1)', 'var(--color-gradient-2)', 'var(--color-gradient-3)'],
  ctaText = '探索项目',
  isPlaceholder = false
}: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  // Use refs for all animation state - no React re-renders
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
      inner.style.borderColor = 'var(--color-border-strong)';
      inner.style.boxShadow = 'var(--shadow-strong)';
    };

    const handleMouseLeave = () => {
      isHovering.current = false;
      targetTilt.current = { x: 0, y: 0 };
      inner.style.borderColor = 'var(--color-border)';
      inner.style.boxShadow = '';
    };

    const animate = () => {
      const current = currentTilt.current;
      const target = targetTilt.current;

      // Smooth interpolation
      current.x += (target.x - current.x) * 0.15;
      current.y += (target.y - current.y) * 0.15;

      // Direct DOM update
      if (isHovering.current) {
        inner.style.transform = `perspective(1000px) rotateX(${current.x + 2}deg) rotateY(${current.y}deg) translateY(-8px)`;
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

  // Memoize static content to avoid re-creating on every render
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
            <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(135deg, ${gradientColors.join(', ')})`,
                opacity: 0.9
              }} />
              <span style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '56px',
                filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.3))'
              }}>{emoji}</span>
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)', position: 'relative' }}>
                  {ctaText}
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
