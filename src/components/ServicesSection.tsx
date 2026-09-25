import React, { useState } from 'react';
import { servicesData } from '../data/agencyData';
import { ServiceItem } from '../types';
import {
  Compass,
  Share2,
  Search,
  Target,
  Flame,
  BookOpen,
  Sparkles,
  Crown,
  PenTool,
  Video,
  Users,
  Layout,
  Radio,
  Layers,
  ArrowUpRight,
  CheckCircle2,
  X
} from 'lucide-react';

interface ServicesSectionProps {
  onSelectServiceForInquiry: (serviceTitle: string) => void;
  servicesList?: ServiceItem[];
}

// Icon mapping dictionary
const iconMap: Record<string, React.ElementType> = {
  Compass,
  Share2,
  Search,
  Target,
  Flame,
  BookOpen,
  Sparkles,
  Crown,
  PenTool,
  Video,
  Users,
  Layout,
  Radio,
  Layers
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectServiceForInquiry,
  servicesList
}) => {
  const [activeModalService, setActiveModalService] = useState<ServiceItem | null>(null);

  const activeServices = servicesList && servicesList.length > 0 ? servicesList : servicesData;

  return (
    <section id="services" className="py-24 bg-[#0A0A0A] relative">
      {/* Background Accent */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#F5C542]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-5">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-[11px] font-mono-data tracking-widest uppercase text-[#FFD966] mb-2">
              <span>SPECIALIZED CAPABILITIES</span>
              <span aria-hidden="true">/</span>
              <span>{activeServices.length} INTEGRATED DISCIPLINES</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-display font-bold tracking-tight text-white">
              END-TO-END DIGITAL <span className="gold-gradient-text">GROWTH ENGINES</span>
            </h2>

            <p className="mt-2.5 text-[#A0A0A0] text-xs sm:text-sm leading-relaxed">
              Every capability is engineered to work in synergy, turning casual impressions into qualified leads and verifiable enterprise revenue.
            </p>
          </div>

          <div className="shrink-0 text-[11px] font-mono-data text-[#A0A0A0] bg-[#111111] px-3.5 py-1.5 rounded-lg border border-white/5 inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F5C542]" />
            <span>Select any card to view deliverables or request scope</span>
          </div>
        </div>

        {/* 14 Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {activeServices.map((service) => {
            const IconComponent = iconMap[service.iconName] || Compass;

            return (
              <div
                key={service.id}
                onClick={() => setActiveModalService(service)}
                className="group relative rounded-2xl overflow-hidden bg-[#111111] border border-[#222222] hover:border-[#F5C542]/60 hover:bg-[#141414] transition-all duration-300 hover:-translate-y-1 cursor-pointer shadow-lg hover:shadow-[0_0_25px_rgba(245,197,66,0.15)] flex flex-col justify-between"
              >
                {/* Glow corner indicator */}
                <div className="absolute top-0 right-0 w-14 h-14 bg-gradient-to-bl from-[#F5C542]/10 to-transparent rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none" />

                <div>
                  {/* Card Media Preview (Image Header) */}
                  {service.image ? (
                    <div className="relative aspect-[16/10] overflow-hidden bg-black/60 border-b border-white/5">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLElement;
                          target.style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/30 to-transparent" />
                      <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#080808]/85 backdrop-blur-md border border-white/10 flex items-center justify-center text-[#F5C542] group-hover:bg-[#F5C542] group-hover:text-[#080808] transition-colors duration-200">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-mono-data px-2 py-0.5 rounded-md bg-[#080808]/85 backdrop-blur-md text-[#FFD966] border border-white/10 font-bold">
                          {service.number}
                        </span>
                      </div>
                    </div>
                  ) : (
                    /* Fallback Top Bar: Icon and Number */
                    <div className="p-5 pb-0 flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-lg bg-[#1A1A1A] border border-white/10 flex items-center justify-center text-[#F5C542] group-hover:bg-[#F5C542] group-hover:text-[#080808] transition-colors duration-200">
                        <IconComponent className="w-4.5 h-4.5" />
                      </div>

                      <span className="text-[11px] font-mono-data font-bold text-[#A0A0A0] group-hover:text-[#FFD966] transition-colors">
                        {service.number}
                      </span>
                    </div>
                  )}

                  <div className="p-5 pt-4">
                    {/* Title */}
                    <h3 className="text-base font-display font-bold text-white mb-2 group-hover:text-[#FFD966] transition-colors">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-[#A0A0A0] leading-relaxed line-clamp-3">
                      {service.shortDescription}
                    </p>
                  </div>
                </div>

                {/* Bottom Action Affordance */}
                <div className="mx-5 mb-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-medium text-[#A0A0A0] group-hover:text-white transition-colors">
                  <span className="text-[11px] font-semibold text-[#FFD966] group-hover:underline">
                    View Deliverables
                  </span>
                  <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#F5C542] group-hover:text-[#080808] transition-colors">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Service Deliverables Detail Modal */}
      {activeModalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#111111] border border-[#F5C542]/40 p-6 sm:p-8 shadow-2xl space-y-6">
            
            {/* Close Button */}
            <button
              onClick={() => setActiveModalService(null)}
              className="absolute top-5 right-5 p-2 rounded-lg text-[#A0A0A0] hover:text-white hover:bg-white/10 transition-colors z-10"
              aria-label="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image Header (if present) */}
            {activeModalService.image && (
              <div className="relative aspect-[21/9] rounded-xl overflow-hidden border border-white/10 bg-black/60 -mt-2">
                <img
                  src={activeModalService.image}
                  alt={activeModalService.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent opacity-80" />
              </div>
            )}

            {/* Modal Header */}
            <div>
              <div className="flex items-center gap-2 text-xs font-mono-data text-[#FFD966] mb-1">
                <span>SERVICE SCOPE</span>
                <span>•</span>
                <span>DISCIPLINE {activeModalService.number}</span>
              </div>
              <h3 className="text-2xl font-display font-bold text-white">
                {activeModalService.title}
              </h3>
              <p className="text-sm text-[#A0A0A0] mt-2">
                {activeModalService.shortDescription}
              </p>
            </div>

            {/* Deliverables List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                What We Deliver:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activeModalService.deliverables.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-black/40 border border-white/5 flex items-center gap-2.5 text-xs text-[#E5E5E5]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#F5C542] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Outcome Target */}
            <div className="p-3.5 rounded-lg bg-[#F5C542]/10 border border-[#F5C542]/20">
              <span className="text-[11px] text-[#A0A0A0] block font-mono-data uppercase">Primary Objective</span>
              <span className="text-xs font-semibold text-[#FFD966]">
                {activeModalService.metricsSample}
              </span>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => {
                  const title = activeModalService.title;
                  setActiveModalService(null);
                  onSelectServiceForInquiry(title);
                }}
                className="w-full sm:flex-1 py-3 px-5 rounded-xl font-bold text-xs bg-gradient-to-r from-[#F5C542] to-[#FFD966] text-[#080808] flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(245,197,66,0.3)] transition-all"
              >
                <span>REQUEST THIS SERVICE</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveModalService(null)}
                className="w-full sm:w-auto py-3 px-5 rounded-xl font-semibold text-xs border border-white/10 text-[#A0A0A0] hover:text-white hover:bg-white/5 transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
