import { useEffect, useRef } from 'react';

let mouseX = 0;
let mouseY = 0;
let animFrameId: number | null = null;
let updateFn: ((x: number, y: number) => void) | null = null;
let smoothX = 0;
let smoothY = 0;

function onMouseMove(e: MouseEvent) {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
}

function animate() {
  smoothX += (mouseX - smoothX) * 0.08;
  smoothY += (mouseY - smoothY) * 0.08;

  if (updateFn) updateFn(smoothX, smoothY);

  animFrameId = requestAnimationFrame(animate);
}

function start() {
  if (animFrameId) return;
  document.addEventListener('mousemove', onMouseMove, { passive: true });
  animFrameId = requestAnimationFrame(animate);
}

function stop() {
  if (animFrameId) {
    cancelAnimationFrame(animFrameId);
    animFrameId = null;
  }
  document.removeEventListener('mousemove', onMouseMove);
  updateFn = null;
}

export function GradientOrbs() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const orb1 = container.querySelector('.orb-1') as HTMLElement;
    const orb2 = container.querySelector('.orb-2') as HTMLElement;
    const orb3 = container.querySelector('.orb-3') as HTMLElement;

    updateFn = (x: number, y: number) => {
      if (orb1) orb1.style.transform = `translate(${x * 30}px, ${y * 30}px)`;
      if (orb2) orb2.style.transform = `translate(${x * -25}px, ${y * 20}px)`;
      if (orb3) orb3.style.transform = `translate(${x * 20}px, ${y * -25}px)`;
    };

    start();

    return () => {
      stop();
    };
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
        zIndex: 0,
        pointerEvents: 'none',
        background: '#050810'
      }}
    >
      {/* Grid background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(36, 116, 166, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(36, 116, 166, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px'
      }} />

      {/* Radial scan effect */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(5, 8, 16, 0.8) 100%)'
      }} />

      {/* Gradient Orbs */}
      <div className="orb-1" style={{
        position: 'absolute',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        filter: 'blur(80px)',
        opacity: 0.15,
        background: 'radial-gradient(circle, #2474a6 0%, transparent 70%)',
        top: '-200px',
        right: '-150px',
        willChange: 'transform',
        transition: 'transform 0.1s ease-out'
      }} />

      <div className="orb-2" style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        filter: 'blur(70px)',
        opacity: 0.12,
        background: 'radial-gradient(circle, #4ecdc4 0%, transparent 70%)',
        bottom: '-150px',
        left: '-100px',
        willChange: 'transform',
        transition: 'transform 0.1s ease-out'
      }} />

      <div className="orb-3" style={{
        position: 'absolute',
        width: '350px',
        height: '350px',
        borderRadius: '50%',
        filter: 'blur(60px)',
        opacity: 0.1,
        background: 'radial-gradient(circle, #d2fffe 0%, transparent 70%)',
        top: '40%',
        left: '60%',
        willChange: 'transform',
        transition: 'transform 0.1s ease-out'
      }} />

      {/* Particle dots */}
      {[...Array(20)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          background: i % 3 === 0 ? '#2474a6' : i % 3 === 1 ? '#4ecdc4' : '#d2fffe',
          left: `${10 + (i * 4.7) % 80}%`,
          top: `${10 + (i * 5.3) % 80}%`,
          opacity: 0.3 + (i % 5) * 0.1,
          boxShadow: `0 0 ${8 + i % 3 * 4}px currentColor`,
          animation: `particle-float ${3 + i % 4}s ease-in-out infinite`,
          animationDelay: `${i * 0.2}s`
        }} />
      ))}

      {/* Corner decorative elements */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        width: '100px',
        height: '100px',
        borderTop: '1px solid rgba(36, 116, 166, 0.2)',
        borderLeft: '1px solid rgba(36, 116, 166, 0.2)'
      }} />

      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        width: '100px',
        height: '100px',
        borderTop: '1px solid rgba(36, 116, 166, 0.2)',
        borderRight: '1px solid rgba(36, 116, 166, 0.2)'
      }} />

      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        width: '100px',
        height: '100px',
        borderBottom: '1px solid rgba(36, 116, 166, 0.2)',
        borderLeft: '1px solid rgba(36, 116, 166, 0.2)'
      }} />

      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        width: '100px',
        height: '100px',
        borderBottom: '1px solid rgba(36, 116, 166, 0.2)',
        borderRight: '1px solid rgba(36, 116, 166, 0.2)'
      }} />

      {/* Scanline effect */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(210, 255, 254, 0.02) 2px, rgba(210, 255, 254, 0.02) 4px)',
        pointerEvents: 'none'
      }} />
    </div>
  );
}
