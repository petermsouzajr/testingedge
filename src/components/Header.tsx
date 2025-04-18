'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { links as homeLinks } from '@/lib/data'; // Rename imported links
import Link from 'next/link';
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

  // Reverted Helper function for link clicks (updates active section state)
  const handleLinkClickState = (linkName: SectionName) => {
    setActiveSection(linkName);
    setTimeOfLastClick(Date.now());
  };

  // Reverted Enhanced click handler for smooth scrolling
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
    // Reverted Outer structure and styling
    <motion.header
      className="z-[999] fixed top-0 left-0 right-0 flex justify-center"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      {/* Reverted Background and Nav Container styling */}
      <div
        className="mt-0 sm:mt-6 w-full sm:w-auto max-w-3xl
                   px-4 py-2
                   rounded-none sm:rounded-full
                   border border-white border-opacity-40
                   bg-white/80 shadow-lg shadow-black/[0.03] backdrop-blur-[0.5rem]"
      >
        <nav className="w-full">
          {/* Reverted ul styling */}
          <ul className="flex w-full items-center justify-center flex-wrap gap-x-4 gap-y-2 text-[0.9rem] font-medium text-gray-700">
            {/* Use the dynamic 'links' variable */}
            {links.map((link) => {
              // Highlighting now depends only on activeSection matching link name
              const isActive = activeSection === link.name;
              // Keep Contact link special styling from original if needed
              const isContactLink = pathname === '/' && link.name === 'Contact';
              const linkText = isContactLink ? 'Consultation' : link.name;

              return (
                <motion.li
                  // Reverted li styling
                  className="relative flex items-center justify-center"
                  key={link.hash}
                >
                  <Link
                    // Reverted Link styling logic, applying active class conditionally
                    className={clsx(
                      'block px-3 py-1 transition sm:whitespace-nowrap rounded-full',
                      {
                        'hover:text-gray-950': !isActive,
                        'bg-blue-600 hover:bg-blue-700 text-white':
                          isContactLink, // Keep special contact button style on home
                        'text-gray-950 font-semibold':
                          isActive && !isContactLink, // Apply active text style only if highlighting
                      }
                    )}
                    href={link.hash}
                    // Use original click handler, which includes smooth scroll
                    onClick={(e) =>
                      handleSmoothScrollClick(
                        e,
                        link.hash,
                        link.name as SectionName // Cast needed as SectionName type comes from homeLinks
                      )
                    }
                  >
                    {linkText}
                    {/* Apply active span if isActive is true (and not the special contact link) */}
                    {isActive && !isContactLink && (
                      <motion.span
                        // Reverted active span styling
                        className="bg-blue-100 outline-1 outline-blue-600 rounded-full absolute inset-0 -z-10"
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
