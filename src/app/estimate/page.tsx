'use client';

import React, { useState, useEffect, useTransition } from 'react';
import SelectableCard from '@/components/ui/SelectableCard'; // Use the created SelectableCard
import { sendEstimateEmail } from '@/actions/sendEmail'; // Import the server action
import { useSectionInView } from '@/lib/hooks'; // Import the hook
import type { SectionName } from '@/lib/types'; // Import SectionName type
// import toast from 'react-hot-toast'; // Keep commented unless toast is confirmed to be set up
// --- IMPORT Config Values ---
import {
  // CORE_CONFIG, // Unused import
  BASE_EFFORT,
  // SPECIALIZED_FACTORS, // Unused import
  ESTIMATE_ASSUMPTIONS,
  ESTIMATE_CONFIG,
} from '@/config/pricingConfig'; // Adjust path as needed
// --- End Imports ---

// --- Define Interfaces for Calculation Function ---
interface EstimateCustomerInputs {
  projectName?: string;
  numFeatures: string | number; // Keep as string|number to handle form input
  isE2E: boolean;
  isUnitIntegration: boolean;
  needsDocsTestCaseManagement: boolean;
  needsDocsHowTo: boolean;
  needsAccessibility: boolean;
  needsPerformance: boolean;
  needsSoc2: boolean;
  isRush: boolean;
  // Notes is handled separately in the payload usually, but can include if needed
}

interface EstimateCalculationResult {
  results: {
    finalHoursMin: number;
    finalHoursMax: number;
    finalPriceMin: number;
    finalPriceMax: number;
  };
  assumptions: {
    // Match the payload structure required by sendEstimateEmail
    baseHourlyRateUsed: number;
    contingencyBufferUsed: number;
    complexityFactorUsed: number;
    documentationFactorUsed: number;
    specializedFactorUsed: number;
    rushFactorUsed: number;
    // Add other raw assumptions if passed along and needed
  };
}
// --- End Interface Definitions ---

// --- Locally Defined Helper Components (Adjusted for Dark Mode if needed) ---
const InputField = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  description,
  required = false,
  min,
  // NEW: Add theme prop
  theme = 'light', // 'light' or 'dark'
}: {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  min?: string | number;
  theme?: 'light' | 'dark';
}) => (
  // Add conditional text colors based on theme
  <div className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
    <label
      htmlFor={name}
      className={`block text-lg font-medium mb-1 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}
    >
      {label}
    </label>
    {description && (
      <p
        className={`text-xs mb-1.5 italic ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
      >
        {description}
      </p>
    )}
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      min={min}
      // Input always has light background, dark text for contrast
      className="mt-1 block w-full text-sm border border-gray-600 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-100"
    />
  </div>
);

const TextAreaField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  description,
  required = false,
  rows = 3,
  // NEW: Add theme prop
  theme = 'light', // 'light' or 'dark'
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  description?: string;
  required?: boolean;
  rows?: number;
  theme?: 'light' | 'dark';
}) => (
  <div className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
    <label
      htmlFor={name}
      className={`block text-lg font-medium mb-1 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}
    >
      {label}
    </label>
    {description && (
      <p
        className={`text-xs mb-1.5 italic ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
      >
        {description}
      </p>
    )}
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      rows={rows}
      // Textarea always has light background, dark text
      className="mt-1 block w-full text-sm border  border-gray-600 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-100"
    />
  </div>
);
// --- End Helper Components ---

// --- Parsing Helpers ---
const parseIntStrict = (value: string | number): number => {
  return parseInt(String(value)) || 0;
};
// const parseFloatStrict = (value: string | number): number => { // Unused function
//   return parseFloat(String(value)) || 0;
// };
// --- End Parsing Helpers ---

