import { useEffect, useState } from 'react';

// 共享的鼠标位置状态，避免多个监听器
let sharedMousePos = { x: 0, y: 0 };
let animationFrameId: number | null = null;
let listeners: Set<(pos: { x: number; y: number }) => void> = new Set();

function updateSharedMouse(e: MouseEvent) {
  sharedMousePos.x = (e.clientX / window.innerWidth - 0.5) * 2;
  sharedMousePos.y = (e.clientY / window.innerHeight - 0.5) * 2;
}

function startAnimationLoop() {
  if (animationFrameId) return;

  let currentPos = { x: 0, y: 0 };

  const animate = () => {
    currentPos.x += (sharedMousePos.x - currentPos.x) * 0.05;
    currentPos.y += (sharedMousePos.y - currentPos.y) * 0.05;

    listeners.forEach(listener => listener({ ...currentPos }));

    animationFrameId = requestAnimationFrame(animate);
  };

  document.addEventListener('mousemove', updateSharedMouse);
  animationFrameId = requestAnimationFrame(animate);
}

function stopAnimationLoop() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  document.removeEventListener('mousemove', updateSharedMouse);
  listeners.clear();
}

export function useParallax(factor: number = 20) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const listener = (pos: { x: number; y: number }) => {
      setPosition({
        x: pos.x * factor,
        y: pos.y * factor
      });
    };

    listeners.add(listener);

    if (listeners.size === 1) {
      startAnimationLoop();
    }

    return () => {
      listeners.delete(listener);
      if (listeners.size === 0) {
        stopAnimationLoop();
      }
    };
  }, [factor]);

  return position;
}
