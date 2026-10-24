import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, FileText, AlertCircle } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import { SelectedProject, getProjectPdfUrl } from '../data/studioContent';

// Set up local web worker for zero-network-dependency, high-performance canvas rendering
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/assets/pdf.worker.min.mjs';
}

interface ProjectModalProps {
  project: SelectedProject | null;
  onClose: () => void;
  onDiscussProject?: (offeringType?: string) => void;
}

// Individual PDF Page Canvas Renderer
const PDFPageCanvas: React.FC<{
  pdfDoc: pdfjsLib.PDFDocumentProxy;
  pageNumber: number;
  containerWidth: number;
}> = ({ pdfDoc, pageNumber, containerWidth }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<pdfjsLib.RenderTask | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const renderPage = async () => {
      try {
        const page = await pdfDoc.getPage(pageNumber);
        if (isCancelled) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const unscaledViewport = page.getViewport({ scale: 1 });
        // Scale to fit viewport comfortably while remaining crisp
        const availableWidth = Math.max(300, containerWidth - 32);
        const targetWidth = Math.min(availableWidth, 1100, unscaledViewport.width * 1.5);
        const scale = targetWidth / unscaledViewport.width;
        const viewport = page.getViewport({ scale });

        const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
        canvas.width = Math.floor(viewport.width * dpr);
        canvas.height = Math.floor(viewport.height * dpr);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);

        if (renderTaskRef.current) {
          renderTaskRef.current.cancel();
        }

        const renderContext = {
          canvasContext: ctx,
          viewport: viewport,
          canvas: canvas,
        };

        const renderTask = page.render(renderContext);
        renderTaskRef.current = renderTask;
        await renderTask.promise;
      } catch (err: unknown) {
        if ((err as { name?: string })?.name !== 'RenderingCancelledException') {
          console.warn(`PDF page ${pageNumber} render notice:`, err);
        }
      }
    };

    renderPage();

    return () => {
      isCancelled = true;
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, [pdfDoc, pageNumber, containerWidth]);

  return (
    <div className="w-full flex justify-center py-2 sm:py-3">
      <canvas
        ref={canvasRef}
        className="shadow-2xl rounded-sm bg-white max-w-full block transition-opacity duration-200"
      />
    </div>
  );
};

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
}) => {
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [errorState, setErrorState] = useState<'not_found' | 'error' | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Resize listener to adapt canvas width responsively
  useEffect(() => {
    const handleResize = () => {
      if (scrollContainerRef.current) {
        setContainerWidth(scrollContainerRef.current.clientWidth);
      } else {
        setContainerWidth(window.innerWidth);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard navigation & body scroll lock
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

  // Load PDF via PDF.js (Bypasses Chrome iframe sandbox security block)
  useEffect(() => {
    if (!project) {
      setPdfDoc(null);
      setNumPages(0);
      setErrorState(null);
      return;
    }

    let isCancelled = false;
    const primaryUrl = getProjectPdfUrl(project);

    // List of candidate URLs to test
    const cleanTitle = project.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanId = project.id.replace(/-/g, '');

    const candidateUrls = Array.from(new Set([
      primaryUrl,
      `/assets/work/${cleanTitle}.pdf`,
      `/assets/work/${cleanId}.pdf`,
      `/assets/work/${project.id}.pdf`,
      ...(project.id === 'the-blue-kite-homes'
        ? [
            '/assets/work/thebluekite.pdf',
            '/assets/work/thebluekie.pdf',
            '/assets/work/thebluekiteholidayhomes.pdf',
            '/assets/work/thebluekitehomes.pdf',
          ]
        : []),
      ...(project.id === 'fiorella-flower-boutique'
        ? [
            '/assets/work/fiorellatheflowerboutique.pdf',
            '/assets/work/fiorellathefolwerboutique.pdf',
          ]
        : []),
      ...(project.id === 'norbu-the-montanna'
        ? [
            '/assets/work/norbuthemontanna.pdf',
            '/assets/work/norbuthemontannaihclseleqtions.pdf',
            '/assets/work/norbu.pdf',
          ]
        : []),
      ...(project.id === 'salt-and-grey'
        ? [
            '/assets/work/saltandgrey.pdf',
            '/assets/work/salt&grey.pdf',
            '/assets/work/saltgrey.pdf',
          ]
        : []),
      ...(project.id === 'jhalak-gems'
        ? [
            '/assets/work/jhalakgems.pdf',
            '/assets/work/jhalak.pdf',
          ]
        : []),
    ]));

    const loadDocument = async () => {
      setErrorState(null);

      // Find first accessible candidate
      let targetUrl: string | null = null;
      for (const url of candidateUrls) {
        try {
          const res = await fetch(url, { method: 'HEAD' });
          if (res.ok && res.status !== 404) {
            targetUrl = url;
            break;
          }
        } catch {
          // continue
        }
      }

      if (!targetUrl) {
        if (!isCancelled) setErrorState('not_found');
        return;
      }

      try {
        const loadingTask = pdfjsLib.getDocument({
          url: targetUrl,
          cMapUrl: 'https://unpkg.com/pdfjs-dist@4.10.38/cmaps/',
          cMapPacked: true,
        });

        const doc = await loadingTask.promise;
        if (isCancelled) return;

        setPdfDoc(doc);
        setNumPages(doc.numPages);
      } catch (err) {
        console.error('Error loading PDF document:', err);
        if (!isCancelled) setErrorState('error');
      }
    };

    loadDocument();

    return () => {
      isCancelled = true;
    };
  }, [project]);

  if (!project) return null;

  const pdfFileName = getProjectPdfUrl(project).replace('/assets/work/', '');

  const modalElement = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} PDF Portfolio`}
      className="fixed inset-0 z-[100000] w-screen h-screen bg-[#F0F5F0] overflow-hidden flex flex-col items-center justify-center m-0 p-0 select-none"
    >
      {/* 
        Close Button:
        Fixed at top right over the scrollable document.
        Styled with approved palette (#49756B, #F0F5F0, #ACC7B8).
      */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[100002] p-2.5 sm:p-3 rounded-full bg-[#F0F5F0]/95 hover:bg-[#ACC7B8] text-[#49756B] border border-[#ACC7B8] shadow-2xl backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#49756B]"
        aria-label="Close PDF viewer"
      >
        <X className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
      </button>

      {/* 
        Scrollable Document Viewport:
        Renders every page of the PDF directly on HTML5 canvas elements.
        Chrome native PDF plugin cannot block this.
      */}
      <div
        ref={scrollContainerRef}
        className="w-full h-full overflow-y-auto overscroll-contain flex flex-col items-center py-8 sm:py-12 px-3 sm:px-6 space-y-4"
      >
        {pdfDoc && numPages > 0 ? (
          Array.from({ length: numPages }, (_, i) => (
            <PDFPageCanvas
              key={`pdf-page-${i + 1}`}
              pdfDoc={pdfDoc}
              pageNumber={i + 1}
              containerWidth={containerWidth}
            />
          ))
        ) : errorState === 'not_found' ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center max-w-lg p-8 my-auto">
            <div className="w-16 h-16 rounded-full bg-[#ACC7B8]/30 border border-[#ACC7B8] flex items-center justify-center text-[#49756B] mb-5">
              <FileText className="w-8 h-8 stroke-[1.5]" />
            </div>
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#49756B]/70 block mb-2 font-semibold">
              PDF Document Upload
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#49756B] font-normal mb-3">
              {project.title}
            </h3>
            <p className="text-sm text-[#49756B]/85 font-light leading-relaxed mb-5">
              The portfolio document will display here once uploaded to the following path in your project:
            </p>
            <div className="px-4 py-2.5 rounded-lg bg-[#ACC7B8]/25 border border-[#ACC7B8] text-xs font-mono text-[#49756B] mb-6 select-all font-semibold">
              /public/assets/work/{pdfFileName}
            </div>
            <p className="text-xs text-[#49756B]/70 font-light">
              Press the top right cross button or hit Esc to return.
            </p>
          </div>
        ) : errorState === 'error' ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md p-8 my-auto">
            <div className="w-14 h-14 rounded-full bg-[#ACC7B8]/30 border border-[#ACC7B8] flex items-center justify-center text-[#49756B] mb-4">
              <AlertCircle className="w-7 h-7 text-[#49756B]" />
            </div>
            <h3 className="font-serif text-2xl text-[#49756B] font-normal mb-2">
              Unable to load document
            </h3>
            <p className="text-xs text-[#49756B]/80 font-light leading-relaxed mb-4">
              Please ensure the PDF file in <span className="font-mono font-medium">/public/assets/work/{pdfFileName}</span> is a valid, non-empty PDF file.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalElement, document.body) : modalElement;
};
