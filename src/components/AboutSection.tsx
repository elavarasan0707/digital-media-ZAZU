import React, { useState, useRef } from 'react';
import { MapPin, Phone, ExternalLink, CheckCircle2, Sparkles, Upload, Trash2, ImagePlus } from 'lucide-react';
import { AgencyContactConfig } from '../types';
import { saveSiteConfig } from '../firebase/firestoreService';

interface AboutSectionProps {
  agencyConfig?: AgencyContactConfig;
  onUpdateConfig?: (config: AgencyContactConfig) => void;
  isAdmin?: boolean;
  userUid?: string;
  onOpenBooking?: () => void;
}

const LEGACY_LONG_BIOS = [
  'He has a strong interest in digital media, content creation, and brand promotion.',
  'He continuously explores new creative ideas and digital marketing trends.'
];

export const AboutSection: React.FC<AboutSectionProps> = ({
  agencyConfig,
  onUpdateConfig,
  userUid
}) => {
  const [imgError, setImgError] = useState(false);
  const [isSavingPhoto, setIsSavingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const instagramUrl =
    agencyConfig?.instagram ||
    'https://www.instagram.com/zazudigitalmedia?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==';
  const linkedinUrl =
    agencyConfig?.linkedin ||
    'https://www.linkedin.com/in/vijayakumar-s-2a48a8394/';

  // Filter out the previously generated AI image if still in state
  const rawImg = agencyConfig?.aboutImageUrl || '';
  const portraitSrc =
    rawImg && !rawImg.includes('vijayakumar_founder_portrait') ? rawImg : '';

  // Use custom bio only if admin explicitly customized it (ignore old verbose 17-line default cached in localStorage)
  const rawBio = agencyConfig?.aboutVijayakumar || '';
  const isLegacyVerboseBio = LEGACY_LONG_BIOS.some((phrase) => rawBio.includes(phrase));
  const customBio = !isLegacyVerboseBio && rawBio.trim().length > 0 ? rawBio : null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !agencyConfig) return;

    setIsSavingPhoto(true);
    const reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result === 'string') {
        setImgError(false);
        const updated: AgencyContactConfig = {
          ...agencyConfig,
          aboutImageUrl: reader.result
        };
        onUpdateConfig?.(updated);
        try {
          await saveSiteConfig(updated, userUid);
        } catch (err) {
          console.error('Error saving portrait image:', err);
        } finally {
          setIsSavingPhoto(false);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = async () => {
    if (!agencyConfig) return;
    setIsSavingPhoto(true);
    const updated: AgencyContactConfig = {
      ...agencyConfig,
      aboutImageUrl: ''
    };
    onUpdateConfig?.(updated);
    try {
      await saveSiteConfig(updated, userUid);
    } catch (err) {
      console.error('Error removing portrait image:', err);
    } finally {
      setIsSavingPhoto(false);
    }
  };

  const corePillars = [
    'Creative Content & Brand Storytelling',
    'Professional Video Creation & Editing',
    'Social Media Growth & Promotions',
    'Search Engine Marketing (SEM) & Paid Ads'
  ];

  return (
    <section
      id="about"
      className="py-24 bg-black/40 backdrop-blur-[2px] relative overflow-hidden border-t border-white/5"
    >
      {/* Subtle Background Glow */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#F5C542]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-mono-data tracking-wider text-[#FFD966] mb-2">
            <span>Leadership</span>
            <span aria-hidden="true">·</span>
            <span>Creative Direction</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold tracking-tight text-white leading-tight">
            Meet Vijayakumar &{' '}
            <span className="gold-gradient-text">Zazu Digital Media</span>
          </h2>
        </div>

        {/* Executive Split Showcase Card */}
        <div className="rounded-3xl bg-[#0E0E0E]/95 border border-white/10 p-6 sm:p-8 lg:p-10 shadow-[0_24px_60px_rgba(0,0,0,0.9)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Founder Portrait Frame */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-sm lg:max-w-none group">
                {/* Decorative Gold Corner Frame */}
                <div className="absolute -inset-2.5 rounded-2xl border border-[#F5C542]/25 pointer-events-none" />
                <div className="absolute -top-3 -left-3 w-8 h-8 border-t-2 border-l-2 border-[#F5C542] rounded-tl-xl pointer-events-none" />
                <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-2 border-r-2 border-[#F5C542] rounded-br-xl pointer-events-none" />

                {/* Hidden File Input for Quick Photo Upload */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />

                {/* Main Image Container */}
                <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-[#141414] border border-white/15 shadow-2xl">
                  {portraitSrc && !imgError ? (
                    <>
                      <img
                        src={portraitSrc}
                        alt="Vijayakumar S — Founder of Zazu Digital Media"
                        referrerPolicy="no-referrer"
                        onError={() => setImgError(true)}
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-103"
                      />
                      {/* Top-right Change / Remove Photo controls on hover */}
                      <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-lg bg-black/80 hover:bg-[#F5C542] text-white hover:text-[#080808] border border-white/15 text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md transition-colors cursor-pointer"
                          title="Change Photo"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Change Photo</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="p-1.5 rounded-lg bg-black/80 hover:bg-red-500/90 text-white border border-white/15 backdrop-blur-md transition-colors cursor-pointer"
                          title="Remove Photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  ) : (
                    /* Clean Interactive Upload Frame when no image is set */
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#181818] via-[#101010] to-[#0A0A0A] p-6 pb-20 text-center cursor-pointer hover:bg-[#191919] transition-colors"
                    >
                      <div className="w-20 h-20 rounded-2xl bg-[#F5C542]/15 border border-[#F5C542]/40 flex items-center justify-center font-display font-bold text-2xl text-[#F5C542] mb-4 shadow-lg shadow-[#F5C542]/5">
                        <ImagePlus className="w-8 h-8 text-[#F5C542]" />
                      </div>
                      <span className="text-base font-display font-bold text-white">
                        Add Founder Photo
                      </span>
                      <span className="text-xs text-[#A0A0A0] mt-1 max-w-[200px]">
                        Click here to upload Vijayakumar&apos;s portrait image
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        disabled={isSavingPhoto}
                        className="mt-4 px-4 py-2 rounded-xl bg-[#F5C542] hover:bg-[#FFD966] text-[#080808] font-bold text-xs inline-flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isSavingPhoto ? 'Saving...' : 'Upload Image'}</span>
                      </button>
                    </div>
                  )}

                  {/* Measured Bottom Gradient Scrim + Nameplate */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/75 to-transparent pt-12 pb-5 px-5 pointer-events-none">
                    <div className="flex items-end justify-between gap-2">
                      <div>
                        <h3 className="text-lg sm:text-xl font-display font-bold text-white leading-tight">
                          Vijayakumar S
                        </h3>
                        <p className="text-xs text-[#FFD966] font-medium mt-0.5">
                          Founder & Creative Strategist
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-[#D4D4D4]">
                        <MapPin className="w-3.5 h-3.5 text-[#F5C542] shrink-0" />
                        <span className="whitespace-nowrap">Tirumangalam, TN</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Concise Important Context & Direct Connect */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 text-xs text-[#FFD966] font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-[#F5C542]" />
                  <span>Creative Ideas · Digital Content · Smart Marketing</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-display font-bold text-white leading-snug">
                  Turning Creative Vision Into Measurable Brand Growth
                </h3>

                {customBio ? (
                  <p className="text-sm sm:text-base text-[#CCCCCC] leading-relaxed whitespace-pre-line">
                    {customBio}
                  </p>
                ) : (
                  <p className="text-sm sm:text-base text-[#CCCCCC] leading-relaxed">
                    <strong className="text-white">Vijayakumar S</strong> is the creative mind behind{' '}
                    <strong className="text-white">Zazu Digital Media</strong>, dedicated to building high-impact digital identities, engaging video content, and result-driven marketing campaigns tailored for modern businesses.
                  </p>
                )}
              </div>

              {/* 4 Key Focus Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {corePillars.map((pillar, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2.5 p-3.5 rounded-xl bg-white/[0.03] border border-white/10"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#F5C542] shrink-0" />
                    <span className="text-xs sm:text-sm font-medium text-white">
                      {pillar}
                    </span>
                  </div>
                ))}
              </div>

              {/* Concise Executive Quote */}
              <div className="pt-2 border-t border-white/10">
                <p className="text-xs sm:text-sm italic text-[#A0A0A0] leading-relaxed">
                  “From developing an initial concept to producing and scaling the final campaign, every stage is crafted for real business impact.”
                </p>
              </div>

              {/* Direct Action Bar */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-[#161616] hover:bg-[#222222] border border-white/10 text-xs text-white font-medium inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                  >
                    <span>Instagram</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#F5C542]" />
                  </a>
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-[#161616] hover:bg-[#222222] border border-white/10 text-xs text-white font-medium inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                  >
                    <span>LinkedIn</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#0A66C2]" />
                  </a>
                </div>

                <a
                  href="https://wa.me/919789504702?text=Hi%20Vijayakumar,%20I%20would%20like%20to%20discuss%20a%20project%20with%20Zazu%20Digital%20Media"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-[#25D366] text-[#080808] font-bold text-xs inline-flex items-center gap-2 hover:brightness-110 transition-all shadow-md shadow-[#25D366]/20 whitespace-nowrap shrink-0"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>+91 9789504702</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

