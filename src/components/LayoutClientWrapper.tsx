'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';
import ActiveSectionContextProvider from '@/context/active-section-context';
import { Inter } from 'next/font/google'; // Keep font consistent

const inter = Inter({ subsets: ['latin'] });

export default function LayoutClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // Update condition to hide header on legal pages as well
  const showHeader = ![
    '/calculator',
    '/terms-of-service',
    '/privacy-policy',
  ].includes(pathname);

  // Adjust body padding based on whether header is shown
  const bodyPadding = showHeader
    ? 'pt-20 md:pt-[calc(1.5rem+3.25rem+1rem)]' // Padding when header is shown
    : 'pt-4'; // Reduced padding when header is hidden

  return (
    <body
      className={`${inter.className} flex flex-col min-h-screen bg-gray-50 text-gray-950 relative ${bodyPadding}`}
    >
      <ActiveSectionContextProvider>
        {showHeader && <Header />} {/* Conditionally render Header */}
        <main className="flex-grow flex flex-col items-center px-4">
          {children}
        </main>
        <Footer />
        <Toaster position="top-right" />
      </ActiveSectionContextProvider>
    </body>
  );
}
