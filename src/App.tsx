/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { WhyChooseUs } from './components/WhyChooseUs';
import { ServicesSection } from './components/ServicesSection';
import { ProcessSection } from './components/ProcessSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { BookingSection } from './components/BookingSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { GlobalMarketingBackground } from './components/GlobalMarketingBackground';
import { ScrollReveal } from './components/ScrollReveal';
import { DashboardModal } from './components/DashboardModal';
import { AuthModal } from './components/AuthModal';
import { QuoteModal } from './components/QuoteModal';
import { initialAgencyConfig } from './data/agencyData';
import { AgencyContactConfig, CaseStudyItem, TestimonialItem, ServiceItem } from './types';
import { fetchSiteConfig, fetchWorks, fetchReviews, fetchServices } from './firebase/firestoreService';

function MainApp() {
  // Live configuration & Firestore collections
  const [agencyConfig, setAgencyConfig] = useState<AgencyContactConfig>(initialAgencyConfig);
  const [worksList, setWorksList] = useState<CaseStudyItem[]>([]);
  const [reviewsList, setReviewsList] = useState<TestimonialItem[]>([]);
  const [servicesList, setServicesList] = useState<ServiceItem[]>([]);

  // Modal controls
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [dashboardInitialTab, setDashboardInitialTab] = useState('home');
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [preloadedService, setPreloadedService] = useState('Digital Marketing');
  const [dataVersion, setDataVersion] = useState(0);

  const refreshData = async () => {
    setDataVersion((v) => v + 1);
    try {
      const [cfg, works, reviews, services] = await Promise.all([
        fetchSiteConfig(),
        fetchWorks(),
        fetchReviews(),
        fetchServices()
      ]);
      setAgencyConfig(cfg);
      setWorksList(works);
      setReviewsList(reviews);
      setServicesList(services);
    } catch (err) {
      console.warn('Error refreshing live data:', err);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const scrollToSection = (id: string) => {
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenDashboard = (tab: string = 'home') => {
    setDashboardInitialTab(tab);
    setIsDashboardOpen(true);
  };

  const handleSelectServiceForInquiry = (serviceTitle: string) => {
    setPreloadedService(serviceTitle);
    scrollToSection('contact');
  };

  return (
    <div className="relative min-h-screen bg-[#080808] text-white selection:bg-[#F5C542]/30 selection:text-[#FFD966] font-sans antialiased overflow-x-hidden">
      
      {/* 0. Global 3D Marketing Ambient Background (Fixed full wallpaper matching reference image) */}
      <GlobalMarketingBackground />

      <div className="relative z-10">
        {/* 1. Header Navigation */}
        <Navbar
          agencyConfig={agencyConfig}
          onOpenBooking={() => scrollToSection('booking')}
          onOpenQuote={() => setIsQuoteModalOpen(true)}
          onOpenDashboard={handleOpenDashboard}
        />

        {/* 2. Hero Section */}
        <Hero
          onBookConsultation={() => scrollToSection('booking')}
          onExploreServices={() => scrollToSection('services')}
        />

        {/* 3. About Section (About Vijayakumar) with Scroll Reveal */}
        <ScrollReveal direction="up" delay={50}>
          <AboutSection
            agencyConfig={agencyConfig}
            onOpenBooking={() => scrollToSection('booking')}
          />
        </ScrollReveal>

        {/* 4. Why Choose ZAZU with Scroll Reveal */}
        <ScrollReveal direction="pop" delay={100}>
          <WhyChooseUs />
        </ScrollReveal>

        {/* 5. Services Section with Scroll Reveal */}
        <ScrollReveal direction="up" delay={50}>
          <ServicesSection
            servicesList={servicesList}
            onSelectServiceForInquiry={handleSelectServiceForInquiry}
          />
        </ScrollReveal>

        {/* 6. Execution Process with Scroll Reveal */}
        <ScrollReveal direction="pop" delay={50}>
          <ProcessSection />
        </ScrollReveal>

        {/* 7. Client Reviews with Scroll Reveal */}
        <ScrollReveal direction="up" delay={50}>
          <TestimonialsSection
            reviewsList={reviewsList}
            onOpenDashboard={handleOpenDashboard}
          />
        </ScrollReveal>

        {/* 8. Consultation Booking with Scroll Reveal */}
        <ScrollReveal direction="pop" delay={50}>
          <BookingSection key={dataVersion} agencyConfig={agencyConfig} />
        </ScrollReveal>

        {/* 9. Contact Section with Scroll Reveal */}
        <ScrollReveal direction="up" delay={50}>
          <ContactSection
            agencyConfig={agencyConfig}
            selectedServicePreload={preloadedService}
            onOpenDashboard={() => handleOpenDashboard('contact')}
          />
        </ScrollReveal>

        {/* 10. Footer */}
        <Footer
          agencyConfig={agencyConfig}
          onOpenBooking={() => scrollToSection('booking')}
          onOpenQuote={() => setIsQuoteModalOpen(true)}
        />
      </div>

      {/* Floating WhatsApp Quick-Chat (Routes to 9789504702) */}
      <FloatingWhatsApp agencyConfig={agencyConfig} />

      {/* Agency Dashboard Modal */}
      <DashboardModal
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        initialTab={dashboardInitialTab}
        onDataChange={refreshData}
      />

      {/* Auth Modal (Login / Sign Up / Continue with Google) */}
      <AuthModal />

      {/* Quick Quote Estimation Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        onRedirectToContact={handleSelectServiceForInquiry}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
