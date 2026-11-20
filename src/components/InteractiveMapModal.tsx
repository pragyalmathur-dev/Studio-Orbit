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
        className="relative w-full max-w-6xl h-[90vh] bg-gradient-to-b from-[#FAF6EE] to-[#F5EFE4] text-[#1F3D2B] rounded-xl overflow-hidden shadow-2xl border border-[#1F3D2B]/25 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Browser-style Top Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#1F3D2B]/10 border-b border-[#1F3D2B]/15 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1F3D2B]/25" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#1F3D2B]/45" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#1F3D2B]/70" />
            </div>
            <div className="h-4 w-[1px] bg-[#1F3D2B]/20 mx-1" />
            <span className="text-xs font-mono text-[#1F3D2B] truncate max-w-xs sm:max-w-md font-medium">
              {project.title} · {project.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {project.publicUrl && (
              <a
                href={project.publicUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#FAF6EE] bg-[#1F3D2B] hover:bg-[#295039] font-medium rounded transition-colors shadow-sm"
              >
                <span>Open full experience</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-[#1F3D2B]/80 hover:text-[#1F3D2B] hover:bg-[#1F3D2B]/10 rounded transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Main Map Viewer Stage */}
          <div className="flex-1 relative bg-[#1F3D2B]/8 overflow-hidden flex flex-col">
            {hasEmbedUrl ? (
              <div className="relative w-full h-full">
                {iframeLoading && (
                  <div className="absolute inset-0 bg-[#F5EFE4] z-20 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-7 h-7 text-[#1F3D2B] animate-spin" />
                    <span className="text-xs font-mono text-[#1F3D2B]/70">
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
                <div className="flex-1 relative overflow-hidden bg-[#1F3D2B]/8">
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-[#1F3D2B]/60">
                    Interactive 3D Masterplan Viewer
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Information Sidebar */}
          <div className="w-full md:w-80 bg-gradient-to-b from-[#FAF6EE] to-[#F5EFE4] border-t md:border-t-0 md:border-l border-[#1F3D2B]/20 p-5 flex flex-col justify-between shrink-0">
            <div>
              <div className="text-xs uppercase font-mono text-[#1F3D2B]/70 tracking-wider mb-2 font-semibold">
                Project Information
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-serif text-[#1F3D2B] font-normal mb-1">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#1F3D2B]/75">
                    <span>{project.category}</span>
                  </div>
                </div>

                <p className="text-xs text-[#1F3D2B]/85 leading-relaxed font-light">
                  {project.description}
                </p>

                <div>
                  <span className="text-[11px] uppercase font-mono text-[#1F3D2B]/70 tracking-wider block mb-2 font-semibold">
                    Key Features
                  </span>
                  <ul className="text-xs text-[#1F3D2B]/85 space-y-1.5">
                    {project.features.map((f: string, i: number) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1F3D2B]" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#1F3D2B]/20 space-y-2 mt-4">
              {project.publicUrl && (
                <a
                  href={project.publicUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="w-full py-2.5 text-xs font-medium text-[#FAF6EE] bg-[#1F3D2B] hover:bg-[#295039] rounded transition-colors text-center flex items-center justify-center gap-1.5 font-sans shadow-sm"
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
                className="w-full py-2 text-xs font-medium text-[#FAF6EE] bg-[#1F3D2B] hover:bg-[#295039] rounded transition-colors text-center font-sans cursor-pointer shadow-sm"
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
