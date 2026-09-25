import React, { useState } from 'react';
import { servicesData } from '../data/agencyData';
import { Mail, Phone, MessageSquare, MapPin, Send, CheckCircle2, MessageCircle, ExternalLink, Sparkles } from 'lucide-react';
import { AgencyContactConfig } from '../types';
import { submitClientInquiry } from '../firebase/firestoreService';

interface ContactSectionProps {
  agencyConfig: AgencyContactConfig;
  selectedServicePreload?: string;
  onOpenCustomizer?: () => void;
  onOpenDashboard?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  agencyConfig,
  selectedServicePreload = '',
  onOpenCustomizer,
  onOpenDashboard
}) => {
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    email: '',
    phone: '',
    serviceRequired: selectedServicePreload || 'Digital Marketing',
    monthlyBudget: '₹25,000 - ₹75,000 / mo',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [whatsappDirectUrl, setWhatsappDirectUrl] = useState('');

  // Sync if preloaded service changes
  React.useEffect(() => {
    if (selectedServicePreload) {
      setFormData((prev) => ({ ...prev, serviceRequired: selectedServicePreload }));
    }
  }, [selectedServicePreload]);

  const budgetOptions = [
    '< ₹25,000 / month (Foundation)',
    '₹25,000 - ₹75,000 / month (Growth)',
    '₹75,000 - ₹2,00,000 / month (Scale)',
    '₹2,00,000+ / month (Enterprise)'
  ];

  const getCleanWhatsAppNumber = () => {
    const rawNumber = agencyConfig.whatsapp || agencyConfig.phone || '9789504702';
    let digits = rawNumber.replace(/\D/g, '');
    if (digits.length === 10) {
      digits = '91' + digits;
    } else if (!digits.startsWith('91') && digits.length > 0) {
      digits = '91' + digits;
    }
    return digits || '919789504702';
  };

  const targetPhoneNumber = getCleanWhatsAppNumber();
  const fullPhoneDisplay = agencyConfig.phone || '+91 9789504702';
  const targetEmail = agencyConfig.email || 'digitalmediazazu@gmail.com';
  const targetLocation = agencyConfig.location || 'Tirumangalam, Tamil Nadu, India';
  const instagramUrl = agencyConfig.instagram || 'https://www.instagram.com/zazudigitalmedia?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==';
  const linkedinUrl = agencyConfig.linkedin || 'https://www.linkedin.com/in/vijayakumar-s-2a48a8394/';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const waText = `*New Project Inquiry - ZAZU Digital Media*
*Name:* ${formData.name || 'Anonymous'}
*Company:* ${formData.businessName || 'N/A'}
*Phone:* ${formData.phone || 'N/A'}
*Email:* ${formData.email || 'N/A'}
*Service Required:* ${formData.serviceRequired}
*Monthly Budget:* ${formData.monthlyBudget}
*Project Message:* ${formData.message || 'I am interested in digital marketing services.'}`;

    const waUrl = `https://wa.me/${targetPhoneNumber}?text=${encodeURIComponent(waText)}`;
    setWhatsappDirectUrl(waUrl);

    // Save inquiry to Firestore in background without delaying user
    submitClientInquiry({
      name: formData.name,
      businessName: formData.businessName,
      email: formData.email,
      phone: formData.phone,
      serviceRequired: formData.serviceRequired,
      monthlyBudget: formData.monthlyBudget,
      message: formData.message,
      source: 'website_form',
      whatsappSent: true,
      status: 'new'
    }).catch((err) => {
      console.warn('Inquiry saved locally:', err);
    });

    // Reliable WhatsApp opening directly within user gesture:
    let popupBlocked = false;
    try {
      const waWin = window.open(waUrl, '_blank', 'noopener,noreferrer');
      if (!waWin || waWin.closed || typeof waWin.closed === 'undefined') {
        popupBlocked = true;
      }
    } catch {
      popupBlocked = true;
    }

    if (popupBlocked) {
      try {
        const link = document.createElement('a');
        link.href = waUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch {
        window.location.href = waUrl;
      }
    }

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <section id="contact" className="py-24 bg-black/55 backdrop-blur-[2px] relative overflow-hidden border-t border-white/5">
      {/* Ambient Lighting */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#F5C542]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 text-[11px] font-mono-data tracking-widest uppercase text-[#FFD966] mb-2">
            <span>START A DIALOGUE</span>
            <span aria-hidden="true">/</span>
            <span>PROPOSAL & INQUIRY</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-display font-bold tracking-tight text-white">
            LET’S DISCUSS YOUR <span className="gold-gradient-text">DIGITAL GROWTH</span>
          </h2>

          <p className="mt-2.5 text-[#A0A0A0] text-xs sm:text-sm leading-relaxed">
            Ready to turn digital attention into qualified inquiries and revenue? Submit your project parameters below to message directly to Vijayakumar at <strong className="text-white">+91 9789504702</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Agency Channels (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222] shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  Direct Agency Channels
                </h3>
                <span className="text-[10px] font-mono text-[#FFD966] px-2 py-0.5 rounded bg-[#F5C542]/10 border border-[#F5C542]/30">
                  Active Response
                </span>
              </div>

              {/* Phone & WhatsApp (9789504702) */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center text-[#25D366] shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono-data text-[#A0A0A0] block">
                    Phone & WhatsApp:
                  </span>
                  <a
                    href={`https://wa.me/91${targetPhoneNumber}?text=${encodeURIComponent('Hi Vijayakumar, I am reaching out from your ZAZU Digital Media website.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-white hover:text-[#25D366] transition-colors"
                  >
                    {fullPhoneDisplay}
                  </a>
                  <span className="text-[10px] text-[#A0A0A0] block mt-0.5">
                    Click to message directly on WhatsApp
                  </span>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center text-[#F5C542] shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono-data text-[#A0A0A0] block">
                    Official Email:
                  </span>
                  <a
                    href={`mailto:${targetEmail}`}
                    className="text-sm font-semibold text-white hover:text-[#FFD966] transition-colors break-all"
                  >
                    {targetEmail}
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center text-[#F5C542] shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono-data text-[#A0A0A0] block">
                    Headquarters:
                  </span>
                  <span className="text-sm text-[#D4D4D4] leading-relaxed block font-medium">
                    {targetLocation}
                  </span>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-2 border-t border-white/10 flex flex-wrap gap-2.5">
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 rounded-lg bg-[#181818] hover:bg-[#222222] border border-white/10 text-xs text-white font-medium flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Instagram</span>
                  <ExternalLink className="w-3 h-3 text-[#F5C542]" />
                </a>
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 rounded-lg bg-[#181818] hover:bg-[#222222] border border-white/10 text-xs text-white font-medium flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>LinkedIn</span>
                  <ExternalLink className="w-3 h-3 text-[#0A66C2]" />
                </a>
              </div>

            </div>

            {/* Direct WhatsApp Callout Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#121c15] to-[#0d1310] border border-[#25D366]/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#25D366] uppercase">
                <MessageCircle className="w-4 h-4" />
                <span>DIRECT MESSAGING TO {targetPhoneNumber}</span>
              </div>
              <p className="text-xs text-[#A0A0A0] leading-relaxed">
                When you submit an inquiry or click message, your project parameters are routed directly to Vijayakumar’s mobile WhatsApp for an immediate consultation.
              </p>
            </div>

          </div>

          {/* Right Column: Lead Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-[#111111] border border-[#222222] shadow-[0_25px_60px_rgba(0,0,0,0.9)] relative">
              
              {isSubmitted ? (
                <div className="text-center py-12 space-y-4 animate-in fade-in duration-300">
                  <div className="w-16 h-16 rounded-full bg-[#25D366]/10 border-2 border-[#25D366] flex items-center justify-center text-[#25D366] mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white">
                    Inquiry Dispatched!
                  </h3>
                  <p className="text-sm text-[#A0A0A0] max-w-md mx-auto leading-relaxed">
                    Thank you, <span className="text-white font-semibold">{formData.name}</span>. Your inquiry has been recorded and directed to <strong className="text-white">+91 9789504702</strong>.
                  </p>
                  
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={whatsappDirectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-[#080808] font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/30 transition-all hover:scale-105 active:scale-95"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>Open WhatsApp Chat Now</span>
                    </a>
                    <button
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({
                          name: '',
                          businessName: '',
                          email: '',
                          phone: '',
                          serviceRequired: 'Digital Marketing',
                          monthlyBudget: '₹25,000 - ₹75,000 / mo',
                          message: ''
                        });
                      }}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#222222] hover:bg-[#333333] text-xs font-semibold text-white transition-colors"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                  <p className="text-[11px] text-[#777777] font-mono mt-1">
                    If WhatsApp didn't open automatically on your device, click &quot;Open WhatsApp Chat Now&quot;.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  
                  {/* Row 1: Name & Business */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase font-mono-data text-[#A0A0A0] mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full px-4 py-3 rounded-xl bg-[#080808] border border-white/10 text-white placeholder-[#555555] focus:outline-none focus:border-[#F5C542] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase font-mono-data text-[#A0A0A0] mb-1.5">
                        Company / Brand Name
                      </label>
                      <input
                        type="text"
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        placeholder="e.g. Acme Enterprises"
                        className="w-full px-4 py-3 rounded-xl bg-[#080808] border border-white/10 text-white placeholder-[#555555] focus:outline-none focus:border-[#F5C542] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Row 2: Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase font-mono-data text-[#A0A0A0] mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@company.com"
                        className="w-full px-4 py-3 rounded-xl bg-[#080808] border border-white/10 text-white placeholder-[#555555] focus:outline-none focus:border-[#F5C542] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase font-mono-data text-[#A0A0A0] mb-1.5">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-3 rounded-xl bg-[#080808] border border-white/10 text-white placeholder-[#555555] focus:outline-none focus:border-[#F5C542] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Row 3: Service & Budget in Rupees */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase font-mono-data text-[#A0A0A0] mb-1.5">
                        Core Capability Needed
                      </label>
                      <select
                        value={formData.serviceRequired}
                        onChange={(e) => setFormData({ ...formData, serviceRequired: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#080808] border border-white/10 text-white focus:outline-none focus:border-[#F5C542] transition-colors"
                      >
                        {servicesData.map((s) => (
                          <option key={s.id} value={s.title}>
                            {s.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase font-mono-data text-[#A0A0A0] mb-1.5">
                        Target Monthly Budget (in ₹)
                      </label>
                      <select
                        value={formData.monthlyBudget}
                        onChange={(e) => setFormData({ ...formData, monthlyBudget: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#080808] border border-white/10 text-white focus:outline-none focus:border-[#F5C542] transition-colors"
                      >
                        {budgetOptions.map((b, idx) => (
                          <option key={idx} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Row 4: Message */}
                  <div>
                    <label className="block text-[11px] uppercase font-mono-data text-[#A0A0A0] mb-1.5">
                      Describe Your Objectives & Timeline *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your brand, current bottlenecks, target audience, and primary growth goals..."
                      className="w-full px-4 py-3 rounded-xl bg-[#080808] border border-white/10 text-white placeholder-[#555555] focus:outline-none focus:border-[#F5C542] transition-colors resize-y leading-relaxed"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 px-6 rounded-xl font-bold text-xs bg-gradient-to-r from-[#F5C542] via-[#FFD966] to-[#F5C542] text-[#080808] shadow-[0_0_25px_rgba(245,197,66,0.3)] hover:shadow-[0_0_35px_rgba(245,197,66,0.5)] transition-all duration-200 flex items-center justify-center gap-2 group"
                    >
                      {isSubmitting ? (
                        <span>Routing Message to WhatsApp (+91 9789504702)...</span>
                      ) : (
                        <>
                          <MessageCircle className="w-4 h-4 text-[#080808]" />
                          <span>SEND INQUIRY TO +91 9789504702</span>
                          <Send className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </button>
                    <p className="text-[10px] text-center text-[#777777] mt-2 font-mono">
                      Submissions automatically route to Vijayakumar (+91 9789504702) & sync to Firestore.
                    </p>
                  </div>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
