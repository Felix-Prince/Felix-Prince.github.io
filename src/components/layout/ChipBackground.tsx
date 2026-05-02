import { useEffect, useRef } from 'react';

// Particle system with smooth animation
export function ChipBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Array<{
    element: HTMLDivElement; x: number; y: number; vx: number; vy: number; }>>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create particles
    const container = containerRef.current;
    const particles: Array<{
      element: HTMLDivElement;
      x: number;
      y: number;
      vx: number;
      vy: number;
    }> = [];

    const particleCount = 120;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      const size = 2 + Math.random() * 3;
      const color = i % 3 === 0 ? '#0ff' : i % 3 === 1 ? '#4ecdc4' : '#2474a6';

      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: ${color};
        opacity: ${0.2 + Math.random() * 0.4};
        box-shadow: 0 0 ${5 + Math.random() * 10}px ${color};
        left: 0;
        top: 0;
        will-change: transform;
      `;

      container.appendChild(particle);

      particles.push({
        element: particle,
        x: Math.random() * 100,
        y: Math.random() * 100,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15
      });
    }

    particlesRef.current = particles;

    // Animation loop
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 16; // Normalize to 60fps
      lastTime = currentTime;

      particles.forEach(p => {
        // Update position with subtle movement
        p.x += p.vx * deltaTime;
        p.y += p.vy * deltaTime;

        // Bounce at edges
        if (p.x < 0) { p.x = 0; p.vx = Math.abs(p.vx); }
        if (p.x > 100) { p.x = 100; p.vx = -Math.abs(p.vx); }
        if (p.y < 0) { p.y = 0; p.vy = Math.abs(p.vy); }
        if (p.y > 100) { p.y = 100; p.vy = -Math.abs(p.vy); }

        // Update transform
        p.element.style.transform = `translate(${p.x}vw, ${p.y}vh)`;
      });

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    return () => {
      particles.forEach(p => {
        container.removeChild(p.element);
      });
    };
  }, []);

  return (
    <div ref={containerRef} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      zIndex: 2,
      pointerEvents: 'none',
      background: '#0a0a0d'
    }}>
      {/* Grain texture overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")`,
        opacity: 0.5,
        zIndex: 1
      }} />

      {/* Circuit traces SVG */}
      <svg style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 3
      }}>
        <defs>
          <filter id="circuitGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Circuit traces */}
        <g filter="url(#circuitGlow)" opacity="1">
          {/* Top - 4 lines */}
          <path d="M50% 35% L50% 28% L30% 28% L30% 5%" stroke="#0ff" strokeWidth="7" fill="none" strokeLinecap="round" opacity="0.9" />
          <path d="M50% 35% L50% 28% L40% 28% L40% 5%" stroke="#4ecdc4" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.8" />
          <path d="M50% 35% L50% 28% L60% 28% L60% 5%" stroke="#4ecdc4" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.8" />
          <path d="M50% 35% L50% 28% L70% 28% L70% 5%" stroke="#0ff" strokeWidth="7" fill="none" strokeLinecap="round" opacity="0.9" />

          {/* Bottom - 4 lines */}
          <path d="M50% 65% L50% 72% L30% 72% L30% 95%" stroke="#0ff" strokeWidth="7" fill="none" strokeLinecap="round" opacity="0.9" />
          <path d="M50% 65% L50% 72% L40% 72% L40% 95%" stroke="#4ecdc4" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.8" />
          <path d="M50% 65% L50% 72% L60% 72% L60% 95%" stroke="#4ecdc4" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.8" />
          <path d="M50% 65% L50% 72% L70% 72% L70% 95%" stroke="#0ff" strokeWidth="7" fill="none" strokeLinecap="round" opacity="0.9" />

          {/* Left - 4 lines */}
          <path d="M35% 50% L28% 50% L28% 38% L10% 38% L10% 25%" stroke="#0ff" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.9" />
          <path d="M35% 50% L28% 50% L28% 44% L10% 44% L10% 38%" stroke="#4ecdc4" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.8" />
          <path d="M35% 50% L28% 50% L28% 56% L10% 56% L10% 62%" stroke="#4ecdc4" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.8" />
          <path d="M35% 50% L28% 50% L28% 62% L10% 62% L10% 75%" stroke="#0ff" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.9" />

          {/* Right - 4 lines */}
          <path d="M65% 50% L72% 50% L72% 38% L90% 38% L90% 25%" stroke="#0ff" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.9" />
          <path d="M65% 50% L72% 50% L72% 44% L90% 44% L90% 38%" stroke="#4ecdc4" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.8" />
          <path d="M65% 50% L72% 50% L72% 56% L90% 56% L90% 62%" stroke="#4ecdc4" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.8" />
          <path d="M65% 50% L72% 50% L72% 62% L90% 62% L90% 75%" stroke="#0ff" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.9" />

          {/* Diagonals */}
          <path d="M50% 50% L42% 42% L30% 42% L22% 30%" stroke="#4ecdc4" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.8" />
          <path d="M50% 50% L58% 42% L70% 42% L78% 30%" stroke="#0ff" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.8" />
          <path d="M50% 50% L42% 58% L30% 58% L22% 70%" stroke="#0ff" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.8" />
          <path d="M50% 50% L58% 58% L70% 58% L78% 70%" stroke="#4ecdc4" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.8" />
        </g>
      </svg>

      {/* Center chip module */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%) rotateX(18deg) rotateY(-22deg)',
        transformStyle: 'preserve-3d',
        perspective: '1200px',
        zIndex: 5
      }}>
        {/* Outer glow layer */}
        <div style={{
          position: 'absolute',
          top: '-12px',
          left: '-12px',
          width: '384px',
          height: '384px',
          borderRadius: '80px',
          background: 'transparent',
          border: '3px solid rgba(0, 255, 255, 0.35)',
          boxShadow: '0 0 18px rgba(0, 255, 255, 0.45), inset 0 0 18px rgba(0, 255, 255, 0.2)',
          zIndex: 1
        }} />

        {/* Inner border layer */}
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          width: '320px',
          height: '320px',
          borderRadius: '70px',
          background: 'transparent',
          border: '2px solid rgba(78, 205, 196, 0.55)',
          boxShadow: '0 0 10px rgba(78, 205, 196, 0.35), inset 0 0 10px rgba(78, 205, 196, 0.18)',
          zIndex: 2
        }} />

        {/* Main chip body */}
        <div style={{
          position: 'relative',
          width: '360px',
          height: '360px',
          borderRadius: '75px',
          background: 'linear-gradient(135deg, #0f1820 0%, #05080d 50%, #030508 100%)',
          boxShadow: '0 0 18px rgba(0, 255, 255, 0.4), 0 0 35px rgba(0, 255, 255, 0.18), inset 0 0 22px rgba(0, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3
        }}>
          {/* Lightning logo */}
          <svg style={{
            width: '170px',
            height: '170px',
            filter: 'drop-shadow(0 0 9px #0ff) drop-shadow(0 0 18px rgba(0, 255, 255, 0.55))'
          }} viewBox="0 0 200 200">
            <defs>
              <linearGradient id="lightningGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="50%" stopColor="#0ff" />
                <stop offset="100%" stopColor="#4ecdc4" />
              </linearGradient>
            </defs>

            {/* Main bolt */}
            <path d="M100 30 L65 98 L92 98 L83 170 L145 103 L117 103 L128 30 Z"
              fill="url(#lightningGrad)" opacity="0.98" />

            {/* Highlight */}
            <path d="M100 30 L78 70 L102 70 L96 115 L122 85 L110 85 L118 50 Z"
              fill="white" opacity="0.55" />
          </svg>
        </div>
      </div>

      {/* Dark vignette */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 0%, rgba(10, 10, 13, 0.4) 50%, rgba(10, 10, 13, 0.92) 100%)',
        pointerEvents: 'none',
        zIndex: 8
      }} />
    </div>
  );
}
