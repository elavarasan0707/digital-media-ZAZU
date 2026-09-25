import React from 'react';
import { ZazuLogo } from './ZazuLogo';
import { ArrowUpRight, Mail, Phone, MapPin, ExternalLink, MessageCircle } from 'lucide-react';
import { AgencyContactConfig } from '../types';

interface FooterProps {
  agencyConfig: AgencyContactConfig;
  onOpenBooking?: () => void;
  onOpenQuote?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ agencyConfig }) => {
  const quickLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'About Vijayakumar', href: '#about' },
    { label: 'Why ZAZU', href: '#why-us' },
    { label: 'Services', href: '#services' },
    { label: '6-Step Process', href: '#process' },
    { label: 'Client Reviews', href: '#reviews' },
    { label: 'Contact', href: '#contact' }
  ];

  const serviceCategories = [
    'Digital Marketing Strategy',
    'Social Media Marketing',
    'Search Engine Optimization (SEO)',
    'Google Ads (PPC)',
    'Content Creation & Video',
    'Luxury Brand Identity',
    'Website Marketing & CRO'
  ];

  const instagramUrl = agencyConfig.instagram || 'https://www.instagram.com/zazudigitalmedia?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==';
  const linkedinUrl = agencyConfig.linkedin || 'https://www.linkedin.com/in/vijayakumar-s-2a48a8394/';

  const rawPhone = agencyConfig.whatsapp || agencyConfig.phone || '9789504702';
  let cleanDigits = rawPhone.replace(/\D/g, '');
  if (cleanDigits.length === 10) {
    cleanDigits = '91' + cleanDigits;
  } else if (!cleanDigits.startsWith('91') && cleanDigits.length > 0) {
    cleanDigits = '91' + cleanDigits;
  }
  const footerWaNumber = cleanDigits || '919789504702';
  const footerWaUrl = `https://wa.me/${footerWaNumber}?text=${encodeURIComponent('Hi Vijayakumar, I am contacting you from the ZAZU Digital Media website.')}`;

  return (
    <footer className="bg-black/85 backdrop-blur-[4px] border-t border-[#1C1C1C] text-white pt-16 pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-16 border-b border-white/5">
          
          {/* Col 1: Brand & Tagline (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <ZazuLogo variant="official" size="lg" />

            <p className="text-sm font-semibold tracking-wide text-[#E5E5E5] pt-2">
              “WE DON’T JUST CREATE CONTENT.<br />
              <span className="text-[#FFD966]">WE CREATE BUSINESS IMPACT.”</span>
            </p>

            <p className="text-xs text-[#A0A0A0] leading-relaxed max-w-sm">
              ZAZU Digital Media – Led by creative professional Vijayakumar. Delivering creative ideas, digital content, and smart marketing solutions from Tirumangalam, Tamil Nadu.
            </p>

            {/* Direct Contact Badges */}
            <div className="space-y-1.5 pt-2 text-xs text-[#A0A0A0]">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#F5C542]" />
                <a href="tel:+919789504702" className="text-white hover:text-[#FFD966]">
                  +91 9789504702
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#F5C542]" />
                <a href="mailto:digitalmediazazu@gmail.com" className="text-white hover:text-[#FFD966]">
                  digitalmediazazu@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#F5C542]" />
                <span>Tirumangalam, Tamil Nadu, India</span>
              </div>
            </div>

            {/* Social Connect */}
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-[#111111] border border-white/10 text-xs text-white hover:text-[#FFD966] hover:border-[#F5C542]/40 transition-colors flex items-center gap-1.5"
              >
                <span>Instagram</span>
                <ExternalLink className="w-3 h-3 text-[#F5C542]" />
              </a>
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-[#111111] border border-white/10 text-xs text-white hover:text-[#FFD966] hover:border-[#F5C542]/40 transition-colors flex items-center gap-1.5"
              >
                <span>LinkedIn</span>
                <ExternalLink className="w-3 h-3 text-[#0A66C2]" />
              </a>
              <a
                href={footerWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-[#25D366] text-[#080808] font-bold text-xs hover:brightness-110 transition-colors flex items-center gap-1.5"
              >
                <MessageCircle className="w-3 h-3" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Mirror (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[#A0A0A0] hover:text-[#FFD966] transition-colors inline-flex items-center gap-1"
                  >
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Key Disciplines (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Specializations
            </h4>
            <ul className="space-y-2 text-xs text-[#A0A0A0]">
              {serviceCategories.map((s, idx) => (
                <li key={idx}>
                  <a href="#services" className="hover:text-white transition-colors">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Quiet Bottom Legal Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#666666]">
          <div>
            © {new Date().getFullYear()} ZAZU Digital Media. Creative Ideas, Digital Content & Smart Marketing.
          </div>
          <div className="flex items-center gap-6">
            <span>Vijayakumar • Founder & Creative Lead</span>
            <span>Tirumangalam, India</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
