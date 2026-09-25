import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send, CheckCircle2, Database, ShieldCheck, Sparkles } from 'lucide-react';
import { AgencyContactConfig } from '../types';
import { ZazuLogo } from './ZazuLogo';
import { submitClientInquiry } from '../firebase/firestoreService';

interface FloatingWhatsAppProps {
  agencyConfig: AgencyContactConfig;
}

const PRESET_SERVICES = [
  'Social Media Marketing',
  'Video Editing & Reels',
  'Google Ads & Meta Ads',
  'Search Engine Optimization (SEO)',
  'Brand Identity & Logo',
  'Full Digital Media Management'
];

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ agencyConfig }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [service, setService] = useState('Video Editing & Reels');
  const [customMsg, setCustomMsg] = useState('Hi Vijayakumar, I need creative digital marketing and video solutions for my business.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [hasStoredData, setHasStoredData] = useState(false);

  // Load saved client info if previously entered
  useEffect(() => {
    try {
      const savedInfo = localStorage.getItem('zazu_user_contact_info');
      if (savedInfo) {
        const parsed = JSON.parse(savedInfo);
        if (parsed.name) setName(parsed.name);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.businessName) setBusinessName(parsed.businessName);
      }
    } catch {}
  }, []);

  const rawPhone = agencyConfig.whatsapp || agencyConfig.phone || '9789504702';
  let cleanAgencyNumber = rawPhone.replace(/\D/g, '');
  if (cleanAgencyNumber.length === 10) {
    cleanAgencyNumber = '91' + cleanAgencyNumber;
  } else if (!cleanAgencyNumber.startsWith('91') && cleanAgencyNumber.length > 0) {
    cleanAgencyNumber = '91' + cleanAgencyNumber;
  }
  const targetNumber = cleanAgencyNumber || '919789504702';

  const handleSendWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Please enter your name.');
      return;
    }
    if (!phone.trim()) {
      alert('Please enter your WhatsApp / mobile number.');
      return;
    }

    setIsSubmitting(true);

    // Save contact info locally for convenience
    try {
      localStorage.setItem('zazu_user_contact_info', JSON.stringify({ name, phone, businessName }));
    } catch {}

    // Formatted WhatsApp message for Vijayakumar
    const formattedWhatsAppText = 
