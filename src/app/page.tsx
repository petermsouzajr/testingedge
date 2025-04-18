/* eslint-disable react/no-unescaped-entities */
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useSectionInView } from '@/lib/hooks';
import Contact from '@/components/Contact';

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
  // Use the hook for each section *except* Hero
  const { ref: problemRef } = useSectionInView('Problem');
  const { ref: servicesRef } = useSectionInView('Services');
  const { ref: whyUsRef } = useSectionInView('Why Us');
  const { ref: processRef } = useSectionInView('Process');
  const { ref: supportRef } = useSectionInView('Support');
  // Track the final CTA section as 'Contact' for navigation
  const { ref: contactRef } = useSectionInView('Contact');

  return (
    // Adjusted width and centering based on new layout
    <div className="flex flex-col items-center px-4 w-full">
      {/* Hero Section */}
      <motion.section
        id="hero"
        className="w-full max-w-[50rem] text-center sm:mt-0 mt-20 py-16 bg-gray-200 rounded-lg mb-28 scroll-mt-[100rem]"
        variants={fadeInAnimationVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        custom={0} // Animation index
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Ship Reliable Web Apps Faster
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl sm:mx-auto mx-2">
          Expert Test Automation, Documentation, & Compliance (WCAG,
          Performance, SOC2 Prep) for SaaS, Fintech, and E-commerce.
        </p>
        <Link
          href="/estimate"
          className="bg-blue-600 inline-block hover:bg-blue-700 mx-2  text-white px-8 py-3 rounded-md text-lg font-medium shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 active:scale-95 transition-all duration-150 ease-in-out"
        >
          Schedule Your Free Consultation Now
        </Link>
        {/* Wrapper div for panoramic image effect - Added padding/centering */}
        <div className="mt-10 relative w-11/12 h-50 mx-auto overflow-hidden rounded-lg shadow-md">
          <Image
            src="/images/hero-4.png"
            alt="Abstract graphic representing software reliability and efficient testing processes"
            layout="fill" // Fill the wrapper div
            objectFit="cover" // Cover the area, cropping excess
            priority // Keep priority for LCP
          />
        </div>
      </motion.section>

      {/* Problem / Solution Section */}
      <motion.section
        ref={problemRef}
        id="problem-solution"
        className="w-full max-w-[50rem] py-12 mb-28 scroll-mt-28 bg-gray-800 p-4" // Added scroll-mt and mb
        variants={fadeInAnimationVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        custom={1}
      >
        <h2 className="text-3xl font-bold text-center text-gray-100 mb-8">
          Solve Your Software Quality Challenges
        </h2>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-xl font-semibold text-gray-200 mb-4">
              Common Pain Points:
            </h3>
            <ul className="list-inside text-lg space-y-2 text-gray-300">
              <li>❌ Bugs slowing down releases?</li>
              <li>❌ Meeting WCAG accessibility standards?</li>
              <li>❌ Documenting test evidence for audits?</li>
              <li>❌ Bandwidth for performance testing?</li>
              <li>❌ Errors hindering user adoption?</li>
              <li>❌ Features lacking Unit Testing?</li>
            </ul>
          </div>
          <div className="bg-green-100 p-6 rounded-lg font-semibold text-lg">
            <h3 className="text-xl font-semibold text-green-800 mb-4">
              Our Solution:
            </h3>
            <ul className="list-inside  text-green-800">
              <li>✅ Stable end-to-end test suites.</li>
              <li>✅ Unit tests in Jest/Vitest.</li>
              <li>✅ Test scenarios for team use.</li>
              <li>✅ SOC2 and WCAG readiness.</li>
              <li>✅ Digestible audit documentation.</li>
              <li>✅ Ongoing test maintenance.</li>
            </ul>
          </div>
        </div>
      </motion.section>

      {/* Services Overview Section */}
      <motion.section
        ref={servicesRef}
        id="services"
        className="w-full max-w-[50rem] py-12 bg-gray-100 rounded-lg mb-28 scroll-mt-28"
        variants={fadeInAnimationVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        custom={2}
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Our Core Services
        </h2>
        <div className="grid md:grid-cols-3 gap-8 text-center px-4">
          {/* Service Card 1 - UPDATED */}
          <div className="p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
            <Image
              src="/images/icon-1.png"
              alt="Test Automation Icon"
              width={84}
              height={74}
              className="mx-auto mb-3" // Center icon and maintain margin
            />
            {/* Updated Title */}
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Test Automation & Migration
            </h3>
            {/* Replaced <p> with <ul> */}
            <ul className="text-gray-600 text-sm space-y-1 text-left">
              {' '}
              {/* Use text-left for list items */}
              <li>✓ New suite setup (Cypress, Playwright, etc.)</li>
              <li>✓ Existing suite optimization & expansion</li>
              <li>
                ✓{' '}
                <strong className="font-medium">
                  Framework Migration (e.g., RSpec to Cypress)
                </strong>
              </li>
              <li>✓ Unit Testing (Jest / Vitest)</li>
              <li>✓ Coverage goals tailored to your needs</li>
            </ul>
          </div>
          {/* Service Card 2 - CONVERTED TO LIST */}
          <div className="p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
            <Image
              src="/images/icon-2.png"
              alt="Essential Documentation Icon"
              width={84}
              height={84}
              className="mx-auto mb-3"
            />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Essential Documentation
            </h3>
            {/* CHANGED from <p> to <ul> */}
            <ul className="text-gray-600 text-sm space-y-1 text-left">
              <li>✓ TestRail / Xray Integration</li>
              <li>✓ Test Data Management</li>
              <li>✓ Clear How-To Guides</li>
              <li>✓ Non-technical Gherkin Scenarios</li>
            </ul>
          </div>
          {/* Service Card 3 - CONVERTED TO LIST */}
          <div className="p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
            <Image
              src="/images/icon-3.png"
              alt="Specialized Testing Icon"
              width={84}
              height={84}
              className="mx-auto mb-3"
            />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Specialized Testing
            </h3>
            {/* CHANGED from <p> to <ul> */}
            <ul className="text-gray-600 text-sm space-y-1 text-left">
              <li>✓ Accessibility Testing (WCAG AA)</li>
              <li>✓ Performance Testing (Load/Stress)</li>
              <li>✓ SOC2 Preparation Support</li>
              <li>
                ✓{' '}
                <em className="text-xs">Tiered options available for scope</em>
              </li>
            </ul>
          </div>
        </div>
        {/* Key Tools Sub-section */}
        <div className="mt-10 text-center">
          <h4 className="text-lg font-semibold text-gray-700 mb-4">
            Tools We Excel With:
          </h4>
          <div className="flex justify-center items-center flex-wrap gap-4 md:gap-6 mb-4">
            <Image
              src="/images/logo-cypress.png"
              alt="Cypress"
              width={70}
              height={48}
              className="max-h-12 w-auto"
            />
            <Image
              src="/images/logo-vitest.png"
              alt="Vitest"
              width={70}
              height={48}
              className="max-h-12 w-auto"
            />
            <Image
              src="/images/logo-testrail.png"
              alt="TestRail"
              width={48}
              height={48}
              className="max-h-12 w-auto"
            />
            <Image
              src="/images/logo-loadforge.png"
              alt="LoadForge"
              width={70}
              height={48}
              className="max-h-12 w-auto"
            />
          </div>
          <div className="flex justify-center items-center flex-wrap gap-4 md:gap-6">
            <Image
              src="/images/logo-rspec.png"
              alt="RSpec"
              width={68}
              height={48}
              className="max-h-12 w-auto"
            />
            <Image
              src="/images/logo-playwright.png"
              alt="Playwright"
              width={52}
              height={48}
              className="max-h-12 w-auto"
            />
            <Image
              src="/images/logo-jest.jpeg"
              alt="Jest"
              width={48}
              height={48}
              className="max-h-12 w-auto"
            />

            <Image
              src="/images/logo-xray.png"
              alt="Xray"
              width={48}
              height={48}
              className="max-h-12 w-auto"
            />
            <Image
              src="/images/logo-jmeter.png"
              alt="JMeter"
              width={70}
              height={48}
              className="max-h-12 w-auto"
            />

            <Image
              src="/images/logo-axe.png"
              alt="Axe-core"
              width={48}
              height={48}
              className="max-h-12 w-auto"
            />
          </div>
        </div>
      </motion.section>

      {/* Why Choose Us Section - Ensure consistent padding/margins */}
      <motion.section
        ref={whyUsRef}
        id="why-us"
        // Added bg, padding for context - Ensure p-8 is present
        className="w-full max-w-[50rem] py-12 mb-28 scroll-mt-28 bg-gray-900 rounded-lg p-8"
        variants={fadeInAnimationVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        custom={3}
      >
        <h2 className="text-3xl font-bold text-center text-white mb-12">
          Why Partner with Testing Edge?
        </h2>
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Point 1 - Use Bullet */}
          <div className="flex items-start gap-3">
            {' '}
            {/* Slightly reduce gap */}
            {/* Replace number span with styled div */}
            <div className="mt-1.5 w-3 h-3 bg-blue-600 rounded-full shrink-0"></div>
            <div>
              <h3 className="text-xl font-semibold text-gray-200 mb-1">
                Proven Experience
              </h3>
              <p className="text-gray-200 text-sm">
                Proven experience delivering robust testing solutions in
                demanding sectors (FinTech, E-commerce, Social).
              </p>
            </div>
          </div>
          {/* Point 2 - Use Bullet */}
          <div className="flex items-start gap-3">
            <div className="mt-1.5 w-3 h-3 bg-blue-600 rounded-full shrink-0"></div>
            <div>
              <h3 className="text-xl font-semibold text-gray-200 mb-1">
                Technical Mastery
              </h3>
              <p className="text-gray-200 text-sm">
                Mastery of modern tools (Cypress, TS, Playwright, RSpec, CI/CD)
                enhances test reliability and accelerates feedback.
              </p>
            </div>
          </div>
          {/* Point 3 - Use Bullet */}
          <div className="flex items-start gap-3">
            <div className="mt-1.5 w-3 h-3 bg-blue-600 rounded-full shrink-0"></div>
            <div>
              <h3 className="text-xl font-semibold text-gray-200 mb-1">
                Full-Stack Perspective
              </h3>
              <p className="text-gray-200 text-sm">
                Full-stack perspective enables effective strategies considering
                frontend & backend implications.
              </p>
            </div>
          </div>
          {/* Point 4 (Keep original structure or update if needed) - Assuming update */}
          <div className="flex items-start gap-3">
            <div className="mt-1.5 w-3 h-3 bg-blue-600 rounded-full shrink-0"></div>
            <div>
              <h3 className="text-xl font-semibold text-gray-200 mb-1">
                Proactive Problem Solving
              </h3>{' '}
              {/* Assuming point 4 exists */}
              <p className="text-gray-200 text-sm">
                Don't just find bugs, resolve client-facing issues and
                proactively improve core QA processes to prevent future
                problems.
              </p>{' '}
              {/* Example text */}
            </div>
          </div>
          {/* Point 5 - Use Bullet */}
          <div className="flex items-start gap-3">
            <div className="mt-1.5 w-3 h-3 bg-blue-600 rounded-full shrink-0"></div>
            <div>
              <h3 className="text-xl font-semibold text-gray-200 mb-1">
                Holistic Approach
              </h3>
              <p className="text-gray-200 text-sm">
                Holistic approach includes documentation standards (TestRail,
                Gherkin), workflow enhancements (Jira), and specialized testing
                (Accessibility).
              </p>
            </div>
          </div>
          {/* Point 6 - Use Bullet */}
          <div className="flex items-start gap-3">
            <div className="mt-1.5 w-3 h-3 bg-blue-600 rounded-full shrink-0"></div>
            <div>
              {/* NOTE: text-gray-700/600 used here in original, corrected to 200 to match others */}
              <h3 className="text-xl font-semibold text-gray-200 mb-1">
                Foundation Building
              </h3>
              <p className="text-gray-200 text-sm">
                Expertise in building full QA ecosystems (repos, docs, Jira,
                processes) to reduce friction for dev teams.
              </p>
            </div>
          </div>
          {/* Point 7 - Use Bullet */}
          <div className="flex items-start gap-3">
            <div className="mt-1.5 w-3 h-3 bg-blue-600 rounded-full shrink-0"></div>
            <div>
              {/* NOTE: text-gray-700/600 used here in original, corrected to 200 to match others */}
              <h3 className="text-xl font-semibold text-gray-200 mb-1">
                Industry Credibility
              </h3>
              <p className="text-gray-200 text-sm">
                Direct collaboration with a Cypress Ambassador brings
                cutting-edge knowledge and industry-recognized quality
                commitment.
              </p>
            </div>
          </div>
          {/* Point 8 - Use Bullet */}
          <div className="flex items-start gap-3">
            <div className="mt-1.5 w-3 h-3 bg-blue-600 rounded-full shrink-0"></div>
            <div>
              {/* NOTE: text-gray-700/600 used here in original, corrected to 200 to match others */}
              <h3 className="text-xl font-semibold text-gray-200 mb-1">
                Agile & ROI-Focused
              </h3>
              <p className="text-gray-200 text-sm">
                Agile methodologies ensure clear communication, defined scopes,
                and a partnership focused on ROI and team enablement.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Process Section - Updated with Card Styling */}
      <motion.section
        ref={processRef}
        id="process"
        // Use bg-gray-100 for a cleaner light theme, ensure consistent padding
        className="w-full max-w-[50rem] py-12 mb-28 scroll-mt-28 bg-gray-100 rounded-lg p-8"
        variants={fadeInAnimationVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        custom={4}
      >
        {/* Ensure consistent heading margin */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Our Engagement Process
        </h2>
        {/* Use gap-6 for consistency */}
        <div className="grid md:grid-cols-4 gap-6 text-center">
          {/* Step 1 Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center">
            {/* Make number larger and bolder */}
            <div className="text-5xl font-bold text-blue-600 mb-3">1</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Discovery Call
            </h3>
            <p className="text-sm text-gray-600">
              Discuss goals, stack, scope & challenges (Free).
            </p>
          </div>

          {/* Step 2 Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center">
            <div className="text-5xl font-bold text-blue-600 mb-3">2</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Tailored Proposal
            </h3>
            <p className="text-sm text-gray-600">
              Receive a detailed summary of work & quote (free).
            </p>
          </div>

          {/* Step 3 Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center">
            <div className="text-5xl font-bold text-blue-600 mb-3">3</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Execution & Delivery
            </h3>
            <p className="text-sm text-gray-600">
              Build/implement with regular updates, virtually or in-person.
            </p>
          </div>

          {/* Step 4 Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center">
            <div className="text-5xl font-bold text-blue-600 mb-3">4</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">
              Handover & Support
            </h3>
            <p className="text-sm text-gray-600">
              Deliver assets, warranty, discuss ongoing support.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Post-Project Support Section - EXPANDED CONTENT */}
      <motion.section
        ref={supportRef}
        id="support"
        // Match background with "Why Us" or choose another contrasting one
        className="w-full max-w-[50rem] py-12 bg-gray-800 p-8 rounded-lg mb-28 scroll-mt-28"
        variants={fadeInAnimationVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        custom={5}
      >
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Ongoing Support Packages
        </h2>
        <p className="text-center text-gray-300 mb-10 max-w-3xl mx-auto">
          Protect your test automation investment. As your application evolves,
          our structured support options ensure continued ROI beyond project
          delivery.
        </p>

        {/* Included Warranty Section */}
        <div className="mb-12 bg-blue-800 p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold text-white mb-3">
            Included Project Warranty (1 Month)
          </h3>
          <p className="text-gray-300 mb-2">
            Confidence in our work is key. Every project includes a{' '}
            <strong className="font-semibold text-white">
              complimentary 1-month warranty
            </strong>{' '}
            covering fixes for any defects found directly within the test
            suites, framework setup, or documentation delivered by Testing Edge.
          </p>
          <p className="text-sm text-gray-400">
            (Scope: Up to 10 hours, focused on our deliverables. Excludes
            application code changes, environment issues, or new feature
            testing.)
          </p>
        </div>

        {/* Paid Support Packages Section */}
        <h3 className="text-2xl font-semibold text-center text-white mb-8">
          Flexible Support Packages (Post-Warranty)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Package 1: Essential Maintenance */}
          <div className="bg-gray-700 p-6 rounded-lg border border-gray-600 flex flex-col">
            <h4 className="text-xl font-semibold text-white mb-3">
              Essential Maintenance
            </h4>
            <p className="text-sm text-gray-400 mb-4 italic">
              Best for: Stability checks & minor fixes.
            </p>
            <ul className="text-gray-300 space-y-2 text-sm mb-4 flex-grow">
              <li>✓ Up to 10 hours/month</li>
              <li>✓ Fixes for minor test flakiness</li>
              <li>✓ Basic test run monitoring</li>
              <li>✓ Standard email support</li>
            </ul>
            <p className="text-white font-semibold text-lg mt-auto">
              $1,500 / month
            </p>
            <p className="text-xs text-gray-400">(1 Month Commitment)</p>
          </div>

          {/* Package 2: Growth & Stability (Highlighted) */}
          <div className="bg-blue-700 p-6 rounded-lg border-2 border-blue-400 shadow-lg flex flex-col ring-2 ring-blue-300 ring-offset-2 ring-offset-gray-800">
            {' '}
            {/* Highlight styling */}
            <span className="text-xs font-bold uppercase text-white bg-blue-500 px-2 py-1 rounded-full self-start mb-3">
              Most Popular
            </span>
            <h4 className="text-xl font-semibold text-white mb-3">
              Growth & Stability
            </h4>
            <p className="text-sm text-blue-100 mb-4 italic">
              Best for: Active development cycles needing regular upkeep.
            </p>
            <ul className="text-blue-50 space-y-2 text-sm mb-4 flex-grow">
              <li>
                ✓ <strong className="font-medium">~13 hours/month</strong> (40
                total)
              </li>
              <li>✓ Includes Essential scope</li>
              <li>✓ Updates for moderate UI/API changes</li>
              <li>✓ Testing for 1-2 minor new features</li>
              <li>✓ Priority email support</li>
              <li>✓ Monthly health check summary</li>
            </ul>
            <p className="text-white font-semibold text-lg mt-auto">
              $1,400 / month
            </p>
            <p className="text-xs text-blue-200">
              ($4,200 total - 3 Month Commitment)
            </p>
          </div>

          {/* Package 3: Strategic Partnership */}
          <div className="bg-gray-700 p-6 rounded-lg border border-gray-600 flex flex-col">
            <h4 className="text-xl font-semibold text-white mb-3">
              Strategic Partnership
            </h4>
            <p className="text-sm text-gray-400 mb-4 italic">
              Best for: Long-term strategy & proactive optimization.
            </p>
            <ul className="text-gray-300 space-y-2 text-sm mb-4 flex-grow">
              <li>
                ✓ <strong className="font-medium">~15 hours/month</strong> (90
                total)
              </li>
              <li>✓ Includes Growth scope</li>
              <li>✓ Proactive test optimization</li>
              <li>✓ Monthly strategy call participation</li>
              <li>✓ Highest priority support (Slack/Direct)</li>
              <li>✓ Detailed monthly reporting</li>
            </ul>
            <p className="text-white font-semibold text-lg mt-auto">
              $1,575 / month
            </p>
            <p className="text-xs text-gray-400">
              ($9,450 total - 6 Month Commitment)
            </p>
          </div>
        </div>
        <p className="text-center text-gray-400 text-sm mt-10">
          Package details and pricing are indicative. Specific terms are
          discussed and tailored during project handover or upon request.
          Flexible payment options may be available.
        </p>
      </motion.section>

      {/* Final CTA Section - Now designated as the 'Contact' target */}
      <motion.section
        ref={contactRef} // Add ref back
        id="contact" // Set ID back to contact
        className="w-full max-w-[50rem] py-16 bg-blue-700 text-white rounded-lg text-center mb-28 scroll-mt-28" // Changed bg-gray-800 back towards blue, using darker bg-blue-800
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
          Let's discuss how Testing Edge can help.
        </p>
        <Link
          href="/estimate"
          className="inline-block bg-gray-100 hover:bg-white mx-2 text-gray-800 px-8 py-3 rounded-md text-lg font-medium shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white active:scale-95 transition-all duration-150 ease-in-out"
        >
          Schedule Your Free Consultation Now
        </Link>
        {/* Wrapper div styled with repeating background image */}
        <div
          className="mt-10 relative w-10/12 h-50 mx-auto overflow-hidden rounded-lg sm:shadow-md"
          style={{
            backgroundImage: 'url(/images/hero-3.png)',
            backgroundRepeat: 'repeat-x',
            backgroundPosition: 'center center',
            backgroundSize: 'contain', // Scales image height to fit container height
          }}
        >
          {/* Image component removed, using CSS background instead */}
        </div>
      </motion.section>

      {/* CONTACT FORM SECTION - Rendered after the CTA block */}
      <Contact />
    </div>
  );
}
