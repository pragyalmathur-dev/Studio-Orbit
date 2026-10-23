import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { STUDIO_CONFIG } from '../data/studioContent';

interface NavigationProps {
  currentPage: 'home' | 'services' | 'contact';
  onNavigate: (page: 'home' | 'services' | 'contact') => void;
  onNavigateSection?: (sectionId: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentPage,
  onNavigate,
  onNavigateSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'about', label: 'About Us', type: 'section' as const, target: 'about' },
    { id: 'work', label: 'Our Work', type: 'section' as const, target: 'selected-work' },
    { id: 'services', label: 'Services', type: 'section' as const, target: 'our-focus' },
    { id: 'contact', label: 'Contact Us', type: 'page' as const, target: 'contact' },
  ];

  const handleItemClick = (item: (typeof navItems)[number]) => {
    setMobileMenuOpen(false);
    if (item.type === 'page') {
      onNavigate('contact');
    } else {
      if (onNavigateSection) {
        onNavigateSection(item.target);
      } else {
        if (currentPage !== 'home') {
          onNavigate('home');
          setTimeout(() => {
            const el = document.getElementById(item.target);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        } else {
          const el = document.getElementById(item.target);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#F0F5F0]/92 border-b border-[#ACC7B8] text-[#49756B] backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 sm:h-20 flex items-center justify-between">
        {/* Zone 1: Wordmark */}
        <button
          onClick={() => {
            onNavigate('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="font-serif text-xl sm:text-2xl font-normal tracking-tight text-[#49756B] hover:opacity-80 transition-opacity text-left cursor-pointer whitespace-nowrap"
        >
          {STUDIO_CONFIG.name}
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-normal">
          {navItems.map((item) => {
            const isActive = item.type === 'page' && currentPage === 'contact';
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`transition-colors relative py-1 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'text-[#49756B] font-semibold'
                    : 'text-[#49756B]/75 hover:text-[#49756B]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] rounded-full bg-[#49756B]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Mobile Menu Toggle only (Let's Talk removed per request) */}
        <div className="flex items-center md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md hover:bg-[#ACC7B8]/25 text-[#49756B] transition-colors cursor-pointer"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-6 py-6 border-t bg-[#F0F5F0] border-[#ACC7B8] text-[#49756B]">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className="text-left text-lg font-serif py-1 text-[#49756B] hover:underline transition-all"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
