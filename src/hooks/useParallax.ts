import { useEffect, useRef, useState } from 'react';

export function useParallax(factor: number = 20) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const requestRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });

  const animate = () => {
    currentRef.current.x += (mouseRef.current.x - currentRef.current.x) * 0.05;
    currentRef.current.y += (mouseRef.current.y - currentRef.current.y) * 0.05;
    setPosition({
      x: currentRef.current.x * factor,
      y: currentRef.current.y * factor
    });
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    document.addEventListener('mousemove', handleMouseMove);
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [factor]);

  return position;
}
