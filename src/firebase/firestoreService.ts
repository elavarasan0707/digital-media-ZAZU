import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from './config';
import { CaseStudyItem, TestimonialItem, ServiceItem, AgencyContactConfig, ClientInquiry, BookingRecord } from '../types';
import { initialAgencyConfig, caseStudiesData, testimonialsData, servicesData } from '../data/agencyData';

const ADMIN_EMAILS = ['digitalmediazazu@gmail.com', 'eladigitalw@gmail.com', 'elae2379@gmail.com', 'admin@zazudigitalmedia.com', 'admin'];

export const isUserAdmin = (email?: string | null): boolean => {
  if (!email) return false;
  return ADMIN_EMAILS.some((adm) => adm.toLowerCase() === email.trim().toLowerCase());
};

// Fast timeout helper so Firestore network delays or offline state never hang UI buttons or loading indicators
const withTimeout = <T>(promise: Promise<T>, ms = 2500): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Firestore operation timed out')), ms)
    )
  ]);
};

// ---------------- SITE CONFIG ----------------
export const fetchSiteConfig = async (): Promise<AgencyContactConfig> => {
  const DEFAULT_CALENDLY = 'https://calendly.com/elae2379/30min';
  const normalizeConfig = (cfg: AgencyContactConfig): AgencyContactConfig => {
    if (!cfg.bookingUrl || cfg.bookingUrl === 'https://calendly.com' || cfg.bookingUrl === 'https://calendly.com/') {
      return { ...cfg, bookingUrl: DEFAULT_CALENDLY };
    }
    return cfg;
  };

  const saved = localStorage.getItem('zazu_agency_config');
  try {
    const docRef = doc(db, 'site_config', 'main');
    const snap = await withTimeout(getDoc(docRef), 2500);
    if (snap.exists()) {
      const remoteData = normalizeConfig({ ...initialAgencyConfig, ...(snap.data() as AgencyContactConfig) });
      if (!saved) {
        localStorage.setItem('zazu_agency_config', JSON.stringify(remoteData));
        return remoteData;
      }
      const merged = normalizeConfig({ ...remoteData, ...JSON.parse(saved) });
      localStorage.setItem('zazu_agency_config', JSON.stringify(merged));
      return merged;
    }
  } catch (err) {
    console.warn('Firestore fetchSiteConfig fallback to local:', err);
  }
  if (saved) {
    try {
      const merged = normalizeConfig({ ...initialAgencyConfig, ...JSON.parse(saved) });
      localStorage.setItem('zazu_agency_config', JSON.stringify(merged));
      return merged;
    } catch {}
  }
  return initialAgencyConfig;
};

export const saveSiteConfig = async (config: AgencyContactConfig, userEmail?: string | null): Promise<void> => {
  localStorage.setItem('zazu_agency_config', JSON.stringify(config));
  try {
    const docRef = doc(db, 'site_config', 'main');
    await withTimeout(setDoc(docRef, config, { merge: true }), 1800);
  } catch (err) {
    console.warn('Firestore saveSiteConfig error:', err);
  }
};

const getLocalWorks = (): CaseStudyItem[] | null => {
  const cached = localStorage.getItem('zazu_works_cache');
  if (cached) {
    try { return JSON.parse(cached); } catch {}
  }
  return null;
};

// ---------------- WORKS (CASE STUDIES) ----------------
export const fetchWorks = async (): Promise<CaseStudyItem[]> => {
  const localItems = getLocalWorks();
  try {
    const q = query(collection(db, 'works'));
    const snap = await withTimeout(getDocs(q), 2500);
    if (!snap.empty) {
      const remoteItems = snap.docs.map((d) => ({ id: d.id, ...d.data() } as CaseStudyItem));
      if (!localItems) {
        localStorage.setItem('zazu_works_cache', JSON.stringify(remoteItems));
        return remoteItems;
      }
      return localItems;
    }
  } catch (err) {
    console.warn('Firestore fetchWorks fallback:', err);
  }
  if (localItems) return localItems;
  localStorage.setItem('zazu_works_cache', JSON.stringify(caseStudiesData));
  return caseStudiesData;
};

