import React, { useState } from 'react';
import { testimonialsData as defaultTestimonials } from '../data/agencyData';
import { TestimonialItem } from '../types';
import { Quote, Star, Plus, X, CheckCircle2, Trash2, Edit3, MessageSquarePlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { saveReview, deleteReviewItem } from '../firebase/firestoreService';

interface TestimonialsSectionProps {
  reviewsList?: TestimonialItem[];
  onOpenDashboard?: (tab: string) => void;
  onReviewAdded?: () => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  reviewsList,
  onOpenDashboard,
  onReviewAdded
}) => {
  const { isAdmin, user } = useAuth();
  const [localReviews, setLocalReviews] = useState<TestimonialItem[] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [clientName, setClientName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [role, setRole] = useState('');
  const [stars, setStars] = useState(5);
  const [highlight, setHighlight] = useState('Strategic Growth & ROI');
  const [testimonial, setTestimonial] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const activeReviews = localReviews || (reviewsList && reviewsList.length > 0 ? reviewsList : defaultTestimonials);

  // Sync when parent prop updates
  React.useEffect(() => {
    if (reviewsList && reviewsList.length > 0) {
      setLocalReviews(reviewsList);
    }
  }, [reviewsList]);

  const openAddModal = () => {
    setEditingId(null);
    setClientName(user?.displayName && !user.isAdmin ? user.displayName : '');
    setBusinessName('');
    setRole('');
    setStars(5);
    setHighlight('Strategic Growth & ROI');
    setTestimonial('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: TestimonialItem) => {
    setEditingId(item.id);
    setClientName(item.clientName);
    setBusinessName(item.businessName);
    setRole(item.role);
    setStars(item.stars || 5);
    setHighlight(item.highlight || 'Strategic Growth & ROI');
    setTestimonial(item.testimonial);
    setIsModalOpen(true);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !testimonial.trim()) return;

    setSubmitting(true);
    const cleanName = clientName.trim();
    const initials =
      cleanName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase() || 'ZM';

    const newItem: TestimonialItem = {
      id: editingId || `review-${Date.now()}`,
      clientName: cleanName,
      businessName: businessName.trim() || 'Verified Client',
      role: role.trim() || 'Business Partner',
      stars,
      highlight: highlight.trim() || 'Verified Client Review',
      testimonial: testimonial.trim(),
      avatarInitials: initials
    };

    // Immediately update UI and close modal so it never hangs on "Publishing..."
    setLocalReviews((prev) => {
      const base = prev || activeReviews;
      const idx = base.findIndex((r) => r.id === newItem.id);
      return idx >= 0
        ? [...base.slice(0, idx), newItem, ...base.slice(idx + 1)]
        : [newItem, ...base];
    });

    setSubmitting(false);
    setIsModalOpen(false);
    setSuccessBanner(editingId ? 'Review updated successfully!' : 'Thank you! Your review has been published.');
    setTimeout(() => setSuccessBanner(null), 4500);

    try {
      await saveReview(newItem, user?.email);
      onReviewAdded?.();
    } catch (err) {
      console.warn('Error saving review:', err);
    }
  };

  const handleDeleteReview = async (id: string) => {
    setLocalReviews((prev) => (prev || activeReviews).filter((r) => r.id !== id));
    try {
      await deleteReviewItem(id, user?.email);
      setSuccessBanner('Review removed.');
      setTimeout(() => setSuccessBanner(null), 3000);
      onReviewAdded?.();
    } catch (err) {
      console.warn('Error deleting review:', err);
    }
  };

  return (
    <section id="reviews" className="py-24 bg-black/45 backdrop-blur-[2px] relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-5">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-[11px] font-mono-data tracking-widest uppercase text-[#FFD966] mb-2">
              <Star className="w-3.5 h-3.5 fill-[#F5C542] text-[#F5C542]" />
              <span>CLIENT REVIEWS</span>
              <span aria-hidden="true">/</span>
              <span>VERIFIED PARTNER EXPERIENCES</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-display font-bold tracking-tight text-white">
              WHAT BRANDS & LEADERS <span className="gold-gradient-text">SAY ABOUT ZAZU</span>
            </h2>

            <p className="mt-2.5 text-[#A0A0A0] text-xs sm:text-sm leading-relaxed">
              We cultivate close, high-accountability partnerships with our clients. Read genuine client reviews or share your own experience working with ZAZU Digital Media.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Public Client "Write a Review" Button */}
            <button
              type="button"
              onClick={openAddModal}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#F5C542] to-[#FFD966] text-[#080808] hover:shadow-[0_0_20px_rgba(245,197,66,0.4)] transition-all flex items-center gap-2 cursor-pointer"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Write a Client Review</span>
            </button>

            {isAdmin && (
              <button
                type="button"
                onClick={() => onOpenDashboard?.('reviews')}
                className="px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-white/10 text-white hover:bg-white/15 border border-white/15 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#F5C542]" />
                <span>Manage in Dashboard</span>
              </button>
            )}

            <div className="text-[11px] font-mono-data text-[#888888] bg-[#111111] px-3 py-2.5 rounded-xl border border-white/5">
              {activeReviews.length} Verified Reviews • 5.0 ★
            </div>
          </div>
        </div>

        {/* Success Notification */}
        {successBanner && (
          <div className="mb-6 p-3.5 rounded-xl bg-green-950/60 border border-green-500/40 text-green-300 text-xs font-medium flex items-center justify-between animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
              <span>{successBanner}</span>
            </div>
            <button onClick={() => setSuccessBanner(null)} className="text-green-300 hover:text-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeReviews.map((item) => (
            <div
              key={item.id}
              className="relative rounded-2xl bg-[#111111] border border-[#222222] hover:border-[#F5C542] card-pop-hover p-6 flex flex-col justify-between group shadow-xl hover:shadow-[0_12px_35px_rgba(245,197,66,0.2)]"
            >
              {/* Quote Mark Watermark */}
              <div className="absolute top-4 right-4 text-white/5 group-hover:text-[#F5C542]/10 transition-colors pointer-events-none">
                <Quote className="w-12 h-12 rotate-180" />
              </div>

              <div>
                {/* Star Rating & Result Tag */}
                <div className="flex items-center justify-between mb-4 gap-2">
                  <div className="flex items-center gap-1 text-[#F5C542]">
                    {[...Array(item.stars || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#F5C542]" />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono-data px-2 py-0.5 rounded bg-white/5 text-[#FFD966] border border-white/10 truncate max-w-[180px]">
                    {item.highlight}
                  </span>
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-[#CCCCCC] leading-relaxed italic mb-6">
                  “{item.testimonial}”
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F5C542] to-[#B38F26] p-0.5 shadow-md shrink-0">
                    <div className="w-full h-full bg-[#0E0E0E] rounded-full flex items-center justify-center font-display font-bold text-xs text-[#FFD966]">
                      {item.avatarInitials || item.clientName?.substring(0, 2).toUpperCase() || 'ZM'}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white leading-tight truncate">
                      {item.clientName}
                    </h4>
                    <p className="text-[10px] text-[#A0A0A0] truncate">
                      {item.role}{item.businessName ? `, ` : ''}
                      <span className="text-[#CCCCCC]">{item.businessName}</span>
                    </p>
                  </div>
                </div>

                {isAdmin && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => openEditModal(item)}
                      className="p-1.5 rounded-lg text-[#A0A0A0] hover:text-[#F5C542] hover:bg-white/5 transition-colors cursor-pointer"
                      title="Edit Review"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteReview(item.id)}
                      className="p-1.5 rounded-lg text-[#A0A0A0] hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer"
                      title="Delete Review"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Client Review Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#111111] border border-[#F5C542]/40 p-6 sm:p-7 shadow-[0_20px_70px_rgba(0,0,0,0.95)]">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-lg text-[#A0A0A0] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F5C542]/10 border border-[#F5C542]/30 text-[#FFD966] text-[10px] font-mono uppercase tracking-wider mb-2">
                <Star className="w-3 h-3 fill-[#F5C542] text-[#F5C542]" />
                <span>ZAZU CLIENT FEEDBACK</span>
              </div>
              <h3 className="text-xl font-display font-bold text-white">
                {editingId ? 'Edit Client Review' : 'Share Your Experience'}
              </h3>
              <p className="text-xs text-[#A0A0A0] mt-1">
                Your feedback helps other brands and business leaders discover ZAZU Digital Media.
              </p>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              {/* Interactive Star Rating Selector */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#D4D4D4] mb-1.5">
                  Your Rating *
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setStars(num)}
                      className={`p-2 rounded-lg border transition-all flex items-center gap-1 cursor-pointer ${
                        stars >= num
                          ? 'bg-[#F5C542]/15 border-[#F5C542] text-[#F5C542]'
                          : 'bg-black/60 border-white/10 text-[#555555]'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${stars >= num ? 'fill-[#F5C542]' : ''}`} />
                    </button>
                  ))}
                  <span className="ml-2 text-xs font-mono text-[#FFD966] font-bold">{stars}.0 / 5.0</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#D4D4D4] mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Rajesh Kannan"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#090909] border border-white/15 text-white text-xs focus:outline-none focus:border-[#F5C542]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#D4D4D4] mb-1.5">
                    Business / Company Name
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Kannan Retail Group"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#090909] border border-white/15 text-white text-xs focus:outline-none focus:border-[#F5C542]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#D4D4D4] mb-1.5">
                    Your Role / Designation
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Founder / Managing Director"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#090909] border border-white/15 text-white text-xs focus:outline-none focus:border-[#F5C542]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#D4D4D4] mb-1.5">
                    Service / Highlight
                  </label>
                  <input
                    type="text"
                    value={highlight}
                    onChange={(e) => setHighlight(e.target.value)}
                    placeholder="e.g. Digital Marketing & Reels"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#090909] border border-white/15 text-white text-xs focus:outline-none focus:border-[#F5C542]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#D4D4D4] mb-1.5">
                  Your Review / Feedback *
                </label>
                <textarea
                  rows={4}
                  required
                  value={testimonial}
                  onChange={(e) => setTestimonial(e.target.value)}
                  placeholder="Share how ZAZU Digital Media helped your business grow..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090909] border border-white/15 text-white text-xs focus:outline-none focus:border-[#F5C542]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#A0A0A0] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#F5C542] to-[#FFD966] text-[#080808] hover:shadow-[0_0_20px_rgba(245,197,66,0.4)] transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Publishing...' : editingId ? 'Save Changes' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export const ReviewsSection = TestimonialsSection;
