import React, { useState } from 'react';
import { processSteps } from '../data/agencyData';
import { CheckCircle2, ChevronRight, Zap } from 'lucide-react';

export const ProcessSection: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  return (
    <section id="process" className="py-24 bg-[#0A0A0A] relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-[#F5C542]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 text-[11px] font-mono-data tracking-widest uppercase text-[#FFD966] mb-2">
            <span>METHODOLOGY</span>
            <span aria-hidden="true">/</span>
            <span>6-STEP GROWTH SPRINT</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-display font-bold tracking-tight text-white">
            THE 6-STEP <span className="gold-gradient-text">EXECUTION TIMELINE</span>
          </h2>

          <p className="mt-2.5 text-[#A0A0A0] text-xs sm:text-sm leading-relaxed">
            From deep diagnostic research to aggressive multi-channel scale, our systematic roadmap eliminates guesswork and guarantees sustained momentum.
          </p>
        </div>

        {/* Step Selector Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {processSteps.map((step, idx) => {
            const isActive = activeStepIndex === idx;

            return (
              <button
                key={step.number}
                onClick={() => setActiveStepIndex(idx)}
                className={`text-left p-4 rounded-xl border transition-all duration-200 focus:outline-none ${
                  isActive
                    ? 'bg-[#151515] border-[#F5C542] shadow-[0_0_20px_rgba(245,197,66,0.2)]'
                    : 'bg-[#111111] border-[#222222] hover:border-white/20 text-[#A0A0A0]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-xs font-mono-data font-bold ${
                      isActive ? 'text-[#FFD966]' : 'text-[#666666]'
                    }`}
                  >
                    STEP {step.number}
                  </span>
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#F5C542] animate-ping" />}
                </div>

                <div className={`text-sm font-display font-bold ${isActive ? 'text-white' : 'text-[#D4D4D4]'}`}>
                  {step.name}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Step Feature Breakdown */}
        {(() => {
          const currentStep = processSteps[activeStepIndex];
          return (
            <div className="p-8 sm:p-10 rounded-2xl bg-[#111111] border border-[#222222] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#F5C542]/5 rounded-bl-full pointer-events-none" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl sm:text-4xl font-mono-data font-extrabold text-[#F5C542]">
                      {currentStep.number}
                    </span>
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
                        {currentStep.name}
                      </h3>
                      <p className="text-xs sm:text-sm font-mono-data text-[#FFD966]">
                        {currentStep.tagline}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-[#A0A0A0] leading-relaxed pt-2">
                    {currentStep.description}
                  </p>

                  <div className="pt-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-white block mb-3">
                      Key Deliverables for this Phase:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {currentStep.deliverables.map((del, dIdx) => (
                        <div
                          key={dIdx}
                          className="p-3 rounded-lg bg-black/50 border border-white/5 flex items-center gap-2 text-xs text-[#E5E5E5]"
                        >
                          <CheckCircle2 className="w-4 h-4 text-[#F5C542] shrink-0" />
                          <span>{del}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 flex flex-col justify-center items-center p-6 rounded-xl bg-black/40 border border-white/10 text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#F5C542]/10 border border-[#F5C542]/30 flex items-center justify-center text-[#F5C542]">
                    <Zap className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-xs text-[#A0A0A0] block">Average Phase Velocity</span>
                    <span className="text-lg font-mono-data font-bold text-white">Sprint 1–2 Weeks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveStepIndex((prev) => (prev > 0 ? prev - 1 : processSteps.length - 1))}
                      className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-xs text-[#D4D4D4] transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setActiveStepIndex((prev) => (prev < processSteps.length - 1 ? prev + 1 : 0))}
                      className="px-3 py-1.5 rounded bg-[#F5C542] hover:bg-[#FFD966] text-xs font-bold text-[#080808] transition-colors flex items-center gap-1"
                    >
                      <span>Next Step</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          );
        })()}

      </div>
    </section>
  );
};
