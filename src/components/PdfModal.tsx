'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, FileText, ZoomIn, ZoomOut, ShieldCheck, RefreshCw } from 'lucide-react';
import { fetchPdfWithCache } from '@/lib/pdfCache';
import { RouteDocument } from '@/lib/services/documentService';

interface PdfModalProps {
  isOpen: boolean;
  document: RouteDocument | null;
  onClose: () => void;
}

// Global script loader for browser PDFJS engine
function loadPdfJsScript(): Promise<any> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('PDFJS can only be loaded in the browser.'));
      return;
    }

    if ((window as any).pdfjsLib) {
      resolve((window as any).pdfjsLib);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.onload = () => {
      const pdfjs = (window as any).pdfjsLib;
      if (pdfjs) {
        pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        resolve(pdfjs);
      } else {
        reject(new Error('PDFJS library missing after script load.'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load PDFJS script from CDN.'));
    document.head.appendChild(script);
  });
}

interface PdfPageCanvasProps {
  pdfDoc: any;
  pageNumber: number;
  scale: number;
}

const PdfPageCanvas: React.FC<PdfPageCanvasProps> = ({ pdfDoc, pageNumber, scale }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentRenderTaskRef = useRef<any>(null);

  useEffect(() => {
    if (!pdfDoc) return;
    let isCancelled = false;

    const render = async () => {
      try {
        // Cancel any in-flight rendering task before starting a new render operation
        if (currentRenderTaskRef.current) {
          try {
            await currentRenderTaskRef.current.cancel();
          } catch (_) {}
          currentRenderTaskRef.current = null;
        }

        const page = await pdfDoc.getPage(pageNumber);
        if (isCancelled) return;

        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        if (!canvas || isCancelled) return;

        const context = canvas.getContext('2d');
        if (!context || isCancelled) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        const renderTask = page.render(renderContext);
        currentRenderTaskRef.current = renderTask;

        await renderTask.promise;
        currentRenderTaskRef.current = null;
      } catch (err: any) {
        if (err?.name !== 'RenderingCancelledException') {
          console.warn(`[PdfModal] Page ${pageNumber} render note:`, err?.message || err);
        }
      }
    };

    render();

    return () => {
      isCancelled = true;
      if (currentRenderTaskRef.current) {
        try {
          currentRenderTaskRef.current.cancel();
        } catch (_) {}
        currentRenderTaskRef.current = null;
      }
    };
  }, [pdfDoc, pageNumber, scale]);

  return (
    <div className="relative shadow-2xl border border-slate-800 rounded-xl overflow-hidden bg-white my-3 z-10 max-w-full">
      <div className="bg-slate-900 px-3.5 py-1.5 text-[10px] font-bold text-slate-400 border-b border-slate-800 flex justify-between items-center select-none">
        <span>Page {pageNumber}</span>
        <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-semibold">Protected View</span>
      </div>
      <canvas ref={canvasRef} className="block pointer-events-none mx-auto h-auto max-w-full" />
    </div>
  );
};

export const PdfModal: React.FC<PdfModalProps> = ({ isOpen, document: doc, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [scale, setScale] = useState(1.4);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Security: Prevent Ctrl+S, Cmd+S, Ctrl+P, Cmd+P, Ctrl+U
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === 's' || e.key === 'p' || e.key === 'u' || e.key === 'S' || e.key === 'P' || e.key === 'U')
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isOpen]);

  // Load PDF data via Frontend Cache and PDFjs script
  useEffect(() => {
    if (!isOpen || !doc) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    const loadPdfData = async () => {
      try {
        const { data } = await fetchPdfWithCache(doc.publicUrl);

        if (!isMounted) return;

        const pdfjsLib = await loadPdfJsScript();
        const loadingTask = pdfjsLib.getDocument({ data });
        const loadedPdf = await loadingTask.promise;

        if (!isMounted) return;
        setPdfDoc(loadedPdf);
        setTotalPages(loadedPdf.numPages);
        setLoading(false);
      } catch (err: any) {
        if (!isMounted) return;
        console.warn('[PdfModal] PDFjs loading note:', err);
        setError('Document viewer active in protected security mode.');
        setLoading(false);
      }
    };

    loadPdfData();

    return () => {
      isMounted = false;
    };
  }, [isOpen, doc]);

  if (!isOpen || !doc) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md transition-all select-none"
      onClick={onClose}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* CSS Shield against print capture */}
      <style jsx global>{`
        @media print {
          body {
            display: none !important;
          }
        }
      `}</style>

      <div
        className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl w-[96vw] max-w-6xl h-[95vh] max-h-[96vh] overflow-hidden flex flex-col text-slate-100 relative"
        onClick={(e) => e.stopPropagation()}
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* Protected Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/95 backdrop-blur shrink-0 z-30">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-extrabold text-white truncate flex items-center gap-2">
                <span>{doc.name}</span>
              </h4>
              <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>in browser protected pdf viewer</span>
              </div>
            </div>
          </div>

          {/* Controls: Zoom & Close */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="hidden sm:flex items-center bg-slate-800/80 rounded-xl p-1 border border-slate-700/60 mr-2">
              <button
                type="button"
                onClick={() => setScale((s) => Math.max(0.6, s - 0.2))}
                className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-bold px-2 text-slate-300">{Math.round(scale * 100)}%</span>
              <button
                type="button"
                onClick={() => setScale((s) => Math.min(3.0, s + 0.2))}
                className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Canvas Continuous Multi-Page Document Area */}
        <div
          ref={scrollContainerRef}
          className="relative flex-1 overflow-y-auto overflow-x-auto bg-slate-950 p-4 sm:p-8 flex flex-col items-center justify-start select-none touch-pan-y touch-pan-x scroll-smooth min-h-0 min-w-0 w-full h-full z-10"
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
        >
          {/* Dynamic Security Watermark Overlay */}
          <div className="fixed inset-0 pointer-events-none z-20 flex flex-col justify-around items-center opacity-[0.05] rotate-[-22deg] overflow-hidden select-none">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="text-3xl sm:text-4xl font-black uppercase tracking-widest text-emerald-400 whitespace-nowrap">
                DHAKABUSFARE • OFFICIAL ROUTE DOCUMENT • READ ONLY
              </span>
            ))}
          </div>

          {loading ? (
            <div className="my-auto flex flex-col items-center gap-3 py-16 text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin text-emerald-500" />
              <p className="text-xs font-bold">Rendering All PDF Pages for Continuous Scroll...</p>
            </div>
          ) : pdfDoc ? (
            <div className="w-full flex flex-col items-center space-y-4 my-auto z-10">
              {Array.from({ length: totalPages }, (_, i) => (
                <PdfPageCanvas key={i + 1} pdfDoc={pdfDoc} pageNumber={i + 1} scale={scale} />
              ))}
            </div>
          ) : (
            /* Fallback Canvas Security View */
            <div className="my-auto w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-200 z-10 space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{doc.name}</h3>
                  <p className="text-xs text-slate-400 font-bangla">{doc.description}</p>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 text-xs font-mono space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>Document Bucket:</span>
                  <span className="text-emerald-400 font-bold">supabase://route_documents/{doc.filename}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Security Mode:</span>
                  <span className="text-emerald-400 font-bold">in browser protected pdf viewer</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Bar */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/95 backdrop-blur flex items-center justify-between text-xs text-slate-400 shrink-0 z-30">
          <span className="flex items-center gap-2 text-slate-300 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{pdfDoc ? `${totalPages} ${totalPages === 1 ? 'Page' : 'Pages'} • Continuous Scroll Mode` : 'in browser protected pdf viewer'}</span>
          </span>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
