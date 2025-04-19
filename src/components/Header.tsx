'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { links as homeLinks } from '@/lib/data'; // Rename imported links
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
import { useActiveSectionContext } from '@/context/active-section-context';
import { usePathname } from 'next/navigation'; // Import usePathname
import type { SectionName } from '@/lib/types';

// Define links specifically for the estimate page
const estimateLinks = [
  { name: 'Home', hash: '/' },
  { name: 'Scope', hash: '#core-scope' },
  { name: 'Options', hash: '#add-ons' },
  { name: 'Timeline', hash: '#timeline-notes' },
  { name: 'Estimate', hash: '#estimate-display' },
] as const;

export default function Header() {
  const { activeSection, setActiveSection, setTimeOfLastClick } =
    useActiveSectionContext();
  const pathname = usePathname(); // Get current path

  // Determine which links to use based on the path
  const links = pathname === '/estimate' ? estimateLinks : homeLinks;

  // Helper function for link clicks (updates active section state)
  const handleLinkClickState = (linkName: SectionName) => {
    setActiveSection(linkName);
    setTimeOfLastClick(Date.now());
  };

  // Enhanced click handler for smooth scrolling
  const handleSmoothScrollClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string,
    linkName: SectionName
  ) => {
    handleLinkClickState(linkName);

    const targetId = sectionId.startsWith('#')
      ? sectionId.substring(1)
      : sectionId;
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      event.preventDefault();
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <motion.header
      className="z-[999] fixed top-0 left-0 right-0 flex justify-center"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      {/* Main header container: Use flexbox for layout */}
      <div
        className="mt-0 sm:mt-6 w-full sm:w-auto max-w-4xl /* Increased max-width */
                   px-4 py-2 flex items-center justify-between /* Flex layout */
                   rounded-none sm:rounded-full
                   border border-white border-opacity-40
                   bg-white/80 shadow-lg shadow-black/[0.03] backdrop-blur-[0.5rem]"
      >
        {/* Logo Link - Always Visible */}
        <div className="flex-shrink-0 mr-4">
          {' '}
          {/* Prevent shrinking, add margin */}
          <Link
            href="/"
            onClick={() => handleLinkClickState('Home' as SectionName)}
          >
            {' '}
            {/* Reset state on click */}
            <Image
              src="/images/logo.png"
              alt="Testing Edge Logo"
              width={130} // Adjust size as needed
              height={35} // Adjust size as needed
              priority
              className="h-8 w-auto sm:h-9 rounded-sm" // Responsive height
            />
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-grow flex justify-center">
          {' '}
          {/* Center links */}
          <ul className="flex items-center justify-center flex-wrap gap-x-4 gap-y-2 text-[0.9rem] font-medium text-gray-700">
            {links.map((link) => {
              // **** Skip rendering the text 'Home' link ****
              if (link.name === 'Home') {
                return null;
              }

              const isActive = activeSection === link.name;
              const isContactLink = pathname === '/' && link.name === 'Contact';
              const linkText = isContactLink ? 'Consultation' : link.name;

              return (
                <motion.li
                  className="relative flex items-center justify-center"
                  key={link.hash}
                >
                  <Link
                    className={clsx(
                      'block px-3 py-1 transition sm:whitespace-nowrap rounded-full',
                      {
                        'text-white bg-blue-600 hover:bg-blue-700':
                          isContactLink,
                        'hover:text-gray-950': !isActive && !isContactLink,
                        'text-gray-950 font-semibold':
                          isActive && !isContactLink,
                      }
                    )}
                    href={link.hash}
                    onClick={(e) =>
                      handleSmoothScrollClick(
                        e,
                        link.hash,
                        link.name as SectionName
                      )
                    }
                  >
                    {linkText}
                    {isActive && (
                      <motion.span
                        className={clsx(
                          'outline-1 outline-blue-600 rounded-full absolute inset-0 -z-10',
                          {
                            'bg-transparent': isContactLink,
                            'bg-blue-100': !isContactLink,
                          }
                        )}
                        layoutId="activeSection"
                        transition={{
                          type: 'spring',
                          stiffness: 380,
                          damping: 30,
                        }}
                      ></motion.span>
                    )}
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </nav>
      </div>
    </motion.header>
  );
}
