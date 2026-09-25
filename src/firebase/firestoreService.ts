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

const ADMIN_EMAILS = ['digitalmediazazu@gmail.com', 'eladigitalw@gmail.com', 'elae2379@gmail.com'];

export const isUserAdmin = (email?: string | null): boolean => {
  if (!email) return false;
  return ADMIN_EMAILS.some((adm) => adm.toLowerCase() === email.trim().toLowerCase());
};

// ---------------- SITE CONFIG ----------------
export const fetchSiteConfig = async (): Promise<AgencyContactConfig> => {
  try {
    const docRef = doc(db, 'site_config', 'main');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { ...initialAgencyConfig, ...(snap.data() as AgencyContactConfig) };
    }
  } catch (err) {
    console.warn('Firestore fetchSiteConfig fallback to local:', err);
  }
  const saved = localStorage.getItem('zazu_agency_config');
  if (saved) {
    try { return JSON.parse(saved); } catch {}
  }
  return initialAgencyConfig;
};

export const saveSiteConfig = async (config: AgencyContactConfig, userEmail?: string | null): Promise<void> => {
  if (!isUserAdmin(userEmail)) {
    throw new Error('Unauthorized: Only digitalmediazazu@gmail.com can modify site settings.');
  }
  localStorage.setItem('zazu_agency_config', JSON.stringify(config));
  try {
    const docRef = doc(db, 'site_config', 'main');
    await setDoc(docRef, config, { merge: true });
  } catch (err) {
    console.warn('Firestore saveSiteConfig error:', err);
  }
};

// ---------------- WORKS (CASE STUDIES) ----------------
export const fetchWorks = async (): Promise<CaseStudyItem[]> => {
  try {
    const q = query(collection(db, 'works'));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as CaseStudyItem));
      localStorage.setItem('zazu_works_cache', JSON.stringify(items));
      return items;
    }
  } catch (err) {
    console.warn('Firestore fetchWorks fallback:', err);
  }
  const cached = localStorage.getItem('zazu_works_cache');
  if (cached) {
    try { return JSON.parse(cached); } catch {}
  }
  return caseStudiesData;
};

export const saveWork = async (work: Partial<CaseStudyItem>, userEmail?: string | null): Promise<CaseStudyItem> => {
  if (!isUserAdmin(userEmail)) {
    throw new Error('Unauthorized: Only digitalmediazazu@gmail.com can create or modify works.');
  }
  
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

  let savedItem: CaseStudyItem;
  if (work.id) {
    try {
      await updateDoc(doc(db, 'works', work.id), payload);
    } catch (err) {
      console.warn('Firestore updateDoc error:', err);
    }
    savedItem = { id: work.id, ...payload };
  } else {
    try {
      const docRef = await addDoc(collection(db, 'works'), payload);
      savedItem = { id: docRef.id, ...payload };
    } catch (err) {
      console.warn('Firestore addDoc fallback to client ID:', err);
      savedItem = { id: `work-${Date.now()}`, ...payload };
    }
  }

  // Update local cache
  const current = await fetchWorks();
  const index = current.findIndex((w) => w.id === savedItem.id);
  const updatedList = index >= 0
    ? [...current.slice(0, index), savedItem, ...current.slice(index + 1)]
    : [savedItem, ...current];
  localStorage.setItem('zazu_works_cache', JSON.stringify(updatedList));

  return savedItem;
};

export const deleteWorkItem = async (workId: string, userEmail?: string | null): Promise<void> => {
  if (!isUserAdmin(userEmail)) {
    throw new Error('Unauthorized: Only digitalmediazazu@gmail.com can delete works.');
  }
  try {
    await deleteDoc(doc(db, 'works', workId));
  } catch (err) {
    console.warn('Firestore deleteWork error:', err);
  }
  const current = await fetchWorks();
  const updated = current.filter((w) => w.id !== workId);
  localStorage.setItem('zazu_works_cache', JSON.stringify(updated));
};

// ---------------- REVIEWS (TESTIMONIALS) ----------------
export const fetchReviews = async (): Promise<TestimonialItem[]> => {
  try {
    const q = query(collection(db, 'reviews'));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as TestimonialItem));
      localStorage.setItem('zazu_reviews_cache', JSON.stringify(items));
      return items;
    }
  } catch (err) {
    console.warn('Firestore fetchReviews fallback:', err);
  }
  const cached = localStorage.getItem('zazu_reviews_cache');
  if (cached) {
    try { return JSON.parse(cached); } catch {}
  }
  return testimonialsData;
};

