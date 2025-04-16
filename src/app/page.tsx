/* eslint-disable react/no-unescaped-entities */
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSectionInView } from '@/lib/hooks';

// Simple fade-in animation variant
const fadeInAnimationVariants = {
  initial: {
    opacity: 0,
    y: 100, // Start slightly below
  },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.05 * index, // Stagger animation based on index
    },
  }),
};

export default function HomePage() {
  // Use the hook for each section
  const { ref: heroRef } = useSectionInView('Hero', 0.5);
  const { ref: problemRef } = useSectionInView('Problem');
  const { ref: servicesRef } = useSectionInView('Services');
  const { ref: whyUsRef } = useSectionInView('Why Us');
  const { ref: processRef } = useSectionInView('Process');
  const { ref: supportRef } = useSectionInView('Support');
  const { ref: contactRef } = useSectionInView('Contact');

  return (
    // Adjusted width and centering based on new layout
    <div className="flex flex-col items-center px-4 w-full">
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        id="hero"
        className="w-full max-w-[50rem] text-center py-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg mb-28 scroll-mt-[100rem]" // Added scroll-mt and mb
        variants={fadeInAnimationVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        custom={0} // Animation index
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Ship Reliable Web Apps Faster
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Expert Test Automation, Documentation, & Compliance Testing (WCAG,
          Performance, SOC2 Prep) for SaaS, Fintech, and E-commerce.
        </p>
        <Link
          href="#contact"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md text-lg font-medium"
        >
          Schedule Consultation
        </Link>
        {/* Placeholder for visual element */}
        <div className="mt-10 h-32 bg-gray-200 rounded flex items-center justify-center text-gray-500">
          [Professional Graphic/Image Placeholder]
        </div>
      </motion.section>

      {/* Problem / Solution Section */}
      <motion.section
        ref={problemRef}
        id="problem-solution"
        className="w-full max-w-[50rem] py-12 mb-28 scroll-mt-28" // Added scroll-mt and mb
        variants={fadeInAnimationVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        custom={1}
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Overcome Your Testing Challenges
        </h2>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Common Pain Points:
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Struggling with flaky tests slowing down releases?</li>
              <li>Worried about meeting WCAG accessibility standards?</li>
              <li>Need documented test evidence for SOC2 audits?</li>
              <li>Lacking bandwidth for thorough performance testing?</li>
              <li>Insufficient QA hindering user adoption?</li>
            </ul>
          </div>
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Our Solution:
            </h3>
            <p className="text-gray-600">
              We build stable, maintainable test suites (Cypress/Playwright),
              provide expert Accessibility audits, implement Performance
              testing, and support SOC2 readiness – tailored to your project
              needs.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Services Overview Section */}
      <motion.section
        ref={servicesRef}
        id="services"
        className="w-full max-w-[50rem] py-12 bg-gray-100 rounded-lg mb-28 scroll-mt-28" // Adjusted bg, added scroll-mt and mb
        variants={fadeInAnimationVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        custom={2}
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Our Core Services
        </h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {/* Service Card 1 */}
          <div className="p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
            <div className="text-blue-600 mb-3">[Icon]</div> {/* Placeholder */}
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Test Automation
            </h3>
            <p className="text-gray-600 text-sm">
              Cypress, Playwright, Jest/Vitest. Aiming for 80%+ coverage.
            </p>
          </div>
          {/* Service Card 2 */}
          <div className="p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
            <div className="text-blue-600 mb-3">[Icon]</div> {/* Placeholder */}
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Essential Documentation
            </h3>
            <p className="text-gray-600 text-sm">
              TestRail integration, How-To Guides, GWT Scenarios.
            </p>
          </div>
          {/* Service Card 3 */}
          <div className="p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
            <div className="text-blue-600 mb-3">[Icon]</div> {/* Placeholder */}
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Specialized Testing
            </h3>
            <p className="text-gray-600 text-sm">
              Accessibility (WCAG AA), Performance (Load/Stress), SOC2 Prep
              (Tiers Available).
            </p>
          </div>
        </div>
        {/* Key Tools Sub-section */}
        <div className="mt-10 text-center">
          <h4 className="text-lg font-semibold text-gray-700 mb-4">
            Key Tools We Master:
          </h4>
          <p className="text-gray-600 text-sm">
            Cypress, Playwright, Jest, Vitest, TestRail, Axe-core, k6, JMeter
          </p>
          {/* Consider adding logos later */}
        </div>
      </motion.section>

      {/* Why Choose Us Section */}
      <motion.section
        ref={whyUsRef}
        id="why-us"
        className="w-full max-w-[50rem] py-12 mb-28 scroll-mt-28"
        variants={fadeInAnimationVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        custom={3}
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Why Partner with Testing Edge?
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4 text-gray-600">
            <p>
              <strong>10+ Years Experience:</strong> Proven track record across
              diverse web projects.
            </p>
            <p>
              <strong>Modern Tooling Expertise:</strong> Specialized in Cypress,
              Playwright for faster, reliable results.
            </p>
            <p>
              <strong>Focus on ROI:</strong> Building maintainable assets and
              clear documentation, enabling your teams.
            </p>
          </div>
          <div className="space-y-4 text-gray-600">
            <p>
              <strong>Comprehensive Approach:</strong> Holistic QA combining
              Automation, Documentation, and Specialized Services.
            </p>
            <p>
              <strong>Direct Collaboration:</strong> Work directly with an
              experienced solo consultant.
            </p>
            <p>
              <strong>Structured & Transparent:</strong> Predictable process
              using defined scopes and clear communication.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Process Section */}
      <motion.section
        ref={processRef}
        id="process"
        className="w-full max-w-[50rem] py-12 bg-gray-100 rounded-lg mb-28 scroll-mt-28"
        variants={fadeInAnimationVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        custom={4}
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Our Engagement Process
        </h2>
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div className="p-4">
            <div className="text-2xl font-bold text-blue-600 mb-2">1</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">
              Discovery Call
            </h3>
            <p className="text-sm text-gray-600">
              Discuss goals, stack, scope & challenges (Free).
            </p>
          </div>
          <div className="p-4">
            <div className="text-2xl font-bold text-blue-600 mb-2">2</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">
              Tailored Proposal
            </h3>
            <p className="text-sm text-gray-600">
              Receive a detailed SOW & quote.
            </p>
          </div>
          <div className="p-4">
            <div className="text-2xl font-bold text-blue-600 mb-2">3</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">
              Execution & Delivery
            </h3>
            <p className="text-sm text-gray-600">
              Build/implement with regular updates.
            </p>
          </div>
          <div className="p-4">
            <div className="text-2xl font-bold text-blue-600 mb-2">4</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">
              Handover & Support
            </h3>
            <p className="text-sm text-gray-600">
              Deliver assets, warranty, discuss ongoing support.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Post-Project Support Section */}
      <motion.section
        ref={supportRef}
        id="support"
        className="w-full max-w-[50rem] py-12 mb-28 scroll-mt-28"
        variants={fadeInAnimationVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        custom={5}
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Ongoing Support & Warranty
        </h2>
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-gray-600 mb-4">
            All projects include a <strong>1-Month Project Warranty</strong>{' '}
            covering the delivered test suites and documentation for peace of
            mind.
          </p>
          <p className="text-gray-600 mb-6">
            Need ongoing help after the warranty? We offer tiered support
            packages to keep your tests healthy as your application evolves:
          </p>
          <div className="flex justify-center space-x-4 mb-6">
            <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
              Essential Maintenance
            </span>
            <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
              Growth & Stability
            </span>
            <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
              Strategic Partnership
            </span>
          </div>
          <p className="text-gray-600">
            Ask about our support options during your consultation for detailed
            scope and pricing.
          </p>
        </div>
      </motion.section>

      {/* Final CTA Section */}
      <motion.section
        ref={contactRef}
        id="contact"
        className="w-full max-w-[50rem] py-16 bg-blue-600 text-white rounded-lg text-center mb-28 scroll-mt-28" // Added scroll-mt and mb
        variants={fadeInAnimationVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        custom={6}
      >
        <h2 className="text-3xl font-bold mb-4">
          Ready to Improve Your Software Quality?
        </h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Meet compliance needs and release with confidence. Let's discuss how
          Testing Edge can help.
        </p>
        <Link
          href="#contact-form"
          className="bg-white hover:bg-gray-100 text-blue-700 px-8 py-3 rounded-md text-lg font-medium"
        >
          Schedule Your Free Consultation Now
        </Link>
        {/* Placeholder for a potential contact form or direct email */}
        <div id="contact-form" className="mt-8 text-blue-100 text-sm">
          <p>
            Contact us via email:{' '}
            <a href="mailto:placeholder@example.com" className="underline">
              placeholder@example.com
            </a>
          </p>
        </div>
      </motion.section>
    </div>
  );
}