export const saveWork = async (work: Partial<CaseStudyItem>, userEmail?: string | null): Promise<CaseStudyItem> => {
  const payload = {
    title: work.title || 'Untitled Work',
    category: work.category || 'Digital Marketing',
    clientType: work.clientType || 'Corporate Partner',
    challenge: work.challenge || '',
    solution: work.solution || '',
    sampleMetrics: work.sampleMetrics || [{ label: 'Impact', value: '+100%' }],
    deliverables: work.deliverables || ['Strategic Execution'],
    image: work.image || '/assets/images/case_study_analytics_1790255994838.jpg'
  };

  const current = getLocalWorks() || [...caseStudiesData];
  const itemId = work.id || `work-${Date.now()}`;
  const savedItem: CaseStudyItem = { id: itemId, ...payload };

  const index = current.findIndex((w) => w.id === savedItem.id);
  const updatedList = index >= 0
    ? [...current.slice(0, index), savedItem, ...current.slice(index + 1)]
    : [savedItem, ...current];
  localStorage.setItem('zazu_works_cache', JSON.stringify(updatedList));

  try {
    await withTimeout(setDoc(doc(db, 'works', itemId), payload, { merge: true }), 1800);
  } catch (err) {
    console.warn('Firestore setDoc work fallback to local cache:', err);
  }

  return savedItem;
};

export const deleteWorkItem = async (workId: string, userEmail?: string | null): Promise<void> => {
  const current = getLocalWorks() || [...caseStudiesData];
  const updated = current.filter((w) => w.id !== workId);
  localStorage.setItem('zazu_works_cache', JSON.stringify(updated));

  try {
    await withTimeout(deleteDoc(doc(db, 'works', workId)), 1800);
  } catch (err) {
    console.warn('Firestore deleteWork fallback to local cache:', err);
  }
};

const getLocalReviews = (): TestimonialItem[] | null => {
  const cached = localStorage.getItem('zazu_reviews_cache');
  if (cached) {
    try { return JSON.parse(cached); } catch {}
  }
  return null;
};