// --- Calculation Logic Helper (Uses IMPORTED Config & Defined Types) ---
const calculateEstimateDetails = (
  customerInputs: EstimateCustomerInputs // Use defined interface
): EstimateCalculationResult => {
  // 1. Parse Customer Inputs
  const numFeatures = parseIntStrict(customerInputs.numFeatures);

  // 2. Define Assumptions & Map using IMPORTED values
  const assumptions = {
    complexity: ESTIMATE_ASSUMPTIONS.COMPLEXITY,
    browsers: customerInputs.isE2E
      ? ESTIMATE_ASSUMPTIONS.BROWSERS_E2E
      : ESTIMATE_ASSUMPTIONS.BROWSERS_DEFAULT,
    cypressCoverage: customerInputs.isE2E
      ? ESTIMATE_ASSUMPTIONS.CYPRESS_COVERAGE
      : 0,
    jestCoverage: customerInputs.isUnitIntegration
      ? ESTIMATE_ASSUMPTIONS.JEST_COVERAGE
      : 0,
    testRailCoverage: customerInputs.needsDocsTestCaseManagement
      ? ESTIMATE_ASSUMPTIONS.TESTRAIL_COVERAGE
      : 0,
    docsRequested:
      customerInputs.needsDocsHowTo ||
      customerInputs.needsDocsTestCaseManagement,
    howToCount:
      customerInputs.needsDocsHowTo ||
      customerInputs.needsDocsTestCaseManagement
        ? ESTIMATE_ASSUMPTIONS.DOCS_BASE_COUNT +
          Math.ceil(numFeatures * ESTIMATE_ASSUMPTIONS.DOCS_PER_FEATURE_RATE)
        : 0,
    gwtCount:
      customerInputs.needsDocsHowTo ||
      customerInputs.needsDocsTestCaseManagement
        ? ESTIMATE_ASSUMPTIONS.DOCS_BASE_COUNT +
          Math.ceil(numFeatures * ESTIMATE_ASSUMPTIONS.DOCS_PER_FEATURE_RATE)
        : 0,
    accessibilityTier: customerInputs.needsAccessibility ? 'Tier 1' : 'None',
    performanceTier: customerInputs.needsPerformance ? 'Tier 1' : 'None',
    soc2Tier: customerInputs.needsSoc2 ? 'Tier 1' : 'None',
    supportIncluded: false, // Explicitly false for customer estimate
    isRush: customerInputs.isRush,
    estimateRangeFactor: ESTIMATE_CONFIG.ESTIMATE_RANGE_FACTOR,
  };

  // Map assumptions to variables used in core logic
  const internalComplexity = assumptions.complexity;
  // const internalBrowsers = assumptions.browsers; // Unused variable
  const internalCypressCoverage = assumptions.cypressCoverage;
  const internalJestCoverage = assumptions.jestCoverage;
  const internalTestRailCoverage = assumptions.testRailCoverage;
  const internalHowToCount = assumptions.howToCount;
  const internalGwtCount = assumptions.gwtCount;
  const internalIsAccessibilityT1 = assumptions.accessibilityTier === 'Tier 1';
  const internalIsPerformanceT1 = assumptions.performanceTier === 'Tier 1';
  const internalIsSoc2T1 = assumptions.soc2Tier === 'Tier 1';
  const internalIsRush = assumptions.isRush;

  // --- Config Object using IMPORTED values --- (Simplified config object)
  const config = {
    baseHourlyRate: ESTIMATE_CONFIG.BASE_HOURLY_RATE,
    contingencyBuffer: ESTIMATE_CONFIG.CONTINGENCY_BUFFER,
    rushFeeMultiplier: ESTIMATE_CONFIG.RUSH_FEE_MULTIPLIER,
    cypressHrsBase: BASE_EFFORT.CYPRESS_HRS_PER_FEATURE,
    playwrightHrsBase: BASE_EFFORT.PLAYWRIGHT_HRS_PER_FEATURE, // Keep for completeness
    jestHrsBase: BASE_EFFORT.JEST_HRS_PER_FEATURE,
    testRailHrsBase: BASE_EFFORT.TESTRAIL_HRS_PER_FEATURE,
    howToHrsPerDoc: BASE_EFFORT.HOWTO_HRS_PER_DOC,
    gwtHrsPerDoc: BASE_EFFORT.GWT_HRS_PER_DOC,
    accessibilityFactorT1: ESTIMATE_CONFIG.ACCESSIBILITY_FACTOR,
    performanceFactorT1: ESTIMATE_CONFIG.PERFORMANCE_FACTOR,
    soc2FactorT1: ESTIMATE_CONFIG.SOC2_FACTOR,
    minPrice: ESTIMATE_CONFIG.MIN_PRICE,
    // Removed rushHoursPerWeek - not used in this estimate calc
  };
  // --- End Config Object ---

  // --- Execute Calculations --- (Using values from config object)
  // (A) Hours Breakdown
  const result_cypressHours =
    numFeatures *
    config.cypressHrsBase *
    internalCypressCoverage *
    internalComplexity;
  const result_playwrightHours = 0;
  const result_jestHours =
    numFeatures *
    config.jestHrsBase *
    internalJestCoverage *
    internalComplexity;
  const result_testRailHours =
    numFeatures *
    config.testRailHrsBase *
    internalTestRailCoverage *
    internalComplexity;
  const result_howToHours = internalHowToCount * config.howToHrsPerDoc;
  const result_gwtHours = internalGwtCount * config.gwtHrsPerDoc;

  // (B) Specialized Hours
  const baseForSpecialized = result_cypressHours;
  let result_accessibilityHours = 0;
  if (internalIsAccessibilityT1) {
    result_accessibilityHours =
      baseForSpecialized * config.accessibilityFactorT1;
  }
  let result_performanceHours = 0;
  if (internalIsPerformanceT1) {
    result_performanceHours = baseForSpecialized * config.performanceFactorT1;
  }
  let result_soc2Hours = 0;
  if (internalIsSoc2T1) {
    result_soc2Hours = baseForSpecialized * config.soc2FactorT1;
  }

  // (C) Support Hours
  const result_supportPackageHours = 0;

  // (D) Hours Summary
  const result_totalBaseHours =
    result_cypressHours +
    result_playwrightHours +
    result_jestHours +
    result_testRailHours +
    result_howToHours +
    result_gwtHours +
    result_accessibilityHours +
    result_performanceHours +
    result_soc2Hours;
  const result_contingencyHours =
    result_totalBaseHours * config.contingencyBuffer;
  const result_finalHours =
    result_totalBaseHours +
    result_contingencyHours +
    result_supportPackageHours;

  // (E) Pricing
  const projectPriceInclContingency =
    (result_totalBaseHours + result_contingencyHours) * config.baseHourlyRate;
  const rushAdjustment = internalIsRush
    ? projectPriceInclContingency * config.rushFeeMultiplier
    : 0;
  const calculated_center_price = projectPriceInclContingency + rushAdjustment;

  // --- Calculate Raw Min/Max Ranges ---
  const rawPriceMin = Math.max(
    0,
    calculated_center_price * (1 - assumptions.estimateRangeFactor)
  );
  const rawPriceMax =
    calculated_center_price * (1 + assumptions.estimateRangeFactor);
  const rawHoursMin = Math.max(
    0,
    result_finalHours * (1 - assumptions.estimateRangeFactor)
  );
  const rawHoursMax = result_finalHours * (1 + assumptions.estimateRangeFactor);

  // --- Determine Final Displayed Range --- (Using config.minPrice)
  let finalPriceMinResult: number;
  let finalPriceMaxResult: number;
  let finalHoursMinResult = rawHoursMin;
  let finalHoursMaxResult = rawHoursMax;

  if (result_finalHours <= 0) {
    finalPriceMinResult = 0;
    finalPriceMaxResult = 0;
    finalHoursMinResult = 0;
    finalHoursMaxResult = 0;
  } else {
    finalPriceMinResult = Math.max(config.minPrice, rawPriceMin);
    finalPriceMaxResult = Math.max(finalPriceMinResult, rawPriceMax);
  }

  // --- Return Results and Updated Assumptions Payload --- (Match sendEmail action)
  // Calculate derived factors for payload
  const documentationFactorUsed =
    (result_howToHours + result_gwtHours) / (result_totalBaseHours || 1);
  const specializedFactorUsed =
    (result_accessibilityHours + result_performanceHours + result_soc2Hours) /
    (result_totalBaseHours || 1);

  return {
    results: {
      finalHoursMin: finalHoursMinResult,
      finalHoursMax: finalHoursMaxResult,
      finalPriceMin: finalPriceMinResult,
      finalPriceMax: finalPriceMaxResult,
    },
    assumptions: {
      // Payload structure for sendEstimateEmail
      baseHourlyRateUsed: config.baseHourlyRate,
      contingencyBufferUsed: config.contingencyBuffer,
      complexityFactorUsed: internalComplexity,
      documentationFactorUsed: isNaN(documentationFactorUsed)
        ? 0
        : documentationFactorUsed, // Handle NaN if base hours 0
      specializedFactorUsed: isNaN(specializedFactorUsed)
        ? 0
        : specializedFactorUsed, // Handle NaN if base hours 0
      rushFactorUsed: internalIsRush ? config.rushFeeMultiplier : 0,
      // Include other raw assumptions from the top `assumptions` object if needed by email templates
      // These are not strictly required by the sendEmail action payload type itself anymore
      // but might be useful context in the email body.
      // Example:
      // complexity: assumptions.complexity,
      // browsers: assumptions.browsers,
      // cypressCoveragePercent: assumptions.cypressCoverage * 100,
      // jestCoveragePercent: assumptions.jestCoverage * 100,
      // ... etc
    },
  };
};
// --- End Corrected Calculation Helper ---

