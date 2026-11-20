import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { CustomCursor } from './components/CustomCursor';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { ContactPage } from './pages/ContactPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'services' | 'contact'>('home');
  const [selectedServiceForContact, setSelectedServiceForContact] = useState<string | undefined>(undefined);

  // Sync with browser URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'services') {
        setCurrentPage('services');
      } else if (hash === 'contact') {
        setCurrentPage('contact');
      } else {
        setCurrentPage('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page: 'home' | 'services' | 'contact') => {
    setCurrentPage(page);
    window.location.hash = page === 'home' ? '' : page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToSection = (sectionId: string) => {
    if (currentPage !== 'home') {
      setCurrentPage('home');
      window.location.hash = '';
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectServiceForContact = (serviceTitle?: string) => {
    setSelectedServiceForContact(serviceTitle);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#FAF6EE] via-[#F5EFE4] to-[#EDE3D2] text-[#1F3D2B]">
      {/* Precision Brand Cursor for Pointer Devices */}
      <CustomCursor />

      {/* Sticky Header */}
      <Navigation
        currentPage={currentPage}
        onNavigate={navigateTo}
        onNavigateSection={navigateToSection}
      />

      {/* Main Content Area */}
      <main className="main-container flex-1 bg-transparent">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={navigateTo}
            onSelectServiceForContact={handleSelectServiceForContact}
          />
        )}

        {currentPage === 'services' && (
          <ServicesPage
            onNavigate={navigateTo}
            onSelectServiceForContact={handleSelectServiceForContact}
          />
        )}

        {currentPage === 'contact' && (
          <ContactPage initialService={selectedServiceForContact} />
        )}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={navigateTo} onNavigateSection={navigateToSection} />
    </div>
  );
}
