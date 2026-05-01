import { useEffect, useRef } from 'react';

// Ultra-optimized single animation system
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

    const orb1 = container.children[0] as HTMLElement;
    const orb2 = container.children[1] as HTMLElement;
    const orb3 = container.children[2] as HTMLElement;

    updateFn = (x: number, y: number) => {
      orb1.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
      orb2.style.transform = `translate(${x * 15}px, ${y * 15}px)`;
      orb3.style.transform = `translate(${x * 10}px, ${y * 10}px)`;
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
        pointerEvents: 'none'
      }}
    >
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        filter: 'blur(60px)',
        opacity: 0.12,
        background: 'radial-gradient(circle, var(--color-gradient-1) 0%, transparent 70%)',
        top: '-150px',
        right: '-150px',
        willChange: 'transform'
      }} />
      <div style={{
        position: 'absolute',
        width: '350px',
        height: '350px',
        borderRadius: '50%',
        filter: 'blur(60px)',
        opacity: 0.12,
        background: 'radial-gradient(circle, var(--color-gradient-3) 0%, transparent 70%)',
        bottom: '-100px',
        left: '-80px',
        willChange: 'transform'
      }} />
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        filter: 'blur(60px)',
        opacity: 0.12,
        background: 'radial-gradient(circle, var(--color-gradient-4) 0%, transparent 70%)',
        top: '40%',
        left: '30%',
        willChange: 'transform'
      }} />
    </div>
  );
}
