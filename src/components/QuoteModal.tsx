import React, { useState } from 'react';
import { X, CheckCircle, Calculator, ArrowUpRight, MessageCircle } from 'lucide-react';
import { servicesData } from '../data/agencyData';
import { submitClientInquiry } from '../firebase/firestoreService';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRedirectToContact: (service: string) => void;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  onRedirectToContact
}) => {
  const [selectedServices, setSelectedServices] = useState<string[]>([
    'Digital Marketing',
    'Google Ads (PPC)'
  ]);
  const [timeline, setTimeline] = useState('Immediate (Next 2 Weeks)');
  const [submitted, setSubmitted] = useState(false);
  const [contactInfo, setContactInfo] = useState({ name: '', email: '', phone: '' });

  if (!isOpen) return null;

  const toggleService = (title: string) => {
    if (selectedServices.includes(title)) {
      setSelectedServices(selectedServices.filter((s) => s !== title));
    } else {
      setSelectedServices([...selectedServices, title]);
    }
  };

  const getWhatsAppQuoteUrl = () => {
    const waText = `*Custom Project Quote Scope - ZAZU Digital Media*
*Name:* ${contactInfo.name || 'Anonymous'}
*Work Email:* ${contactInfo.email}
*Phone / WhatsApp:* ${contactInfo.phone || 'N/A'}
*Selected Services:* ${selectedServices.join(', ')}
*Timeline:* ${timeline}`;
    return `https://wa.me/919789504702?text=${encodeURIComponent(waText)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    // Save to Database (Firestore & Local Cache)
    submitClientInquiry({
      name: contactInfo.name || 'Anonymous',
      email: contactInfo.email,
      phone: contactInfo.phone || 'N/A',
      serviceRequired: `Quote Scope: ${selectedServices.join(', ')}`,
      monthlyBudget: timeline,
      message: `Quote Request for: ${selectedServices.join(', ')}. Target Timeline: ${timeline}`,
      source: 'quote_modal',
      whatsappSent: true,
      status: 'new'
    }).catch((err) => {
      console.warn('Quote database save notice:', err);
    });

    const waUrl = getWhatsAppQuoteUrl();
    try {
      const win = window.open(waUrl, '_blank', 'noopener,noreferrer');
      if (!win || win.closed || typeof win.closed === 'undefined') {
        const link = document.createElement('a');
        link.href = waUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch {
      // Handled via submitted button
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#111111] border border-[#F5C542]/40 p-6 sm:p-8 shadow-2xl space-y-6">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-[#A0A0A0] hover:text-white"
          aria-label="Close Quote Modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2 text-xs font-mono-data text-[#FFD966] mb-1">
            <Calculator className="w-3.5 h-3.5" />
            <span>CUSTOM PROPOSAL SCOPE</span>
          </div>
          <h3 className="text-2xl font-display font-bold text-white">
            REQUEST A FREE PROJECT QUOTE
          </h3>
          <p className="text-xs text-[#A0A0A0] mt-1">
            Select the services your business requires for an immediate tailored scope estimation.
          </p>
        </div>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#F5C542]/10 border border-[#F5C542] flex items-center justify-center text-[#F5C542] mx-auto">
              <CheckCircle className="w-7 h-7" />
            </div>
            <h4 className="text-xl font-bold text-white">Custom Proposal Initiated!</h4>
            <p className="text-xs text-[#A0A0A0] leading-relaxed max-w-md mx-auto">
              Thank you, <strong className="text-white">{contactInfo.name}</strong>. Our senior agency estimators are preparing a detailed proposal for:
            </p>
            <div className="flex flex-wrap justify-center gap-1.5 pt-1">
              {selectedServices.map((s) => (
                <span key={s} className="px-2.5 py-1 rounded bg-black border border-white/10 text-[11px] text-[#FFD966]">
                  {s}
                </span>
              ))}
            </div>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={getWhatsAppQuoteUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-[#080808] font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Message Scope on WhatsApp</span>
              </a>
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#222222] hover:bg-[#333333] text-white font-bold text-xs transition-colors"
              >
                Close & Return to Site
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            {/* Service Selection */}
            <div>
              <label className="text-[11px] uppercase font-mono-data text-[#A0A0A0] block mb-2">
                1. Select Required Capabilities ({selectedServices.length} Selected)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-44 overflow-y-auto pr-1">
                {servicesData.map((s) => {
                  const isChecked = selectedServices.includes(s.title);
                  return (
                    <button
                      type="button"
                      key={s.id}
                      onClick={() => toggleService(s.title)}
                      className={`p-2.5 rounded-lg border text-left text-[11px] font-medium transition-colors ${
                        isChecked
                          ? 'bg-[#F5C542]/15 border-[#F5C542] text-[#FFD966]'
                          : 'bg-black/50 border-white/5 text-[#A0A0A0] hover:text-white'
                      }`}
                    >
                      {s.title}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Timeline Selection */}
            <div>
              <label className="text-[11px] uppercase font-mono-data text-[#A0A0A0] block mb-1.5">
                2. Target Launch Timeline
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {['Immediate (Next 2 Weeks)', 'Next 30–60 Days', 'Exploratory (Q4)'].map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setTimeline(t)}
                    className={`p-2.5 rounded-lg border text-center text-[11px] transition-colors ${
                      timeline === t
                        ? 'bg-[#F5C542] text-[#080808] font-bold border-[#F5C542]'
                        : 'bg-black/40 border-white/5 text-[#A0A0A0] hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <label className="text-[11px] uppercase font-mono-data text-[#A0A0A0] block">
                3. Where Should We Send Your Scope & Rate Card?
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <input
                  type="text"
                  required
                  placeholder="Your Name *"
                  value={contactInfo.name}
                  onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                  className="p-2.5 rounded-lg bg-black border border-white/10 text-white focus:outline-none focus:border-[#F5C542]"
                />
                <input
                  type="email"
                  required
                  placeholder="Work Email *"
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                  className="p-2.5 rounded-lg bg-black border border-white/10 text-white focus:outline-none focus:border-[#F5C542]"
                />
                <input
                  type="tel"
                  placeholder="Phone / WhatsApp"
                  value={contactInfo.phone}
                  onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                  className="p-2.5 rounded-lg bg-black border border-white/10 text-white focus:outline-none focus:border-[#F5C542]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl font-bold text-xs bg-gradient-to-r from-[#F5C542] via-[#FFD966] to-[#F5C542] text-[#080808] shadow-[0_0_20px_rgba(245,197,66,0.3)] hover:shadow-[0_0_30px_rgba(245,197,66,0.5)] transition-all flex items-center justify-center gap-2"
              >
                <span>GENERATE CUSTOM ESTIMATE</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
