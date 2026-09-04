'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { LeftDrawer } from '@/components/LeftDrawer';
import { BottomNav } from '@/components/BottomNav';
import { PdfModal } from '@/components/PdfModal';
import { HotlinesModal } from '@/components/HotlinesModal';
import { DocumentsModal } from '@/components/DocumentsModal';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [pdfTitle, setPdfTitle] = useState('BRTA Gazette');
  const [isHotlinesOpen, setIsHotlinesOpen] = useState(false);
  const [isDocumentsOpen, setIsDocumentsOpen] = useState(false);

  // Close all open modals & drawers automatically on route navigation!
  useEffect(() => {
    setIsDrawerOpen(false);
    setIsPdfOpen(false);
    setIsHotlinesOpen(false);
    setIsDocumentsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const isDarkStored = localStorage.getItem('dhaka_theme') === 'dark' ||
      (!('dhaka_theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDark(isDarkStored);
    if (isDarkStored) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Touch listener for tapping/swiping left screen edge (< 30px from left)
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches && e.touches[0] && e.touches[0].clientX < 30) {
        setIsDrawerOpen(true);
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    return () => window.removeEventListener('touchstart', handleTouchStart);
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('dhaka_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('dhaka_theme', 'light');
    }
  };

  const handleOpenPdf = (title?: string) => {
    if (title) setPdfTitle(title);
    setIsPdfOpen(true);
  };

  const closeAllModals = () => {
    setIsDrawerOpen(false);
    setIsPdfOpen(false);
    setIsHotlinesOpen(false);
    setIsDocumentsOpen(false);
  };

  return (
    <html lang="en" className={isDark ? 'dark' : ''}>
      <head>
        <title>Dhaka Bus Fare - Route Finder & Fare Calculator | ঢাকা বাস ভাড়া</title>
        <meta name="description" content="Calculate Dhaka city bus fares, view route maps, and explore bus operators." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 min-h-screen flex flex-col font-sans transition-colors duration-200 pb-24 md:pb-12">
        <Navbar
          onOpenDrawer={() => setIsDrawerOpen(true)}
          isDark={isDark}
          onToggleDarkMode={toggleDarkMode}
        />

        {children}

        <LeftDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          isDark={isDark}
          onToggleDarkMode={toggleDarkMode}
        />

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
      </body>
    </html>
  );
}