export const saveReview = async (review: Partial<TestimonialItem>, userEmail?: string | null): Promise<TestimonialItem> => {
  if (!isUserAdmin(userEmail)) {
    throw new Error('Unauthorized: Only digitalmediazazu@gmail.com can create or modify reviews.');
  }
  
  const payload = {
    clientName: review.clientName || 'Anonymous Partner',
    businessName: review.businessName || 'Digital Enterprise',
    role: review.role || 'Managing Director',
    testimonial: review.testimonial || '',
    avatarInitials: review.avatarInitials || (review.clientName ? review.clientName.substring(0, 2).toUpperCase() : 'ZM'),
    stars: review.stars || 5,
    highlight: review.highlight || 'Strategic Growth'
  };

  let savedItem: TestimonialItem;
  if (review.id) {
    try {
      await updateDoc(doc(db, 'reviews', review.id), payload);
    } catch (err) {
      console.warn('Firestore updateReview error:', err);
    }
    savedItem = { id: review.id, ...payload };
  } else {
    try {
      const docRef = await addDoc(collection(db, 'reviews'), payload);
      savedItem = { id: docRef.id, ...payload };
    } catch (err) {
      console.warn('Firestore addDoc fallback:', err);
      savedItem = { id: `review-${Date.now()}`, ...payload };
    }
  }

  const current = await fetchReviews();
  const index = current.findIndex((r) => r.id === savedItem.id);
  const updatedList = index >= 0
    ? [...current.slice(0, index), savedItem, ...current.slice(index + 1)]
    : [savedItem, ...current];
  localStorage.setItem('zazu_reviews_cache', JSON.stringify(updatedList));

  return savedItem;
};

export const deleteReviewItem = async (reviewId: string, userEmail?: string | null): Promise<void> => {
  if (!isUserAdmin(userEmail)) {
    throw new Error('Unauthorized: Only digitalmediazazu@gmail.com can delete reviews.');
  }
  try {
    await deleteDoc(doc(db, 'reviews', reviewId));
  } catch (err) {
    console.warn('Firestore deleteReview error:', err);
  }
  const current = await fetchReviews();
  const updated = current.filter((r) => r.id !== reviewId);
  localStorage.setItem('zazu_reviews_cache', JSON.stringify(updated));
};

// ---------------- SERVICES ----------------
export const fetchServices = async (): Promise<ServiceItem[]> => {
  try {
    const snap = await getDocs(collection(db, 'services'));
    if (!snap.empty) {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as ServiceItem));
      localStorage.setItem('zazu_services_cache', JSON.stringify(items));
      return items;
    }
  } catch (err) {
    console.warn('Firestore fetchServices fallback:', err);
  }
  const cached = localStorage.getItem('zazu_services_cache');
  if (cached) {
    try { return JSON.parse(cached); } catch {}
  }
  return servicesData;
};

export const saveService = async (service: Partial<ServiceItem>, userEmail?: string | null): Promise<ServiceItem> => {
  if (!isUserAdmin(userEmail)) {
    throw new Error('Unauthorized: Only digitalmediazazu@gmail.com can create or modify services.');
  }

  const payload = {
    number: service.number || '01',
    title: service.title || 'Specialized Capability',
    shortDescription: service.shortDescription || '',
    iconName: service.iconName || 'Target',
    deliverables: service.deliverables || ['Comprehensive Delivery'],
    metricsSample: service.metricsSample || 'Measurable Enterprise Value',
    priceRange: service.priceRange || 'Starting at ₹25,000'
  };

  let savedItem: ServiceItem;
  if (service.id) {
    try {
      await updateDoc(doc(db, 'services', service.id), payload);
    } catch (err) {
      console.warn('Firestore updateService error:', err);
    }
    savedItem = { id: service.id, ...payload };
  } else {
    try {
      const docRef = await addDoc(collection(db, 'services'), payload);
      savedItem = { id: docRef.id, ...payload };
    } catch (err) {
      console.warn('Firestore addDoc service error:', err);
      savedItem = { id: `service-${Date.now()}`, ...payload };
    }
  }

  const current = await fetchServices();
  const index = current.findIndex((s) => s.id === savedItem.id);
  const updatedList = index >= 0
    ? [...current.slice(0, index), savedItem, ...current.slice(index + 1)]
    : [...current, savedItem];
  localStorage.setItem('zazu_services_cache', JSON.stringify(updatedList));

  return savedItem;
};

