import { useEffect } from 'react';

export function GradientOrbs() {
  useEffect(() => {
    // Mouse parallax on gradient orbs using CSS custom properties (no rAF loop)
    const handleMouseMove = (e: MouseEvent) => {
      const x = ((e.clientX / window.innerWidth - 0.5) * 2).toFixed(2);
      const y = ((e.clientY / window.innerHeight - 0.5) * 2).toFixed(2);
      document.documentElement.style.setProperty('--mouse-x', x);
      document.documentElement.style.setProperty('--mouse-y', y);
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: 0,
        pointerEvents: 'none',
        background: '#080a12',
      }}
    >
      {/* Subtle grid — static, single paint */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(79, 143, 255, 0.03) 1px, transparent 1px),' +
            'linear-gradient(90deg, rgba(79, 143, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      {/* Gradient orbs — no blur, pure gradient + opacity */}
      <div
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          opacity: 0.08,
          background: 'radial-gradient(circle, #4f8fff 0%, transparent 60%)',
          top: '-200px',
          right: '-150px',
          transform: 'translate(calc(var(--mouse-x, 0) * 15px), calc(var(--mouse-y, 0) * 15px))',
          transition: 'transform 1.5s cubic-bezier(0.22, 1, 0.36, 1)',
          animation: 'heroFloat 25s ease-in-out infinite',
        }}
      />

      <div
        style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          opacity: 0.06,
          background: 'radial-gradient(circle, #8b5cf6 0%, transparent 60%)',
          bottom: '-150px',
          left: '-100px',
          transform: 'translate(calc(var(--mouse-x, 0) * -12px), calc(var(--mouse-y, 0) * 12px))',
          transition: 'transform 1.5s cubic-bezier(0.22, 1, 0.36, 1)',
          animation: 'heroFloat 25s ease-in-out infinite 5s',
        }}
      />

      <div
        style={{
          position: 'absolute',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          opacity: 0.05,
          background: 'radial-gradient(circle, #22d3ee 0%, transparent 60%)',
          top: '40%',
          left: '60%',
          transform: 'translate(calc(var(--mouse-x, 0) * 10px), calc(var(--mouse-y, 0) * -10px))',
          transition: 'transform 1.5s cubic-bezier(0.22, 1, 0.36, 1)',
          animation: 'heroFloat 25s ease-in-out infinite 10s',
        }}
      />

      {/* Dark vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 50% 50%, transparent 0%, rgba(8, 10, 18, 0.85) 100%)',
        }}
      />
    </div>
  );
}
