import React from 'react';
import { Target, Lightbulb, Video, Share2, Search, TrendingUp, CheckCircle2, MapPin, Mail, Phone, ExternalLink } from 'lucide-react';
import { ZazuLogo } from './ZazuLogo';
import { AgencyContactConfig } from '../types';

interface AboutSectionProps {
  agencyConfig?: AgencyContactConfig;
  onOpenBooking?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ agencyConfig, onOpenBooking }) => {
  const highlights = [
    {
      title: 'Creative Content Creation',
      description: 'Engaging branded content and compelling narrative angles crafted specifically for modern digital audiences.',
      icon: Lightbulb
    },
    {
      title: 'Professional Video & Editing',
      description: 'Cinematic video creation and high-retention video editing making brand stories visually attractive and viral-ready.',
      icon: Video
    },
    {
      title: 'Social Media Promotions',
      description: 'End-to-end social media marketing, audience engagement protocols, and organic-to-paid community amplification.',
      icon: Share2
    },
    {
      title: 'SEM & Online Advertising',
      description: 'High-intent Search Engine Marketing (SEM) and strategic online advertising engineered to compound online visibility.',
      icon: Search
    }
  ];

  const instagramUrl = agencyConfig?.instagram || 'https://www.instagram.com/zazudigitalmedia?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==';
  const linkedinUrl = agencyConfig?.linkedin || 'https://www.linkedin.com/in/vijayakumar-s-2a48a8394/';

  return (
    <section id="about" className="py-24 bg-black/40 backdrop-blur-[2px] relative overflow-hidden border-t border-white/5">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-[#F5C542]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 text-[11px] font-mono-data tracking-widest uppercase text-[#FFD966] mb-2">
            <span>ABOUT ZAZU DIGITAL MEDIA</span>
            <span aria-hidden="true">/</span>
            <span>LEADERSHIP & PHILOSOPHY</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-display font-bold tracking-tight text-white leading-tight">
            MEET VIJAYAKUMAR &{' '}
            <span className="gold-gradient-text">ZAZU DIGITAL MEDIA</span>
          </h2>

          <p className="mt-3 text-sm sm:text-base text-[#D4D4D4] leading-relaxed">
            Creative Ideas, Digital Content & Smart Marketing engineered to help brands communicate effectively and achieve real business impact.
          </p>
        </div>

        {/* 2-Column Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Col 1: About Vijayakumar Profile Card (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative rounded-2xl overflow-hidden bg-[#111111] border border-[#222222] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.85)] group hover:border-[#F5C542]/50 transition-all duration-300">
              
              {/* Brand Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F5C542] to-[#D4A017] p-0.5 flex items-center justify-center shadow-lg shadow-[#F5C542]/20">
                    <div className="w-full h-full bg-[#0E0E0E] rounded-[10px] flex items-center justify-center font-display font-bold text-white text-lg">
                      VS
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-bold text-white leading-none">
                      Vijayakumar S
                    </h3>
                    <span className="text-xs text-[#FFD966] font-medium mt-1 block">
                      Founder & Zazu Digital Media
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-[#A0A0A0]">
                  <MapPin className="w-3 h-3 text-[#F5C542]" />
                  <span>Tirumangalam, TN</span>
                </div>
              </div>

              {/* Vijayakumar Bio Paragraphs */}
              <div className="space-y-3.5 text-xs sm:text-sm text-[#CCCCCC] leading-relaxed font-sans">
                <p>
                  <strong>Vijayakumar</strong> is the creative professional behind <strong>Zazu Digital Media</strong>, focused on delivering creative and effective digital marketing solutions.
                </p>
                <p>
                  He has a strong interest in digital media, content creation, and brand promotion. He creates engaging content based on the needs of different brands and businesses.
                </p>
                <p>
                  His work includes creative content creation and professional video creation. He also specializes in video editing to make content more attractive and engaging. Along with content creation, he handles social media marketing and promotions.
                </p>
                <p>
                  He works on digital marketing strategies to help businesses grow their online presence. He also focuses on Search Engine Marketing (SEM) and online advertising.
                </p>
                <p className="pt-2 text-xs italic text-[#A0A0A0] border-t border-white/5">
                  “From developing an idea to creating and promoting the final content, he manages different stages of the digital marketing process. Zazu Digital Media – Creative Ideas, Digital Content & Smart Marketing.”
                </p>
              </div>

              {/* Social and Connect Links */}
              <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none px-3 py-2 rounded-lg bg-[#1A1A1A] hover:bg-[#252525] border border-white/10 text-xs text-white font-medium flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Instagram</span>
                    <ExternalLink className="w-3 h-3 text-[#F5C542]" />
                  </a>
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none px-3 py-2 rounded-lg bg-[#1A1A1A] hover:bg-[#252525] border border-white/10 text-xs text-white font-medium flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>LinkedIn</span>
                    <ExternalLink className="w-3 h-3 text-[#0A66C2]" />
                  </a>
                </div>

                <a
                  href="https://wa.me/919789504702?text=Hi%20Vijayakumar,%20I%20would%20like%20to%20discuss%20a%20project%20with%20Zazu%20Digital%20Media"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-lg bg-[#25D366] text-[#080808] font-bold text-xs flex items-center justify-center gap-1.5 hover:brightness-110 transition-all shadow-md shadow-[#25D366]/20"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>+91 9789504702</span>
                </a>
              </div>

            </div>
          </div>

          {/* Col 2: Approach & Strategic Pillars (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Core Philosophy Box */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#121212] via-[#0E0E0E] to-[#0A0A0A] border border-white/10 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#F5C542]" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FFD966]">
                  CREATIVE EXCELLENCE & BUSINESS IMPACT
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#CCCCCC] leading-relaxed">
                His approach combines creativity, marketing knowledge, and audience-focused strategies. He has worked on multiple projects across different digital marketing requirements. Each project is handled with attention to quality, creativity, and business goals.
              </p>
              <p className="text-xs sm:text-sm text-[#CCCCCC] leading-relaxed">
                Through Zazu Digital Media, he aims to provide creative digital solutions that help brands communicate effectively with their target audience. His goal is to create meaningful content that connects brands with people. He continuously explores new creative ideas and digital marketing trends.
              </p>
            </div>

            {/* 4 Feature Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {highlights.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-xl bg-[#111111]/90 border border-[#222222] hover:border-[#F5C542]/40 transition-all duration-300 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#1A1A1A] border border-white/10 flex items-center justify-center text-[#F5C542] mb-3 group-hover:bg-[#F5C542] group-hover:text-[#080808] transition-colors duration-200">
                      <Icon className="w-5 h-5" />
                    </div>

                    <h4 className="text-sm font-display font-bold text-white mb-1.5 group-hover:text-[#FFD966] transition-colors">
                      {item.title}
                    </h4>

                    <p className="text-xs text-[#A0A0A0] leading-relaxed">
                      {item.description}
                    </p>

                    <div className="mt-3 pt-2 border-t border-white/5 flex items-center gap-1.5 text-[10px] font-semibold text-[#FFD966]">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Dedicated Quality Guarantee</span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
