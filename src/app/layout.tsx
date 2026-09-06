'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { PdfModal } from '@/components/PdfModal';
import { HotlinesModal } from '@/components/HotlinesModal';
import { DocumentsModal } from '@/components/DocumentsModal';
import { BottomNav } from '@/components/BottomNav';
import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [pdfTitle, setPdfTitle] = useState('BRTA Gazette');
  const [isHotlinesOpen, setIsHotlinesOpen] = useState(false);
  const [isDocumentsOpen, setIsDocumentsOpen] = useState(false);

  // Close all open modals automatically on route navigation
  useEffect(() => {
    setIsPdfOpen(false);
    setIsHotlinesOpen(false);
    setIsDocumentsOpen(false);
  }, [pathname]);

  const handleOpenPdf = (title?: string) => {
    if (title) setPdfTitle(title);
    setIsPdfOpen(true);
  };

  const closeAllModals = () => {
    setIsPdfOpen(false);
    setIsHotlinesOpen(false);
    setIsDocumentsOpen(false);
  };

  return (
    <html lang="en" className="dark">
      <head>
        <title>DhakaBusFare - Dhaka Bus Fare & Route Guide | ঢাকা বাস ভাড়া</title>
        <meta name="description" content="Know your Dhaka bus fare and routes quickly and easily." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans transition-colors duration-200">
        <AuthProvider>
          <Navbar />

          {children}

          <PdfModal
            isOpen={isPdfOpen}
            busName={pdfTitle}
            onClose={() => setIsPdfOpen(false)}
          />

          <HotlinesModal
            isOpen={isHotlinesOpen}
            onClose={() => setIsHotlinesOpen(false)}
          />

          <DocumentsModal
            isOpen={isDocumentsOpen}
            onClose={() => setIsDocumentsOpen(false)}
            onOpenPdf={handleOpenPdf}
          />

          <BottomNav
            onOpenDocuments={() => { setIsHotlinesOpen(false); setIsDocumentsOpen(true); }}
            onOpenHotlines={() => { setIsDocumentsOpen(false); setIsHotlinesOpen(true); }}
            onCloseModals={closeAllModals}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
