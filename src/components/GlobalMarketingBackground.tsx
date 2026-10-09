import React, { useEffect, useState, useRef } from 'react';
import bgLandscape from '../assets/images/luxurious_gold_marketing_bg_1791524827226.jpg';

export const GlobalMarketingBackground: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const xNorm = (e.clientX / innerWidth - 0.5) * 10;
      const yNorm = (e.clientY / innerHeight - 0.5) * 10;
      setMousePos({ x: xNorm, y: yNorm });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#050505]"
    >
      {/* Full Luxurious Gold Digital Marketing Network Wallpaper */}
      <div
        className="w-full h-full absolute inset-0 transition-transform duration-300 ease-out will-change-transform"
        style={{
          transform: `translate3d(${mousePos.x * 0.25}px, ${ mousePos.y * 0.25}px, 0) scale(1.02)`
        }}
      >
        <img
          src={bgLandscape}
          alt="Luxurious Gold Digital Marketing Network"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center"
          style={{
            filter: 'brightness(0.82) contrast(1.12)'
          }}
        />
      </div>

      {/* Subtle dark overlay for crisp text legibility while keeping the full background clearly visible */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/45 via-[#080808]/35 to-[#080808]/55 pointer-events-none" />
    </div>
  );
};
