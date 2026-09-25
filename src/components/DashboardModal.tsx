import React, { useState, useEffect } from 'react';
import { useAuth, ADMIN_EMAIL } from '../context/AuthContext';
import {
  fetchSiteConfig,
  saveSiteConfig,
  fetchWorks,
  saveWork,
  deleteWorkItem,
  fetchReviews,
  saveReview,
  deleteReviewItem,
  fetchServices,
  saveService,
  deleteServiceItem,
  fetchClientInquiries,
  deleteInquiryItem,
  updateInquiryStatus,
  submitClientInquiry,
  fetchBookings,
  deleteBookingItem
} from '../firebase/firestoreService';
import {
  AgencyContactConfig,
  CaseStudyItem,
  TestimonialItem,
  ServiceItem,
  ClientInquiry,
  BookingRecord
} from '../types';
import {
  X,
  Home,
  User,
  HelpCircle,
  Briefcase,
  Layers,
  FolderGit2,
  Star,
  Mail,
  Plus,
  Trash2,
  Edit,
  Save,
  CheckCircle2,
  ShieldCheck,
  ShieldAlert,
  Phone,
  MapPin,
  ExternalLink,
  MessageCircle,
  Database,
  IndianRupee,
  RefreshCw,
  Calendar,
  Download,
  Search,
  Filter,
  PhoneCall,
  Sparkles,
  Send,
  FileSpreadsheet
} from 'lucide-react';

interface DashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: string;
  onDataChange?: () => void;
}

type TabType = 'home' | 'leads' | 'about' | 'why-zazu' | 'services' | 'process' | 'works' | 'reviews' | 'bookings' | 'contact';

