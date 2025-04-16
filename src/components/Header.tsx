'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { links } from '@/lib/data';
import Link from 'next/link';
import clsx from 'clsx';
import { useActiveSectionContext } from '@/context/active-section-context';
import type { SectionName } from '@/lib/types';

export default function Header() {
  const { activeSection, setActiveSection, setTimeOfLastClick } =
    useActiveSectionContext();

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
    handleLinkClickState(linkName); // Update active section state first

    const targetId = sectionId.startsWith('#')
      ? sectionId.substring(1)
      : sectionId;
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      event.preventDefault(); // Prevent default hash jump ONLY if target exists
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // If targetElement doesn't exist for some reason, let the default href behavior proceed.
  };

  return (
    <motion.header
      className="z-[999] fixed top-0 left-0 right-0 flex justify-center" // Use flex to center the nav inside
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      {/* Combined Background and Nav Container */}
      <div
        className="mt-0 sm:mt-6 w-full sm:w-auto max-w-3xl 
                   px-4 py-2 
                   rounded-none sm:rounded-full
                   border border-white border-opacity-40
                   bg-white/80 shadow-lg shadow-black/[0.03] backdrop-blur-[0.5rem]"
      >
        <nav className="w-full">
          <ul className="flex w-full items-center justify-center flex-wrap gap-x-4 gap-y-2 text-[0.9rem] font-medium text-gray-700">
            {links.map((link) => {
              const isContactLink = link.name === 'Contact';
              const linkText = isContactLink ? 'Consultation' : link.name;
              const isActive = activeSection === link.name;

              return (
                <motion.li
                  className="relative flex items-center justify-center"
                  key={link.hash}
                >
                  <Link
                    className={clsx(
                      'block px-3 py-1 transition sm:whitespace-nowrap rounded-full',
                      {
                        'hover:text-gray-950': !isActive,
                        'bg-blue-600 hover:bg-blue-700 text-white':
                          isContactLink,
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
                        // Use desired blue highlight
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
