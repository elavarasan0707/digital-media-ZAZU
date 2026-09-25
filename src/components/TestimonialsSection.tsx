import React, { useState } from 'react';
import { testimonialsData as defaultTestimonials } from '../data/agencyData';
import { TestimonialItem } from '../types';
import { Quote, Star, Edit3, Check, Plus, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface TestimonialsSectionProps {
  reviewsList?: TestimonialItem[];
  onOpenDashboard?: (tab: string) => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  reviewsList,
  onOpenDashboard
}) => {
  const { isAdmin } = useAuth();
  const activeReviews = reviewsList && reviewsList.length > 0 ? reviewsList : defaultTestimonials;

  return (
    <section id="reviews" className="py-24 bg-[#080808] relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-5">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-[11px] font-mono-data tracking-widest uppercase text-[#FFD966] mb-2">
              <Star className="w-3.5 h-3.5 fill-[#F5C542] text-[#F5C542]" />
              <span>CLIENT REVIEWS</span>
              <span aria-hidden="true">/</span>
              <span>VERIFIED PARTNER EXPERIENCES</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-display font-bold tracking-tight text-white">
              WHAT BRANDS & LEADERS <span className="gold-gradient-text">SAY ABOUT ZAZU</span>
            </h2>

            <p className="mt-2.5 text-[#A0A0A0] text-xs sm:text-sm leading-relaxed">
              We cultivate close, high-accountability partnerships with our clients. Review genuine client reviews and testimonials reflecting our strategic dedication and commercial outcomes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <button
                onClick={() => onOpenDashboard?.('reviews')}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#F5C542] text-[#080808] hover:bg-[#FFD966] transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add / Manage Reviews</span>
              </button>
            )}
            <div className="text-[11px] font-mono-data text-[#888888] bg-[#111111] px-3 py-2 rounded-lg border border-white/5">
              {activeReviews.length} Verified Reviews • 5.0 Rating
            </div>
          </div>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeReviews.map((item) => (
            <div
              key={item.id}
              className="relative rounded-2xl bg-[#111111] border border-[#222222] hover:border-[#F5C542]/40 transition-all duration-300 p-6 flex flex-col justify-between group shadow-xl"
            >
              {/* Quote Mark Watermark */}
              <div className="absolute top-4 right-4 text-white/5 group-hover:text-[#F5C542]/10 transition-colors pointer-events-none">
                <Quote className="w-12 h-12 rotate-180" />
              </div>

              <div>
                {/* Star Rating & Result Tag */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-[#F5C542]">
                    {[...Array(item.stars || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#F5C542]" />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono-data px-2 py-0.5 rounded bg-white/5 text-[#FFD966] border border-white/10">
                    {item.highlight}
                  </span>
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-[#CCCCCC] leading-relaxed italic mb-6">
                  “{item.testimonial}”
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F5C542] to-[#B38F26] p-0.5 shadow-md">
                    <div className="w-full h-full bg-[#0E0E0E] rounded-full flex items-center justify-center font-display font-bold text-xs text-[#FFD966]">
                      {item.avatarInitials}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight">
                      {item.clientName}
                    </h4>
                    <p className="text-[10px] text-[#A0A0A0]">
                      {item.role}, <span className="text-[#CCCCCC]">{item.businessName}</span>
                    </p>
                  </div>
                </div>

                {isAdmin && (
                  <button
                    onClick={() => onOpenDashboard?.('reviews')}
                    className="text-[10px] font-mono text-[#A0A0A0] hover:text-[#F5C542]"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export const ReviewsSection = TestimonialsSection;
