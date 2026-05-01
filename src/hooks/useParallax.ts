import { useEffect, useRef } from 'react';

// Single shared animation system
let mousePos = { x: 0, y: 0 };
let animFrameId: number | null = null;
let subscribers: Array<(pos: { x: number; y: number }) => void> = [];
let smoothPos = { x: 0, y: 0 };

function onMouseMove(e: MouseEvent) {
  mousePos.x = (e.clientX / window.innerWidth - 0.5) * 2;
  mousePos.y = (e.clientY / window.innerHeight - 0.5) * 2;
}

function animate() {
  smoothPos.x += (mousePos.x - smoothPos.x) * 0.08;
  smoothPos.y += (mousePos.y - smoothPos.y) * 0.08;

  for (let i = 0; i < subscribers.length; i++) {
    subscribers[i](smoothPos);
  }

  animFrameId = requestAnimationFrame(animate);
}

function startAnimation() {
  if (animFrameId) return;
  document.addEventListener('mousemove', onMouseMove, { passive: true });
  animFrameId = requestAnimationFrame(animate);
}

function stopAnimation() {
  if (animFrameId) {
    cancelAnimationFrame(animFrameId);
    animFrameId = null;
  }
  document.removeEventListener('mousemove', onMouseMove);
  subscribers = [];
}

// Hook for a single parallax element
export function useParallax(factor: number = 20) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = (pos: { x: number; y: number }) => {
      el.style.transform = `translate(${pos.x * factor}px, ${pos.y * factor}px)`;
    };

    subscribers.push(update);

    if (subscribers.length === 1) {
      startAnimation();
    }

    return () => {
      const idx = subscribers.indexOf(update);
      if (idx > -1) subscribers.splice(idx, 1);
      if (subscribers.length === 0) {
        stopAnimation();
      }
    };
  }, [factor]);

  return ref;
}

// Hook for multiple elements with different factors (more efficient)
export function useMultiParallax(factors: number[]) {
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const elements = refs.current.filter(el => el !== null) as HTMLElement[];
    if (elements.length === 0) return;

    const update = (pos: { x: number; y: number }) => {
      for (let i = 0; i < elements.length; i++) {
        const factor = factors[i] || 1;
        elements[i].style.transform = `translate(${pos.x * factor}px, ${pos.y * factor}px)`;
      }
    };

    subscribers.push(update);

    if (subscribers.length === 1) {
      startAnimation();
    }

    return () => {
      const idx = subscribers.indexOf(update);
      if (idx > -1) subscribers.splice(idx, 1);
      if (subscribers.length === 0) {
        stopAnimation();
      }
    };
  }, [factors]);

  return refs;
}
