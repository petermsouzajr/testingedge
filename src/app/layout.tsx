import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import LayoutClientWrapper from '@/components/LayoutClientWrapper';

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
      <LayoutClientWrapper>{children}</LayoutClientWrapper>
    </html>
  );
}