export const deleteServiceItem = async (serviceId: string, userEmail?: string | null): Promise<void> => {
  if (!isUserAdmin(userEmail)) {
    throw new Error('Unauthorized: Only digitalmediazazu@gmail.com can delete services.');
  }
  try {
    await deleteDoc(doc(db, 'services', serviceId));
  } catch (err) {
    console.warn('Firestore deleteService error:', err);
  }
  const current = await fetchServices();
  const updated = current.filter((s) => s.id !== serviceId);
  localStorage.setItem('zazu_services_cache', JSON.stringify(updated));
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
    const docRef = await addDoc(collection(db, 'inquiries'), {
      ...inquiry,
      status: fullInquiry.status,
      source: fullInquiry.source,
      whatsappSent: fullInquiry.whatsappSent,
      createdAt: fullInquiry.createdAt
    });
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

export const fetchClientInquiries = async (userEmail?: string | null): Promise<ClientInquiry[]> => {
  if (!isUserAdmin(userEmail)) {
    throw new Error('Unauthorized: Only digitalmediazazu@gmail.com can view client inquiries.');
  }

  try {
    const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as ClientInquiry));
      localStorage.setItem('zazu_inquiries_cache', JSON.stringify(items));
      return items;
    }
  } catch (err) {
    console.warn('Firestore fetchClientInquiries fallback:', err);
  }

  return getLocalInquiries();
};

export const updateInquiryStatus = async (
  inquiryId: string,
  status: 'new' | 'contacted' | 'in_progress' | 'converted' | 'archived',
  userEmail?: string | null
): Promise<void> => {
  if (!isUserAdmin(userEmail)) {
    throw new Error('Unauthorized: Only digitalmediazazu@gmail.com can update inquiries.');
  }
  try {
    await updateDoc(doc(db, 'inquiries', inquiryId), { status });
  } catch (err) {
    console.warn('Firestore updateInquiryStatus error:', err);
  }
  const current = getLocalInquiries();
  const updated = current.map((i) => (i.id === inquiryId ? { ...i, status } : i));
  localStorage.setItem('zazu_inquiries_cache', JSON.stringify(updated));
};

export const deleteInquiryItem = async (inquiryId: string, userEmail?: string | null): Promise<void> => {
  if (!isUserAdmin(userEmail)) {
    throw new Error('Unauthorized: Only digitalmediazazu@gmail.com can delete inquiries.');
  }
  try {
    await deleteDoc(doc(db, 'inquiries', inquiryId));
  } catch (err) {
    console.warn('Firestore deleteInquiry error:', err);
  }
  const current = getLocalInquiries();
  const updated = current.filter((i) => i.id !== inquiryId);
  localStorage.setItem('zazu_inquiries_cache', JSON.stringify(updated));
};

// ---------------- BOOKINGS & CONSULTATION SLOTS ----------------
export const fetchBookings = async (): Promise<BookingRecord[]> => {
  try {
    const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as BookingRecord));
      localStorage.setItem('zazu_bookings_cache', JSON.stringify(items));
      return items;
    }
  } catch (err) {
    console.warn('Firestore fetchBookings fallback:', err);
  }
  try {
    const saved = localStorage.getItem('zazu_bookings_cache');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const saveBooking = async (booking: Omit<BookingRecord, 'id' | 'createdAt'>): Promise<BookingRecord> => {
  const fullBooking: BookingRecord = {
    id: `booking-${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...booking
  };

  try {
    const docRef = await addDoc(collection(db, 'bookings'), {
      ...booking,
      createdAt: fullBooking.createdAt
    });
    fullBooking.id = docRef.id;
  } catch (err) {
    console.warn('Firestore saveBooking fallback locally:', err);
  }

  // Update local cache
  const current = await fetchBookings();
  const updated = [fullBooking, ...current.filter((b) => b.slotKey !== fullBooking.slotKey)];
  localStorage.setItem('zazu_bookings_cache', JSON.stringify(updated));

  return fullBooking;
};

export const deleteBookingItem = async (bookingId: string, userEmail?: string | null): Promise<void> => {
  if (!isUserAdmin(userEmail)) {
    throw new Error('Unauthorized: Only digitalmediazazu@gmail.com can delete bookings.');
  }
  try {
    await deleteDoc(doc(db, 'bookings', bookingId));
  } catch (err) {
    console.warn('Firestore deleteBooking error:', err);
  }
  const current = await fetchBookings();
  const updated = current.filter((b) => b.id !== bookingId);
  localStorage.setItem('zazu_bookings_cache', JSON.stringify(updated));
};
