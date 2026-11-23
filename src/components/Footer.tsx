import React, { useState } from 'react';
import { ArrowUpRight, Mail, Phone } from 'lucide-react';
import { STUDIO_CONFIG } from '../data/studioContent';

interface FooterProps {
  onNavigate: (page: 'home' | 'services' | 'contact') => void;
  onNavigateSection?: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onNavigateSection }) => {
  const [logoError, setLogoError] = useState(false);

  const handleNavClick = (target: string, isPage: boolean) => {
    if (isPage) {
      onNavigate('contact');
    } else if (onNavigateSection) {
      onNavigateSection(target);
    } else {
      const el = document.getElementById(target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gradient-to-br from-[#EAE0CC] via-[#E3D6BC] to-[#D8C7A7] text-[#1F3D2B] border-t border-[#1F3D2B]/15 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-16 border-b border-[#1F3D2B]/15">
          {/* Brand & Positioning */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center overflow-hidden h-12 sm:h-14">
              {!logoError ? (
                <img
                  src="/assets/aistudio/Studio_Orbit_Forest_Green_Logo_0bc8b332.png"
                  alt={STUDIO_CONFIG.name}
                  referrerPolicy="no-referrer"
                  onError={() => setLogoError(true)}
                  className="h-[80px] sm:h-[96px] w-auto object-contain -ml-2 mix-blend-multiply select-none"
                />
              ) : (
                <h3 className="font-serif text-3xl text-[#1F3D2B] font-normal">
                  {STUDIO_CONFIG.name}
                </h3>
              )}
            </div>
            <p className="text-sm text-[#1F3D2B]/85 font-light max-w-md leading-relaxed">
              A branding and brand transformation studio. We create brands with a clear identity and help established businesses evolve through strategy, design, and digital experiences.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-xs uppercase font-mono tracking-widest text-[#1F3D2B]/70 font-semibold">
              Navigation
            </span>
            <ul className="space-y-2 text-sm text-[#1F3D2B]/85">
              <li>
                <button
                  onClick={() => handleNavClick('about', false)}
                  className="hover:underline hover:text-[#1F3D2B] transition-colors cursor-pointer"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('selected-work', false)}
                  className="hover:underline hover:text-[#1F3D2B] transition-colors cursor-pointer"
                >
                  Our Work
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('our-focus', false)}
                  className="hover:underline hover:text-[#1F3D2B] transition-colors cursor-pointer"
                >
                  Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('contact', true)}
                  className="hover:underline hover:text-[#1F3D2B] transition-colors cursor-pointer"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Studio Channels */}
          <div className="md:col-span-4 space-y-3">
            <span className="text-xs uppercase font-mono tracking-widest text-[#1F3D2B]/70 font-semibold">
              Studio Inquiries
            </span>
            <div className="space-y-3 text-sm text-[#1F3D2B]/85">
              <div>
                <span className="block text-xs text-[#1F3D2B]/60 font-mono">Email Direct</span>
                <a
                  href={`mailto:${STUDIO_CONFIG.email}`}
                  className="text-[#1F3D2B] font-medium hover:underline font-mono text-xs transition-colors flex items-center gap-1.5 mt-0.5"
                >
                  <Mail className="w-3.5 h-3.5 text-[#1F3D2B]" />
                  <span>{STUDIO_CONFIG.email}</span>
                </a>
              </div>
              <div>
                <span className="block text-xs text-[#1F3D2B]/60 font-mono">Telephone</span>
                <a
                  href={`tel:${STUDIO_CONFIG.phoneTel}`}
                  className="text-[#1F3D2B] font-medium hover:underline font-mono text-xs transition-colors flex items-center gap-1.5 mt-0.5"
                >
                  <Phone className="w-3.5 h-3.5 text-[#1F3D2B]" />
                  <span>{STUDIO_CONFIG.phoneFormatted}</span>
                </a>
              </div>
              <div>
                <span className="block text-xs text-[#1F3D2B]/60 font-mono">Location</span>
                <span className="text-[#1F3D2B] font-mono text-xs">{STUDIO_CONFIG.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#1F3D2B]/75 font-mono">
          <div>
            © {STUDIO_CONFIG.copyrightYear} {STUDIO_CONFIG.name}. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-[#1F3D2B] hover:underline transition-all flex items-center gap-1 cursor-pointer font-medium"
            >
              <span>Back to top</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
