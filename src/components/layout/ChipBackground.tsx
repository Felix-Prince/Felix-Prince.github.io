import { useEffect, useRef } from 'react';

// Subtle gradient orbs background — CSS only, inspired by agent-roadmap-2026 design
export function ChipBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Mouse-follow parallax for gradient orbs
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 6;
      const y = (e.clientY / window.innerHeight - 0.5) * 6;
      container.style.setProperty('--mouse-x', `${x}px`);
      container.style.setProperty('--mouse-y', `${y}px`);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: 2,
        pointerEvents: 'none',
        background: '#050810',
      }}
    >
      {/* Gradient orbs — CSS only, subtle floating animation */}
      <div
        style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          transform: 'translate(var(--mouse-x, 0), var(--mouse-y, 0))',
          transition: 'transform 1.5s cubic-bezier(0.22, 1, 0.36, 1)',
          background:
            'radial-gradient(ellipse at 30% 20%, rgba(79, 143, 255, 0.08) 0%, transparent 50%),' +
            'radial-gradient(ellipse at 70% 80%, rgba(139, 92, 246, 0.08) 0%, transparent 50%),' +
            'radial-gradient(ellipse at 50% 50%, rgba(34, 211, 238, 0.05) 0%, transparent 50%)',
          animation: 'heroFloat 20s ease-in-out infinite',
        }}
      />

      {/* Grain texture — static, paint once */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
          opacity: 0.5,
          zIndex: 2,
        }}
      />

      {/* Dark vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at center, transparent 0%, rgba(5, 8, 16, 0.3) 50%, rgba(5, 8, 16, 0.85) 100%)',
          pointerEvents: 'none',
          zIndex: 3,
        }}
      />
    </div>
  );
}