export default function EstimatePage() {
  // --- State Management (From Section III) ---
  const [inputs, setInputs] = useState({
    projectName: '',
    numFeatures: '', // Store as string, parse later
    isE2E: false,
    isUnitIntegration: false,
    // Add other state fields later as needed
    needsDocsTestCaseManagement: false,
    needsDocsHowTo: false,
    needsAccessibility: false,
    needsPerformance: false,
    needsSoc2: false,
    isRush: false,
    notes: '',
    userName: '', // For email section
    userEmail: '', // For email section
  });
  // Add results state
  const [results, setResults] = useState({
    finalHoursMin: 0,
    finalHoursMax: 0,
    finalPriceMin: 0,
    finalPriceMax: 0,
  });
  const [isPending, startTransition] = useTransition(); // Add transition state
  const [showConfirmation, setShowConfirmation] = useState(false); // Add state for confirmation section

  // Setup refs for section views
  const { ref: introRef } = useSectionInView('Intro' as SectionName, 0.5);
  const { ref: scopeRef } = useSectionInView('Scope' as SectionName, 0.2); // Adjust threshold if needed
  const { ref: optionsRef } = useSectionInView('Options' as SectionName, 0.2);
  const { ref: timelineRef } = useSectionInView('Timeline' as SectionName, 0.3);
  const { ref: emailRef } = useSectionInView('Email' as SectionName, 0.5);
  // Confirmation section doesn't need tracking for nav

  // --- Input Handler (From Section III) ---
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    // Need explicit check for HTMLInputElement for 'checked' property
    const checkedValue = (e.target as HTMLInputElement).checked;

    setInputs((prev) => ({
      ...prev,
      [name]: isCheckbox ? checkedValue : value,
    }));
  };

  // --- Calculation Logic useEffect (Uses Helper) ---
  useEffect(() => {
    const details = calculateEstimateDetails(inputs);
    setResults(details.results);
  }, [inputs]);

  // --- Form Submission Handler (Uses Helper & Expanded Payload) ---
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(async () => {
      setShowConfirmation(false); // Reset confirmation

      // Calculate details again to ensure latest inputs/logic are used for email
      const details = calculateEstimateDetails(inputs);

      // --- Construct Expanded Payload for Server Action ---
      const payload = {
        // Customer Info
        userName: inputs.userName,
        userEmail: inputs.userEmail,

        // Customer Inputs
        customerInputs: {
          projectName: inputs.projectName,
          numFeatures: inputs.numFeatures,
          isE2E: inputs.isE2E,
          isUnitIntegration: inputs.isUnitIntegration,
          needsDocsTestCaseManagement: inputs.needsDocsTestCaseManagement,
          needsDocsHowTo: inputs.needsDocsHowTo,
          needsAccessibility: inputs.needsAccessibility,
          needsPerformance: inputs.needsPerformance,
          needsSoc2: inputs.needsSoc2,
          isRush: inputs.isRush,
          notes: inputs.notes,
        },

        // Estimate Provided
        estimateProvided: details.results,

        // Assumptions Made
        assumptionsMade: details.assumptions,
      };
      // --- End Expanded Payload ---

      try {
        const result = await sendEstimateEmail(payload);
        if (result.success) {
          setShowConfirmation(true);
          // Optionally clear fields
          // setInputs({ ...initialInputs });
        } else {
          console.error('Email send failed:', result.error);
          // Handle error - maybe show a message without toast
          // setErrorState(result.error || 'Failed to send estimate.');
        }
      } catch (error) {
        console.error('Error submitting estimate:', error);
        // setErrorState('An unexpected error occurred.');
      }
    });
  };

  return (
    // Apply main theme background - use white or light gray
    <main className="container mx-auto px-4 bg-gray-950 py-12">
      {/* Section 1: Introduction & Purpose - Light Theme */}
      <section
        ref={introRef}
        id="introduction"
        className="mb-16 text-center scroll-mt-28" // Increased margin
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
          Get a Quick Project Estimate
        </h1>
        <p className="text-lg text-gray-300 mb-3 max-w-3xl mx-auto">
          Answer a few questions to see a preliminary cost range for your test
          automation needs.
        </p>
        <p className="text-sm text-gray-400 italic">
          Note: This provides a preliminary estimate. A detailed consultation is
          recommended for a precise quote.
        </p>
      </section>

      {/* Section 2: Core Project Scope - Dark Theme */}
      <section
        ref={scopeRef}
        id="core-scope"
        // Apply dark theme styles, consistent padding
        className="mb-16 max-w-3xl mx-auto scroll-mt-28 bg-gray-900 text-gray-300 p-6 sm:p-8 rounded-lg shadow-lg border border-gray-700"
      >
        <h2 className="text-2xl font-semibold mb-6 text-white border-b border-gray-700 pb-3">
          Core Project Scope
        </h2>

        <div className="space-y-6">
          <InputField
            theme="dark" // Pass theme prop
            label="Project/Company Name (Optional)"
            name="projectName"
            type="text"
            placeholder="e.g., E-commerce Checkout Flow"
            value={inputs.projectName}
            onChange={handleInputChange}
          />
          <InputField
            theme="dark" // Pass theme prop
            label="Number of Key Features/Flows to Automate"
            name="numFeatures"
            type="number"
            placeholder="e.g., 5"
            required
            min="1"
            value={inputs.numFeatures}
            onChange={handleInputChange}
            description="Enter the primary user journeys or distinct features."
          />
          <div>
            <label className="text-lg font-medium text-gray-200 mb-3 block">
              Primary Automation Needs{' '}
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* SelectableCard should handle internal text color, check its implementation */}
              <SelectableCard
                label="E2E Testing"
                description="Simulating full user flows in browser."
                name="isE2E"
                checked={inputs.isE2E}
                onChange={handleInputChange}
              />
              <SelectableCard
                label="Unit/Integration Testing"
                description="Code-level function/component tests."
                name="isUnitIntegration"
                checked={inputs.isUnitIntegration}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Optional Services & Add-ons - Light Theme */}
      <section
        ref={optionsRef}
        id="add-ons"
        // Use a light background, consistent padding
        className="mb-16 max-w-3xl mx-auto scroll-mt-28 bg-gray-800 p-6 sm:p-8 rounded-lg shadow-md border border-gray-700"
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-200 border-b border-gray-600 pb-3">
          Optional Add-ons
        </h2>

        <div className="space-y-8">
          <div>
            <label className="text-lg font-medium text-gray-200 mb-3 block">
              Documentation Needs
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* SelectableCard - Assume it handles internal text colors */}
              <SelectableCard
                label="Test Case Management Setup"
                description="(e.g., TestRail, Xray)"
                name="needsDocsTestCaseManagement"
                checked={inputs.needsDocsTestCaseManagement}
                onChange={handleInputChange}
              />
              <SelectableCard
                label="How-To Guides / Team Docs"
                description="Clear guides for running tests."
                name="needsDocsHowTo"
                checked={inputs.needsDocsHowTo}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div>
            <label className="text-lg font-medium text-gray-200 mb-3 block">
              Specialized Testing Needs
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <SelectableCard
                label="Accessibility Testing"
                description="(WCAG Compliance)"
                name="needsAccessibility"
                checked={inputs.needsAccessibility}
                onChange={handleInputChange}
              />
              <SelectableCard
                label="Performance Testing"
                description="(Load/Stress)"
                name="needsPerformance"
                checked={inputs.needsPerformance}
                onChange={handleInputChange}
              />
              <SelectableCard
                label="SOC2 Preparation Support"
                description="Audit documentation."
                name="needsSoc2"
                checked={inputs.needsSoc2}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Timeline & Notes - Dark Theme */}
      <section
        ref={timelineRef}
        id="timeline-notes"
        // Apply dark theme styles, consistent padding
        className="mb-16 max-w-3xl mx-auto scroll-mt-28 bg-gray-900 text-gray-300 p-6 sm:p-8 rounded-lg shadow-lg border border-gray-700"
      >
        <h2 className="text-2xl font-semibold mb-6 text-white border-b border-gray-700 pb-3">
          Timeline & Notes
        </h2>
        <div className="space-y-6">
          <div>
            <label className="text-lg font-medium text-gray-200 mb-3 block">
              Project Timeline
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-sm">
              <SelectableCard
                label="Rush Project?"
                description="Requires faster turnaround."
                name="isRush"
                checked={inputs.isRush}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <TextAreaField
            theme="dark" // Pass theme prop
            label="Additional Notes (Optional)"
            name="notes"
            placeholder="Any specific requirements, questions, or details?"
            value={inputs.notes}
            onChange={handleInputChange}
            rows={4}
          />
        </div>
      </section>

      {/* Section: Estimate Display - Light Theme (Keep white bg) */}
      <section
        id="estimate-display"
        // Make margin consistent, keep white bg
        className="mb-16 max-w-3xl mx-auto scroll-mt-28 bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center text-white">
          Preliminary Estimate Range
        </h2>
        <div className="text-center">
          <p className="text-lg font-medium text-gray-300">
            {Math.round(results.finalHoursMin)} -{' '}
            {Math.round(results.finalHoursMax)} Hours
          </p>
          <p className="text-3xl font-bold text-blue-400 mt-1 mb-3">
            ${results.finalPriceMin.toLocaleString()} - $
            {results.finalPriceMax.toLocaleString()}
          </p>
          <p className="text-sm text-gray-400 italic">
            Based on selections. Final quote requires consultation. <br />{' '}
            Flexible payment options may be available.
          </p>
        </div>
      </section>

      {/* Section 6: Email Estimate & CTA - Light Theme (Keep light gray bg) */}
      {!showConfirmation && (
        <section
          ref={emailRef}
          id="email-estimate"
          // Make margin consistent
          className="mb-16 max-w-3xl mx-auto scroll-mt-28"
        >
          <h2 className="text-2xl font-semibold mb-6 text-gray-200 border-b border-gray-600 pb-3">
            Receive Your Estimate and We&apos;ll Follow Up!
          </h2>
          <form onSubmit={handleSubmit}>
            {/* Use slightly lighter gray or keep white for form area */}
            <div className="space-y-6 bg-gray-800 p-6 sm:p-8 rounded-lg  shadow-md border border-gray-700">
              <InputField
                theme="dark"
                label="Your Name*"
                name="userName"
                type="text"
                required
                placeholder="Your Name"
                value={inputs.userName}
                onChange={handleInputChange}
              />
              <InputField
                theme="dark"
                label="Your Email*"
                name="userEmail"
                type="email"
                required
                placeholder="your.email@example.com"
                value={inputs.userEmail}
                onChange={handleInputChange}
              />
              <button
                type="submit"
                // Match primary button style from HomePage
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-md shadow-md transition duration-150 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800"
                disabled={isPending || !inputs.userEmail}
              >
                {isPending ? 'Sending...' : 'Email This Estimate & Follow Up'}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Section 7: Confirmation / Next Steps */}
      {showConfirmation && (
        <section
          id="confirmation"
          // Make margin consistent
          className="mb-16 max-w-3xl mx-auto text-center  bg-green-900 border-green-700 p-8 rounded-lg shadow-md border  scroll-mt-28"
        >
          <h2 className="text-2xl font-semibold  text-green-200 mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 inline-block mr-2  text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Estimate Sent!
          </h2>
          <p className="text-lg text-gray-300 mb-6">
            Check your inbox for the detailed estimate. We&apos;ll follow up
            soon!
          </p>
          <h3 className="text-xl font-semibold text-gray-100 mb-4">
            Ready to Discuss Details?
          </h3>
          {/* Match primary button style */}
          <a
            href="/path-to-your-booking-page" // UPDATE THIS LINK
            className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 text-lg font-semibold shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-green-900"
          >
            Schedule Your Free Consultation Now
          </a>
        </section>
      )}
    </main>
  );
}
