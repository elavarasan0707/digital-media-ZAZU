import React, { useEffect, useState, useRef } from 'react';
import bgLandscape from '../assets/images/clean_3d_marketing_desk_1790349414774.jpg';
import bgPortrait from '../assets/images/clean_3d_marketing_portrait_1790349431370.jpg';

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
      const xNorm = (e.clientX / innerWidth - 0.5) * 16;
      const yNorm = (e.clientY / innerHeight - 0.5) * 16;
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
      {/* 1. Main 3D Digital Marketing Wallpaper with Interactive Parallax */}
      <div
        className="w-full h-full absolute inset-0 transition-transform duration-300 ease-out will-change-transform"
        style={{
          transform: `translate3d(${mousePos.x * 0.4}px, ${scrollY * 0.06 + mousePos.y * 0.4}px, 0) scale(1.05)`
        }}
      >
        <picture className="w-full h-full block">
          <source media="(max-width: 768px)" srcSet={bgPortrait} />
          <img
            src={bgLandscape}
            alt="3D Digital Marketing Workspace"
            className="w-full h-full object-cover object-center"
            style={{
              filter: 'brightness(0.65) contrast(1.18) saturate(1.15)'
            }}
          />
        </picture>
      </div>

      {/* 2. Top Warm Edison Bulb Light Cone (Rich Amber Gold) */}
      <div 
        className="absolute -top-20 left-1/2 -translate-x-1/2 w-[750px] h-[550px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(251,191,36,0.22) 0%, rgba(245,158,11,0.08) 45%, transparent 75%)',
          filter: 'blur(35px)'
        }}
      />

      {/* 3. Center 3D Holographic Ambient Radiance */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(245,197,66,0.14) 0%, rgba(217,119,6,0.04) 50%, transparent 70%)',
          filter: 'blur(45px)'
        }}
      />

      {/* 4. Bottom Laptop Tech Glow (Deep Cyan / Electric Indigo Accent) */}
      <div
        className="absolute bottom-10 right-10 w-[550px] h-[450px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(14,165,233,0.12) 0%, rgba(59,130,246,0.05) 50%, transparent 75%)',
          filter: 'blur(50px)'
        }}
      />

      {/* 5. Sleek Dark Vignette Layer for pristine content readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/75 via-[#080808]/65 to-[#080808]/85 pointer-events-none" />

      {/* 6. Subtle Floating Golden Embers Particle Field */}
      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(245,197,66,0.9) 1.2px, transparent 1.2px)',
          backgroundSize: '100px 100px',
          transform: `translateY(${-scrollY * 0.03}px)`
        }}
      />
    </div>
  );
};
