import React from 'react';
import { Hero3DCanvas } from './Hero3DCanvas';
import { ArrowUpRight, TrendingUp, ShieldCheck, Zap, Activity } from 'lucide-react';

interface HeroProps {
  onBookConsultation: () => void;
  onExploreServices: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onBookConsultation, onExploreServices }) => {
  return (
    <section id="hero" className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 overflow-hidden bg-[#080808]">
      {/* Interactive 3D Canvas Background */}
      <Hero3DCanvas />

      {/* Subtle Radial Glow Mask */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(245,197,66,0.12),transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#080808] to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Hero Copy (Left 7 cols on desktop) */}
          <div className="lg:col-span-7 text-left space-y-6">
            
            {/* Agency Trust Kicker */}
            <div className="inline-flex items-center gap-2 text-[11px] font-mono-data tracking-wider uppercase font-semibold text-[#A0A0A0]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F5C542] animate-pulse" />
              <span className="text-[#FFD966]">PREMIUM DIGITAL MARKETING AGENCY</span>
              <span aria-hidden="true" className="text-[#444444]">/</span>
              <span>2026 REVENUE ARCHITECTURE</span>
            </div>

            {/* Headline (Refined middle size for neat elegance) */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-display font-bold tracking-tight leading-[1.2] text-white">
              WE DON’T JUST CREATE CONTENT.{' '}
              <span className="block mt-1.5 gold-gradient-text drop-shadow-[0_0_25px_rgba(245,197,66,0.3)]">
                WE CREATE BUSINESS IMPACT.
              </span>
            </h1>

            {/* Subheadline with text-balance */}
            <p className="text-xs sm:text-sm md:text-base text-[#A0A0A0] max-w-xl font-normal leading-relaxed text-balance">
              Helping businesses build powerful digital brands, reach the right audience, generate quality leads, and grow online.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <button
                onClick={onBookConsultation}
                className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-[#F5C542] via-[#FFD966] to-[#F5C542] text-[#080808] shadow-[0_0_20px_rgba(245,197,66,0.3)] hover:shadow-[0_0_25px_rgba(245,197,66,0.45)] transition-all duration-300 hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD966]"
              >
                <span>BOOK A FREE CONSULTATION</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              <button
                onClick={onExploreServices}
                className="inline-flex items-center justify-center px-5 py-3 rounded-xl font-semibold text-xs border border-[#333333] hover:border-[#F5C542]/60 text-white hover:text-[#FFD966] bg-[#111111]/80 hover:bg-[#151515] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C542]"
              >
                EXPLORE OUR SERVICES
              </button>
            </div>

            {/* 4 Pillars Strip */}
            <div className="pt-4 border-t border-white/10">
              <div className="flex flex-wrap items-center gap-y-1.5 text-xs font-semibold tracking-wider text-[#A0A0A0]">
                <span className="text-white hover:text-[#F5C542] transition-colors">STRATEGY</span>
                <span className="mx-2.5 text-[#F5C542]" aria-hidden="true">•</span>
                <span className="text-white hover:text-[#F5C542] transition-colors">CREATIVITY</span>
                <span className="mx-2.5 text-[#F5C542]" aria-hidden="true">•</span>
                <span className="text-white hover:text-[#F5C542] transition-colors">TECHNOLOGY</span>
                <span className="mx-2.5 text-[#F5C542]" aria-hidden="true">•</span>
                <span className="text-[#FFD966] hover:text-white transition-colors">RESULTS</span>
              </div>
            </div>
          </div>

          {/* Futuristic Visual & Floating Digital Cards (Right 5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Glassmorphic Central Visual Container */}
              <div className="relative rounded-2xl p-6 bg-[#111111]/80 border border-[#222222] shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl overflow-hidden group hover:border-[#F5C542]/40 transition-colors duration-300">
                
                {/* Ambient Top Glow */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#F5C542]/10 rounded-full blur-3xl pointer-events-none" />

                {/* Card Header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-[#F5C542] shadow-[0_0_10px_#F5C542]" />
                    <span className="text-xs font-mono-data uppercase tracking-wider text-[#A0A0A0]">
                      LIVE GROWTH MATRIX
                    </span>
                  </div>
                  <span className="text-[11px] font-mono-data text-[#FFD966] px-2 py-0.5 rounded bg-[#F5C542]/10 border border-[#F5C542]/20">
                    SAMPLE PREVIEW
                  </span>
                </div>

                {/* Growth Graph Vector Display */}
                <div className="py-5">
                  <div className="flex items-baseline justify-between mb-2">
                    <div>
                      <span className="text-xs text-[#A0A0A0]">Attributable Pipeline Acceleration</span>
                      <div className="text-2xl font-mono-data font-bold text-white flex items-center gap-2">
                        <span>+164.2%</span>
                        <span className="text-xs font-normal text-[#F5C542] flex items-center">
                          <TrendingUp className="w-3.5 h-3.5 inline mr-1" />
                          90-Day Trajectory
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-[#A0A0A0] block">Average ROAS</span>
                      <span className="text-lg font-mono-data font-bold text-[#FFD966]">4.8x</span>
                    </div>
                  </div>

                  {/* SVG Chart Line with Golden Glow */}
                  <div className="h-32 w-full pt-2">
                    <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="heroChartFill" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#F5C542" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#F5C542" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      {/* Grid Lines */}
                      <line x1="0" y1="25" x2="300" y2="25" stroke="#222" strokeDasharray="3 3" />
                      <line x1="0" y1="50" x2="300" y2="50" stroke="#222" strokeDasharray="3 3" />
                      <line x1="0" y1="75" x2="300" y2="75" stroke="#222" strokeDasharray="3 3" />

                      {/* Area Fill */}
                      <path
                        d="M0 85 Q 50 78, 100 62 T 200 38 T 300 12 L 300 100 L 0 100 Z"
                        fill="url(#heroChartFill)"
                      />

                      {/* Line */}
                      <path
                        d="M0 85 Q 50 78, 100 62 T 200 38 T 300 12"
                        fill="none"
                        stroke="#F5C542"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />

                      {/* Hotspots */}
                      <circle cx="100" cy="62" r="4" fill="#F5C542" />
                      <circle cx="200" cy="38" r="4" fill="#F5C542" />
                      <circle cx="300" cy="12" r="5" fill="#FFFFFF" stroke="#F5C542" strokeWidth="2.5" />
                    </svg>
                  </div>
                </div>

                {/* Sub Metrics Row */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/5 text-center">
                  <div className="p-2 rounded bg-black/40 border border-white/5">
                    <span className="text-[10px] text-[#A0A0A0] block">Meta & Google</span>
                    <span className="text-xs font-mono-data font-bold text-white">Full-Funnel</span>
                  </div>
                  <div className="p-2 rounded bg-black/40 border border-white/5">
                    <span className="text-[10px] text-[#A0A0A0] block">Target CPA</span>
                    <span className="text-xs font-mono-data font-bold text-[#FFD966]">-38%</span>
                  </div>
                  <div className="p-2 rounded bg-black/40 border border-white/5">
                    <span className="text-[10px] text-[#A0A0A0] block">Client Focus</span>
                    <span className="text-xs font-mono-data font-bold text-white">100%</span>
                  </div>
                </div>
              </div>

              {/* Floating Badge 1 (Top Left) */}
              <div className="hidden sm:flex items-center gap-3 absolute -top-5 -left-6 bg-[#161616]/95 border border-[#F5C542]/30 px-4 py-2.5 rounded-xl shadow-xl backdrop-blur-md animate-bounce duration-1000">
                <div className="p-2 rounded-lg bg-[#F5C542]/10 text-[#F5C542]">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-white block">Strategy First</span>
                  <span className="text-[10px] text-[#A0A0A0]">Zero AI Template Slop</span>
                </div>
              </div>

              {/* Floating Badge 2 (Bottom Right) */}
              <div className="hidden sm:flex items-center gap-3 absolute -bottom-6 -right-6 bg-[#161616]/95 border border-[#F5C542]/30 px-4 py-2.5 rounded-xl shadow-xl backdrop-blur-md">
                <div className="p-2 rounded-lg bg-[#F5C542]/10 text-[#FFD966]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-white block">Audience Targeting</span>
                  <span className="text-[10px] text-[#A0A0A0]">High-Intent Acquisition</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
