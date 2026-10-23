import React, { useState, useEffect } from 'react';
import { STUDIO_CONFIG } from '../data/studioContent';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Mail,
  Phone,
} from 'lucide-react';

interface ContactPageProps {
  initialService?: string;
}

export const ContactPage: React.FC<ContactPageProps> = ({ initialService }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [lookingFor, setLookingFor] = useState<'Branding' | 'Brand Transformation' | 'Not sure yet'>('Branding');
  const [description, setDescription] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<{
    referenceId: string;
    message: string;
    receivedAt: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize service selection if provided via navigation props
  useEffect(() => {
    if (initialService) {
      if (initialService.toLowerCase().includes('transformation')) {
        setLookingFor('Brand Transformation');
      } else if (initialService.toLowerCase().includes('branding')) {
        setLookingFor('Branding');
      } else {
        setLookingFor('Not sure yet');
      }
    }
  }, [initialService]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Form validation
    if (!name.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    if (!description.trim()) {
      setErrorMessage('Please tell us a little about your project.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          company: company.trim(),
          services: [lookingFor],
          description: description.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Server rejected the submission.');
      }

      setSubmitSuccess({
        referenceId: data.referenceId,
        message: data.message,
        receivedAt: data.receivedAt,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Connection failed. Please verify your network.';
      setErrorMessage(`Unable to submit enquiry: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F0F5F0] text-[#49756B] pt-28 sm:pt-36 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs uppercase font-mono tracking-[0.2em] text-[#49756B]/70 font-semibold block mb-3">
            Contact
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#49756B] font-normal leading-[1.08] mb-6">
            Let’s shape what comes next.
          </h1>
          <p className="text-base sm:text-lg text-[#49756B]/85 font-light leading-relaxed">
            Tell us about your business and where you want to take it.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Form Column */}
          <div className="lg:col-span-7 bg-[#F0F5F0] border border-[#ACC7B8] rounded-2xl p-6 sm:p-10 shadow-sm">
            {submitSuccess ? (
              // Verified Backend Receipt Success Screen
              <div className="py-8 space-y-6">
                <div className="w-12 h-12 rounded-full bg-[#ACC7B8] text-[#49756B] border border-[#49756B]/30 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 stroke-[2]" />
                </div>

                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl text-[#49756B] font-normal mb-2">
                    Message received.
                  </h2>
                  <p className="text-sm text-[#49756B]/80 leading-relaxed font-light">
                    {submitSuccess.message}
                  </p>
                </div>

                <div className="p-4 bg-[#ACC7B8]/30 rounded-lg border border-[#ACC7B8] text-xs font-mono space-y-1.5 text-[#49756B]">
                  <div className="flex justify-between">
                    <span className="text-[#49756B]/60">REFERENCE ID</span>
                    <span className="font-semibold">{submitSuccess.referenceId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#49756B]/60">LOGGED AT</span>
                    <span>{new Date(submitSuccess.receivedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSubmitSuccess(null);
                    setName('');
                    setEmail('');
                    setCompany('');
                    setDescription('');
                  }}
                  className="px-5 py-2.5 text-xs font-medium text-[#F0F5F0] bg-[#49756B] hover:bg-[#49756B]/90 border border-[#49756B] rounded-md transition-colors cursor-pointer"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {errorMessage && (
                  <div className="p-4 rounded-lg bg-[#ACC7B8]/25 border border-[#49756B]/30 text-[#49756B] text-xs flex items-center gap-3">
                    <AlertCircle className="w-4 h-4 shrink-0 text-[#49756B]" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* 1. Name */}
                <div>
                  <label htmlFor="name" className="block text-xs font-mono uppercase tracking-wider text-[#49756B] mb-2 font-medium">
                    Name <span className="text-[#49756B]">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full bg-[#F0F5F0] border border-[#ACC7B8] focus:border-[#49756B] focus:ring-1 focus:ring-[#49756B] rounded-lg px-4 py-3 text-sm text-[#49756B] placeholder:text-[#49756B]/40 outline-none transition-all"
                  />
                </div>

                {/* 2. Email */}
                <div>
                  <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-[#49756B] mb-2 font-medium">
                    Email <span className="text-[#49756B]">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-[#F0F5F0] border border-[#ACC7B8] focus:border-[#49756B] focus:ring-1 focus:ring-[#49756B] rounded-lg px-4 py-3 text-sm text-[#49756B] placeholder:text-[#49756B]/40 outline-none transition-all"
                  />
                </div>

                {/* 3. Company (optional) */}
                <div>
                  <label htmlFor="company" className="block text-xs font-mono uppercase tracking-wider text-[#49756B] mb-2 font-medium">
                    Company <span className="text-[#49756B]/60 font-normal lowercase">(optional)</span>
                  </label>
                  <input
                    id="company"
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Company or venture name"
                    className="w-full bg-[#F0F5F0] border border-[#ACC7B8] focus:border-[#49756B] focus:ring-1 focus:ring-[#49756B] rounded-lg px-4 py-3 text-sm text-[#49756B] placeholder:text-[#49756B]/40 outline-none transition-all"
                  />
                </div>

                {/* 4. What are you looking for? */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#49756B] mb-2 font-medium">
                    What are you looking for? <span className="text-[#49756B]">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {(['Branding', 'Brand Transformation', 'Not sure yet'] as const).map((opt) => {
                      const isSelected = lookingFor === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setLookingFor(opt)}
                          className={`px-4 py-3 rounded-lg text-xs font-medium text-left transition-all border cursor-pointer ${
                            isSelected
                              ? 'bg-[#49756B] text-[#F0F5F0] border-[#49756B] font-semibold shadow-sm'
                              : 'bg-[#F0F5F0] text-[#49756B]/80 border-[#ACC7B8] hover:bg-[#ACC7B8]/20'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Tell us about your project */}
                <div>
                  <label htmlFor="description" className="block text-xs font-mono uppercase tracking-wider text-[#49756B] mb-2 font-medium">
                    Tell us about your project <span className="text-[#49756B]">*</span>
                  </label>
                  <textarea
                    id="description"
                    required
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Briefly describe what you are building or looking to evolve, your timeline, or any specific ambitions..."
                    className="w-full bg-[#F0F5F0] border border-[#ACC7B8] focus:border-[#49756B] focus:ring-1 focus:ring-[#49756B] rounded-lg p-4 text-sm text-[#49756B] placeholder:text-[#49756B]/40 outline-none transition-all resize-y"
                  />
                </div>

                {/* Primary Submit Button: Primary green #49756B background, Off-white #F0F5F0 text */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 text-sm font-medium rounded-lg bg-[#49756B] text-[#F0F5F0] hover:bg-[#49756B]/90 border border-[#49756B] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Sending inquiry...</span>
                  ) : (
                    <>
                      <span>Start a conversation</span>
                      <Send className="w-4 h-4 text-[#F0F5F0]" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Studio Information */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-[#ACC7B8]/25 border border-[#ACC7B8] rounded-2xl p-8 sm:p-10 shadow-sm">
              <span className="text-xs uppercase font-mono text-[#49756B]/70 tracking-widest block mb-4">
                Studio Orbit
              </span>
              <h2 className="font-serif text-2xl text-[#49756B] font-normal mb-4">
                A branding and brand transformation studio.
              </h2>
              <p className="text-sm text-[#49756B]/85 leading-relaxed font-light mb-6">
                We work with businesses at defining moments, whether they are building a brand from the beginning or shaping its next chapter. We bring strategy and creative execution together to create a clear, consistent brand presence.
              </p>

              <div className="space-y-4 pt-6 border-t border-[#ACC7B8] text-xs font-mono text-[#49756B]">
                <div>
                  <span className="block text-[#49756B]/60 mb-1">DIRECT EMAIL</span>
                  <a
                    href={`mailto:${STUDIO_CONFIG.email}`}
                    className="text-[#49756B] hover:underline transition-colors flex items-center gap-2"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#49756B]" />
                    <span>{STUDIO_CONFIG.email}</span>
                  </a>
                </div>
                <div>
                  <span className="block text-[#49756B]/60 mb-1">TELEPHONE</span>
                  <a
                    href={`tel:${STUDIO_CONFIG.phoneTel}`}
                    className="text-[#49756B] hover:underline transition-colors flex items-center gap-2"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#49756B]" />
                    <span>{STUDIO_CONFIG.phoneFormatted}</span>
                  </a>
                </div>
                <div>
                  <span className="block text-[#49756B]/60 mb-1">PRACTICE FOCUS</span>
                  <span className="font-semibold">01 Branding · 02 Brand Transformation</span>
                </div>
                <div>
                  <span className="block text-[#49756B]/60 mb-1">STUDIO LOCATION</span>
                  <span>{STUDIO_CONFIG.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
