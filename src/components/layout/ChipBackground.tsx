import { useEffect, useRef } from 'react';

// Particle system rendered on Canvas for GPU-accelerated performance
export function ChipBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particleCount = 60;
    const colors = ['#0ff', '#4ecdc4', '#2474a6'];
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      size: 1.5 + Math.random() * 2.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 0.25 + Math.random() * 0.4,
    }));

    // Draw connections between nearby particles (skipped — not visible enough to justify cost)

    let lastTime = performance.now();

    const animate = (time: number) => {
      const dt = Math.min((time - lastTime) / 16, 3);
      lastTime = time;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        if (p.x < 0) { p.x = 0; p.vx = Math.abs(p.vx); }
        if (p.x > canvas.width) { p.x = canvas.width; p.vx = -Math.abs(p.vx); }
        if (p.y < 0) { p.y = 0; p.vy = Math.abs(p.vy); }
        if (p.y > canvas.height) { p.y = canvas.height; p.vy = -Math.abs(p.vy); }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      requestAnimationFrame(animate);
    };

    const frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
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
        zIndex: 2,
        pointerEvents: 'none',
        background: '#050810',
        transform: 'translateZ(0)', // GPU compositor layer
      }}
    >
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
        }}
      />

      {/* Grain texture overlay — static, no perf cost after first paint */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.06'/%3E%3C/svg%3E")`,
          opacity: 0.5,
          zIndex: 2,
        }}
      />

      {/* Circuit traces — simpler, no expensive glow filter */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 3,
        }}
      >
        <g opacity="0.7">
          {/* Top */}
          <path d="M50% 35% L50% 28% L30% 28% L30% 5%" stroke="#0ff" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.8" />
          <path d="M50% 35% L50% 28% L40% 28% L40% 5%" stroke="#4ecdc4" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />
          <path d="M50% 35% L50% 28% L60% 28% L60% 5%" stroke="#4ecdc4" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />
          <path d="M50% 35% L50% 28% L70% 28% L70% 5%" stroke="#0ff" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.8" />

          {/* Bottom */}
          <path d="M50% 65% L50% 72% L30% 72% L30% 95%" stroke="#0ff" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.8" />
          <path d="M50% 65% L50% 72% L40% 72% L40% 95%" stroke="#4ecdc4" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />
          <path d="M50% 65% L50% 72% L60% 72% L60% 95%" stroke="#4ecdc4" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />
          <path d="M50% 65% L50% 72% L70% 72% L70% 95%" stroke="#0ff" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.8" />

          {/* Left */}
          <path d="M35% 50% L28% 50% L28% 38% L10% 38% L10% 25%" stroke="#0ff" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.8" />
          <path d="M35% 50% L28% 50% L28% 44% L10% 44% L10% 38%" stroke="#4ecdc4" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />
          <path d="M35% 50% L28% 50% L28% 56% L10% 56% L10% 62%" stroke="#4ecdc4" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />
          <path d="M35% 50% L28% 50% L28% 62% L10% 62% L10% 75%" stroke="#0ff" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.8" />

          {/* Right */}
          <path d="M65% 50% L72% 50% L72% 38% L90% 38% L90% 25%" stroke="#0ff" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.8" />
          <path d="M65% 50% L72% 50% L72% 44% L90% 44% L90% 38%" stroke="#4ecdc4" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />
          <path d="M65% 50% L72% 50% L72% 56% L90% 56% L90% 62%" stroke="#4ecdc4" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />
          <path d="M65% 50% L72% 50% L72% 62% L90% 62% L90% 75%" stroke="#0ff" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.8" />

          {/* Diagonals */}
          <path d="M50% 50% L42% 42% L30% 42% L22% 30%" stroke="#4ecdc4" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />
          <path d="M50% 50% L58% 42% L70% 42% L78% 30%" stroke="#0ff" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />
          <path d="M50% 50% L42% 58% L30% 58% L22% 70%" stroke="#0ff" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />
          <path d="M50% 50% L58% 58% L70% 58% L78% 70%" stroke="#4ecdc4" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />
        </g>
      </svg>

      {/* Center chip module — consolidated shadows */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotateX(18deg) rotateY(-22deg) translateZ(0)',
          transformStyle: 'preserve-3d',
          zIndex: 5,
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '360px',
            height: '360px',
            borderRadius: '75px',
            background: 'linear-gradient(135deg, #0f1820 0%, #05080d 50%, #030508 100%)',
            border: '2px solid rgba(78, 205, 196, 0.4)',
            boxShadow: '0 0 30px rgba(0, 255, 255, 0.25), inset 0 0 20px rgba(0, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Lightning logo */}
          <svg
            style={{
              width: '170px',
              height: '170px',
              filter: 'drop-shadow(0 0 6px rgba(0, 255, 255, 0.5))',
            }}
            viewBox="0 0 200 200"
          >
            <defs>
              <linearGradient id="lightningGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="50%" stopColor="#0ff" />
                <stop offset="100%" stopColor="#4ecdc4" />
              </linearGradient>
            </defs>
            <path
              d="M100 30 L65 98 L92 98 L83 170 L145 103 L117 103 L128 30 Z"
              fill="url(#lightningGrad)"
              opacity="0.95"
            />
            <path
              d="M100 30 L78 70 L102 70 L96 115 L122 85 L110 85 L118 50 Z"
              fill="white"
              opacity="0.45"
            />
          </svg>
        </div>
      </div>

      {/* Vignette overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(5, 8, 16, 0.3) 50%, rgba(5, 8, 16, 0.9) 100%)',
          pointerEvents: 'none',
          zIndex: 8,
        }}
      />
    </div>
  );
}