export const DashboardModal: React.FC<DashboardModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'home',
  onDataChange
}) => {
  const { user, isAdmin, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>((initialTab as TabType) || 'home');

  // State data
  const [siteConfig, setSiteConfig] = useState<AgencyContactConfig | null>(null);
  const [works, setWorks] = useState<CaseStudyItem[]>([]);
  const [reviews, setReviews] = useState<TestimonialItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [inquiries, setInquiries] = useState<ClientInquiry[]>([]);
  const [bookingsList, setBookingsList] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // CRM Filters
  const [leadsFilter, setLeadsFilter] = useState<'all' | 'whatsapp' | 'website' | 'quote'>('all');
  const [leadsSearch, setLeadsSearch] = useState('');

  // Editing forms
  const [editingWork, setEditingWork] = useState<Partial<CaseStudyItem> | null>(null);
  const [editingReview, setEditingReview] = useState<Partial<TestimonialItem> | null>(null);
  const [editingService, setEditingService] = useState<Partial<ServiceItem> | null>(null);
  const [editingAboutText, setEditingAboutText] = useState('');

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [cfg, w, r, s, b] = await Promise.all([
        fetchSiteConfig(),
        fetchWorks(),
        fetchReviews(),
        fetchServices(),
        fetchBookings()
      ]);
      setSiteConfig(cfg);
      setEditingAboutText(cfg.aboutVijayakumar || '');
      setWorks(w);
      setReviews(r);
      setServices(s);
      setBookingsList(b);

      if (isAdmin) {
        try {
          const inq = await fetchClientInquiries(user?.email);
          setInquiries(inq);
        } catch {
          try {
            const local = localStorage.getItem('zazu_inquiries_cache');
            if (local) setInquiries(JSON.parse(local));
          } catch {}
        }
      } else {
        try {
          const local = localStorage.getItem('zazu_inquiries_cache');
          if (local) setInquiries(JSON.parse(local));
        } catch {}
      }
    } catch (err: any) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadAllData();
    }
  }, [isOpen, isAdmin]);

  if (!isOpen) return null;

  const showFeedback = (type: 'success' | 'error', text: string) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg(null), 4000);
  };

  // Handlers for Work
  const handleSaveWork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      showFeedback('error', 'Only digitalmediazazu@gmail.com can add or edit works.');
      return;
    }
    if (!editingWork || !editingWork.title) return;
    try {
      await saveWork(editingWork, user?.email);
      showFeedback('success', 'Work item saved to Firestore!');
      setEditingWork(null);
      await loadAllData();
      onDataChange?.();
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to save work.');
    }
  };

  const handleDeleteWork = async (id: string) => {
    if (!isAdmin) {
      showFeedback('error', 'Only digitalmediazazu@gmail.com can delete works.');
      return;
    }
    if (!confirm('Are you sure you want to delete this work item?')) return;
    try {
      await deleteWorkItem(id, user?.email);
      showFeedback('success', 'Work item deleted.');
      await loadAllData();
      onDataChange?.();
    } catch (err: any) {
      showFeedback('error', err.message);
    }
  };

  // Handlers for Review
  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      showFeedback('error', 'Only digitalmediazazu@gmail.com can add or edit reviews.');
      return;
    }
    if (!editingReview || !editingReview.clientName) return;
    try {
      await saveReview(editingReview, user?.email);
      showFeedback('success', 'Review saved to Firestore!');
      setEditingReview(null);
      await loadAllData();
      onDataChange?.();
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to save review.');
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!isAdmin) {
      showFeedback('error', 'Only digitalmediazazu@gmail.com can delete reviews.');
      return;
    }
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      await deleteReviewItem(id, user?.email);
      showFeedback('success', 'Review deleted.');
      await loadAllData();
      onDataChange?.();
    } catch (err: any) {
      showFeedback('error', err.message);
    }
  };

  // Handlers for Service
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      showFeedback('error', 'Only digitalmediazazu@gmail.com can add or edit services.');
      return;
    }
    if (!editingService || !editingService.title) return;
    try {
      await saveService(editingService, user?.email);
      showFeedback('success', 'Service saved to Firestore!');
      setEditingService(null);
      await loadAllData();
      onDataChange?.();
    } catch (err: any) {
      showFeedback('error', err.message);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!isAdmin) {
      showFeedback('error', 'Only digitalmediazazu@gmail.com can delete services.');
      return;
    }
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      await deleteServiceItem(id, user?.email);
      showFeedback('success', 'Service deleted.');
      await loadAllData();
      onDataChange?.();
    } catch (err: any) {
      showFeedback('error', err.message);
    }
  };

  // Handlers for About context & Contact Config
  const handleSaveAboutContext = async () => {
    if (!isAdmin) {
      showFeedback('error', 'Only digitalmediazazu@gmail.com can update About content.');
      return;
    }
    if (!siteConfig) return;
    try {
      const updated = { ...siteConfig, aboutVijayakumar: editingAboutText };
      await saveSiteConfig(updated, user?.email);
      setSiteConfig(updated);
      showFeedback('success', 'About Vijayakumar bio saved to Firestore & live site!');
      onDataChange?.();
    } catch (err: any) {
      showFeedback('error', err.message);
    }
  };

  const handleSaveContactConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      showFeedback('error', 'Only digitalmediazazu@gmail.com can update contact settings.');
      return;
    }
    if (!siteConfig) return;
    try {
      await saveSiteConfig(siteConfig, user?.email);
      showFeedback('success', 'Agency contact details updated!');
      onDataChange?.();
    } catch (err: any) {
      showFeedback('error', err.message);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    try {
      await deleteInquiryItem(id, user?.email);
      showFeedback('success', 'Inquiry removed.');
      const inq = isAdmin ? await fetchClientInquiries(user?.email) : JSON.parse(localStorage.getItem('zazu_inquiries_cache') || '[]');
      setInquiries(inq);
    } catch (err: any) {
      // Also remove from local state
      setInquiries(prev => prev.filter(i => i.id !== id));
      try {
        const local = JSON.parse(localStorage.getItem('zazu_inquiries_cache') || '[]');
        localStorage.setItem('zazu_inquiries_cache', JSON.stringify(local.filter((i: any) => i.id !== id)));
      } catch {}
      showFeedback('success', 'Inquiry removed from local view.');
    }
  };

  const handleStatusChange = async (inquiryId: string, newStatus: ClientInquiry['status']) => {
    try {
      await updateInquiryStatus(inquiryId, newStatus || 'new', user?.email);
      setInquiries(prev => prev.map(i => i.id === inquiryId ? { ...i, status: newStatus } : i));
      showFeedback('success', `Lead status updated to ${newStatus}`);
    } catch (err: any) {
      setInquiries(prev => prev.map(i => i.id === inquiryId ? { ...i, status: newStatus } : i));
      try {
        const local = JSON.parse(localStorage.getItem('zazu_inquiries_cache') || '[]');
        const updated = local.map((i: any) => i.id === inquiryId ? { ...i, status: newStatus } : i);
        localStorage.setItem('zazu_inquiries_cache', JSON.stringify(updated));
      } catch {}
      showFeedback('success', `Lead status updated locally to ${newStatus}`);
    }
  };

  const handleExportCSV = () => {
    if (inquiries.length === 0) {
      showFeedback('error', 'No client inquiries available to export.');
      return;
    }
    const headers = ['ID', 'Date', 'Name', 'Phone', 'Email', 'Business', 'Service Required', 'Budget', 'Source', 'Status', 'Message'];
    const rows = inquiries.map(inq => [
      `"${inq.id}"`,
      `"${new Date(inq.createdAt).toLocaleString()}"`,
      `"${(inq.name || '').replace(/"/g, '""')}"`,
      `"${(inq.phone || '').replace(/"/g, '""')}"`,
      `"${(inq.email || '').replace(/"/g, '""')}"`,
      `"${(inq.businessName || '').replace(/"/g, '""')}"`,
      `"${(inq.serviceRequired || '').replace(/"/g, '""')}"`,
      `"${(inq.monthlyBudget || '').replace(/"/g, '""')}"`,
      `"${(inq.source || 'website_form').replace(/"/g, '""')}"`,
      `"${(inq.status || 'new').replace(/"/g, '""')}"`,
      `"${(inq.message || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `zazu-leads-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showFeedback('success', 'Exported client leads to CSV successfully!');
  };

  const handleCreateTestLead = async () => {
    try {
      const sampleNames = ['Karthik Raman (Madurai)', 'Priya Sundaram (Chennai)', 'Venkatesh Babu (Tirumangalam)', 'Divya Textiles'];
      const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
      const sampleLead = await submitClientInquiry({
        name: randomName,
        phone: '+91 98401 23456',
        email: `${randomName.toLowerCase().replace(/[^a-z]/g, '')}@business.in`,
        businessName: `${randomName.split(' ')[0]} Enterprises`,
        serviceRequired: 'WhatsApp Lead: Video Editing & Reels',
        monthlyBudget: '₹35,000 / month',
        message: 'Hi Vijayakumar, looking for high-converting Instagram Reels and video marketing for our brand.',
        source: 'whatsapp_widget',
        whatsappSent: true,
        status: 'new'
      });
      setInquiries(prev => [sampleLead, ...prev]);
      showFeedback('success', 'Test WhatsApp Lead created and stored in Firestore database & local cache!');
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to create test lead');
    }
  };

  const handleReleaseSlot = async (id: string, name: string, dateLabel: string, time: string) => {
    if (!isAdmin) {
      showFeedback('error', 'Only digitalmediazazu@gmail.com can release booked slots.');
      return;
    }
    const confirmRelease = confirm(`Mark consultation with ${name} (${dateLabel} at ${time}) as completed and release the slot for new clients?`);
    if (!confirmRelease) return;

    try {
      await deleteBookingItem(id, user?.email);
      showFeedback('success', `Slot (${dateLabel} at ${time}) completed & released for new bookings!`);
      const updated = await fetchBookings();
      setBookingsList(updated);
      onDataChange?.();
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to release slot');
    }
  };

  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'leads', label: 'WhatsApp & Leads', icon: MessageCircle },
    { id: 'about', label: 'About', icon: User },
    { id: 'why-zazu', label: 'Why ZAZU', icon: HelpCircle },
    { id: 'services', label: 'Services', icon: Briefcase },
    { id: 'process', label: 'Process', icon: Layers },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'contact', label: 'Contact', icon: Mail }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-1 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl h-[95vh] sm:h-[90vh] flex flex-col rounded-2xl bg-[#0c0c0c] border border-[#262626] shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-3 sm:px-6 py-3 border-b border-white/10 bg-[#121212]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#F5C542]/10 border border-[#F5C542]/30 flex items-center justify-center text-[#F5C542] shrink-0">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xs sm:text-base font-display font-bold text-white tracking-wide truncate">
                  ZAZU DASHBOARD
                </h2>
                <span className="text-[9px] sm:text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#F5C542]/15 text-[#FFD966] border border-[#F5C542]/30 uppercase font-semibold">
                  Live
                </span>
              </div>
              <p className="hidden sm:block text-xs text-[#A0A0A0]">
                Manage website content, inquiries, and agency resources in real-time.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {isAdmin ? (
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="truncate max-w-[150px]">Admin</span>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#F5C542] text-[#080808] hover:bg-[#FFD966] transition-colors cursor-pointer"
                >
                  Login
                </button>
              </div>
            )}

            <button
              onClick={() => { loadAllData(); showFeedback('success', 'Refreshed latest data.'); }}
              title="Refresh"
              className="p-1.5 sm:p-2 rounded-lg text-[#A0A0A0] hover:text-white hover:bg-white/5 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-lg text-[#A0A0A0] hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Notification Banner */}
        {statusMsg && (
          <div
            className={`px-4 sm:px-6 py-2 text-xs font-medium flex items-center justify-between border-b ${
              statusMsg.type === 'success'
                ? 'bg-green-950/60 border-green-500/30 text-green-300'
                : 'bg-red-950/60 border-red-500/30 text-red-300'
            }`}
          >
            <span>{statusMsg.text}</span>
            <button onClick={() => setStatusMsg(null)}>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Main Body: Responsive Flex-Col on Mobile, Flex-Row on md+ */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Navigation Bar / Sidebar */}
          <div className="w-full md:w-52 bg-[#0E0E0E] border-b md:border-b-0 md:border-r border-white/5 p-2 md:p-3 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-y-auto shrink-0 scrollbar-none">
            <span className="hidden md:block text-[10px] font-mono uppercase text-[#666666] px-3 py-1 font-semibold">
              Sections & Views
            </span>

            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[#F5C542] text-[#080808] font-bold shadow-md shadow-[#F5C542]/20'
                      : 'text-[#A0A0A0] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}

            {/* Admin Notice on Sidebar (Desktop only to save mobile screen height) */}
            <div className="hidden md:block mt-auto p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] text-[#A0A0A0] space-y-1">
              <div className="flex items-center gap-1 text-[#FFD966] font-bold">
                {isAdmin ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                <span>{isAdmin ? 'Admin Mode' : 'Account'}</span>
              </div>
              <p className="text-[10px] text-[#888888] leading-tight">
                {isAdmin
                  ? 'Full administrative permissions enabled.'
                  : 'Sign in to access account actions.'}
              </p>
            </div>
          </div>

          {/* Tab Content Display Area */}
          <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto bg-[#090909]">
            
            {/* 1. HOME TAB */}
            {activeTab === 'home' && (
              <div className="space-y-6 max-w-4xl">
                <div>
                  <h3 className="text-xl font-display font-bold text-white">Dashboard Overview</h3>
                  <p className="text-xs text-[#A0A0A0]">
                    Real-time operational portal for ZAZU Digital Media.
                  </p>
                </div>

                {/* Metrics Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                  <div 
                    onClick={() => setActiveTab('leads')}
                    className="p-4 rounded-xl bg-[#131313] border border-white/10 hover:border-[#25D366]/40 cursor-pointer transition-all hover:bg-white/[0.03] group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase text-[#A0A0A0]">WhatsApp & Leads</span>
                      <span className="text-[9px] font-semibold text-[#25D366] bg-[#25D366]/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <MessageCircle className="w-2.5 h-2.5" /> View →
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-white mt-1 group-hover:text-[#25D366] transition-colors">{inquiries.length}</p>
                    <span className="text-[10px] text-[#FFD966]">Client Inquiries</span>
                  </div>

                  <div 
                    onClick={() => setActiveTab('bookings')}
                    className="p-4 rounded-xl bg-[#131313] border border-white/10 hover:border-[#F5C542]/40 cursor-pointer transition-all hover:bg-white/[0.03] group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase text-[#A0A0A0]">Bookings</span>
                      <span className="text-[9px] font-semibold text-[#F5C542] bg-[#F5C542]/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <Calendar className="w-2.5 h-2.5" /> View →
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-white mt-1 group-hover:text-[#F5C542] transition-colors">{bookingsList.length}</p>
                    <span className="text-[10px] text-[#FFD966]">Reserved Slots</span>
                  </div>

                  <div 
                    onClick={() => setActiveTab('works')}
                    className="p-4 rounded-xl bg-[#131313] border border-white/10 hover:border-white/30 cursor-pointer transition-all hover:bg-white/[0.03]"
                  >
                    <span className="text-[10px] font-mono uppercase text-[#A0A0A0]">Active Works</span>
                    <p className="text-2xl font-bold text-white mt-1">{works.length}</p>
                    <span className="text-[10px] text-[#FFD966]">Case Studies</span>
                  </div>

                  <div 
                    onClick={() => setActiveTab('reviews')}
                    className="p-4 rounded-xl bg-[#131313] border border-white/10 hover:border-white/30 cursor-pointer transition-all hover:bg-white/[0.03]"
                  >
                    <span className="text-[10px] font-mono uppercase text-[#A0A0A0]">Client Reviews</span>
                    <p className="text-2xl font-bold text-white mt-1">{reviews.length}</p>
                    <span className="text-[10px] text-[#FFD966]">5-Star Testimonials</span>
                  </div>

                  <div 
                    onClick={() => setActiveTab('services')}
                    className="p-4 rounded-xl bg-[#131313] border border-white/10 hover:border-white/30 cursor-pointer transition-all hover:bg-white/[0.03]"
                  >
                    <span className="text-[10px] font-mono uppercase text-[#A0A0A0]">Services</span>
                    <p className="text-2xl font-bold text-white mt-1">{services.length}</p>
                    <span className="text-[10px] text-[#FFD966]">Disciplines</span>
                  </div>
                </div>

                {/* Live Activity Feed: Latest Bookings & Inquiries */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Latest Consultation Bookings */}
                  <div className="p-5 rounded-2xl bg-[#111111] border border-white/10 space-y-3">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#F5C542]" />
                        <h4 className="text-sm font-bold text-white">Latest Consultation Bookings</h4>
                      </div>
                      <button
                        onClick={() => setActiveTab('bookings')}
                        className="text-xs text-[#F5C542] hover:underline font-semibold"
                      >
                        All Bookings ({bookingsList.length}) →
                      </button>
                    </div>

                    {bookingsList.length === 0 ? (
                      <p className="text-xs text-[#777777] py-4 text-center">No consultation bookings yet.</p>
                    ) : (
                      <div className="space-y-2.5">
                        {bookingsList.slice(0, 3).map((b) => (
                          <div key={b.id} className="p-3 rounded-xl bg-black/60 border border-white/5 flex items-center justify-between gap-3">
                            <div className="space-y-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-white truncate">{b.name}</span>
                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#F5C542]/10 text-[#FFD966]">
                                  {b.dateLabel} • {b.time}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#A0A0A0] truncate">Topic: {b.topic} {b.notes ? `• ${b.notes}` : ''}</p>
                              <p className="text-[10px] text-[#777777]">Tel: {b.phone} | {b.email}</p>
                            </div>

                            <a
                              href={`https://wa.me/${(b.phone || '').replace(/\D/g, '')}?text=${encodeURIComponent(
                                `Hi ${b.name}, this is Vijayakumar from ZAZU DIGITAL MEDIA regarding your booking for ${b.dateLabel} at ${b.time}.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-[#080808] font-bold text-[11px] flex items-center gap-1 shrink-0"
                            >
                              <MessageCircle className="w-3 h-3 fill-current" />
                              <span>WhatsApp</span>
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Latest WhatsApp & Client Inquiries */}
                  <div className="p-5 rounded-2xl bg-[#111111] border border-white/10 space-y-3">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-[#25D366]" />
                        <h4 className="text-sm font-bold text-white">Recent WhatsApp & Web Inquiries</h4>
                      </div>
                      <button
                        onClick={() => setActiveTab('leads')}
                        className="text-xs text-[#25D366] hover:underline font-semibold"
                      >
                        All Leads ({inquiries.length}) →
                      </button>
                    </div>

                    {inquiries.length === 0 ? (
                      <p className="text-xs text-[#777777] py-4 text-center">No inquiries yet.</p>
                    ) : (
                      <div className="space-y-2.5">
                        {inquiries.slice(0, 3).map((inq) => {
                          let cleanPhone = (inq.phone || '').replace(/\D/g, '');
                          if (cleanPhone.length === 10) cleanPhone = '91' + cleanPhone;
                          return (
                            <div key={inq.id} className="p-3 rounded-xl bg-black/60 border border-white/5 flex items-center justify-between gap-3">
                              <div className="space-y-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-white truncate">{inq.name}</span>
                                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#25D366]/15 text-[#25D366]">
                                    {inq.source === 'whatsapp_widget' ? 'WhatsApp' : 'Website'}
                                  </span>
                                </div>
                                <p className="text-[11px] text-[#A0A0A0] truncate">"{inq.message}"</p>
                                <p className="text-[10px] text-[#777777]">Tel: {inq.phone}</p>
                              </div>

                              <a
                                href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                                  `Hi ${inq.name}, thank you for contacting ZAZU DIGITAL MEDIA regarding ${inq.serviceRequired}.`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-[#080808] font-bold text-[11px] flex items-center gap-1 shrink-0"
                              >
                                <MessageCircle className="w-3 h-3 fill-current" />
                                <span>Reply</span>
                              </a>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Shortcuts */}
                <div className="p-5 rounded-2xl bg-[#111111] border border-white/10 space-y-3">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-[#F5C542]" />
                    <span>Database & Security Configuration</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#A0A0A0]">
                    <div className="p-3 rounded-lg bg-black/60 border border-white/5">
                      <span className="text-[10px] font-mono uppercase text-[#777777] block">Firestore Database ID</span>
                      <span className="text-white font-mono">(default) • Cloud Live</span>
                    </div>
                    <div className="p-3 rounded-lg bg-black/60 border border-white/5">
                      <span className="text-[10px] font-mono uppercase text-[#777777] block">Security Rules</span>
                      <span className="text-emerald-400 font-mono">Protected by Role-Based Access</span>
                    </div>
                  </div>
                </div>

                {/* Direct Agency Contact Summary */}
                <div className="p-5 rounded-2xl bg-[#111111] border border-white/10 space-y-3">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#F5C542]" />
                    <span>Live Agency Profile</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-black/60 border border-white/5">
                      <span className="text-[10px] font-mono text-[#777777] block">PHONE & WHATSAPP</span>
                      <span className="text-white font-semibold">{siteConfig?.phone || '+91 9789504702'}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-black/60 border border-white/5">
                      <span className="text-[10px] font-mono text-[#777777] block">EMAIL</span>
                      <span className="text-white font-semibold">{siteConfig?.email || 'digitalmediazazu@gmail.com'}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-black/60 border border-white/5">
                      <span className="text-[10px] font-mono text-[#777777] block">LOCATION</span>
                      <span className="text-white font-semibold">{siteConfig?.location || 'Tirumangalam, Tamil Nadu, India'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. WHATSAPP & LEADS CRM TAB */}
            {activeTab === 'leads' && (
              <div className="space-y-6 max-w-5xl">
                {/* Header & Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-[#25D366]" />
                        <span>WhatsApp & Client Leads CRM</span>
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#25D366]/15 text-[#25D366] border border-[#25D366]/30">
                        {inquiries.length} Active Leads
                      </span>
                    </div>
                    <p className="text-xs text-[#A0A0A0] mt-1">
                      Real-time client inquiries received through WhatsApp widget, contact form, and custom project scopes.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={handleCreateTestLead}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-white border border-white/10 flex items-center gap-1.5 transition-all"
                      title="Generate a test lead to verify real-time data storage"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#F5C542]" />
                      <span>Test WhatsApp Lead</span>
                    </button>

                    <button
                      onClick={handleExportCSV}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#F5C542] hover:bg-[#FFD966] text-[#080808] flex items-center gap-1.5 shadow-md shadow-[#F5C542]/20 transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export CSV</span>
                    </button>
                  </div>
                </div>

                {/* Data Storage Architecture Explanation Box */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#121212] via-[#161616] to-[#121212] border border-[#25D366]/30 shadow-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                      <Database className="w-4 h-4 text-[#25D366]" />
                      <span>Where is your WhatsApp & Inquiry Data Stored?</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                      Sync Active
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-black/60 border border-white/5 space-y-1">
                      <div className="font-semibold text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>1. Cloud Firestore Database</span>
                      </div>
                      <p className="text-[11px] text-[#A0A0A0] leading-relaxed">
                        Saved in Google Firestore collection <code className="text-[#FFD966] font-mono">inquiries</code> with client name, WhatsApp number, service, and full message.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-black/60 border border-white/5 space-y-1">
                      <div className="font-semibold text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        <span>2. Browser Local Cache</span>
                      </div>
                      <p className="text-[11px] text-[#A0A0A0] leading-relaxed">
                        Cached in <code className="text-[#FFD966] font-mono">localStorage('zazu_inquiries_cache')</code> so records are preserved instantly without offline data loss.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-black/60 border border-white/5 space-y-1">
                      <div className="font-semibold text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#25D366]" />
                        <span>3. Vijayakumar's Phone</span>
                      </div>
                      <p className="text-[11px] text-[#A0A0A0] leading-relaxed">
                        Direct ping sent to Vijayakumar's personal WhatsApp at <strong className="text-white">+91 9789504702</strong> with formatted lead details.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                    {[
                      { id: 'all', label: `All (${inquiries.length})` },
                      { id: 'whatsapp', label: `WhatsApp (${inquiries.filter(i => i.source?.startsWith('whatsapp') || i.whatsappSent).length})` },
                      { id: 'website', label: `Website Forms (${inquiries.filter(i => i.source === 'website_form').length})` },
                      { id: 'quote', label: `Quotes (${inquiries.filter(i => i.source === 'quote_modal').length})` }
                    ].map(f => (
                      <button
                        key={f.id}
                        onClick={() => setLeadsFilter(f.id as any)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                          leadsFilter === f.id
                            ? 'bg-[#25D366] text-[#080808] font-bold shadow-md shadow-[#25D366]/20'
                            : 'bg-[#151515] text-[#A0A0A0] hover:text-white border border-white/5'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  <div className="relative min-w-[220px]">
                    <Search className="w-3.5 h-3.5 text-[#777777] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search name, phone, message..."
                      value={leadsSearch}
                      onChange={(e) => setLeadsSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#111111] border border-white/10 text-xs text-white placeholder:text-[#666666] focus:outline-none focus:border-[#25D366]"
                    />
                  </div>
                </div>

                {/* Leads List */}
                <div className="space-y-3">
                  {(() => {
                    const filtered = inquiries.filter((inq) => {
                      const matchesFilter =
                        leadsFilter === 'all'
                          ? true
                          : leadsFilter === 'whatsapp'
                          ? inq.source?.startsWith('whatsapp') || inq.whatsappSent
                          : leadsFilter === 'website'
                          ? inq.source === 'website_form'
                          : leadsFilter === 'quote'
                          ? inq.source === 'quote_modal'
                          : true;

                      const q = leadsSearch.toLowerCase();
                      const matchesSearch =
                        !q ||
                        inq.name.toLowerCase().includes(q) ||
                        inq.phone.toLowerCase().includes(q) ||
                        (inq.businessName && inq.businessName.toLowerCase().includes(q)) ||
                        inq.serviceRequired.toLowerCase().includes(q) ||
                        inq.message.toLowerCase().includes(q);

                      return matchesFilter && matchesSearch;
                    });

                    if (filtered.length === 0) {
                      return (
                        <div className="p-10 rounded-2xl bg-[#111111] border border-white/5 text-center space-y-3">
                          <MessageCircle className="w-8 h-8 text-[#555555] mx-auto" />
                          <p className="text-sm font-semibold text-white">No inquiries match the current filter</p>
                          <p className="text-xs text-[#777777] max-w-md mx-auto">
                            Submit a message from the Floating WhatsApp button on the website, or click "Test WhatsApp Lead" above to simulate an inquiry.
                          </p>
                        </div>
                      );
                    }

                    return filtered.map((inq) => {
                      const isWhatsApp = inq.source?.startsWith('whatsapp') || inq.whatsappSent;
                      let cleanClientPhone = (inq.phone || '').replace(/\D/g, '');
                      if (cleanClientPhone.length === 10) cleanClientPhone = '91' + cleanClientPhone;
                      const replyUrl = `https://wa.me/${cleanClientPhone}?text=${encodeURIComponent(
                        `Hi ${inq.name}, thank you for contacting ZAZU DIGITAL MEDIA regarding ${inq.serviceRequired}. How can we assist you with your business goals?`
                      )}`;

                      return (
                        <div
                          key={inq.id}
                          className="p-5 rounded-2xl bg-[#121212] border border-white/10 hover:border-white/20 transition-all space-y-3 shadow-md"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                                  isWhatsApp
                                    ? 'bg-[#25D366]/15 text-[#25D366] border border-[#25D366]/30'
                                    : 'bg-[#F5C542]/15 text-[#FFD966] border border-[#F5C542]/30'
                                }`}
                              >
                                {isWhatsApp ? <MessageCircle className="w-3 h-3" /> : <Mail className="w-3 h-3" />}
                                {inq.source === 'whatsapp_widget' ? 'WhatsApp Widget' : inq.source === 'quote_modal' ? 'Quote Scope' : 'Website Form'}
                              </span>

                              <span className="text-sm font-bold text-white">{inq.name}</span>
                              {inq.businessName && (
                                <span className="text-xs text-[#A0A0A0]">
                                  • <strong className="text-white/90">{inq.businessName}</strong>
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              {/* Status Dropdown */}
                              <select
                                value={inq.status || 'new'}
                                onChange={(e) => handleStatusChange(inq.id, e.target.value as any)}
                                className={`text-[10px] font-mono font-semibold px-2 py-1 rounded border focus:outline-none cursor-pointer ${
                                  inq.status === 'converted'
                                    ? 'bg-purple-950/80 text-purple-300 border-purple-500/40'
                                    : inq.status === 'in_progress'
                                    ? 'bg-blue-950/80 text-blue-300 border-blue-500/40'
                                    : inq.status === 'contacted'
                                    ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                                    : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                                }`}
                              >
                                <option value="new" className="bg-[#111] text-white">● New Lead</option>
                                <option value="contacted" className="bg-[#111] text-white">● Contacted</option>
                                <option value="in_progress" className="bg-[#111] text-white">● In Progress</option>
                                <option value="converted" className="bg-[#111] text-white">★ Converted Client</option>
                                <option value="archived" className="bg-[#111] text-white">Archive</option>
                              </select>

                              <span className="text-[10px] font-mono text-[#777777]">
                                {new Date(inq.createdAt).toLocaleString(undefined, {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                          </div>

                          {/* Message Body */}
                          <div className="p-3 rounded-xl bg-black/50 border border-white/5 text-xs text-[#D4D4D4] leading-relaxed">
                            <span className="text-[10px] font-mono text-[#777777] uppercase block mb-0.5">Inquiry Details:</span>
                            "{inq.message}"
                          </div>

                          {/* Lead Attributes & Contact Actions */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                            <div className="flex flex-wrap items-center gap-3 text-xs text-[#A0A0A0]">
                              <span className="text-white font-mono flex items-center gap-1">
                                <Phone className="w-3 h-3 text-[#25D366]" />
                                {inq.phone}
                              </span>
                              {inq.email && !inq.email.endsWith('@whatsapp.client') && (
                                <span className="flex items-center gap-1">
                                  <Mail className="w-3 h-3 text-[#FFD966]" />
                                  {inq.email}
                                </span>
                              )}
                              <span className="text-[#FFD966] bg-[#F5C542]/10 px-2 py-0.5 rounded text-[11px] font-mono">
                                {inq.serviceRequired}
                              </span>
                              {inq.monthlyBudget && (
                                <span className="text-[11px] font-mono text-[#888888]">
                                  Budget: {inq.monthlyBudget}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              {/* Reply to Client on WhatsApp */}
                              <a
                                href={replyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-[#080808] font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-[#25D366]/20 cursor-pointer"
                                title={`Open WhatsApp chat with ${inq.name} (${inq.phone})`}
                              >
                                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                                <span>WhatsApp Client</span>
                              </a>

                              {/* Direct Phone Call */}
                              <a
                                href={`tel:${inq.phone}`}
                                className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium text-xs flex items-center gap-1 border border-white/10 transition-colors"
                                title={`Call ${inq.phone}`}
                              >
                                <PhoneCall className="w-3.5 h-3.5 text-[#FFD966]" />
                                <span>Call</span>
                              </a>

                              {/* Delete Lead */}
                              <button
                                onClick={() => handleDeleteInquiry(inq.id)}
                                className="p-2 rounded-lg text-[#777777] hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer"
                                title="Delete Inquiry"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            )}

            {/* 2. ABOUT TAB */}
            {activeTab === 'about' && (
              <div className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-display font-bold text-white">About Vijayakumar</h3>
                    <p className="text-xs text-[#A0A0A0]">
                      The creative professional behind ZAZU Digital Media.
                    </p>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={handleSaveAboutContext}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-[#F5C542] text-[#080808] hover:bg-[#FFD966] transition-colors flex items-center gap-1.5"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                  )}
                </div>

                {/* Editor or Content Display */}
                <div className="p-5 rounded-2xl bg-[#111111] border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-white">
                      Official Biography & Agency Context
                    </label>
                    <span className="text-[10px] font-mono text-[#FFD966]">
                      {isAdmin ? 'Editable by Admin' : 'Read-only preview'}
                    </span>
                  </div>

                  <textarea
                    rows={16}
                    disabled={!isAdmin}
                    value={editingAboutText}
                    onChange={(e) => setEditingAboutText(e.target.value)}
                    className="w-full p-4 rounded-xl bg-black/80 border border-white/10 text-white text-xs font-sans leading-relaxed focus:outline-none focus:border-[#F5C542] disabled:opacity-85"
                  />

                  {/* Social and live link buttons */}
                  <div className="pt-2 flex flex-wrap gap-3">
                    <a
                      href="https://www.instagram.com/zazudigitalmedia?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw=="
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-lg bg-[#1a1a1a] hover:bg-[#252525] border border-white/10 text-xs text-white flex items-center gap-2"
                    >
                      <span>Instagram Profile</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#F5C542]" />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/vijayakumar-s-2a48a8394/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-lg bg-[#1a1a1a] hover:bg-[#252525] border border-white/10 text-xs text-white flex items-center gap-2"
                    >
                      <span>LinkedIn Profile</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#0A66C2]" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* 3. WHY ZAZU TAB */}
            {activeTab === 'why-zazu' && (
              <div className="space-y-6 max-w-4xl">
                <div>
                  <h3 className="text-xl font-display font-bold text-white">Why ZAZU Differentiators</h3>
                  <p className="text-xs text-[#A0A0A0]">
                    Core methodology and business-focused competitive advantage.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      num: '01',
                      title: 'Strategy Before Execution',
                      desc: 'We never waste client budget on haphazard ads. Every deliverable is preceded by competitor benchmarking, target audience profiling, and high-level funnel architecture.'
                    },
                    {
                      num: '02',
                      title: 'Creative Content That Connects',
                      desc: 'Generic templates are invisible. Our in-house creative production marries direct-response psychology with visual polish that demands viewer attention.'
                    },
                    {
                      num: '03',
                      title: 'Data-Driven Marketing',
                      desc: 'Likes and vanity impressions do not pay the bills. We orient our entire agency around pipeline velocity, qualified inbound consultations, and measurable bottom-line revenue.'
                    },
                    {
                      num: '04',
                      title: 'Direct Strategic Partnership',
                      desc: 'Work directly with creative professional Vijayakumar and senior digital marketing strategists with weekly transparency and real-time communication.'
                    }
                  ].map((item, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-[#111111] border border-white/10 space-y-2">
                      <span className="text-[10px] font-mono text-[#F5C542] font-bold">PILLAR {item.num}</span>
                      <h4 className="text-sm font-bold text-white">{item.title}</h4>
                      <p className="text-xs text-[#A0A0A0] leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. SERVICES TAB */}
            {activeTab === 'services' && (
              <div className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-display font-bold text-white">Services & Pricing (in ₹ Rupees)</h3>
                    <p className="text-xs text-[#A0A0A0]">
                      Manage agency service offerings and deliverables.
                    </p>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => setEditingService({ number: String(services.length + 1).padStart(2, '0'), deliverables: [] })}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#F5C542] text-[#080808] hover:bg-[#FFD966] transition-colors flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Service</span>
                    </button>
                  )}
                </div>

                {/* Service Edit/Create Form */}
                {editingService && (
                  <form onSubmit={handleSaveService} className="p-5 rounded-2xl bg-[#141414] border border-[#F5C542]/40 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <h4 className="text-xs font-bold uppercase text-[#FFD966]">
                        {editingService.id ? 'Edit Service' : 'New Service'}
                      </h4>
                      <button type="button" onClick={() => setEditingService(null)} className="text-[#A0A0A0] hover:text-white">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-[11px] text-[#A0A0A0] mb-1">Service Title *</label>
                        <input
                          type="text"
                          required
                          value={editingService.title || ''}
                          onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                          className="w-full p-2.5 bg-black border border-white/10 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#A0A0A0] mb-1">Price Range (in ₹ Rupees)</label>
                        <input
                          type="text"
                          value={editingService.priceRange || ''}
                          placeholder="e.g. Starting at ₹35,000 / mo"
                          onChange={(e) => setEditingService({ ...editingService, priceRange: e.target.value })}
                          className="w-full p-2.5 bg-black border border-white/10 rounded-lg text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-[#A0A0A0] mb-1">Short Description *</label>
                      <textarea
                        rows={3}
                        required
                        value={editingService.shortDescription || ''}
                        onChange={(e) => setEditingService({ ...editingService, shortDescription: e.target.value })}
                        className="w-full p-2.5 bg-black border border-white/10 rounded-lg text-white"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingService(null)}
                        className="px-3 py-1.5 text-xs text-[#A0A0A0] hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-xs font-bold bg-[#F5C542] text-[#080808] rounded-lg hover:bg-[#FFD966]"
                      >
                        Save Service
                      </button>
                    </div>
                  </form>
                )}

                {/* List of Services */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {services.map((svc) => (
                    <div key={svc.id} className="p-4 rounded-xl bg-[#111111] border border-white/10 flex flex-col justify-between group">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-mono text-[#F5C542] font-bold">DISCIPLINE {svc.number}</span>
                          {isAdmin && (
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => setEditingService(svc)}
                                className="p-1 rounded text-[#A0A0A0] hover:text-[#F5C542]"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteService(svc.id)}
                                className="p-1 rounded text-[#A0A0A0] hover:text-red-400"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-white">{svc.title}</h4>
                        <p className="text-xs text-[#A0A0A0] mt-1 leading-relaxed line-clamp-2">{svc.shortDescription}</p>
                      </div>

                      {svc.priceRange && (
                        <div className="mt-3 pt-2 border-t border-white/5 flex items-center gap-1 text-[11px] font-mono text-[#FFD966]">
                          <IndianRupee className="w-3 h-3" />
                          <span>{svc.priceRange}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. PROCESS TAB */}
            {activeTab === 'process' && (
              <div className="space-y-6 max-w-4xl">
                <div>
                  <h3 className="text-xl font-display font-bold text-white">Execution Process</h3>
                  <p className="text-xs text-[#A0A0A0]">
                    The 6-stage operational sprint driving predictable client growth.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { step: '01', title: 'Audit & Analysis', desc: 'Competitor teardown, market audience profile, and existing bottleneck detection.' },
                    { step: '02', title: 'Positioning & Strategy', desc: 'Clarifying brand narrative, high-intent angles, and target funnel blueprints.' },
                    { step: '03', title: 'Creative Production', desc: 'Short-form reels, bespoke video assets, and conversion-engineered ad creatives.' },
                    { step: '04', title: 'Channel Distribution', desc: 'Precision Google Ads, search dominance, and omnichannel promotional campaigns.' },
                    { step: '05', title: 'Conversion Optimization', desc: 'Speed optimization, landing page friction removal, and attribution tracking.' },
                    { step: '06', title: 'Scale & Compounding', desc: 'Doubling down on winning angles, lowering acquisition cost, and revenue acceleration.' }
                  ].map((s, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-[#111111] border border-white/10 space-y-1.5">
                      <span className="text-[10px] font-mono text-[#F5C542] font-bold">STAGE {s.step}</span>
                      <h4 className="text-sm font-bold text-white">{s.title}</h4>
                      <p className="text-xs text-[#A0A0A0] leading-relaxed">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. WORKS TAB (Renamed from Portfolio) */}
            {activeTab === 'works' && (
              <div className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-display font-bold text-white">Works & Case Studies</h3>
                    <p className="text-xs text-[#A0A0A0]">
                      Portfolio of verified campaigns, brand identities, and video projects.
                    </p>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => setEditingWork({
                        category: 'Branding',
                        sampleMetrics: [{ label: 'Impact', value: '+100%' }],
                        deliverables: ['Custom Assets']
                      })}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#F5C542] text-[#080808] hover:bg-[#FFD966] transition-colors flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Work</span>
                    </button>
                  )}
                </div>

                {/* Work Edit / Add Form */}
                {editingWork && (
                  <form onSubmit={handleSaveWork} className="p-5 rounded-2xl bg-[#141414] border border-[#F5C542]/40 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <h4 className="text-xs font-bold uppercase text-[#FFD966]">
                        {editingWork.id ? 'Edit Work Item' : 'Create New Work Item'}
                      </h4>
                      <button type="button" onClick={() => setEditingWork(null)} className="text-[#A0A0A0] hover:text-white">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-[11px] text-[#A0A0A0] mb-1">Work Title *</label>
                        <input
                          type="text"
                          required
                          value={editingWork.title || ''}
                          onChange={(e) => setEditingWork({ ...editingWork, title: e.target.value })}
                          className="w-full p-2.5 bg-black border border-white/10 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#A0A0A0] mb-1">Category</label>
                        <select
                          value={editingWork.category || 'Branding'}
                          onChange={(e) => setEditingWork({ ...editingWork, category: e.target.value })}
                          className="w-full p-2.5 bg-black border border-white/10 rounded-lg text-white"
                        >
                          <option value="Branding">Branding</option>
                          <option value="SEO">SEO</option>
                          <option value="Social Media">Social Media</option>
                          <option value="Paid Advertising">Paid Advertising</option>
                          <option value="Content Creation">Content Creation</option>
                          <option value="Video Marketing">Video Marketing</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-[11px] text-[#A0A0A0] mb-1">Client Profile</label>
                        <input
                          type="text"
                          value={editingWork.clientType || ''}
                          onChange={(e) => setEditingWork({ ...editingWork, clientType: e.target.value })}
                          className="w-full p-2.5 bg-black border border-white/10 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#A0A0A0] mb-1">Featured Metric (e.g. +₹3,50,000 Deal Size)</label>
                        <input
                          type="text"
                          placeholder="Label: Value"
                          value={editingWork.sampleMetrics?.[0]?.value || ''}
                          onChange={(e) => setEditingWork({
                            ...editingWork,
                            sampleMetrics: [{ label: 'Key Metric', value: e.target.value }]
                          })}
                          className="w-full p-2.5 bg-black border border-white/10 rounded-lg text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-[#A0A0A0] mb-1">Strategy & Solution *</label>
                      <textarea
                        rows={3}
                        required
                        value={editingWork.solution || ''}
                        onChange={(e) => setEditingWork({ ...editingWork, solution: e.target.value })}
                        className="w-full p-2.5 bg-black border border-white/10 rounded-lg text-white"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingWork(null)}
                        className="px-3 py-1.5 text-xs text-[#A0A0A0] hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-xs font-bold bg-[#F5C542] text-[#080808] rounded-lg hover:bg-[#FFD966]"
                      >
                        Save to Firestore
                      </button>
                    </div>
                  </form>
                )}

                {/* List of Works */}
                <div className="space-y-3">
                  {works.map((w) => (
                    <div key={w.id} className="p-4 rounded-xl bg-[#111111] border border-white/10 flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-[#F5C542] border border-white/10">
                            {w.category}
                          </span>
                          <span className="text-xs text-[#777777]">{w.clientType}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white">{w.title}</h4>
                        <p className="text-xs text-[#A0A0A0] line-clamp-2">{w.solution}</p>
                        {w.sampleMetrics && w.sampleMetrics.length > 0 && (
                          <div className="flex items-center gap-3 pt-1">
                            {w.sampleMetrics.map((m, idx) => (
                              <span key={idx} className="text-[11px] text-[#FFD966] font-mono">
                                {m.label}: <strong>{m.value}</strong>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {isAdmin && (
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => setEditingWork(w)}
                            className="p-1.5 rounded-lg text-[#A0A0A0] hover:text-[#F5C542] hover:bg-white/5"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteWork(w.id)}
                            className="p-1.5 rounded-lg text-[#A0A0A0] hover:text-red-400 hover:bg-white/5"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. REVIEWS TAB (Renamed from Testimonials) */}
            {activeTab === 'reviews' && (
              <div className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-display font-bold text-white">Client Reviews & Testimonials</h3>
                    <p className="text-xs text-[#A0A0A0]">
                      Client feedback and verified satisfaction ratings.
                    </p>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => setEditingReview({ stars: 5, highlight: 'High Business Impact' })}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#F5C542] text-[#080808] hover:bg-[#FFD966] transition-colors flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Review</span>
                    </button>
                  )}
                </div>

                {/* Review Form */}
                {editingReview && (
                  <form onSubmit={handleSaveReview} className="p-5 rounded-2xl bg-[#141414] border border-[#F5C542]/40 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <h4 className="text-xs font-bold uppercase text-[#FFD966]">
                        {editingReview.id ? 'Edit Review' : 'New Client Review'}
                      </h4>
                      <button type="button" onClick={() => setEditingReview(null)} className="text-[#A0A0A0] hover:text-white">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block text-[11px] text-[#A0A0A0] mb-1">Client Name *</label>
                        <input
                          type="text"
                          required
                          value={editingReview.clientName || ''}
                          onChange={(e) => setEditingReview({ ...editingReview, clientName: e.target.value })}
                          className="w-full p-2.5 bg-black border border-white/10 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#A0A0A0] mb-1">Company / Business</label>
                        <input
                          type="text"
                          value={editingReview.businessName || ''}
                          onChange={(e) => setEditingReview({ ...editingReview, businessName: e.target.value })}
                          className="w-full p-2.5 bg-black border border-white/10 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#A0A0A0] mb-1">Role</label>
                        <input
                          type="text"
                          value={editingReview.role || ''}
                          onChange={(e) => setEditingReview({ ...editingReview, role: e.target.value })}
                          className="w-full p-2.5 bg-black border border-white/10 rounded-lg text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-[#A0A0A0] mb-1">Review Text *</label>
                      <textarea
                        rows={3}
                        required
                        value={editingReview.testimonial || ''}
                        onChange={(e) => setEditingReview({ ...editingReview, testimonial: e.target.value })}
                        className="w-full p-2.5 bg-black border border-white/10 rounded-lg text-white"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingReview(null)}
                        className="px-3 py-1.5 text-xs text-[#A0A0A0] hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-xs font-bold bg-[#F5C542] text-[#080808] rounded-lg hover:bg-[#FFD966]"
                      >
                        Save Review
                      </button>
                    </div>
                  </form>
                )}

                {/* List of Reviews */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {reviews.map((r) => (
                    <div key={r.id} className="p-4 rounded-xl bg-[#111111] border border-white/10 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1 text-[#F5C542]">
                            {[...Array(r.stars || 5)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-[#F5C542]" />
                            ))}
                          </div>
                          {isAdmin && (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setEditingReview(r)}
                                className="p-1 rounded text-[#A0A0A0] hover:text-[#F5C542]"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteReview(r.id)}
                                className="p-1 rounded text-[#A0A0A0] hover:text-red-400"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-[#D4D4D4] italic leading-relaxed">“{r.testimonial}”</p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-white block">{r.clientName}</span>
                          <span className="text-[10px] text-[#777777]">{r.role} • {r.businessName}</span>
                        </div>
                        <span className="text-[10px] font-mono text-[#FFD966]">{r.highlight}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. BOOKINGS & CONSULTATION SLOTS TAB */}
            {activeTab === 'bookings' && (
              <div className="space-y-6 max-w-4xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-[#F5C542]" />
                      <span>Consultation Bookings & Slot Control</span>
                    </h3>
                    <p className="text-xs text-[#A0A0A0] mt-1">
                      Manage reserved 30-minute consultation appointments. When a meeting is completed or cancelled, click <strong>"Complete & Release Slot"</strong> to immediately reopen that date & time for new clients on the website.
                    </p>
                  </div>
                  <div className="shrink-0 px-3 py-1.5 rounded-lg bg-[#F5C542]/10 border border-[#F5C542]/30 text-[#FFD966] text-xs font-mono">
                    {bookingsList.length} Reserved {bookingsList.length === 1 ? 'Slot' : 'Slots'}
                  </div>
                </div>

                {/* External Calendar Direct Connect Card */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-black/80 to-[#111111] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <ExternalLink className="w-4 h-4 text-[#F5C542]" />
                      <span>Live External Calendar URL (Calendly / Google Calendar)</span>
                    </span>
                    <p className="text-[11px] text-[#A0A0A0]">
                      Current link: <code className="text-[#FFD966] bg-black/60 px-1.5 py-0.5 rounded">{siteConfig?.bookingUrl || 'Not set'}</code>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {siteConfig?.bookingUrl && (
                      <a
                        href={siteConfig.bookingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[#FFD966] text-xs font-mono flex items-center gap-1"
                      >
                        <span>Open Live</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    <button
                      onClick={() => setActiveTab('contact')}
                      className="px-3 py-1.5 rounded-lg bg-[#F5C542] hover:bg-[#FFD966] text-[#080808] font-bold text-xs flex items-center gap-1"
                    >
                      <Edit className="w-3 h-3" />
                      <span>Change Calendar Link</span>
                    </button>
                  </div>
                </div>

                {bookingsList.length === 0 ? (
                  <div className="p-10 rounded-2xl bg-[#111111] border border-white/5 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-[#F5C542]/10 border border-[#F5C542]/30 flex items-center justify-center text-[#F5C542] mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-bold text-white">All Consultation Slots Are Free</h4>
                    <p className="text-xs text-[#777777] max-w-md mx-auto">
                      There are currently no active locked bookings. When a client books a slot on the website, it will appear here and lock that time for all other visitors until you mark it completed.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {bookingsList.map((b) => (
                      <div
                        key={b.id}
                        className="p-5 rounded-2xl bg-[#111111] border border-white/10 hover:border-[#F5C542]/40 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-lg"
                      >
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2.5 py-1 rounded-md bg-[#F5C542]/15 border border-[#F5C542]/40 text-[#FFD966] text-xs font-mono font-bold">
                              📅 {b.dateLabel} at {b.time}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-red-500/10 text-red-400 border border-red-500/20">
                              Locked on Site
                            </span>
                          </div>

                          <div>
                            <h4 className="text-sm font-bold text-white flex items-center gap-2">
                              <span>{b.name}</span>
                              <span className="text-xs font-normal text-[#A0A0A0]">({b.topic})</span>
                            </h4>
                            {b.notes && (
                              <p className="text-xs text-[#D4D4D4] mt-1 bg-black/40 p-2 rounded-lg border border-white/5">
                                <strong className="text-white">Client Goal / Budget:</strong> {b.notes}
                              </p>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#888888] pt-1">
                            <span>📞 {b.phone}</span>
                            <span>✉️ {b.email}</span>
                            <span>Booked on: {new Date(b.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-white/5">
                          <a
                            href={`https://wa.me/${b.phone.replace(/\D/g, '') || '919789504702'}?text=${encodeURIComponent(`Hi ${b.name}, this is Vijayakumar from ZAZU Digital Media regarding our scheduled consultation for ${b.dateLabel} at ${b.time}.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-[#080808] font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>WhatsApp Client</span>
                          </a>

                          {isAdmin && (
                            <button
                              onClick={() => handleReleaseSlot(b.id, b.name, b.dateLabel, b.time)}
                              className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-[#FFD966] hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                              title="Mark consultation as finished and reopen this slot for new bookings"
                            >
                              <CheckCircle2 className="w-4 h-4 text-[#F5C542]" />
                              <span>Complete & Release Slot</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 9. CONTACT & INQUIRIES TAB */}
            {activeTab === 'contact' && (
              <div className="space-y-6 max-w-4xl">
                <div>
                  <h3 className="text-xl font-display font-bold text-white">Contact & Client Inquiries</h3>
                  <p className="text-xs text-[#A0A0A0]">
                    Official phone number, location, email, and live incoming message center.
                  </p>
                </div>

                {/* Contact Configuration Form */}
                <form onSubmit={handleSaveContactConfig} className="p-5 rounded-2xl bg-[#111111] border border-white/10 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-xs font-bold uppercase text-white">Agency Contact Details</span>
                    {isAdmin && (
                      <button
                        type="submit"
                        className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#F5C542] text-[#080808] hover:bg-[#FFD966] flex items-center gap-1.5"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Contact Settings</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-[11px] text-[#A0A0A0] mb-1">Phone & WhatsApp *</label>
                      <input
                        type="text"
                        disabled={!isAdmin}
                        value={siteConfig?.phone || ''}
                        onChange={(e) => siteConfig && setSiteConfig({ ...siteConfig, phone: e.target.value, whatsapp: e.target.value })}
                        className="w-full p-2.5 bg-black border border-white/10 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#A0A0A0] mb-1">Email *</label>
                      <input
                        type="email"
                        disabled={!isAdmin}
                        value={siteConfig?.email || ''}
                        onChange={(e) => siteConfig && setSiteConfig({ ...siteConfig, email: e.target.value })}
                        className="w-full p-2.5 bg-black border border-white/10 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#A0A0A0] mb-1">Location *</label>
                      <input
                        type="text"
                        disabled={!isAdmin}
                        value={siteConfig?.location || ''}
                        onChange={(e) => siteConfig && setSiteConfig({ ...siteConfig, location: e.target.value })}
                        className="w-full p-2.5 bg-black border border-white/10 rounded-lg text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-[11px] text-[#A0A0A0] mb-1">Instagram Link</label>
                      <input
                        type="url"
                        disabled={!isAdmin}
                        value={siteConfig?.instagram || ''}
                        onChange={(e) => siteConfig && setSiteConfig({ ...siteConfig, instagram: e.target.value })}
                        className="w-full p-2.5 bg-black border border-white/10 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#A0A0A0] mb-1">LinkedIn Link</label>
                      <input
                        type="url"
                        disabled={!isAdmin}
                        value={siteConfig?.linkedin || ''}
                        onChange={(e) => siteConfig && setSiteConfig({ ...siteConfig, linkedin: e.target.value })}
                        className="w-full p-2.5 bg-black border border-white/10 rounded-lg text-white"
                      />
                    </div>
                  </div>

                  {/* External Calendar Booking Link */}
                  <div className="text-xs pt-1">
                    <label className="block text-[11px] text-[#A0A0A0] mb-1 font-semibold flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-white">
                        <span>External Calendar Link (Calendly, Google Calendar, SavvyCal)</span>
                      </span>
                      <span className="text-[#FFD966] text-[10px] font-mono">Controls "External Calendar Link ↗" on site</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        disabled={!isAdmin}
                        placeholder="https://calendly.com/your-username/30min"
                        value={siteConfig?.bookingUrl || ''}
                        onChange={(e) => siteConfig && setSiteConfig({ ...siteConfig, bookingUrl: e.target.value })}
                        className="w-full p-2.5 bg-black border border-white/10 rounded-lg text-white font-mono text-xs focus:border-[#F5C542]"
                      />
                      {siteConfig?.bookingUrl && (
                        <a
                          href={siteConfig.bookingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-[#FFD966] text-xs font-mono flex items-center gap-1 shrink-0"
                          title="Test open your calendar link"
                        >
                          <span>Test</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                    <p className="text-[10px] text-[#777777] mt-1">
                      Paste your personal Calendly, Cal.com or Google Calendar appointment scheduling link here. When visitors click "External Calendar Link" on the website, this link will open immediately in a new tab.
                    </p>
                  </div>
                </form>

                {/* Client Inquiries List */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-[#25D366]" />
                      <span>Incoming Client Inquiries ({inquiries.length})</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setActiveTab('leads')}
                      className="text-xs font-bold text-[#25D366] hover:underline flex items-center gap-1"
                    >
                      <span>Open Full CRM View →</span>
                    </button>
                  </div>

                  {inquiries.length === 0 ? (
                    <div className="p-6 rounded-xl bg-[#111111] border border-white/5 text-center text-xs text-[#777777]">
                      No inquiries yet. Submissions from the website contact form or WhatsApp widget will appear here.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {inquiries.slice(0, 10).map((inq) => {
                        let cleanPhone = (inq.phone || '').replace(/\D/g, '');
                        if (cleanPhone.length === 10) cleanPhone = '91' + cleanPhone;
                        const replyUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                          `Hi ${inq.name}, thank you for contacting ZAZU DIGITAL MEDIA regarding ${inq.serviceRequired}. How can we assist you?`
                        )}`;

                        return (
                          <div key={inq.id} className="p-4 rounded-xl bg-[#111111] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-bold text-white">{inq.name}</span>
                                {inq.businessName && <span className="text-xs text-[#A0A0A0]">({inq.businessName})</span>}
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#25D366]/15 text-[#25D366] border border-[#25D366]/30">
                                  {inq.serviceRequired}
                                </span>
                              </div>
                              <p className="text-xs text-[#A0A0A0]">{inq.message}</p>
                              <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#777777] pt-1">
                                <span>Tel: {inq.phone}</span>
                                {inq.email && !inq.email.endsWith('@whatsapp.client') && <span>Email: {inq.email}</span>}
                                {inq.monthlyBudget && <span>Budget: {inq.monthlyBudget}</span>}
                                <span>Time: {new Date(inq.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <a
                                href={replyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-[#080808] font-bold text-xs flex items-center gap-1 transition-colors"
                                title={`Chat with ${inq.name} on WhatsApp`}
                              >
                                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                                <span>Chat</span>
                              </a>
                              <button
                                onClick={() => handleDeleteInquiry(inq.id)}
                                className="p-2 rounded-lg text-[#A0A0A0] hover:text-red-400 hover:bg-white/5 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
