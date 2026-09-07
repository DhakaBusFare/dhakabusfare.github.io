'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Search, ShieldCheck, Database, RefreshCw, Lock, ExternalLink, Calendar, HardDrive } from 'lucide-react';
import { fetchRouteDocuments, RouteDocument } from '@/lib/services/documentService';
import { PdfModal } from '@/components/PdfModal';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<RouteDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<RouteDocument | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetchRouteDocuments().then((docs) => {
      if (isMounted) {
        setDocuments(docs);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredDocs = documents.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleOpenPdf = (doc: RouteDocument) => {
    setSelectedDoc(doc);
    setIsViewerOpen(true);
  };

  return (
    <main className="flex-1 max-w-6xl w-full mx-auto px-4 pt-8 pb-24 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/60 rounded-3xl p-6 md:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <FileText className="w-64 h-64 text-emerald-400" />
        </div>

        <div className="relative z-10 space-y-3 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" /> Official Supabase Bucket Documents
          </span>
          <h1 className="text-2xl md:text-4xl font-black text-white leading-tight">
            Dhaka Route Documents & Gazettes
          </h1>
          <p className="text-xs md:text-sm text-slate-300 font-bangla leading-relaxed">
            বিআরটিএ অনুমোদিত ঢাকা সিটি বাসের রুট পারমিট, সরকারি ভাড়ার গেজেট এবং রুট সার্কুলার সংকলন।
          </p>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents by route name or gazette title..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-semibold self-end sm:self-auto">
          <span className="flex items-center gap-1">
            <Database className="w-3.5 h-3.5 text-emerald-500" /> Bucket: <strong className="text-slate-800 dark:text-slate-200">route_documents</strong>
          </span>
          <span>•</span>
          <span><strong className="text-emerald-500 font-bold">{filteredDocs.length}</strong> Files Available</span>
        </div>
      </div>

      {/* Document Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 flex flex-col items-center gap-3 bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-inner">
          <RefreshCw className="w-8 h-8 animate-spin text-emerald-500" />
          <p className="text-sm font-bold">Scanning Supabase Storage Bucket (route_documents)...</p>
          <span className="text-xs text-slate-500">Checking all folders and PDF files</span>
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="py-16 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
          <FileText className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Matching Documents Found</h3>
          <p className="text-xs text-slate-500">Try adjusting your search terms or view all uploaded PDFs.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800/90 p-5 shadow-lg hover:shadow-xl hover:border-emerald-500/80 dark:hover:border-emerald-500/80 transition-all group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shrink-0 shadow-md group-hover:scale-105 transition-transform">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 flex items-center gap-1 border border-slate-200 dark:border-slate-700">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    <span>in browser protected pdf viewer</span>
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                    {doc.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {doc.description || `Official Gazette Document (${doc.filename})`}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  {doc.sizeBytes && (
                    <span className="flex items-center gap-1">
                      <HardDrive className="w-3 h-3 text-slate-500" /> {(doc.sizeBytes / 1024 / 1024).toFixed(1)} MB
                    </span>
                  )}
                  {doc.updatedAt && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" /> {doc.updatedAt.split('T')[0]}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenPdf(doc)}
                  className="w-full py-3 rounded-2xl bg-slate-900 dark:bg-slate-100 hover:bg-emerald-600 dark:hover:bg-emerald-500 text-white dark:text-slate-900 dark:hover:text-white text-xs font-extrabold transition-all shadow-md flex items-center justify-center gap-2 group/btn"
                >
                  <span>View Protected PDF</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Protected Canvas PDF Viewer Modal */}
      <PdfModal
        isOpen={isViewerOpen}
        document={selectedDoc}
        onClose={() => setIsViewerOpen(false)}
      />

    </main>
  );
}
