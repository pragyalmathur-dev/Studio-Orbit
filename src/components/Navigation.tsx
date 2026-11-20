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
  const [logoError, setLogoError] = useState(false);

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
    <header className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-[#FAF6EE]/95 via-[#F5EFE4]/92 to-[#EFE6D6]/95 border-b border-[#1F3D2B]/15 text-[#1F3D2B] backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 sm:h-20 flex items-center justify-between">
        {/* Zone 1: Brand Logo */}
        <button
          onClick={() => {
            onNavigate('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center hover:opacity-85 transition-opacity text-left cursor-pointer shrink-0"
          aria-label={`${STUDIO_CONFIG.name} Home`}
        >
          {!logoError ? (
            <img
              src="/assets/aistudio/Imprint_Studio_Forest_Green_Logo_7260e622.png"
              alt={STUDIO_CONFIG.name}
              referrerPolicy="no-referrer"
              onError={() => setLogoError(true)}
              className="h-11 sm:h-14 w-auto object-contain mix-blend-multiply select-none"
            />
          ) : (
            <span className="font-serif text-xl sm:text-2xl font-normal tracking-tight text-[#1F3D2B] whitespace-nowrap">
              {STUDIO_CONFIG.name}
            </span>
          )}
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
                    ? 'text-[#1F3D2B] font-semibold'
                    : 'text-[#1F3D2B]/75 hover:text-[#1F3D2B]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] rounded-full bg-[#1F3D2B]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Mobile Menu Toggle only (Let's Talk removed per request) */}
        <div className="flex items-center md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md hover:bg-[#1F3D2B]/10 text-[#1F3D2B] transition-colors cursor-pointer"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-6 py-6 border-t bg-gradient-to-b from-[#FAF6EE] to-[#F5EFE4] border-[#1F3D2B]/15 text-[#1F3D2B]">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className="text-left text-lg font-serif py-1 text-[#1F3D2B] hover:underline transition-all"
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
