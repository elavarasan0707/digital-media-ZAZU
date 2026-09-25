import React from 'react';
import { whyChooseData } from '../data/agencyData';
import { ShieldCheck, Cpu, BarChart3, MessageSquare, Zap } from 'lucide-react';

const icons = [Cpu, Zap, BarChart3, MessageSquare, ShieldCheck];

export const WhyChooseUs: React.FC = () => {
  return (
    <section id="why-us" className="py-24 bg-[#080808] relative overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-[#F5C542]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 text-[11px] font-mono-data tracking-widest uppercase text-[#FFD966] mb-2">
            <span>THE STRATEGIC DIFFERENCE</span>
            <span aria-hidden="true">/</span>
            <span>WHY CLIENTS PARTNER WITH US</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-display font-bold tracking-tight text-white">
            WHY CHOOSE <span className="gold-gradient-text">ZAZU DIGITAL MEDIA</span>
          </h2>

          <p className="mt-2.5 text-[#A0A0A0] text-xs sm:text-sm leading-relaxed">
            In an industry flooded with vanity impressions and generic templates, we operate with surgical rigor, uncompromised creative quality, and bottom-line commercial accountability.
          </p>
        </div>

        {/* 5 Points with Connecting Line Visual */}
        <div className="relative">
          
          {/* Animated Golden Spine Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 -translate-y-1/2 h-[2px] bg-gradient-to-r from-transparent via-[#F5C542]/40 to-transparent z-0">
            <div className="w-20 h-full bg-[#FFD966] blur-[2px] animate-pulse" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 relative z-10">
            {whyChooseData.map((item, idx) => {
              const Icon = icons[idx] || Cpu;

              return (
                <div
                  key={item.number}
                  className="group relative rounded-xl p-5 bg-[#111111] border border-[#222222] hover:border-[#F5C542]/50 hover:bg-[#141414] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between shadow-xl"
                >
                  {/* Step Node Marker */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-mono-data font-bold text-[#FFD966] drop-shadow-[0_0_12px_rgba(245,197,66,0.3)]">
                      {item.number}
                    </span>
                    <div className="w-9 h-9 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center text-[#F5C542] group-hover:bg-[#F5C542] group-hover:text-[#080808] transition-colors duration-200">
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm sm:text-base font-display font-bold text-white mb-2 group-hover:text-[#FFD966] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#A0A0A0] leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Bottom Connection Pip */}
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#F5C542]/40 group-hover:bg-[#F5C542] group-hover:scale-125 transition-all" />
                    <span className="text-[10px] font-mono-data uppercase tracking-wider text-[#A0A0A0] group-hover:text-white transition-colors">
                      Pillar {idx + 1} of 5
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
