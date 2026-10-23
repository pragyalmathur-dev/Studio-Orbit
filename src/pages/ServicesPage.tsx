import React from 'react';
import { CORE_OFFERINGS, HOW_WE_WORK_STEPS } from '../data/studioContent';
import { ArrowRight, Check } from 'lucide-react';

interface ServicesPageProps {
  onNavigate: (page: 'home' | 'services' | 'contact') => void;
  onSelectServiceForContact: (serviceTitle: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  onNavigate,
  onSelectServiceForContact,
}) => {
  const handleEnquireService = (offeringTitle: string) => {
    onSelectServiceForContact(offeringTitle);
    onNavigate('contact');
  };

  return (
    <div className="w-full min-h-screen bg-[#F0F5F0] text-[#49756B] pt-28 sm:pt-36 pb-24">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-20">
        <div className="max-w-3xl">
          <span className="text-xs uppercase font-mono tracking-[0.2em] text-[#49756B]/70 font-semibold block mb-3">
            Our Focus · Branding &amp; Brand Transformation
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#49756B] font-normal leading-[1.08] mb-6">
            Build something new.<br />
            Move an existing brand forward.
          </h1>
          <p className="text-base sm:text-lg text-[#49756B]/85 font-light leading-relaxed">
            We focus our studio entirely on two outcomes. We define what your brand stands for and bring it to life, or we help established businesses find renewed clarity and evolve their presence for what comes next.
          </p>
        </div>
      </div>

      {/* The Two Core Offerings */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-12 mb-24">
        {CORE_OFFERINGS.map((offer) => {
          const isLilac = offer.number === '02';
          const blockBg = isLilac ? 'bg-[#ACC7B8]' : 'bg-[#ACC7B8]/35';

          return (
            <div
              key={offer.number}
              className={`${blockBg} border border-[#ACC7B8] rounded-2xl p-8 sm:p-14 shadow-sm relative overflow-hidden`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex items-center gap-3 text-xs font-mono text-[#49756B]">
                    <span className="text-3xl font-serif font-normal">{offer.number}</span>
                    <span className="uppercase tracking-widest text-[#49756B]/60">· Core Offering</span>
                  </div>

                  <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#49756B] font-normal">
                    {offer.title}
                  </h2>

                  <p className="text-xs font-mono text-[#49756B] uppercase tracking-wider font-semibold">
                    {offer.supportingLine}
                  </p>

                  <p className="text-base sm:text-lg text-[#49756B] leading-relaxed font-normal">
                    {offer.description}
                  </p>

                  <p className="text-sm sm:text-base text-[#49756B]/85 leading-relaxed font-light">
                    {offer.narrative}
                  </p>

                  <div className="pt-4">
                    <button
                      onClick={() => handleEnquireService(offer.title)}
                      className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-medium text-[#F0F5F0] bg-[#49756B] hover:bg-[#49756B]/90 border border-[#49756B] rounded-md transition-all cursor-pointer shadow-sm"
                    >
                      <span>Discuss {offer.title.toLowerCase()}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#F0F5F0]" />
                    </button>
                  </div>
                </div>

                {/* Supporting internal framework capabilities */}
                <div className="lg:col-span-5 bg-[#F0F5F0] border border-[#ACC7B8] rounded-xl p-6 sm:p-8 shadow-sm">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#49756B]/70 block mb-4 font-semibold">
                    Integrated Capabilities
                  </span>
                  <ul className="space-y-3">
                    {offer.capabilities.map((cap, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-[#49756B]/85 font-light">
                        <span className="w-3.5 h-3.5 rounded-full bg-[#ACC7B8] text-[#49756B] border border-[#49756B]/30 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                        </span>
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Process Section */}
      <section className="bg-[#ACC7B8] border-y border-[#49756B]/20 py-24 mb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mb-16">
            <span className="text-xs uppercase font-mono tracking-[0.2em] text-[#49756B]/70 font-semibold block mb-2">
              Our Approach
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#49756B] font-normal leading-tight mb-4">
              From clarity to expression.
            </h2>
            <p className="text-base text-[#49756B]/80 font-light leading-relaxed">
              A compact three-stage process to explore, shape, and deliver a coherent brand identity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_WE_WORK_STEPS.map((step) => (
              <div
                key={step.number}
                className="bg-[#F0F5F0] p-8 rounded-xl border border-[#ACC7B8] shadow-sm"
              >
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-3xl font-serif text-[#49756B] font-normal">
                    {step.number}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#49756B] border border-[#49756B]" />
                </div>
                <h3 className="font-serif text-2xl text-[#49756B] mb-2">{step.name}</h3>
                <p className="text-xs font-mono text-[#49756B]/75 mb-4">{step.summary}</p>
                <p className="text-sm text-[#49756B]/85 leading-relaxed font-light">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
        <div className="max-w-3xl mx-auto bg-[#ACC7B8] border border-[#ACC7B8] rounded-2xl p-10 sm:p-16 shadow-sm">
          <span className="text-xs uppercase font-mono tracking-[0.2em] text-[#49756B]/75 font-semibold block mb-3">
            Collaboration
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#49756B] font-normal mb-6">
            Let’s shape what comes next.
          </h2>
          <p className="text-base text-[#49756B]/90 font-light leading-relaxed mb-8 max-w-xl mx-auto">
            Tell us about your business and where you want to take it. We will explore how Branding or Brand Transformation can move you forward.
          </p>

          <button
            onClick={() => onNavigate('contact')}
            className="px-8 py-4 text-sm font-medium text-[#F0F5F0] bg-[#49756B] hover:bg-[#49756B]/90 border border-[#49756B] rounded-lg transition-all cursor-pointer shadow-sm inline-flex items-center gap-2"
          >
            <span>Start a conversation</span>
            <ArrowRight className="w-4 h-4 text-[#F0F5F0]" />
          </button>
        </div>
      </div>
    </div>
  );
};
