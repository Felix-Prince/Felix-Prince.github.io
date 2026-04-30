import { useParallax } from '../../hooks/useParallax';

export function GradientOrbs() {
  const pos1 = useParallax(20);
  const pos2 = useParallax(15);
  const pos3 = useParallax(10);

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
        pointerEvents: 'none'
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          filter: 'blur(100px)',
          opacity: 0.15,
          mixBlendMode: 'multiply',
          background: 'radial-gradient(circle, var(--color-gradient-1) 0%, transparent 70%)',
          top: '-200px',
          right: '-200px',
          transform: `translate(${pos1.x}px, ${pos1.y}px)`,
          animation: 'orb-float 20s ease-in-out infinite'
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          filter: 'blur(100px)',
          opacity: 0.15,
          mixBlendMode: 'multiply',
          background: 'radial-gradient(circle, var(--color-gradient-3) 0%, transparent 70%)',
          bottom: '-150px',
          left: '-100px',
          transform: `translate(${pos2.x}px, ${pos2.y}px)`,
          animation: 'orb-float 20s ease-in-out infinite',
          animationDelay: '-7s'
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          filter: 'blur(100px)',
          opacity: 0.15,
          mixBlendMode: 'multiply',
          background: 'radial-gradient(circle, var(--color-gradient-4) 0%, transparent 70%)',
          top: '40%',
          left: '30%',
          transform: `translate(${pos3.x}px, ${pos3.y}px)`,
          animation: 'orb-float 20s ease-in-out infinite',
          animationDelay: '-14s'
        }}
      />
    </div>
  );
}
