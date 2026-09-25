import React from 'react';
import zazuOfficialLogo from '../assets/images/zazu_official_logo_1790257041428.jpg';

interface ZazuLogoProps {
  variant?: 'official' | 'gold' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
  linkToHome?: boolean;
  useImage?: boolean;
}

export const ZazuLogo: React.FC<ZazuLogoProps> = ({
  variant = 'official',
  size = 'md',
  showSubtitle = true,
  className = '',
  linkToHome = true,
  useImage = false
}) => {
  // Balanced middle-sized dimensions
  const dimensions = {
    sm: { height: 28, iconSize: 26, textClass: 'text-base', subClass: 'text-[9px] tracking-[0.25em]' },
    md: { height: 36, iconSize: 34, textClass: 'text-lg', subClass: 'text-[10px] tracking-[0.28em]' },
    lg: { height: 46, iconSize: 44, textClass: 'text-xl', subClass: 'text-[11px] tracking-[0.3em]' },
    xl: { height: 60, iconSize: 58, textClass: 'text-2xl', subClass: 'text-xs tracking-[0.32em]' }
  }[size];

  // Palette matching the website's brand colors:
  // "Za" is Gold (#F5C542), "Zu" is Pure White (#FFFFFF), "DIGITAL" is Muted Gray/Silver (#A0A0A0), "MEDIA" is Light Gold (#FFD966)
  const isLight = variant === 'light';

  const zaColor = '#F5C542'; // Signature Brand Gold
  const zuColor = isLight ? '#111111' : '#FFFFFF'; // Pure White on dark bg
  const digitalColor = isLight ? '#555555' : '#A0A0A0'; // Muted Gray
  const mediaColor = isLight ? '#D97706' : '#FFD966'; // Light Gold

  const content = (
    <div className={`inline-flex items-center gap-2.5 select-none group transition-transform duration-200 ${className}`}>
      
      {/* 3D Owl Mask Emblem */}
      <div className="relative shrink-0 flex items-center justify-center">
        {useImage ? (
          <img
            src={zazuOfficialLogo}
            alt="ZaZu Digital Media Emblem"
            className="rounded-lg object-contain"
            style={{ width: dimensions.iconSize, height: dimensions.iconSize }}
          />
        ) : (
          <svg
            width={dimensions.iconSize}
            height={dimensions.iconSize}
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transition-transform duration-300 group-hover:scale-105 filter drop-shadow-[0_2px_10px_rgba(245,197,66,0.3)]"
            aria-label="ZaZu Owl Logo"
          >
            <defs>
              {/* Metallic 3D gradient for owl mask */}
              <linearGradient id="owlMaskGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3A3D40" />
                <stop offset="45%" stopColor="#202224" />
                <stop offset="100%" stopColor="#121314" />
              </linearGradient>

              {/* Edge highlight gradient in Gold */}
              <linearGradient id="owlEdgeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFD966" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#F5C542" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#8A6B1A" stopOpacity="0.2" />
              </linearGradient>

              {/* Eye pupil gradient */}
              <radialGradient id="owlEyeGrad" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#2A2415" />
                <stop offset="70%" stopColor="#0E0D08" />
                <stop offset="100%" stopColor="#000000" />
              </radialGradient>
            </defs>

            {/* Ambient subtle warm gold glow ring */}
            <circle cx="60" cy="60" r="54" fill="rgba(245,197,66,0.08)" />

            {/* Main Outer Owl Mask Geometry */}
            <path
              d="M 60 28 
                 C 50 20, 36 18, 30 14 
                 C 26 22, 28 32, 28 38 
                 C 20 42, 14 50, 14 62 
                 C 14 74, 22 84, 34 88 
                 C 26 84, 22 76, 22 66 
                 C 22 54, 30 46, 40 44
                 C 34 50, 32 58, 34 68 
                 C 36 78, 44 86, 54 88 
                 L 60 98 
                 L 66 88 
                 C 76 86, 84 78, 86 68 
                 C 88 58, 86 50, 80 44 
                 C 90 46, 98 54, 98 66 
                 C 98 76, 94 84, 86 88 
                 C 98 84, 106 74, 106 62 
                 C 106 50, 100 42, 92 38 
                 C 92 32, 94 22, 90 14 
                 C 84 18, 70 20, 60 28 Z"
              fill="url(#owlMaskGrad)"
              stroke="url(#owlEdgeGrad)"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />

            {/* Left Eye Brow Arch & Outer Frame in Gold */}
            <path
              d="M 32 40 C 40 32, 54 36, 58 48 C 60 56, 58 66, 52 74 C 44 82, 34 80, 28 72 C 22 64, 24 50, 32 40 Z"
              fill="#181A1D"
              stroke="#F5C542"
              strokeWidth="1.8"
            />

            {/* Right Eye Brow Arch & Outer Frame in Gold */}
            <path
              d="M 88 40 C 80 32, 66 36, 62 48 C 60 56, 62 66, 68 74 C 76 82, 86 80, 92 72 C 98 64, 96 50, 88 40 Z"
              fill="#181A1D"
              stroke="#F5C542"
              strokeWidth="1.8"
            />

            {/* Left Eye Inner Iris / Pupil */}
            <circle cx="43" cy="58" r="11" fill="url(#owlEyeGrad)" stroke="#333" strokeWidth="1" />
            <circle cx="43" cy="58" r="7" fill="#000000" />
            {/* Left Eye Specular Reflection */}
            <circle cx="46" cy="54" r="3" fill="#FFFFFF" opacity="0.9" />
            <circle cx="41" cy="62" r="1.2" fill="#FFFFFF" opacity="0.6" />

            {/* Right Eye Inner Iris / Pupil */}
            <circle cx="77" cy="58" r="11" fill="url(#owlEyeGrad)" stroke="#333" strokeWidth="1" />
            <circle cx="77" cy="58" r="7" fill="#000000" />
            {/* Right Eye Specular Reflection */}
            <circle cx="80" cy="54" r="3" fill="#FFFFFF" opacity="0.9" />
            <circle cx="75" cy="62" r="1.2" fill="#FFFFFF" opacity="0.6" />

            {/* Center Beak Detail in Gold */}
            <polygon points="56,76 64,76 60,88" fill="#F5C542" />
          </svg>
        )}
      </div>

      {/* Brand Typography Lockup in Website Colors */}
      <div className="flex flex-col justify-center">
        {/* "ZaZu" with Gold "Za" and White "Zu" */}
        <div className={`font-display font-bold tracking-tight leading-none ${dimensions.textClass}`}>
          <span style={{ color: zaColor }} className="drop-shadow-[0_1px_8px_rgba(245,197,66,0.35)]">
            Za
          </span>
          <span style={{ color: zuColor }}>
            Zu
          </span>
        </div>

        {/* "DIGITAL MEDIA" with Silver DIGITAL and Light Gold MEDIA */}
        {showSubtitle && (
          <div className={`font-semibold uppercase tracking-[0.24em] mt-0.5 flex items-center gap-1 ${dimensions.subClass}`}>
            <span style={{ color: digitalColor }}>DIGITAL</span>
            <span style={{ color: mediaColor }} className="font-bold">MEDIA</span>
          </div>
        )}
      </div>

    </div>
  );

  if (linkToHome) {
    return (
      <a href="#hero" className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C542]">
        {content}
      </a>
    );
  }

  return content;
};
