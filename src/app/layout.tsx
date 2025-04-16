import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ActiveSectionContextProvider from '@/context/active-section-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Testing Edge - Expert Test Automation & Compliance',
  description:
    'Contract-based test automation, documentation, and compliance testing (WCAG, Performance, SOC2 Prep).',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="!scroll-smooth">
      <body
        className={`${inter.className} flex flex-col min-h-screen bg-gray-50 text-gray-950 relative pt-24 md:pt-[calc(1.5rem+3.25rem+1rem)]`}
      >
        <ActiveSectionContextProvider>
          <Header />
          <main className="flex-grow flex flex-col items-center px-4">
            {children}
          </main>
          <Footer />
        </ActiveSectionContextProvider>
      </body>
    </html>
  );
}