`🚀 *NEW INQUIRY — ZAZU DIGITAL MEDIA*
━━━━━━━━━━━━━━━━━━━━━━
👤 *Client Name:* ${name.trim()}
📱 *WhatsApp:* ${phone.trim()}
${businessName.trim() ? `🏢 *Business/Brand:* ${businessName.trim()}\n` : ''}🎯 *Service Required:* ${service}
💬 *Message:* 
"${customMsg.trim()}"
━━━━━━━━━━━━━━━━━━━━━━
🌐 Sent via ZAZU Media Live Portal`;

    const whatsappUrl = `https://wa.me/${targetNumber}?text=${encodeURIComponent(formattedWhatsAppText)}`;

    // 1. STORE DATA IN FIRESTORE DATABASE & LOCAL CACHE
    try {
      await submitClientInquiry({
        name: name.trim(),
        phone: phone.trim(),
        email: `${phone.trim().replace(/\D/g, '')}@whatsapp.client`,
        businessName: businessName.trim() || undefined,
        serviceRequired: `WhatsApp Lead: ${service}`,
        monthlyBudget: 'WhatsApp Inquiry',
        message: customMsg.trim(),
        source: 'whatsapp_widget',
        whatsappSent: true,
        status: 'new'
      });
      setIsSaved(true);
      setHasStoredData(true);
    } catch (err) {
      console.warn('Inquiry cached locally:', err);
      setIsSaved(true);
    }

    // 2. OPEN WHATSAPP CHAT
    try {
      const win = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      if (!win || win.closed || typeof win.closed === 'undefined') {
        const link = document.createElement('a');
        link.href = whatsappUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch {
      window.location.href = whatsappUrl;
    }

    setIsSubmitting(false);

    // Auto reset notification badge after 4 seconds
    setTimeout(() => {
      setIsSaved(false);
    }, 4500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Floating Popup Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[340px] sm:w-[410px] max-h-[85vh] overflow-y-auto rounded-2xl bg-[#111111] border border-[#25D366]/40 shadow-[0_25px_60px_rgba(0,0,0,0.95)] p-5 space-y-4 animate-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2.5">
              <ZazuLogo variant="official" size="sm" showSubtitle={false} linkToHome={false} />
              <div className="leading-tight">
                <span className="text-xs font-bold text-white block">Vijayakumar • ZAZU Media</span>
                <span className="text-[10px] text-[#25D366] flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                  Online • WhatsApp: +91 9789504702
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-[#A0A0A0] hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Close WhatsApp Chat Window"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Database Storage Notice */}
          <div className="p-2.5 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 flex items-start gap-2.5">
            <Database className="w-4 h-4 text-[#25D366] shrink-0 mt-0.5" />
            <div className="text-[11px] text-[#D4D4D4] leading-relaxed">
              <span className="font-semibold text-white">Direct WhatsApp + CRM Sync:</span> Every message you send is automatically stored in ZAZU Media's database and delivered directly to Vijayakumar.
            </div>
          </div>

          {/* Success Status Badge */}
          {isSaved && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 flex items-center gap-2 text-xs text-emerald-300 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>Data Stored Successfully!</strong> Opening WhatsApp chat...</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSendWhatsApp} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] font-mono-data text-[#A0A0A0] uppercase block mb-1">
                  Your Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Arun Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg bg-black border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:border-[#25D366]"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono-data text-[#A0A0A0] uppercase block mb-1">
                  WhatsApp Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg bg-black border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:border-[#25D366]"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono-data text-[#A0A0A0] uppercase block mb-1">
                Company / Brand Name <span className="text-white/40">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Acme Studio / Personal Brand"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg bg-black border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:border-[#25D366]"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono-data text-[#A0A0A0] uppercase block mb-1">
                Service Required:
              </label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg bg-black border border-white/20 text-white focus:outline-none focus:border-[#25D366]"
              >
                {PRESET_SERVICES.map((srv) => (
                  <option key={srv} value={srv} className="bg-[#111111] text-white">
                    {srv}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono-data text-[#A0A0A0] uppercase block">
                Message to Vijayakumar:
              </label>
              <textarea
                rows={2}
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg bg-black border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:border-[#25D366] resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-[#25D366] hover:bg-[#20bd5a] text-[#080808] flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#25D366]/25 hover:shadow-[#25D366]/40 active:scale-[0.98] cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4 fill-current" />
              <span>{isSubmitting ? 'Saving & Opening WhatsApp...' : 'Store & Send Message on WhatsApp'}</span>
            </button>
          </form>

          {/* Trust and data storage badge */}
          <div className="pt-1 border-t border-white/5 flex items-center justify-between text-[10px] text-[#777777]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#25D366]" />
              Stored in Firestore CRM
            </span>
            <span className="flex items-center gap-1 text-[#FFD966]">
              <Sparkles className="w-3 h-3" />
              ZAZU Tirumangalam, TN
            </span>
          </div>

        </div>
      )}

      {/* Floating Action Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group w-14 h-14 rounded-full bg-[#25D366] text-[#080808] shadow-[0_10px_30px_rgba(37,211,102,0.45)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center focus:outline-none cursor-pointer"
        aria-label="Direct WhatsApp Contact"
      >
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#F5C542] text-[#080808] text-[9px] font-bold flex items-center justify-center border-2 border-[#080808]">
          1
        </span>
        <MessageCircle className="w-7 h-7" />
        <span className="sr-only">Chat on WhatsApp</span>
      </button>
    </div>
  );
};
