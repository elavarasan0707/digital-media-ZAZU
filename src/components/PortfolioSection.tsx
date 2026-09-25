import React, { useState } from 'react';
import { caseStudiesData } from '../data/agencyData';
import { CaseStudyItem } from '../types';
import { ArrowUpRight, CheckCircle, X, ExternalLink, Plus, Edit, FolderGit2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface PortfolioSectionProps {
  onRequestSimilarProject: (projectCategory: string) => void;
  worksList?: CaseStudyItem[];
  onOpenDashboard?: (tab: string) => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  onRequestSimilarProject,
  worksList,
  onOpenDashboard
}) => {
  const { isAdmin } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalStudy, setActiveModalStudy] = useState<CaseStudyItem | null>(null);

  const activeWorks = worksList && worksList.length > 0 ? worksList : caseStudiesData;

  const categories = [
    'All',
    'Paid Advertising',
    'Branding',
    'SEO',
    'Social Media',
    'Content Creation'
  ];

  const filteredStudies =
    selectedCategory === 'All'
      ? activeWorks
      : activeWorks.filter((c) => c.category === selectedCategory);

  const resolveImageUrl = (img?: string) => {
    if (!img) return '';
    if (img.startsWith('/src/assets/')) {
      return img.replace('/src/assets/', '/assets/');
    }
    return img;
  };

  return (
    <section id="works" className="py-24 bg-[#0A0A0A] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-5">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-[11px] font-mono-data tracking-widest uppercase text-[#FFD966] mb-2">
              <FolderGit2 className="w-3.5 h-3.5 text-[#F5C542]" />
              <span>SELECTED WORKS</span>
              <span aria-hidden="true">/</span>
              <span>CASE STUDY BLUEPRINTS</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-display font-bold tracking-tight text-white">
              FEATURED <span className="gold-gradient-text">WORKS & RESULTS</span>
            </h2>

            <p className="mt-2.5 text-[#A0A0A0] text-xs sm:text-sm leading-relaxed">
              Explore our structured frameworks across core digital marketing and video disciplines. Representative project blueprints demonstrate our creative methodology and commercial return.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <button
                onClick={() => onOpenDashboard?.('works')}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#F5C542] text-[#080808] hover:bg-[#FFD966] transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add / Manage Works</span>
              </button>
            )}
            <div className="text-[11px] font-mono-data text-[#888888] bg-[#111111] px-3 py-2 rounded-lg border border-white/5">
              {activeWorks.length} Verified Works
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#F5C542] text-[#080808] font-bold shadow-[0_0_15px_rgba(245,197,66,0.3)]'
                  : 'bg-[#141414] text-[#A0A0A0] hover:text-white hover:bg-[#1C1C1C] border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Works Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudies.map((study) => (
            <div
              key={study.id}
              className="rounded-2xl bg-[#111111] border border-[#222222] hover:border-[#F5C542]/50 transition-all duration-300 overflow-hidden flex flex-col group hover:-translate-y-1 shadow-lg"
            >
              {/* Media Thumbnail */}
              <div className="relative aspect-[16/10] overflow-hidden bg-black/60">
                <img
                  src={resolveImageUrl(study.image)}
                  alt={study.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    // Fallback to abstract graphic placeholder
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent opacity-80" />
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-mono-data px-2.5 py-1 rounded-md bg-[#080808]/90 backdrop-blur-md text-[#FFD966] border border-white/10">
                    {study.category}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="text-[11px] text-[#777777] font-mono-data">
                    {study.clientType}
                  </div>
                  <h3 className="text-base font-display font-bold text-white group-hover:text-[#FFD966] transition-colors leading-snug">
                    {study.title}
                  </h3>
                  <p className="text-xs text-[#A0A0A0] line-clamp-3 leading-relaxed">
                    {study.solution}
                  </p>
                </div>

                {/* Metrics Highlight (in ₹ Rupees) */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/5 text-center">
                  {study.sampleMetrics.map((metric, i) => (
                    <div key={i} className="p-2 rounded-lg bg-black/40 border border-white/5">
                      <div className="text-[10px] text-[#777777] uppercase font-mono-data truncate">
                        {metric.label}
                      </div>
                      <div className="text-xs font-bold text-[#FFD966] font-mono-data mt-0.5">
                        {metric.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Card CTA */}
                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => setActiveModalStudy(study)}
                    className="text-xs font-bold text-white group-hover:text-[#F5C542] flex items-center gap-1.5 transition-colors"
                  >
                    <span>Inspect Case Framework</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => onOpenDashboard?.('works')}
                      className="text-[10px] font-mono text-[#A0A0A0] hover:text-[#F5C542] flex items-center gap-1"
                    >
                      <Edit className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Framework Detail View */}
        {activeModalStudy && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#111111] border border-[#F5C542]/40 p-6 sm:p-8 shadow-2xl space-y-6">
              <button
                onClick={() => setActiveModalStudy(null)}
                className="absolute top-5 right-5 p-2 rounded-lg text-[#A0A0A0] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-2">
                <span className="text-[11px] font-mono-data text-[#F5C542]">
                  {activeModalStudy.category} Framework
                </span>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-white">
                  {activeModalStudy.title}
                </h3>
                <p className="text-xs text-[#888888]">{activeModalStudy.clientType}</p>
              </div>

              <div className="space-y-4 text-xs text-[#CCCCCC] leading-relaxed">
                <div className="p-4 rounded-xl bg-black/50 border border-white/5">
                  <div className="text-[10px] font-mono-data text-[#FFD966] uppercase mb-1">
                    The Challenge
                  </div>
                  <p>{activeModalStudy.challenge}</p>
                </div>

                <div className="p-4 rounded-xl bg-black/50 border border-white/5">
                  <div className="text-[10px] font-mono-data text-[#FFD966] uppercase mb-1">
                    Tactical Strategy & Execution
                  </div>
                  <p>{activeModalStudy.solution}</p>
                </div>

                <div>
                  <div className="text-[10px] font-mono-data text-[#A0A0A0] uppercase mb-2">
                    Key Deliverables Included
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeModalStudy.deliverables.map((deliv, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2.5 rounded-lg bg-white/5 text-[11px] text-white"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-[#F5C542] shrink-0" />
                        <span>{deliv}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    const cat = activeModalStudy.category;
                    setActiveModalStudy(null);
                    onRequestSimilarProject(cat);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-xs bg-[#F5C542] text-[#080808] hover:bg-[#FFD966] flex items-center justify-center gap-2"
                >
                  <span>Inquire for Similar Growth Project</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export const WorksSection = PortfolioSection;
