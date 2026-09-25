import React, { useState, useEffect } from 'react';
import { sampleBookingSlots } from '../data/agencyData';
import { Calendar as CalendarIcon, Clock, CheckCircle, ExternalLink, Shield, MessageCircle } from 'lucide-react';
import { AgencyContactConfig, BookingRecord } from '../types';
import { submitClientInquiry, fetchBookings, saveBooking } from '../firebase/firestoreService';

interface BookingSectionProps {
  agencyConfig: AgencyContactConfig;
}

export const BookingSection: React.FC<BookingSectionProps> = ({ agencyConfig }) => {
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedTime, setSelectedTime] = useState<string>('10:30 AM');
  const [selectedTopic, setSelectedTopic] = useState<string>('Full-Funnel Digital Growth Audit');
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [isBooked, setIsBooked] = useState(false);
  const [bookedList, setBookedList] = useState<BookingRecord[]>([]);

  // Load booked slots from Firestore & cache
  useEffect(() => {
    let isMounted = true;
    const loadBookings = async () => {
      try {
        const records = await fetchBookings();
        if (isMounted) {
          setBookedList(records);
        }
      } catch (err) {
        console.warn('Could not load bookings:', err);
      }
    };
    loadBookings();
    return () => {
      isMounted = false;
    };
  }, []);

  // Generate next 6 weekdays starting tomorrow
  const days = [
    { day: 'Mon', date: '28 Sep', label: 'Monday, Sep 28' },
    { day: 'Tue', date: '29 Sep', label: 'Tuesday, Sep 29' },
    { day: 'Wed', date: '30 Sep', label: 'Wednesday, Sep 30' },
    { day: 'Thu', date: '01 Oct', label: 'Thursday, Oct 1' },
    { day: 'Fri', date: '02 Oct', label: 'Friday, Oct 2' },
    { day: 'Mon', date: '05 Oct', label: 'Monday, Oct 5' }
  ];

  // Auto-switch to an available slot if selected slot is already booked for this date
  useEffect(() => {
    const currentDay = days[selectedDateIndex];
    if (!currentDay) return;

    const currentSlotIsTaken = !sampleBookingSlots.find((s) => s.time === selectedTime)?.available ||
      bookedList.some((b) => b.slotKey === `${currentDay.date}_${selectedTime}`);

    if (currentSlotIsTaken) {
      const firstAvailable = sampleBookingSlots.find((s) =>
        s.available && !bookedList.some((b) => b.slotKey === `${currentDay.date}_${s.time}`)
      );
      if (firstAvailable) {
        setSelectedTime(firstAvailable.time);
      }
    }
  }, [selectedDateIndex, bookedList]);

  const topics = [
    'Full-Funnel Digital Growth Audit',
    'Paid Ad Performance & ROAS Scaling',
    'SEO & Organic Search Dominance',
    'Creative & Brand Strategy',
    'Turnkey Growth & Acquisition Funnels'
  ];

  const getBookingWhatsAppUrl = () => {
    const rawNumber = agencyConfig.whatsapp || agencyConfig.phone || '9789504702';
    let digits = rawNumber.replace(/\D/g, '');
    if (digits.length === 10) {
      digits = '91' + digits;
    } else if (!digits.startsWith('91') && digits.length > 0) {
      digits = '91' + digits;
    }
    const target = digits || '919789504702';
    const waText = `*Consultation Booking Request - ZAZU Digital Media*
*Name:* ${bookingForm.name}
*Email:* ${bookingForm.email}
*Phone:* ${bookingForm.phone || 'N/A'}
*Selected Window:* ${days[selectedDateIndex]?.label} at ${selectedTime}
*Topic:* ${selectedTopic}
*Notes:* ${bookingForm.notes || 'None'}`;
    return `https://wa.me/${target}?text=${encodeURIComponent(waText)}`;
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.email) return;

    const currentDay = days[selectedDateIndex];
    const slotKey = `${currentDay.date}_${selectedTime}`;

    // Verify slot isn't already taken
    if (bookedList.some((b) => b.slotKey === slotKey)) {
      return;
    }

    setIsBooked(true);

    const newBookingData = {
      slotKey,
      dateLabel: currentDay.label,
      time: selectedTime,
      name: bookingForm.name,
      email: bookingForm.email,
      phone: bookingForm.phone || 'N/A',
      topic: selectedTopic,
      notes: bookingForm.notes || ''
    };

    // 1. Lock slot permanently in Database (Firestore bookings collection)
    saveBooking(newBookingData).then((saved) => {
      setBookedList((prev) => [saved, ...prev]);
    }).catch((err) => {
      console.warn('Booking database save notice:', err);
    });

    // 2. Also save to Inquiries collection for agency records
    submitClientInquiry({
      name: bookingForm.name,
      email: bookingForm.email,
      phone: bookingForm.phone || 'N/A',
      serviceRequired: `Consultation: ${selectedTopic} (${currentDay.label} at ${selectedTime})`,
      monthlyBudget: bookingForm.notes || 'Consultation Session',
      message: `30-Minute Consultation Request: ${currentDay.label} at ${selectedTime}. Focus: ${selectedTopic}. Current Budget/Goal: ${bookingForm.notes || 'N/A'}`,
      source: 'booking',
      whatsappSent: true,
      status: 'new'
    }).catch((err) => {
      console.warn('Booking inquiry save notice:', err);
    });

    // 3. Route directly to WhatsApp (+91 9789504702)
    const waUrl = getBookingWhatsAppUrl();
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
      // Handled via confirmation button
    }
  };

  return (
    <section id="booking" className="py-24 bg-black/50 backdrop-blur-[2px] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 text-[11px] font-mono-data tracking-widest uppercase text-[#FFD966] mb-2">
            <span>STRATEGY SESSION</span>
            <span aria-hidden="true">/</span>
            <span>DIRECT ACCESS</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-display font-bold tracking-tight text-white">
            BOOK YOUR FREE <span className="gold-gradient-text">30-MINUTE CONSULTATION</span>
          </h2>

          <p className="mt-2.5 text-[#A0A0A0] text-xs sm:text-sm leading-relaxed">
            Select a preferred window to speak directly with our senior growth strategists. We examine your current traffic channels, conversion bottlenecks, and construct a high-impact 90-day trajectory.
          </p>
        </div>

        {/* Booking Card Interface */}
        <div className="rounded-3xl bg-[#111111] border border-[#222222] shadow-[0_25px_60px_rgba(0,0,0,0.9)] p-6 sm:p-10">
          
          {/* Integration Connection Banner */}
          <div className="mb-8 p-4 rounded-xl bg-black/50 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#F5C542]/10 border border-[#F5C542]/30 flex items-center justify-center text-[#F5C542] shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold text-white block">Ready for Direct Calendar Sync</span>
                <span className="text-[#A0A0A0]">
                  Configured to connect directly with your Calendly, Google Calendar, or Wix Bookings URL.
                </span>
              </div>
            </div>

            {agencyConfig.bookingUrl && (
              <a
                href={agencyConfig.bookingUrl}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#F5C542]/40 text-[#FFD966] hover:bg-[#F5C542]/10 transition-colors"
              >
                <span>External Calendar Link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {isBooked ? (
            /* Confirmation State */
            <div className="text-center py-12 px-4 max-w-xl mx-auto space-y-4 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-[#F5C542]/10 border-2 border-[#F5C542] flex items-center justify-center text-[#F5C542] mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-display font-bold text-white">
                Consultation Request Reserved!
              </h3>
              <p className="text-sm text-[#A0A0A0] leading-relaxed">
                Thank you, <span className="text-white font-semibold">{bookingForm.name}</span>. We have reserved your requested window for <span className="text-[#FFD966] font-semibold">{days[selectedDateIndex].label} at {selectedTime}</span>.
              </p>
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-xs text-[#D4D4D4] text-left space-y-1">
                <div><strong className="text-white">Topic:</strong> {selectedTopic}</div>
                <div><strong className="text-white">Email:</strong> {bookingForm.email}</div>
                <div><strong className="text-white">Format:</strong> 30-Minute Private Google Meet / Zoom Video Call</div>
              </div>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={getBookingWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-[#080808] font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Confirm on WhatsApp</span>
                </a>
                <button
                  onClick={() => setIsBooked(false)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#222222] hover:bg-[#333333] text-xs font-semibold text-white transition-colors"
                >
                  Schedule Another Slot
                </button>
              </div>
            </div>
          ) : (
            /* Booking Form Flow */
            <form onSubmit={handleConfirmBooking} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Date & Time Selection (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Date Selection */}
                <div>
                  <label className="text-xs font-mono-data uppercase text-[#A0A0A0] block mb-3 flex items-center gap-2">
                    <CalendarIcon className="w-3.5 h-3.5 text-[#F5C542]" />
                    <span>1. Select Preferred Date</span>
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {days.map((item, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setSelectedDateIndex(idx)}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          selectedDateIndex === idx
                            ? 'bg-[#F5C542] text-[#080808] border-[#F5C542] shadow-[0_0_15px_rgba(245,197,66,0.3)] font-bold'
                            : 'bg-black/40 text-[#A0A0A0] hover:text-white border-white/5 hover:border-white/20'
                        }`}
                      >
                        <span className="block text-[11px] uppercase">{item.day}</span>
                        <span className="block text-sm font-mono-data mt-1">{item.date}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Selection */}
                <div>
                  <label className="text-xs font-mono-data uppercase text-[#A0A0A0] block mb-3 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#F5C542]" />
                    <span>2. Select Time Window (EST / GMT / Local)</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {sampleBookingSlots.map((slot, idx) => {
                      const currentDay = days[selectedDateIndex];
                      const slotKey = currentDay ? `${currentDay.date}_${slot.time}` : '';
                      const isSlotBookedInDb = bookedList.some((b) => b.slotKey === slotKey);
                      const isAvailable = slot.available && !isSlotBookedInDb;

                      return (
                        <button
                          type="button"
                          key={idx}
                          disabled={!isAvailable}
                          onClick={() => setSelectedTime(slot.time)}
                          className={`p-3 rounded-xl border text-xs font-mono-data font-semibold transition-all relative ${
                            !isAvailable
                              ? 'opacity-40 cursor-not-allowed bg-black/40 border-red-500/20 text-[#666666]'
                              : selectedTime === slot.time
                              ? 'bg-[#FFD966] text-[#080808] border-[#FFD966] shadow-[0_0_15px_rgba(255,217,102,0.3)] font-bold'
                              : 'bg-black/40 text-[#D4D4D4] hover:text-white border-white/5 hover:border-white/20'
                          }`}
                        >
                          <span>{slot.time}</span>
                          {!isAvailable && (
                            <span className="block text-[9px] font-bold text-red-400 uppercase tracking-wider mt-0.5">
                              Booked
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Focus Topic Selection */}
                <div>
                  <label className="text-xs font-mono-data uppercase text-[#A0A0A0] block mb-2">
                    3. Primary Session Focus
                  </label>
                  <select
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    className="w-full p-3 rounded-xl bg-black/60 border border-white/10 text-white text-xs focus:outline-none focus:border-[#F5C542]"
                  >
                    {topics.map((t, idx) => (
                      <option key={idx} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Right Column: Contact Details & Submit (5 cols) */}
              <div className="lg:col-span-5 p-6 rounded-2xl bg-black/40 border border-white/5 space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-white border-b border-white/10 pb-3">
                  Attendee Details
                </h4>

                <div>
                  <label className="text-[11px] text-[#A0A0A0] block mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Mitchell"
                    value={bookingForm.name}
                    onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-black border border-white/10 text-white text-xs focus:outline-none focus:border-[#F5C542]"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[#A0A0A0] block mb-1">Business Work Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="sarah@company.com"
                    value={bookingForm.email}
                    onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-black border border-white/10 text-white text-xs focus:outline-none focus:border-[#F5C542]"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[#A0A0A0] block mb-1">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 9789504702"
                    value={bookingForm.phone}
                    onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-black border border-white/10 text-white text-xs focus:outline-none focus:border-[#F5C542]"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[#A0A0A0] block mb-1">Current Monthly Budget or Goal</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹35,000 - ₹1,50,000 / mo"
                    value={bookingForm.notes}
                    onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-black border border-white/10 text-white text-xs focus:outline-none focus:border-[#F5C542]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl font-bold text-xs bg-gradient-to-r from-[#F5C542] via-[#FFD966] to-[#F5C542] text-[#080808] shadow-[0_0_20px_rgba(245,197,66,0.35)] hover:shadow-[0_0_30px_rgba(245,197,66,0.5)] transition-all"
                  >
                    CONFIRM 30-MINUTE CONSULTATION
                  </button>
                  <span className="text-[10px] text-[#777777] text-center block mt-2">
                    No credit card required • Instant calendar dispatch
                  </span>
                </div>

              </div>

            </form>
          )}

        </div>

      </div>
    </section>
  );
};
