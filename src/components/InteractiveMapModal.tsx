import React, { useEffect, useState } from 'react';
import { X, ExternalLink, Loader2 } from 'lucide-react';
import { MapShowcaseProject } from '../data/studioContent';

interface InteractiveMapModalProps {
  project: MapShowcaseProject | null;
  onClose: () => void;
  onEnquire: (projectName: string) => void;
}

export const InteractiveMapModal: React.FC<InteractiveMapModalProps> = ({
  project,
  onClose,
  onEnquire,
}) => {
  const [iframeLoading, setIframeLoading] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  const hasEmbedUrl = Boolean(project.embedUrl);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="map-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/45 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl h-[90vh] bg-[#F0F5F0] text-[#49756B] rounded-xl overflow-hidden shadow-2xl border border-[#ACC7B8] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Browser-style Top Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#ACC7B8]/25 border-b border-[#ACC7B8] shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ACC7B8]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#49756B]/40" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#49756B]/70" />
            </div>
            <div className="h-4 w-[1px] bg-[#ACC7B8] mx-1" />
            <span className="text-xs font-mono text-[#49756B] truncate max-w-xs sm:max-w-md font-medium">
              {project.title} · {project.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {project.publicUrl && (
              <a
                href={project.publicUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#F0F5F0] bg-[#49756B] hover:bg-[#49756B]/90 border border-[#49756B] font-medium rounded transition-colors"
              >
                <span>Open full experience</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-[#49756B]/80 hover:text-[#49756B] hover:bg-[#ACC7B8]/30 rounded transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Main Map Viewer Stage */}
          <div className="flex-1 relative bg-[#ACC7B8]/20 overflow-hidden flex flex-col">
            {hasEmbedUrl ? (
              <div className="relative w-full h-full">
                {iframeLoading && (
                  <div className="absolute inset-0 bg-[#F0F5F0] z-20 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-7 h-7 text-[#49756B] animate-spin" />
                    <span className="text-xs font-mono text-[#49756B]/70">
                      Loading interactive 3D explorer...
                    </span>
                  </div>
                )}
                <iframe
                  src={project.embedUrl}
                  title={project.title}
                  className="w-full h-full border-0"
                  onLoad={() => setIframeLoading(false)}
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  sandbox="allow-scripts allow-same-origin allow-popups"
                />
              </div>
            ) : (
              <div className="relative w-full h-full flex flex-col">
                <div className="flex-1 relative overflow-hidden bg-[#ACC7B8]/20">
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-[#49756B]/60">
                    Interactive 3D Masterplan Viewer
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Information Sidebar */}
          <div className="w-full md:w-80 bg-[#F0F5F0] border-t md:border-t-0 md:border-l border-[#ACC7B8] p-5 flex flex-col justify-between shrink-0">
            <div>
              <div className="text-xs uppercase font-mono text-[#49756B]/70 tracking-wider mb-2 font-semibold">
                Project Information
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-serif text-[#49756B] font-normal mb-1">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#49756B]/75">
                    <span>{project.category}</span>
                  </div>
                </div>

                <p className="text-xs text-[#49756B]/85 leading-relaxed font-light">
                  {project.description}
                </p>

                <div>
                  <span className="text-[11px] uppercase font-mono text-[#49756B]/70 tracking-wider block mb-2 font-semibold">
                    Key Features
                  </span>
                  <ul className="text-xs text-[#49756B]/85 space-y-1.5">
                    {project.features.map((f: string, i: number) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#49756B]" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#ACC7B8] space-y-2 mt-4">
              {project.publicUrl && (
                <a
                  href={project.publicUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="w-full py-2.5 text-xs font-medium text-[#F0F5F0] bg-[#49756B] hover:bg-[#49756B]/90 border border-[#49756B] rounded transition-colors text-center flex items-center justify-center gap-1.5 font-sans"
                >
                  <span>Open full experience in new tab</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              <button
                onClick={() => {
                  onClose();
                  onEnquire(project.title);
                }}
                className="w-full py-2 text-xs font-medium text-[#49756B] hover:bg-[#ACC7B8]/25 border border-[#ACC7B8] rounded transition-colors text-center font-sans cursor-pointer"
              >
                Discuss a custom explorer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
