import React from 'react';
import { MapPin, Phone, ExternalLink } from 'lucide-react';
import { AgencyContactConfig } from '../types';

interface AboutSectionProps {
  agencyConfig?: AgencyContactConfig;
  onOpenBooking?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ agencyConfig }) => {
  const instagramUrl = agencyConfig?.instagram || 'https://www.instagram.com/zazudigitalmedia?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==';
  const linkedinUrl = agencyConfig?.linkedin || 'https://www.linkedin.com/in/vijayakumar-s-2a48a8394/';
  const customBio = agencyConfig?.aboutVijayakumar;

  return (
    <section id="about" className="py-24 bg-black/35 backdrop-blur-[2px] relative overflow-hidden border-t border-white/5">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-[#F5C542]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
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

        {/* About Vijayakumar Profile Card */}
        <div className="relative rounded-2xl overflow-hidden bg-[#111111]/90 border border-[#222222] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.85)] group hover:border-[#F5C542]/50 transition-all duration-300">
          
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
          {customBio ? (
            <div className="space-y-3 text-xs sm:text-sm text-[#CCCCCC] leading-relaxed font-sans whitespace-pre-line">
              {customBio}
            </div>
          ) : (
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
          )}

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
    </section>
  );
};