const getDeletedReviewIds = (): string[] => {
  try {
    const saved = localStorage.getItem('zazu_deleted_reviews');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

// ---------------- REVIEWS (TESTIMONIALS) ----------------
export const fetchReviews = async (): Promise<TestimonialItem[]> => {
  const localItems = getLocalReviews();
  const deletedIds = getDeletedReviewIds();
  try {
    const q = query(collection(db, 'reviews'));
    const snap = await withTimeout(getDocs(q), 2500);
    if (!snap.empty) {
      const remoteItems = snap.docs
        .map((d) => ({ id: d.id, ...d.data() } as TestimonialItem))
        .filter((r) => !deletedIds.includes(r.id));

      const mergedMap = new Map<string, TestimonialItem>();
      if (localItems) {
        localItems.forEach((item) => {
          if (!deletedIds.includes(item.id)) {
            mergedMap.set(item.id, item);
          }
        });
      }
      remoteItems.forEach((item) => {
        if (!deletedIds.includes(item.id) && !mergedMap.has(item.id)) {
          mergedMap.set(item.id, item);
        }
      });

      const merged = Array.from(mergedMap.values());
      if (merged.length > 0) {
        localStorage.setItem('zazu_reviews_cache', JSON.stringify(merged));
        return merged;
      }
    }
  } catch (err) {
    console.warn('Firestore fetchReviews fallback:', err);
  }
  if (localItems) {
    return localItems.filter((r) => !deletedIds.includes(r.id));
  }
  const initialFiltered = testimonialsData.filter((r) => !deletedIds.includes(r.id));
  localStorage.setItem('zazu_reviews_cache', JSON.stringify(initialFiltered));
  return initialFiltered;
};

export const saveReview = async (review: Partial<TestimonialItem>, userEmail?: string | null): Promise<TestimonialItem> => {
  const payload = {
    clientName: review.clientName || 'Anonymous Partner',
    businessName: review.businessName || 'Digital Enterprise',
    role: review.role || 'Managing Director',
    testimonial: review.testimonial || '',
    avatarInitials: review.avatarInitials || (review.clientName ? review.clientName.substring(0, 2).toUpperCase() : 'ZM'),
    stars: review.stars || 5,
    highlight: review.highlight || 'Strategic Growth'
  };

  const current = getLocalReviews() || [...testimonialsData];
  const itemId = review.id || `review-${Date.now()}`;
  const savedItem: TestimonialItem = { id: itemId, ...payload };

  const index = current.findIndex((r) => r.id === savedItem.id);
  const updatedList = index >= 0
    ? [...current.slice(0, index), savedItem, ...current.slice(index + 1)]
    : [savedItem, ...current];
  localStorage.setItem('zazu_reviews_cache', JSON.stringify(updatedList));

  // Sync to Firestore with fast timeout so UI never stays stuck on "Publishing..."
  try {
    await withTimeout(setDoc(doc(db, 'reviews', itemId), payload), 1200);
  } catch (err) {
    console.warn('Firestore setDoc review fallback to local cache:', err);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('zazu-reviews-updated'));
  }

  return savedItem;
};

export const deleteReviewItem = async (reviewId: string, userEmail?: string | null): Promise<void> => {
  const current = getLocalReviews() || [...testimonialsData];
  const updated = current.filter((r) => r.id !== reviewId);
  localStorage.setItem('zazu_reviews_cache', JSON.stringify(updated));

  const deletedIds = getDeletedReviewIds();
  if (!deletedIds.includes(reviewId)) {
    localStorage.setItem('zazu_deleted_reviews', JSON.stringify([...deletedIds, reviewId]));
  }

  try {
    await withTimeout(deleteDoc(doc(db, 'reviews', reviewId)), 1200);
  } catch (err) {
    console.warn('Firestore deleteReview fallback to local cache:', err);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('zazu-reviews-updated'));
  }
};

const getLocalServices = (): ServiceItem[] | null => {
  const cached = localStorage.getItem('zazu_services_cache');
  if (cached) {
    try { return JSON.parse(cached); } catch {}
  }
  return null;
};

// ---------------- SERVICES ----------------
export const fetchServices = async (): Promise<ServiceItem[]> => {
  const localItems = getLocalServices();
  try {
    const snap = await withTimeout(getDocs(collection(db, 'services')), 2500);
    if (!snap.empty) {
      const remoteItems = snap.docs.map((d) => ({ id: d.id, ...d.data() } as ServiceItem));
      if (!localItems) {
        localStorage.setItem('zazu_services_cache', JSON.stringify(remoteItems));
        return remoteItems;
      }
      return localItems;
    }
  } catch (err) {
    console.warn('Firestore fetchServices fallback:', err);
  }
  if (localItems) return localItems;
  localStorage.setItem('zazu_services_cache', JSON.stringify(servicesData));
  return servicesData;
};

export const saveService = async (service: Partial<ServiceItem>, userEmail?: string | null): Promise<ServiceItem> => {
  const payload = {
    number: service.number || '01',
    title: service.title || 'Specialized Capability',
    shortDescription: service.shortDescription || '',
    iconName: service.iconName || 'Target',
    deliverables: service.deliverables || ['Comprehensive Delivery'],
    metricsSample: service.metricsSample || 'Measurable Enterprise Value',
    priceRange: service.priceRange || 'Starting at ₹25,000'
  };

  const current = getLocalServices() || [...servicesData];
  const itemId = service.id || `service-${Date.now()}`;
  const savedItem: ServiceItem = { id: itemId, ...payload };

  const index = current.findIndex((s) => s.id === savedItem.id);
  const updatedList = index >= 0
    ? [...current.slice(0, index), savedItem, ...current.slice(index + 1)]
    : [...current, savedItem];
  localStorage.setItem('zazu_services_cache', JSON.stringify(updatedList));

  try {
    await withTimeout(setDoc(doc(db, 'services', itemId), payload, { merge: true }), 1800);
  } catch (err) {
    console.warn('Firestore setDoc service fallback to local cache:', err);
  }

  return savedItem;
};

