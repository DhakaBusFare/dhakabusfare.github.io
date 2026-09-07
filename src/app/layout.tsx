'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { PdfModal } from '@/components/PdfModal';
import { HotlinesModal } from '@/components/HotlinesModal';
import { BottomNav } from '@/components/BottomNav';
import { AuthProvider } from '@/context/AuthContext';
import { RouteDocument } from '@/lib/services/documentService';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<RouteDocument | null>(null);
  const [isHotlinesOpen, setIsHotlinesOpen] = useState(false);

  // Close all open modals automatically on route navigation
  useEffect(() => {
    setIsPdfOpen(false);
    setIsHotlinesOpen(false);
  }, [pathname]);

  const closeAllModals = () => {
    setIsPdfOpen(false);
    setIsHotlinesOpen(false);
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
            document={selectedDocument}
            onClose={() => setIsPdfOpen(false)}
          />

          <HotlinesModal
            isOpen={isHotlinesOpen}
            onClose={() => setIsHotlinesOpen(false)}
          />

          <BottomNav
            onOpenHotlines={() => { setIsHotlinesOpen(false); setIsHotlinesOpen(true); }}
            onCloseModals={closeAllModals}
          />
        </AuthProvider>
      </body>
    </html>
  );
}

