'use client';

import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function LayoutClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerRef = useRef<HTMLElement>(null);
  const [mainPaddingTop, setMainPaddingTop] = useState(100); // Initial fallback padding
  const PADDING_BUFFER = 16; // ~1rem extra space below header

  // Use useLayoutEffect for initial measurement before paint
  useLayoutEffect(() => {
    if (headerRef.current) {
      const initialHeight = headerRef.current.offsetHeight;
      setMainPaddingTop(initialHeight + PADDING_BUFFER);
    }
  }, []);

  // Use useEffect to observe resize changes
  useEffect(() => {
    const headerElement = headerRef.current;
    if (!headerElement) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // Type check before accessing offsetHeight
        if (
          entry.target === headerElement &&
          entry.target instanceof HTMLElement
        ) {
          const newHeight = entry.target.offsetHeight;
          setMainPaddingTop(newHeight + PADDING_BUFFER);
        }
      }
    });

    resizeObserver.observe(headerElement);

    // Cleanup observer on component unmount
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <>
      {/* Wrap Header in a measurable element with ref */}
      {/* Cast ref type explicitly for the div */}
      <div ref={headerRef as React.RefObject<HTMLDivElement>}>
        <Header />
      </div>
      {/* Apply dynamic padding to main */}
      <main
        className="flex-grow flex flex-col items-center px-4"
        style={{ paddingTop: `${mainPaddingTop}px` }}
      >
        {children}
      </main>
      <Footer />
    </>
  );
}