export const deleteServiceItem = async (serviceId: string, userEmail?: string | null): Promise<void> => {
  const current = getLocalServices() || [...servicesData];
  const updated = current.filter((s) => s.id !== serviceId);
  localStorage.setItem('zazu_services_cache', JSON.stringify(updated));

  try {
    await withTimeout(deleteDoc(doc(db, 'services', serviceId)), 1800);
  } catch (err) {
    console.warn('Firestore deleteService fallback to local cache:', err);
  }
};

// ---------------- CLIENT INQUIRIES & MESSAGES ----------------
export const submitClientInquiry = async (inquiry: Omit<ClientInquiry, 'id' | 'createdAt'>): Promise<ClientInquiry> => {
  const fullInquiry: ClientInquiry = {
    id: `inquiry-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: inquiry.status || 'new',
    source: inquiry.source || 'website_form',
    whatsappSent: inquiry.whatsappSent ?? true,
    ...inquiry
  };

  try {
    const docRef = await withTimeout(
      addDoc(collection(db, 'inquiries'), {
        ...inquiry,
        status: fullInquiry.status,
        source: fullInquiry.source,
        whatsappSent: fullInquiry.whatsappSent,
        createdAt: fullInquiry.createdAt
      }),
      1500
    );
    fullInquiry.id = docRef.id;
  } catch (err) {
    console.warn('Firestore submitInquiry saved locally:', err);
  }

  // Cache locally in both inquiries and whatsapp leads cache if applicable
  const current = getLocalInquiries();
  const updated = [fullInquiry, ...current.filter(item => item.id !== fullInquiry.id)];
  localStorage.setItem('zazu_inquiries_cache', JSON.stringify(updated));

  if (fullInquiry.source?.startsWith('whatsapp')) {
    try {
      const waLeads = JSON.parse(localStorage.getItem('zazu_whatsapp_leads_cache') || '[]');
      localStorage.setItem('zazu_whatsapp_leads_cache', JSON.stringify([fullInquiry, ...waLeads]));
    } catch {}
  }

  return fullInquiry;
};

const getLocalInquiries = (): ClientInquiry[] => {
  try {
    const saved = localStorage.getItem('zazu_inquiries_cache');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const getDeletedInquiryIds = (): string[] => {
  try {
    const saved = localStorage.getItem('zazu_deleted_inquiries');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const fetchClientInquiries = async (userEmail?: string | null): Promise<ClientInquiry[]> => {
  const localItems = getLocalInquiries();
  const deletedIds = getDeletedInquiryIds();

  try {
    const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
    const snap = await withTimeout(getDocs(q), 2500);
    if (!snap.empty) {
      const remoteItems = snap.docs
        .map((d) => ({ id: d.id, ...d.data() } as ClientInquiry))
        .filter((i) => !deletedIds.includes(i.id));

      const mergedMap = new Map<string, ClientInquiry>();
      remoteItems.forEach((item) => mergedMap.set(item.id, item));
      localItems.forEach((item) => {
        if (!deletedIds.includes(item.id)) {
          mergedMap.set(item.id, item);
        }
      });

      const merged = Array.from(mergedMap.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      localStorage.setItem('zazu_inquiries_cache', JSON.stringify(merged));
      return merged;
    }
  } catch (err) {
    console.warn('Firestore fetchClientInquiries fallback:', err);
  }

  return localItems.filter((i) => !deletedIds.includes(i.id));
};

export const updateInquiryStatus = async (
  inquiryId: string,
  status: 'new' | 'contacted' | 'in_progress' | 'converted' | 'archived',
  userEmail?: string | null
): Promise<void> => {
  const current = getLocalInquiries();
  const updated = current.map((i) => (i.id === inquiryId ? { ...i, status } : i));
  localStorage.setItem('zazu_inquiries_cache', JSON.stringify(updated));

  try {
    await withTimeout(setDoc(doc(db, 'inquiries', inquiryId), { status }, { merge: true }), 1500);
  } catch (err) {
    console.warn('Firestore updateInquiryStatus error:', err);
  }
};

export const deleteInquiryItem = async (inquiryId: string, userEmail?: string | null): Promise<void> => {
  const current = getLocalInquiries();
  const targetInquiry = current.find((i) => i.id === inquiryId);
  const updated = current.filter((i) => i.id !== inquiryId);
  localStorage.setItem('zazu_inquiries_cache', JSON.stringify(updated));

  const deletedIds = getDeletedInquiryIds();
  if (!deletedIds.includes(inquiryId)) {
    localStorage.setItem('zazu_deleted_inquiries', JSON.stringify([...deletedIds, inquiryId]));
  }

  // Also remove from whatsapp leads cache if present
  try {
    const waLeads = JSON.parse(localStorage.getItem('zazu_whatsapp_leads_cache') || '[]');
    localStorage.setItem(
      'zazu_whatsapp_leads_cache',
      JSON.stringify(waLeads.filter((i: any) => i.id !== inquiryId))
    );
  } catch {}

  // If this inquiry came from a consultation booking, also release its corresponding booking slot!
  if (targetInquiry && (targetInquiry.source === 'booking' || targetInquiry.serviceRequired?.startsWith('Consultation:'))) {
    const allBookings = getLocalBookings() || [];
    const matchingBookings = allBookings.filter(
      (b) =>
        (targetInquiry.serviceRequired && targetInquiry.serviceRequired.includes(`${b.dateLabel} at ${b.time}`)) ||
        (targetInquiry.message && targetInquiry.message.includes(`${b.dateLabel} at ${b.time}`)) ||
        (b.email === targetInquiry.email && b.name === targetInquiry.name)
    );
    for (const mb of matchingBookings) {
      await deleteBookingItem(mb.id, userEmail);
    }
  }

  try {
    await withTimeout(deleteDoc(doc(db, 'inquiries', inquiryId)), 1500);
  } catch (err) {
    console.warn('Firestore deleteInquiry error:', err);
  }
};

// ---------------- BOOKINGS & CONSULTATION SLOTS ----------------
const getLocalBookings = (): BookingRecord[] | null => {
  try {
    const saved = localStorage.getItem('zazu_bookings_cache');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const getReleasedSlotIds = (): string[] => {
  try {
    const saved = localStorage.getItem('zazu_released_bookings');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const isSlotBooked = (
  bookedList: BookingRecord[],
  dayItem: { date: string; label: string },
  slotTime: string
): boolean => {
  const slotKey = `${dayItem.date}_${slotTime}`;
  return bookedList.some(
    (b) =>
      b.slotKey === slotKey ||
      (b.time === slotTime &&
        (b.dateLabel === dayItem.label ||
          b.dateLabel?.startsWith(dayItem.label.replace(/,\s*\d{4}$/, '')) ||
          b.slotKey?.startsWith(dayItem.date)))
  );
};

export const fetchBookings = async (): Promise<BookingRecord[]> => {
  const localItems = getLocalBookings() || [];
  const releasedIds = getReleasedSlotIds();

  try {
    const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
    const snap = await withTimeout(getDocs(q), 2500);
    if (!snap.empty) {
      const remoteItems = snap.docs
        .map((d) => ({ id: d.id, ...d.data() } as BookingRecord))
        .filter(
          (b) =>
            !releasedIds.includes(b.id) &&
            !releasedIds.includes(b.slotKey) &&
            !releasedIds.includes(`${b.dateLabel}_${b.time}`)
        );

      // Merge remote and local items without duplicates by slotKey
      const mergedMap = new Map<string, BookingRecord>();
      remoteItems.forEach((item) => mergedMap.set(item.slotKey || item.id, item));
      localItems.forEach((item) => {
        if (
          !releasedIds.includes(item.id) &&
          !releasedIds.includes(item.slotKey) &&
          !releasedIds.includes(`${item.dateLabel}_${item.time}`)
        ) {
          mergedMap.set(item.slotKey || item.id, item);
        }
      });

      const merged = Array.from(mergedMap.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      localStorage.setItem('zazu_bookings_cache', JSON.stringify(merged));
      return merged;
    }
  } catch (err) {
    console.warn('Firestore fetchBookings fallback:', err);
  }

  const filteredLocal = localItems.filter(
    (b) =>
      !releasedIds.includes(b.id) &&
      !releasedIds.includes(b.slotKey) &&
      !releasedIds.includes(`${b.dateLabel}_${b.time}`)
  );
  return filteredLocal;
};

export const saveBooking = async (booking: Omit<BookingRecord, 'id' | 'createdAt'>): Promise<BookingRecord> => {
  const safeDocId = `slot_${booking.slotKey.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
  const fullBooking: BookingRecord = {
    id: safeDocId,
    createdAt: new Date().toISOString(),
    ...booking
  };

  // Remove from released list if re-booking the same slot
  const dateTimeKey = `${booking.dateLabel}_${booking.time}`;
  const releasedIds = getReleasedSlotIds().filter(
    (id) => id !== safeDocId && id !== booking.slotKey && id !== dateTimeKey
  );
  localStorage.setItem('zazu_released_bookings', JSON.stringify(releasedIds));

  // Update local cache immediately
  const current = getLocalBookings() || [];
  const updated = [fullBooking, ...current.filter((b) => b.slotKey !== fullBooking.slotKey && b.id !== safeDocId)];
  localStorage.setItem('zazu_bookings_cache', JSON.stringify(updated));

  try {
    await withTimeout(
      setDoc(doc(db, 'bookings', safeDocId), {
        ...booking,
        createdAt: fullBooking.createdAt
      }),
      1500
    );
  } catch (err) {
    console.warn('Firestore saveBooking fallback locally:', err);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('zazu-bookings-updated'));
  }

  return fullBooking;
};

export const deleteBookingItem = async (
  bookingId: string,
  userEmail?: string | null,
  slotKeyHint?: string,
  dateTimeHint?: string
): Promise<void> => {
  const current = getLocalBookings() || [];
  const target = current.find((b) => b.id === bookingId || (slotKeyHint && b.slotKey === slotKeyHint));
  const resolvedSlotKey = target?.slotKey || slotKeyHint || '';
  const resolvedDateTime = target ? `${target.dateLabel}_${target.time}` : dateTimeHint || '';

  const updated = current.filter(
    (b) =>
      b.id !== bookingId &&
      (!resolvedSlotKey || b.slotKey !== resolvedSlotKey) &&
      (!resolvedDateTime || `${b.dateLabel}_${b.time}` !== resolvedDateTime)
  );
  localStorage.setItem('zazu_bookings_cache', JSON.stringify(updated));

  // Record released ID, slotKey, and dateTimeKey so it stays released
  const releasedIds = getReleasedSlotIds();
  const nextReleased = Array.from(
    new Set([
      ...releasedIds,
      bookingId,
      ...(resolvedSlotKey ? [resolvedSlotKey] : []),
      ...(resolvedDateTime ? [resolvedDateTime] : [])
    ])
  );
  localStorage.setItem('zazu_released_bookings', JSON.stringify(nextReleased));

  try {
    await withTimeout(deleteDoc(doc(db, 'bookings', bookingId)), 1500);
  } catch (err) {
    console.warn('Firestore deleteBooking error:', err);
  }

  // Also try deleting any other Firestore docs in 'bookings' with the same slotKey
  if (resolvedSlotKey) {
    const safeDocId = `slot_${resolvedSlotKey.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
    if (safeDocId !== bookingId) {
      try {
        await withTimeout(deleteDoc(doc(db, 'bookings', safeDocId)), 1500);
      } catch {}
    }
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('zazu-bookings-updated'));
  }
};
