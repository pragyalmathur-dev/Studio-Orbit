import React, { useState } from 'react';
import { HeroVideo } from '../components/HeroVideo';
import { ProjectModal } from '../components/ProjectModal';
import {
  SELECTED_PROJECTS,
  STUDIO_CONFIG,
  CORE_OFFERINGS,
  SelectedProject,
} from '../data/studioContent';
import {
  ArrowUpRight,
  ArrowRight,
  Mail,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: 'home' | 'services' | 'contact') => void;
  onSelectServiceForContact: (serviceName?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectServiceForContact,
}) => {
  const [selectedProject, setSelectedProject] = useState<SelectedProject | null>(null);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const handleSkipToWork = () => {
    const el = document.getElementById('selected-work');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-[#F0F5F0] text-[#49756B]">
      {/* 1. CINEMATIC BACKGROUND VIDEO HERO */}
      <HeroVideo
        onNavigateToWork={handleSkipToWork}
        onNavigateToContact={(service) => {
          onSelectServiceForContact(service);
          onNavigate('contact');
        }}
      />

      {/* 2. SELECTED WORK & CLIENT PORTFOLIO SECTION */}
      <section
        id="selected-work"
        className="py-24 sm:py-32 px-6 lg:px-12 max-w-7xl mx-auto scroll-mt-20"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 pb-6 border-b border-[#ACC7B8]">
          <div>
            <span className="text-xs uppercase font-mono tracking-[0.2em] text-[#49756B]/70 font-semibold block mb-2">
              StudioOrbit · Selected Work
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl text-[#49756B] font-normal">
              Work that shapes identity and growth.
            </h2>
          </div>
          <p className="text-sm text-[#49756B]/80 max-w-md font-light leading-relaxed">
            Every project demonstrates how strategic clarity, distinctive visual design, and disciplined execution solve a specific brand challenge.
          </p>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {SELECTED_PROJECTS.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="group bg-[#ACC7B8]/25 hover:bg-[#F0F5F0] border border-[#ACC7B8] hover:border-[#49756B]/50 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer flex flex-col justify-between"
            >
              {/* Card Visual Header */}
              <div className="relative aspect-[16/10] bg-[#F0F5F0] overflow-hidden flex items-center justify-center p-6 text-[#49756B] border-b border-[#ACC7B8]">
                {project.imageUrl && !imgErrors[project.id] ? (
                  <div className="absolute inset-0 z-0">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                      onError={() => {
                        setImgErrors((prev) => ({ ...prev, [project.id]: true }));
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#F0F5F0]/30 to-transparent" />
                  </div>
                ) : (
                  <div className="relative z-10 w-full h-full flex flex-col justify-between pt-6">
                    <div className="py-4 flex flex-col items-center justify-center text-center">
                      <span className="font-serif text-2xl text-[#49756B] font-light tracking-wide group-hover:underline">
                        {project.title}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-[#49756B]/70">
                      <span>Studio Case Study</span>
                      <span className="font-medium underline">View More</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col justify-between flex-1 space-y-5">
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl text-[#49756B] mb-3 group-hover:opacity-85 transition-opacity">
                    {project.title}
                  </h3>

                  {/* Brand Challenge */}
                  <div className="mb-3">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#49756B]/60 block mb-1">
                      The Brand Challenge
                    </span>
                    <p className="text-xs sm:text-sm text-[#49756B]/85 leading-relaxed font-light line-clamp-2">
                      {project.brandChallenge}
                    </p>
                  </div>

                  {/* What Changed */}
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#49756B] block mb-1 font-semibold">
                      What Changed
                    </span>
                    <p className="text-xs sm:text-sm text-[#49756B]/90 leading-relaxed font-light line-clamp-2">
                      {project.whatChanged}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#ACC7B8] flex items-center justify-between text-xs font-medium text-[#49756B]">
                  <span>View More</span>
                  <div className="w-7 h-7 rounded-full bg-[#F0F5F0] group-hover:bg-[#49756B] border border-[#ACC7B8] group-hover:border-[#49756B] flex items-center justify-center transition-all">
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#49756B] group-hover:text-[#F0F5F0]" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. ONE FOCUSED OFFERING SECTION: BRANDING & BRAND TRANSFORMATION */}
      <section id="our-focus" className="py-24 sm:py-32 bg-[#F0F5F0] border-y border-[#ACC7B8] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mb-16">
            <span className="text-xs uppercase font-mono tracking-[0.2em] text-[#49756B]/70 font-semibold block mb-3">
              Our Two Core Offerings
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#49756B] font-normal leading-tight mb-4">
              Build something new. Move an existing brand forward.
            </h2>
            <p className="text-base sm:text-lg text-[#49756B]/85 font-light leading-relaxed">
              We focus our studio entirely on two outcomes. Whether you are launching a new venture or evolving an established company, we bring strategy and creative execution together to create a clear, consistent brand presence.
            </p>
          </div>

          {/* Two Substantial Editorial Blocks (Equal visual weight) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {CORE_OFFERINGS.map((offer) => {
              const isLilac = offer.number === '02';
              const blockBg = isLilac ? 'bg-[#ACC7B8]' : 'bg-[#ACC7B8]/35';

              return (
                <div
                  key={offer.number}
                  className={`${blockBg} border border-[#ACC7B8] hover:border-[#49756B]/50 rounded-2xl p-8 sm:p-12 flex flex-col justify-between transition-all shadow-sm`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#49756B]/20 text-xs font-mono">
                      <span className="text-2xl font-serif text-[#49756B] font-normal">
                        {offer.number}
                      </span>
                      <span className="text-[#49756B]/70 uppercase tracking-widest">
                        Core Offering
                      </span>
                    </div>

                    <h3 className="font-serif text-3xl sm:text-4xl text-[#49756B] font-normal mb-3">
                      {offer.title}
                    </h3>

                    <p className="text-xs font-mono text-[#49756B] font-semibold tracking-wider uppercase mb-5">
                      {offer.supportingLine}
                    </p>

                    <p className="text-base text-[#49756B] leading-relaxed font-normal mb-6">
                      {offer.description}
                    </p>

                    <p className="text-sm text-[#49756B]/85 leading-relaxed font-light mb-8">
                      {offer.narrative}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-[#49756B]/20">
                    <button
                      onClick={() => {
                        onSelectServiceForContact(offer.title);
                        onNavigate('contact');
                      }}
                      className="inline-flex items-center gap-2 text-xs font-medium text-[#F0F5F0] bg-[#49756B] hover:bg-[#49756B]/90 border border-[#49756B] px-5 py-3 rounded-md transition-all cursor-pointer shadow-sm"
                    >
                      <span>Discuss {offer.title.toLowerCase()}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#F0F5F0]" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. ABOUT US */}
      <section
        id="about"
        className="relative py-24 sm:py-32 px-6 lg:px-12 max-w-7xl mx-auto scroll-mt-20 bg-[#F0F5F0]"
      >
        <div id="approach" className="absolute -top-24 left-0" />
        <div className="max-w-4xl text-left">
          <span className="text-xs uppercase font-mono tracking-[0.25em] text-[#49756B]/70 font-semibold block mb-8">
            About Us
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[2.65rem] text-[#49756B] font-normal leading-[1.28] tracking-tight mb-10">
            Studio Orbit is a design-forward creative studio focused on brand transformation, identity systems, and narrative motion design.
          </h2>
          <div className="w-16 h-px bg-[#ACC7B8] mb-10" />
          <div className="space-y-6 text-lg sm:text-xl text-[#49756B]/90 font-light leading-relaxed">
            <p>
              We believe a strong brand is built at the intersection of rigorous design discipline and compelling storytelling. We construct cohesive visual languages - from typography and brand systems to dynamic motion assets that translate a brand’s core purpose into a memorable visual world.
            </p>
            <p>
              Design craft is our foundation. We integrate modern AI tools into our design workflow to expand our visual exploration, build custom motion assets, and push narrative boundaries.
            </p>
          </div>
        </div>
      </section>

      {/* 6. CLOSING CONTACT CTA SECTION */}
      <section id="contact" className="py-24 sm:py-32 px-6 lg:px-12 max-w-7xl mx-auto text-center scroll-mt-20">
        <div className="max-w-3xl mx-auto bg-[#ACC7B8] border border-[#ACC7B8] rounded-2xl p-10 sm:p-16 shadow-sm">
          <span className="text-xs uppercase font-mono tracking-[0.2em] text-[#49756B]/75 font-semibold block mb-3">
            Contact Us
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#49756B] font-normal mb-6">
            Let’s shape what comes next.
          </h2>
          <p className="text-base text-[#49756B]/90 font-light leading-relaxed mb-8 max-w-xl mx-auto">
            Tell us about your business and where you want to take it. Whether you are building a new brand from scratch or evolving an established one, we’d like to hear about it.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('contact')}
              className="px-8 py-4 text-sm font-medium text-[#F0F5F0] bg-[#49756B] hover:bg-[#49756B]/90 border border-[#49756B] rounded-lg transition-all cursor-pointer shadow-sm"
            >
              Start a conversation
            </button>
            <a
              href={`mailto:${STUDIO_CONFIG.email}`}
              className="px-8 py-4 text-sm font-medium text-[#49756B] bg-[#F0F5F0] hover:bg-[#F0F5F0]/90 rounded-lg border border-[#49756B] transition-all cursor-pointer flex items-center gap-2 font-mono text-xs"
            >
              <Mail className="w-4 h-4 text-[#49756B]" />
              <span>{STUDIO_CONFIG.email}</span>
            </a>
          </div>
        </div>
      </section>

      {/* Case Study Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onDiscussProject={(category) => {
            setSelectedProject(null);
            onSelectServiceForContact(category);
            onNavigate('contact');
          }}
        />
      )}
    </div>
  );
};
