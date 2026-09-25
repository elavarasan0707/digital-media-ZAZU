import React, { useState } from 'react';
import { X, Check, RotateCcw, Settings } from 'lucide-react';
import { AgencyContactConfig } from '../types';
import { initialAgencyConfig } from '../data/agencyData';

interface AgencyConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AgencyContactConfig;
  onSave: (updated: AgencyContactConfig) => void;
}

export const AgencyConfigModal: React.FC<AgencyConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave
}) => {
  const [formData, setFormData] = useState<AgencyContactConfig>(config);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleReset = () => {
    setFormData(initialAgencyConfig);
    onSave(initialAgencyConfig);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#111111] border border-[#F5C542]/40 p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#F5C542]/10 border border-[#F5C542]/30 flex items-center justify-center text-[#F5C542]">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-white">Agency Details Customizer</h3>
              <p className="text-xs text-[#A0A0A0]">Update live contact placeholders without editing code</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#A0A0A0] hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div>
            <label className="text-[10px] text-[#A0A0A0] uppercase font-mono-data block mb-1">
              Agency Email Address (Email: [ADD EMAIL])
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2.5 rounded-lg bg-black border border-white/20 text-white focus:outline-none focus:border-[#F5C542]"
            />
          </div>

          <div>
            <label className="text-[10px] text-[#A0A0A0] uppercase font-mono-data block mb-1">
              Agency Phone Number (Phone: [ADD PHONE])
            </label>
            <input
              type="text"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full p-2.5 rounded-lg bg-black border border-white/20 text-white focus:outline-none focus:border-[#F5C542]"
            />
          </div>

          <div>
            <label className="text-[10px] text-[#A0A0A0] uppercase font-mono-data block mb-1">
              Agency WhatsApp Number (WhatsApp: [ADD WHATSAPP])
            </label>
            <input
              type="text"
              required
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              className="w-full p-2.5 rounded-lg bg-black border border-white/20 text-white focus:outline-none focus:border-[#F5C542]"
            />
          </div>

          <div>
            <label className="text-[10px] text-[#A0A0A0] uppercase font-mono-data block mb-1">
              Agency Location (Location: [ADD LOCATION])
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full p-2.5 rounded-lg bg-black border border-white/20 text-white focus:outline-none focus:border-[#F5C542]"
            />
          </div>

          <div>
            <label className="text-[10px] text-[#A0A0A0] uppercase font-mono-data block mb-1">
              Calendly / Booking Link
            </label>
            <input
              type="url"
              placeholder="https://calendly.com/your-agency"
              value={formData.bookingUrl}
              onChange={(e) => setFormData({ ...formData, bookingUrl: e.target.value })}
              className="w-full p-2.5 rounded-lg bg-black border border-white/20 text-white focus:outline-none focus:border-[#F5C542]"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-[#A0A0A0] hover:text-white hover:bg-white/5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-xs text-[#A0A0A0] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-xs font-bold bg-[#F5C542] text-[#080808] hover:bg-[#FFD966] transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>Save Live Changes</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
