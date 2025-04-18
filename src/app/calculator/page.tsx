'use client'; // This page will involve client-side logic for auth checking

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import router for redirection
import { sendCalculatorQuoteToOwner } from '@/actions/sendEmail'; // Import the new action
import { CALCULATOR_INITIAL_STATE } from '@/config/pricingConfig'; // Import the initial state

// --- Helper Components ---

// Helper Component: Display Field (Stacking on mobile, optional side-by-side on sm+)
const DisplayField = ({
  label,
  value,
  description,
  isTotal = false, // Flag for emphasizing total rows
}: {
  label: string;
  value: string | number;
  description?: string;
  isTotal?: boolean;
}) => (
  // Removed alternating background from component root
  <div
    className={`px-3 py-2 ${
      isTotal ? 'font-semibold text-green-800 bg-green-100' : '' // Adjusted total color
    }`}
  >
    {/* Stacks by default, row on sm+ */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <span
        className={`text-sm ${isTotal ? 'text-green-900' : 'text-gray-700'} font-medium mb-1 sm:mb-0 sm:w-3/5 break-words`}
      >
        {label}
      </span>
      <span
        className={`text-sm ${isTotal ? 'text-green-900' : 'text-gray-900'} sm:text-right sm:w-2/5 break-words`}
      >
        {value}
      </span>
    </div>
    {description && !isTotal && (
      <p className="text-xs text-gray-500 mt-1 italic">{description}</p>
    )}
    {description && isTotal && (
      <p className="text-xs text-green-600 mt-1 italic">{description}</p> // Adjusted total color
    )}
  </div>
);

// Helper Component: Input Field (Stacking Layout Only)
const InputField = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  description,
  required = true,
}: {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  description?: string;
  required?: boolean;
}) => (
  // Use px-3 py-3 for consistent spacing like YesNoCheckboxField
  <div className="px-3 py-3">
    <label
      htmlFor={name}
      className="text-sm font-medium text-gray-700 block mb-1"
    >
      {label}
    </label>
    {description && (
      <p className="text-xs text-gray-500 mb-1.5 italic">({description})</p>
    )}
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
    />
  </div>
);

// Helper Component: Yes/No Checkbox (Label left, checkbox right)
const YesNoCheckboxField = ({
  label,
  name,
  checked,
  onChange,
  description,
}: {
  label: string;
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  description?: string;
}) => (
  // Use px-3 py-3 for consistent spacing like InputField
  <div className="px-3 py-3 flex justify-between items-center gap-4">
    <div>
      <label htmlFor={name} className="text-sm font-medium text-gray-700 block">
        {label}
      </label>
      {description && (
        <p className="text-xs text-gray-500 mt-1 italic">({description})</p>
      )}
    </div>
    <input
      type="checkbox"
      id={name}
      name={name}
      checked={checked}
      onChange={onChange}
      className="form-checkbox h-5 w-5 text-blue-600 shrink-0 ml-4"
    />
  </div>
);

// --- Main Calculator Component ---
export default function CalculatorPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // --- Authentication Handlers ---
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/check-auth');
        if (!response.ok) {
          console.error('Auth check failed with status:', response.status);
          setIsAuthenticated(false);
          return;
        }
        const data = await response.json();
        setIsAuthenticated(data.isAuthenticated);
      } catch (err) {
        console.error('Error checking authentication:', err);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        let errorMessage = 'Login failed. Please check credentials.';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch /* _jsonError */ {
          console.warn('Could not parse error response from login API.');
        }
        throw new Error(errorMessage);
      }
      setIsAuthenticated(true);
    } catch (err: unknown) {
      console.error('Login error:', err);
      let displayError = 'An error occurred during login.';
      if (err instanceof Error) {
        displayError = err.message;
      }
      setError(displayError);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
    } catch (err) {
      console.error('Error during logout API call:', err);
    }
    setIsAuthenticated(false);
    router.push('/');
  };

  // --- Use IMPORTED Initial State ---
  const [inputs, setInputs] = useState(CALCULATOR_INITIAL_STATE);

  // --- Results State (No changes needed here) ---
  const [results, setResults] = useState({
    cypressHours: 0,
    playwrightHours: 0,
    jestHours: 0,
    testRailHours: 0,
    howToHours: 0,
    gwtHours: 0,
    accessibilityHours: 0,
    performanceHours: 0,
    soc2Hours: 0,
    accessibilityPrice: 0,
    performancePrice: 0,
    soc2Price: 0,
    totalBaseHours: 0,
    contingencyHours: 0,
    supportPackageHours: 0,
    finalHours: 0,
    basePrice: 0,
    rushAdjustment: 0,
    supportPackagePrice: 0,
    finalPrice: 0,
    estimatedWeeks: 0,
    estimatedMonths: 0,
    estimatedYears: 0,
  });

  // --- NEW: State for Notes and Submission Status (Ensure this is defined here) ---
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  // --- NEW: State for confirmation message visibility ---
  const [showOwnerEmailConfirmation, setShowOwnerEmailConfirmation] =
    useState(false);

  // --- Input Handlers ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // --- Helper Function for Formatting Currency ---
  const formatCurrency = (value: number): string => {
    // Ensure finite number before formatting
    if (!Number.isFinite(value)) {
      return (0).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      });
    }
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };

  // --- Revised Parsing Helpers (From User Prompt) ---
  const parseCurrency = (value: string | number): number => {
    if (typeof value === 'number') return value;
    // Remove commas and the $ sign, then parse. Default to 0 if invalid.
    return parseFloat(String(value).replace(/[$,]/g, '')) || 0;
  };

  const parsePercent = (value: string | number): number => {
    // Remove % sign if present, then parse and divide by 100. Default to 0.
    return (parseFloat(String(value).replace(/%/g, '')) || 0) / 100;
  };

  const parseIntStrict = (value: string | number): number => {
    return parseInt(String(value)) || 0;
  };

  const parseFloatStrict = (value: string | number): number => {
    return parseFloat(String(value)) || 0;
  };

  // --- REVISED Calculation Logic (Using Field Names and Corrected Specialized Base) ---
  useEffect(() => {
    // --- 1. Parse ALL Inputs from `inputs` State ---
    // (Using helper functions: parseCurrency, parsePercent, parseIntStrict, parseFloatStrict)
    const baseHourlyRate = parseCurrency(inputs.baseHourlyRate); // B2
    const hoursPerWeek = parseIntStrict(inputs.hoursPerWeek); // B3
    const rushHoursPerWeek = parseIntStrict(inputs.rushHoursPerWeek); // <<< PARSE new input
    const minPrice = parseCurrency(inputs.minPrice); // B4
    const contingencyBuffer = parseFloatStrict(inputs.contingencyBuffer); // B5
    const rushFeeMultiplier = parseFloatStrict(inputs.rushFeeMultiplier); // B6
    const accessibilityFactorT1 = parseFloatStrict(
      inputs.accessibilityFactorT1
    ); // B13
    const accessibilityFactorT2 = parseFloatStrict(
      inputs.accessibilityFactorT2
    ); // B14
    const performanceFactorT1 = parseFloatStrict(inputs.performanceFactorT1); // B15
    const performanceFactorT2 = parseFloatStrict(inputs.performanceFactorT2); // B16
    const soc2FactorT1 = parseFloatStrict(inputs.soc2FactorT1); // B17
    const soc2FactorT2 = parseFloatStrict(inputs.soc2FactorT2); // B18
    const supportHoursT1 = parseIntStrict(inputs.supportHoursT1); // I4
    const supportHoursT2 = parseIntStrict(inputs.supportHoursT2); // I17
    const supportHoursT3 = parseIntStrict(inputs.supportHoursT3); // I30
    const supportRateAdjT1 = parseFloatStrict(inputs.supportRateAdjT1); // I12
    const supportRateAdjT2 = parseFloatStrict(inputs.supportRateAdjT2); // I25
    const supportRateAdjT3 = parseFloatStrict(inputs.supportRateAdjT3); // I39
    const numFeatures = parseIntStrict(inputs.numFeatures); // B22
    const complexity = parseFloatStrict(inputs.complexity); // B23
    const browsers = parseIntStrict(inputs.browsers); // B24
    // const cypressCov = parsePercent(inputs.cypressCoverage); // B25 - Unused
    // const playwrightCov = parsePercent(inputs.playwrightCoverage); // B26 - Unused
    // const jestCov = parsePercent(inputs.jestCoverage); // B27 - Unused
    // const testRailCov = parsePercent(inputs.testRailCoverage); // B28 - Unused
    // const howToCount = parseIntStrict(inputs.howToDocsCount); // B29 - Unused
    // const gwtCount = parseIntStrict(inputs.gwtDocsCount); // B30 - Unused
    // Boolean flags accessed directly via inputs.is*

    // --- (A) Calculated Hours Breakdown ---
    const result_cypressHours =
      parseFloatStrict(inputs.numFeatures) *
      parseFloatStrict(inputs.cypressHrsBase) *
      parsePercent(inputs.cypressCoverage) *
      parseFloatStrict(inputs.complexity); // B49
    const result_playwrightHours =
      parseFloatStrict(inputs.numFeatures) *
      parseFloatStrict(inputs.playwrightHrsBase) *
      parsePercent(inputs.playwrightCoverage) *
      parseFloatStrict(inputs.complexity) *
      parseIntStrict(inputs.browsers); // B50
    const result_jestHours =
      parseFloatStrict(inputs.numFeatures) *
      parseFloatStrict(inputs.jestHrsBase) *
      parsePercent(inputs.jestCoverage) *
      parseFloatStrict(inputs.complexity); // B51
    const result_testRailHours =
      parseFloatStrict(inputs.numFeatures) *
      parseFloatStrict(inputs.testRailHrsBase) *
      parsePercent(inputs.testRailCoverage) *
      parseFloatStrict(inputs.complexity); // B52
    const result_howToHours =
      parseIntStrict(inputs.howToDocsCount) *
      parseFloatStrict(inputs.howToHrsPerDoc); // B53
    const result_gwtHours =
      parseIntStrict(inputs.gwtDocsCount) *
      parseFloatStrict(inputs.gwtHrsPerDoc); // B54

    // --- (B) Specialized Estimations (Hours & Price) ---
    const baseForSpecialized = numFeatures * complexity * browsers;

    let calculatedAccessibilityHours = 0;
    // Use separate IFs for accumulation
    if (inputs.isAccessibilityT1) {
      calculatedAccessibilityHours +=
        baseForSpecialized * accessibilityFactorT1;
    }
    if (inputs.isAccessibilityT2) {
      calculatedAccessibilityHours +=
        baseForSpecialized * accessibilityFactorT2;
    }
    const result_accessibilityHours = calculatedAccessibilityHours;
    const result_accessibilityPrice =
      result_accessibilityHours * baseHourlyRate;

    let calculatedPerformanceHours = 0;
    // Use separate IFs for accumulation
    if (inputs.isPerformanceT1) {
      calculatedPerformanceHours += baseForSpecialized * performanceFactorT1;
    }
    if (inputs.isPerformanceT2) {
      calculatedPerformanceHours += baseForSpecialized * performanceFactorT2;
    }
    const result_performanceHours = calculatedPerformanceHours;
    const result_performancePrice = result_performanceHours * baseHourlyRate;

    let calculatedSoc2Hours = 0;
    // Use separate IFs for accumulation
    if (inputs.isSoc2T1) {
      calculatedSoc2Hours += baseForSpecialized * soc2FactorT1;
    }
    if (inputs.isSoc2T2) {
      calculatedSoc2Hours += baseForSpecialized * soc2FactorT2;
    }
    const result_soc2Hours = calculatedSoc2Hours;
    const result_soc2Price = result_soc2Hours * baseHourlyRate;

    // --- (C) Support Package Calculation ---
    // Pre-calculate price for each tier based on its hours and rate adj
    const calculatedSupportPriceT1 =
      baseHourlyRate * supportHoursT1 * supportRateAdjT1;
    const calculatedSupportPriceT2 =
      baseHourlyRate * supportHoursT2 * supportRateAdjT2;
    const calculatedSupportPriceT3 =
      baseHourlyRate * supportHoursT3 * supportRateAdjT3;

    let calculatedSupportPackageHours = 0;
    let calculatedSupportPackagePrice = 0;
    // Use separate IFs for accumulation
    if (inputs.isSupportT1) {
      calculatedSupportPackageHours += supportHoursT1;
      calculatedSupportPackagePrice += calculatedSupportPriceT1;
    }
    if (inputs.isSupportT2) {
      calculatedSupportPackageHours += supportHoursT2;
      calculatedSupportPackagePrice += calculatedSupportPriceT2;
    }
    if (inputs.isSupportT3) {
      calculatedSupportPackageHours += supportHoursT3;
      calculatedSupportPackagePrice += calculatedSupportPriceT3;
    }
    const result_supportPackageHours = calculatedSupportPackageHours;
    const result_supportPackagePrice = calculatedSupportPackagePrice;

    // --- (D) Hours Summary ---
    const result_totalBaseHours =
      result_cypressHours +
      result_playwrightHours +
      result_jestHours +
      result_testRailHours +
      result_howToHours +
      result_gwtHours +
      result_accessibilityHours +
      result_performanceHours +
      result_soc2Hours; // B65
    const result_contingencyHours = result_totalBaseHours * contingencyBuffer; // B66
    const result_finalHours =
      result_totalBaseHours +
      result_contingencyHours +
      result_supportPackageHours; // B68

    // --- (E) Pricing Summary ---
    // WARNING: Using B68 (result_finalHours) as base, per strict sheet formula B71
    const result_basePrice = Math.max(
      result_finalHours * baseHourlyRate,
      minPrice
    ); // B71
    const result_rushAdjustment = inputs.isRush
      ? result_basePrice * rushFeeMultiplier
      : 0; // B72
    const result_finalPrice =
      result_basePrice + result_rushAdjustment + result_supportPackagePrice; // B74

    // --- (F) Duration Estimation ---
    const effectiveHoursPerWeek = inputs.isRush
      ? rushHoursPerWeek
      : hoursPerWeek;

    const result_estimatedWeeks =
      effectiveHoursPerWeek > 0 ? result_finalHours / effectiveHoursPerWeek : 0; // B77 - Use effective rate
    const result_estimatedMonths =
      Math.ceil((result_estimatedWeeks / 4) * 10) / 10; // B78
    const result_estimatedYears =
      Math.ceil((result_estimatedMonths / 12) * 10) / 10; // B79

    // --- Final Step: Update Results State ---
    setResults({
      cypressHours: result_cypressHours,
      playwrightHours: result_playwrightHours,
      jestHours: result_jestHours,
      testRailHours: result_testRailHours,
      howToHours: result_howToHours,
      gwtHours: result_gwtHours,
      accessibilityHours: result_accessibilityHours,
      performanceHours: result_performanceHours,
      soc2Hours: result_soc2Hours,
      accessibilityPrice: result_accessibilityPrice,
      performancePrice: result_performancePrice,
      soc2Price: result_soc2Price,
      totalBaseHours: result_totalBaseHours,
      contingencyHours: result_contingencyHours,
      finalHours: result_finalHours,
      supportPackageHours: result_supportPackageHours,
      supportPackagePrice: result_supportPackagePrice,
      basePrice: result_basePrice,
      rushAdjustment: result_rushAdjustment,
      finalPrice: result_finalPrice,
      estimatedWeeks: result_estimatedWeeks,
      estimatedMonths: result_estimatedMonths,
      estimatedYears: result_estimatedYears,
    });
  }, [inputs]); // Dependency array remains the same

  // --- Handler for Sending Quote to Owner (Modified) ---
  const handleSendToOwner = async () => {
    setIsSubmitting(true);
    setShowOwnerEmailConfirmation(false);

    try {
      // --- Construct Expanded Payload ---
      const payload = {
        // Project Identification
        projectName: inputs.projectName,

        // Key Inputs
        baseHourlyRateInput: parseFloat(inputs.baseHourlyRate) || 0,
        hoursPerWeekInput: parseInt(inputs.hoursPerWeek, 10) || 0,
        numFeaturesInput: parseInt(inputs.numFeatures, 10) || 0,
        complexityInput: parseFloat(inputs.complexity) || 0,
        browsersInput: parseInt(inputs.browsers, 10) || 0,
        cypressCoverageInput: parseFloat(inputs.cypressCoverage) || 0,
        playwrightCoverageInput: parseFloat(inputs.playwrightCoverage) || 0,
        jestCoverageInput: parseFloat(inputs.jestCoverage) || 0,
        testRailCoverageInput: parseFloat(inputs.testRailCoverage) || 0,
        howToDocsCountInput: parseInt(inputs.howToDocsCount, 10) || 0,
        gwtDocsCountInput: parseInt(inputs.gwtDocsCount, 10) || 0,

        // Selections (Booleans)
        isAccessibilityT1: inputs.isAccessibilityT1,
        isAccessibilityT2: inputs.isAccessibilityT2,
        isPerformanceT1: inputs.isPerformanceT1,
        isPerformanceT2: inputs.isPerformanceT2,
        isSoc2T1: inputs.isSoc2T1,
        isSoc2T2: inputs.isSoc2T2,
        isSupportT1: inputs.isSupportT1,
        isSupportT2: inputs.isSupportT2,
        isSupportT3: inputs.isSupportT3,
        isRush: inputs.isRush,

        // Calculated Results - Summaries
        finalPrice: results.finalPrice,
        finalHours: results.finalHours,
        estimatedWeeks: results.estimatedWeeks,
        estimatedMonths: results.estimatedMonths,
        // Effective Rate Calculation (handle division by zero)
        effectiveRate:
          results.finalHours > 0 ? results.finalPrice / results.finalHours : 0,

        // Calculated Results - Cost Breakdown
        basePrice: results.basePrice,
        accessibilityPrice: results.accessibilityPrice,
        performancePrice: results.performancePrice,
        soc2Price: results.soc2Price,
        supportPackagePrice: results.supportPackagePrice,
        rushAdjustment: results.rushAdjustment,

        // Calculated Results - Hours Breakdown
        cypressHours: results.cypressHours,
        playwrightHours: results.playwrightHours,
        jestHours: results.jestHours,
        testRailHours: results.testRailHours,
        howToHours: results.howToHours,
        gwtHours: results.gwtHours,
        accessibilityHours: results.accessibilityHours,
        performanceHours: results.performanceHours,
        soc2Hours: results.soc2Hours,
        totalBaseHours: results.totalBaseHours,
        contingencyHours: results.contingencyHours,
        supportPackageHours: results.supportPackageHours,

        // Configuration Used (Optional but helpful)
        contingencyBufferUsed: parseFloat(inputs.contingencyBuffer) || 0,
        rushFeeMultiplierUsed: parseFloat(inputs.rushFeeMultiplier) || 0,

        // Notes
        notes: notes,
      };
      // --- End Expanded Payload ---

      // Validation (Using finalPrice as a simple check)
      if (payload.finalPrice <= 0 || !Number.isFinite(payload.finalPrice)) {
        console.error(
          "Calculation hasn't completed or resulted in zero/invalid price. Cannot send email."
        );
        setIsSubmitting(false);
        return;
      }

      // Call Server Action with the new payload structure
      const result = await sendCalculatorQuoteToOwner(payload);

      if (result.success) {
        setShowOwnerEmailConfirmation(true);
      } else {
        console.error('Failed to send email:', result.error);
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'An unknown error occurred.';
      console.error('Error sending calculator quote:', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Render Logic ---
  if (isAuthenticated === null) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p>Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <main className="w-full max-w-[50rem] py-8 sm:py-12 px-0 sm:px-4">
        {/* === In-Page Navigation (Moved Here) === */}
        {isAuthenticated && (
          <nav className="sticky top-0 z-10 bg-white shadow-sm p-2 mb-14 rounded-md border border-gray-200 mx-2 sm:mx-0">
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-4 text-md font-medium">
              <li>
                <a
                  href="#config-params"
                  className="text-blue-600 hover:underline"
                >
                  Config
                </a>
              </li>
              <li>
                <a
                  href="#project-scope"
                  className="text-blue-600 hover:underline"
                >
                  Scope
                </a>
              </li>
              <li>
                <a
                  href="#specialized-estimations"
                  className="text-blue-600 hover:underline"
                >
                  Specialized
                </a>
              </li>
              <li>
                <a
                  href="#hours-breakdown"
                  className="text-blue-600 hover:underline"
                >
                  Hours Breakdown
                </a>
              </li>
              <li>
                <a
                  href="#support-package"
                  className="text-blue-600 hover:underline"
                >
                  Support
                </a>
              </li>
              <li>
                <a
                  href="#hours-summary"
                  className="text-blue-600 hover:underline"
                >
                  Hours Summary
                </a>
              </li>
              <li>
                <a
                  href="#pricing-summary"
                  className="text-blue-600 hover:underline"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#duration-estimation"
                  className="text-blue-600 hover:underline"
                >
                  Duration
                </a>
              </li>
            </ul>
          </nav>
        )}

        {/* Header Section */}
        <div className="flex justify-between items-center mb-6 px-4 sm:px-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Service Estimation
          </h1>
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md text-sm focus:outline-none focus:shadow-outline"
            >
              Logout
            </button>
          )}
        </div>

        {!isAuthenticated ? (
          <div
            id="login-form"
            className="bg-white p-6 rounded-lg shadow mx-2 sm:mx-0"
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Login Required
            </h2>
            <form id="auth-form" onSubmit={handleLogin} className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username:
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 text-gray-900"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password:
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 text-gray-900"
                  disabled={isLoading}
                />
              </div>
              {error && (
                <p id="login-error" className="text-red-600 text-sm">
                  {error}
                </p>
              )}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>
        ) : (
          <div id="calculator-app" className="space-y-6 sm:space-y-8">
            {/* === Configuration Parameters Section === */}
            <div id="config-params" className="h-16"></div>{' '}
            {/* Placeholder Div */}
            <section className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden mx-2 sm:mx-0">
              <h2 className="text-lg sm:text-xl font-semibold p-4 border-b bg-gray-50 text-gray-800">
                Configuration Parameters
              </h2>
              <div className="divide-y divide-gray-200">
                {/* Yellow Group */}
                <div className="bg-green-50">
                  <InputField
                    label="Base Hourly Rate"
                    name="baseHourlyRate"
                    value={inputs.baseHourlyRate}
                    onChange={handleInputChange}
                    type="text"
                    description="Standard hourly rate ($)"
                  />
                </div>
                <div className="bg-green-50">
                  <InputField
                    label="Hours per Week"
                    name="hoursPerWeek"
                    value={inputs.hoursPerWeek}
                    onChange={handleInputChange}
                    type="text"
                    description="Avg hrs/week for duration calc"
                  />
                </div>
                <div className="bg-green-50">
                  <InputField
                    label="Rush Hours per Week"
                    name="rushHoursPerWeek"
                    value={inputs.rushHoursPerWeek}
                    onChange={handleInputChange}
                    type="text"
                    description="Accelerated velocity if Rush=yes."
                  />
                </div>
                <div className="bg-green-50">
                  <InputField
                    label="Minimum Price"
                    name="minPrice"
                    value={inputs.minPrice}
                    onChange={handleInputChange}
                    type="text"
                    description="Minimum total project price ($)"
                  />
                </div>
                <div className="bg-yellow-50">
                  <InputField
                    label="Contingency Buffer %"
                    name="contingencyBuffer"
                    value={inputs.contingencyBuffer}
                    onChange={handleInputChange}
                    type="text"
                    description="Decimal buffer (e.g., 0.15 for 15%)"
                  />
                </div>
                <div className="bg-yellow-50">
                  <InputField
                    label="Rush Fee Multiplier %"
                    name="rushFeeMultiplier"
                    value={inputs.rushFeeMultiplier}
                    onChange={handleInputChange}
                    type="text"
                    description="Decimal fee (e.g., 0.2 for 20%)"
                  />
                </div>
                <div className="bg-yellow-200">
                  <InputField
                    label="Cypress Hrs/Feature (Base)"
                    name="cypressHrsBase"
                    value={inputs.cypressHrsBase}
                    onChange={handleInputChange}
                    type="text"
                    description="Base E2E hrs/feature"
                  />
                </div>
                <div className="bg-yellow-200">
                  <InputField
                    label="Playwright Hrs/Feature (Base)"
                    name="playwrightHrsBase"
                    value={inputs.playwrightHrsBase}
                    onChange={handleInputChange}
                    type="text"
                    description="Base cross-browser hrs/feature"
                  />
                </div>
                <div className="bg-yellow-200">
                  <InputField
                    label="Jest/Vitest Hrs/Feature (Base)"
                    name="jestHrsBase"
                    value={inputs.jestHrsBase}
                    onChange={handleInputChange}
                    type="text"
                    description="Base unit/int hrs/feature"
                  />
                </div>
                <div className="bg-yellow-200">
                  <InputField
                    label="TestRail Hrs/Feature (Base)"
                    name="testRailHrsBase"
                    value={inputs.testRailHrsBase}
                    onChange={handleInputChange}
                    type="text"
                    description="Base test case hrs/feature"
                  />
                </div>
                <div className="bg-yellow-200">
                  <InputField
                    label="How-To Hrs/Doc"
                    name="howToHrsPerDoc"
                    value={inputs.howToHrsPerDoc}
                    onChange={handleInputChange}
                    type="text"
                    description="Avg hrs/how-to guide"
                  />
                </div>
                <div className="bg-yellow-200">
                  <InputField
                    label="GWT Hrs/Doc"
                    name="gwtHrsPerDoc"
                    value={inputs.gwtHrsPerDoc}
                    onChange={handleInputChange}
                    type="text"
                    description="Avg hrs/Gherkin file"
                  />
                </div>
                {/* Blue Group */}
                <div className="bg-blue-50">
                  <InputField
                    label="Accessibility Factor T1"
                    name="accessibilityFactorT1"
                    value={inputs.accessibilityFactorT1}
                    onChange={handleInputChange}
                    type="text"
                    description="Multiplier vs Base Calc"
                  />
                </div>
                <div className="bg-blue-50">
                  <InputField
                    label="Accessibility Factor T2"
                    name="accessibilityFactorT2"
                    value={inputs.accessibilityFactorT2}
                    onChange={handleInputChange}
                    type="text"
                    description="Multiplier vs Base Calc"
                  />
                </div>
                <div className="bg-blue-50">
                  <InputField
                    label="Performance Factor T1"
                    name="performanceFactorT1"
                    value={inputs.performanceFactorT1}
                    onChange={handleInputChange}
                    type="text"
                    description="Multiplier vs Base Calc"
                  />
                </div>
                <div className="bg-blue-50">
                  <InputField
                    label="Performance Factor T2"
                    name="performanceFactorT2"
                    value={inputs.performanceFactorT2}
                    onChange={handleInputChange}
                    type="text"
                    description="Multiplier vs Base Calc"
                  />
                </div>
                <div className="bg-blue-50">
                  <InputField
                    label="SOC2 Factor T1"
                    name="soc2FactorT1"
                    value={inputs.soc2FactorT1}
                    onChange={handleInputChange}
                    type="text"
                    description="Multiplier vs Base Calc"
                  />
                </div>
                <div className="bg-blue-50">
                  <InputField
                    label="SOC2 Factor T2"
                    name="soc2FactorT2"
                    value={inputs.soc2FactorT2}
                    onChange={handleInputChange}
                    type="text"
                    description="Multiplier vs Base Calc"
                  />
                </div>
                {/* Green Group */}
                <div className="bg-yellow-50">
                  <InputField
                    label="Support T1 Hours"
                    name="supportHoursT1"
                    value={inputs.supportHoursT1}
                    onChange={handleInputChange}
                    type="text"
                    description="Included hours/month for Tier 1"
                  />
                </div>
                <div className="bg-yellow-50">
                  <InputField
                    label="Support T1 Rate Adj."
                    name="supportRateAdjT1"
                    value={inputs.supportRateAdjT1}
                    onChange={handleInputChange}
                    type="text"
                    description="Multiplier for Tier 1 effective rate (e.g., 1.2)"
                  />
                </div>
                <div className="bg-green-100">
                  <InputField
                    label="Support T2 Hours"
                    name="supportHoursT2"
                    value={inputs.supportHoursT2}
                    onChange={handleInputChange}
                    type="text"
                    description="Total included hours for Tier 2 (3 months)"
                  />
                </div>
                <div className="bg-green-100">
                  <InputField
                    label="Support T2 Rate Adj."
                    name="supportRateAdjT2"
                    value={inputs.supportRateAdjT2}
                    onChange={handleInputChange}
                    type="text"
                    description="Multiplier for Tier 2 effective rate (e.g., 0.85)"
                  />
                </div>
                <div className="bg-blue-100">
                  <InputField
                    label="Support T3 Hours"
                    name="supportHoursT3"
                    value={inputs.supportHoursT3}
                    onChange={handleInputChange}
                    type="text"
                    description="Total included hours for Tier 3 (6 months)"
                  />
                </div>
                <div className="bg-blue-100">
                  <InputField
                    label="Support T3 Rate Adj."
                    name="supportRateAdjT3"
                    value={inputs.supportRateAdjT3}
                    onChange={handleInputChange}
                    type="text"
                    description="Multiplier for Tier 3 effective rate (e.g., 0.85)"
                  />
                </div>
              </div>
            </section>
            {/* === Project Scope & Inputs Section === */}
            <div id="project-scope" className="h-16"></div>{' '}
            {/* Placeholder Div */}
            <section className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden mx-2 sm:mx-0">
              <h2 className="text-lg sm:text-xl font-semibold p-4 border-b bg-gray-50 text-gray-800">
                Project Scope & Inputs
              </h2>
              <div className="divide-y divide-gray-200">
                {/* Yellow Group */}
                <div className="bg-yellow-50">
                  <InputField
                    label="Project Name"
                    name="projectName"
                    value={inputs.projectName}
                    onChange={handleInputChange}
                    type="text"
                    description="Identifier for the quote"
                  />
                </div>
                <div className="bg-yellow-50">
                  <InputField
                    label="Number of Features"
                    name="numFeatures"
                    value={inputs.numFeatures}
                    onChange={handleInputChange}
                    type="text"
                    description="Count of features/epics"
                  />
                </div>
                <div className="bg-yellow-50">
                  <InputField
                    label="Complexity Multiplier"
                    name="complexity"
                    value={inputs.complexity}
                    onChange={handleInputChange}
                    type="text"
                    description="e.g., 1=Simple, 1.5=Moderate, 2=Complex"
                  />
                </div>
                <div className="bg-yellow-50">
                  <InputField
                    label="Browsers/Devices"
                    name="browsers"
                    value={inputs.browsers}
                    onChange={handleInputChange}
                    type="text"
                    description="Number of target browsers/devices for Playwright"
                  />
                </div>
                <div className="bg-yellow-50">
                  <InputField
                    label="Cypress Coverage %"
                    name="cypressCoverage"
                    value={inputs.cypressCoverage}
                    onChange={handleInputChange}
                    type="text"
                    description="Target E2E coverage % (e.g., 75)"
                  />
                </div>
                <div className="bg-yellow-50">
                  <InputField
                    label="Playwright Coverage %"
                    name="playwrightCoverage"
                    value={inputs.playwrightCoverage}
                    onChange={handleInputChange}
                    type="text"
                    description="Target cross-browser coverage % (e.g., 50)"
                  />
                </div>
                <div className="bg-yellow-50">
                  <InputField
                    label="Jest/Vitest Coverage %"
                    name="jestCoverage"
                    value={inputs.jestCoverage}
                    onChange={handleInputChange}
                    type="text"
                    description="Target unit/integration coverage % (e.g., 90)"
                  />
                </div>
                <div className="bg-yellow-50">
                  <InputField
                    label="TestRail Coverage %"
                    name="testRailCoverage"
                    value={inputs.testRailCoverage}
                    onChange={handleInputChange}
                    type="text"
                    description="Target test case documentation % (e.g., 90)"
                  />
                </div>
                <div className="bg-yellow-50">
                  <InputField
                    label="How-To Docs (count)"
                    name="howToDocsCount"
                    value={inputs.howToDocsCount}
                    onChange={handleInputChange}
                    type="text"
                    description="Number of How-To guides"
                  />
                </div>
                <div className="bg-yellow-50">
                  <InputField
                    label="GWT Docs (count)"
                    name="gwtDocsCount"
                    value={inputs.gwtDocsCount}
                    onChange={handleInputChange}
                    type="text"
                    description="Number of Gherkin files"
                  />
                </div>
                {/* Checkboxes - Yellow Group */}
                <div className="bg-yellow-50">
                  <YesNoCheckboxField
                    label="Accessibility Tier 1"
                    name="isAccessibilityT1"
                    checked={inputs.isAccessibilityT1}
                    onChange={handleInputChange}
                    description="Include Base WCAG Testing?"
                  />
                </div>
                <div className="bg-yellow-50">
                  <YesNoCheckboxField
                    label="Accessibility Tier 2"
                    name="isAccessibilityT2"
                    checked={inputs.isAccessibilityT2}
                    onChange={handleInputChange}
                    description="Include Enhanced WCAG Testing?"
                  />
                </div>
                <div className="bg-yellow-50">
                  <YesNoCheckboxField
                    label="Performance Tier 1"
                    name="isPerformanceT1"
                    checked={inputs.isPerformanceT1}
                    onChange={handleInputChange}
                    description="Include Base Load/Stress Testing?"
                  />
                </div>
                <div className="bg-yellow-50">
                  <YesNoCheckboxField
                    label="Performance Tier 2"
                    name="isPerformanceT2"
                    checked={inputs.isPerformanceT2}
                    onChange={handleInputChange}
                    description="Include Enhanced Load/Stress Testing?"
                  />
                </div>
                <div className="bg-yellow-50">
                  <YesNoCheckboxField
                    label="SOC2 Prep Tier 1"
                    name="isSoc2T1"
                    checked={inputs.isSoc2T1}
                    onChange={handleInputChange}
                    description="Include Base SOC2 Prep Testing?"
                  />
                </div>
                <div className="bg-yellow-50">
                  <YesNoCheckboxField
                    label="SOC2 Prep Tier 2"
                    name="isSoc2T2"
                    checked={inputs.isSoc2T2}
                    onChange={handleInputChange}
                    description="Include Enhanced SOC2 Prep Testing?"
                  />
                </div>
                <div className="bg-yellow-50">
                  <YesNoCheckboxField
                    label="Rush Project?"
                    name="isRush"
                    checked={inputs.isRush}
                    onChange={handleInputChange}
                    description="Expedited timeline required?"
                  />
                </div>
              </div>
            </section>
            {/* === Specialized Estimations Section === */}
            <div id="specialized-estimations" className="h-16"></div>{' '}
            {/* Placeholder Div */}
            <section className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden mx-2 sm:mx-0">
              <h2 className="text-lg sm:text-xl font-semibold p-4 border-b bg-gray-50 text-gray-800">
                Specialized Estimations
              </h2>
              <div className="divide-y divide-gray-200">
                {/* Blue Group */}
                <div className="bg-blue-50">
                  <DisplayField
                    label="Accessibility Hours Calc"
                    value={results.accessibilityHours.toFixed(2)}
                    description="IF(Tier 2, Base * Factor T2, IF(Tier 1, Base * Factor T1, 0))"
                  />
                </div>
                <div className="bg-blue-50">
                  <DisplayField
                    label="Accessibility Price"
                    value={formatCurrency(results.accessibilityPrice)}
                    description="Accessibility Hours * Base Hourly Rate"
                  />
                </div>
                <div className="bg-blue-100">
                  <DisplayField
                    label="Performance Hours Calc"
                    value={results.performanceHours.toFixed(2)}
                    description="IF(Tier 2, Base * Factor T2, IF(Tier 1, Base * Factor T1, 0))"
                  />
                </div>
                <div className="bg-blue-100">
                  <DisplayField
                    label="Performance Price"
                    value={formatCurrency(results.performancePrice)}
                    description="Performance Hours * Base Hourly Rate"
                  />
                </div>
                <div className="bg-blue-50">
                  <DisplayField
                    label="SOC2 Hours Calc"
                    value={results.soc2Hours.toFixed(2)}
                    description="IF(Tier 2, Base * Factor T2, IF(Tier 1, Base * Factor T1, 0))"
                  />
                </div>
                <div className="bg-blue-50">
                  <DisplayField
                    label="SOC2 Price"
                    value={formatCurrency(results.soc2Price)}
                    description="SOC2 Hours * Base Hourly Rate"
                  />
                </div>
              </div>
            </section>
            {/* === Calculated Hours Breakdown Section === */}
            <div id="hours-breakdown" className="h-16"></div>{' '}
            {/* Placeholder Div */}
            <section className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden mx-2 sm:mx-0">
              <h2 className="text-lg sm:text-xl font-semibold p-4 border-b bg-gray-50 text-gray-800">
                Calculated Hours Breakdown
              </h2>
              <div className="divide-y divide-gray-200">
                {/* Yellow Group */}
                <div className="bg-yellow-50">
                  <DisplayField
                    label="Cypress Hours"
                    value={results.cypressHours.toFixed(2)}
                    description="Features * Base Hrs * Coverage * Complexity"
                  />
                </div>
                <div className="bg-yellow-50">
                  <DisplayField
                    label="Playwright Hours"
                    value={results.playwrightHours.toFixed(2)}
                    description="Features * Base Hrs * Coverage * Complexity * Browsers"
                  />
                </div>
                <div className="bg-yellow-50">
                  <DisplayField
                    label="Jest/Vitest Hours"
                    value={results.jestHours.toFixed(2)}
                    description="Features * Base Hrs * Coverage * Complexity"
                  />
                </div>
                <div className="bg-yellow-50">
                  <DisplayField
                    label="TestRail Hours"
                    value={results.testRailHours.toFixed(2)}
                    description="Features * Base Hrs * Coverage * Complexity"
                  />
                </div>
                <div className="bg-yellow-50">
                  <DisplayField
                    label="How-To Hours"
                    value={results.howToHours.toFixed(2)}
                    description="Count * Hrs/Doc"
                  />
                </div>
                <div className="bg-yellow-50">
                  <DisplayField
                    label="GWT Hours"
                    value={results.gwtHours.toFixed(2)}
                    description="Count * Hrs/Doc"
                  />
                </div>
                <div className="bg-yellow-50">
                  <DisplayField
                    label="Accessibility Hours"
                    value={results.accessibilityHours.toFixed(2)}
                    description="From Accessibility Hours Calc"
                  />
                </div>
                <div className="bg-yellow-50">
                  <DisplayField
                    label="Performance Hours"
                    value={results.performanceHours.toFixed(2)}
                    description="From Performance Hours Calc"
                  />
                </div>
                <div className="bg-yellow-50">
                  <DisplayField
                    label="SOC2 Hours"
                    value={results.soc2Hours.toFixed(2)}
                    description="From SOC2 Hours Calc"
                  />
                </div>
              </div>
            </section>
            {/* === Support Package Selection Section === */}
            <div id="support-package" className="h-16"></div>{' '}
            {/* Placeholder Div */}
            <section className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden mx-2 sm:mx-0">
              <h2 className="text-lg sm:text-xl font-semibold p-4 border-b bg-gray-50 text-gray-800">
                Support Package Selection
              </h2>
              <div className="divide-y divide-gray-200">
                {/* Green Group - Descriptions show formula pieces */}
                <div className="bg-green-50">
                  <YesNoCheckboxField
                    label="Support Tier 1 (Essential):"
                    name="isSupportT1"
                    checked={inputs.isSupportT1}
                    onChange={handleInputChange}
                    description={`(${inputs.supportHoursT1} hrs/mo @ ${inputs.supportRateAdjT1}x Rate Adjustment)`}
                  />
                </div>
                <div className="bg-green-50">
                  <YesNoCheckboxField
                    label="Support Tier 2 (Growth):"
                    name="isSupportT2"
                    checked={inputs.isSupportT2}
                    onChange={handleInputChange}
                    description={`(${inputs.supportHoursT2} hrs total @ ${inputs.supportRateAdjT2}x Rate Adjustment)`}
                  />
                </div>
                <div className="bg-green-50">
                  <YesNoCheckboxField
                    label="Support Tier 3 (Strategic):"
                    name="isSupportT3"
                    checked={inputs.isSupportT3}
                    onChange={handleInputChange}
                    description={`(${inputs.supportHoursT3} hrs total @ ${inputs.supportRateAdjT3}x Rate Adjustment)`}
                  />
                </div>
                {/* Output related to selection */}
                <div className="bg-green-50">
                  <DisplayField
                    label="Selected Support Hours"
                    value={results.supportPackageHours.toFixed(2)}
                    description="Hours based on selected Tier"
                  />
                </div>
                <div className="bg-green-50">
                  <DisplayField
                    label="Selected Support Price"
                    value={formatCurrency(results.supportPackagePrice)}
                    description="Calculated Price = Base Rate * Tier Hours * Tier Rate Adj"
                  />
                </div>
              </div>
            </section>
            {/* === Hours Summary Section === */}
            <div id="hours-summary" className="h-16"></div>{' '}
            {/* Placeholder Div */}
            <section className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden mx-2 sm:mx-0">
              <h2 className="text-lg sm:text-xl font-semibold p-4 border-b bg-gray-50 text-gray-800">
                Hours Summary
              </h2>
              <div className="divide-y divide-gray-200">
                {/* Green Group */}
                <div className="bg-blue-100">
                  <DisplayField
                    label="Total Base Hours (Project)"
                    value={results.totalBaseHours.toFixed(2)}
                    description="SUM(All calculated project hours)"
                  />
                </div>
                <div className="bg-yellow-100">
                  <DisplayField
                    label="Contingency Hours"
                    value={results.contingencyHours.toFixed(2)}
                    description="Total Base Hours * Contingency Buffer"
                  />
                </div>
                <div className="bg-green-50">
                  <DisplayField
                    label="Support Package Hours"
                    value={results.supportPackageHours.toFixed(2)}
                    description="Selected Support Tier Hours"
                  />
                </div>
                {/* Emphasize Total */}
                <div className="bg-green-100 border-t-2 border-green-300">
                  <DisplayField
                    label="TOTAL ESTIMATED HOURS"
                    value={results.finalHours.toFixed(2)}
                    description="Total Base Hours + Contingency Hours + Support Package Hours"
                    isTotal={true}
                  />
                </div>
              </div>
            </section>
            {/* === Pricing Summary Section === */}
            <div id="pricing-summary" className="h-16"></div>{' '}
            {/* Placeholder Div */}
            <section className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden mx-2 sm:mx-0">
              <h2 className="text-lg sm:text-xl font-semibold p-4 border-b bg-gray-50 text-gray-800">
                Pricing Summary
              </h2>
              <div className="divide-y divide-gray-200">
                {/* Green Group */}
                <div className="bg-blue-50">
                  <DisplayField
                    label="Base Price (excl. Rush)"
                    value={formatCurrency(results.basePrice)}
                    description={`MAX(Total Estimated Hours * Base Hourly Rate, Minimum Price) - WARNING: Includes support`}
                  />
                </div>
                <div className="bg-yellow-100">
                  <DisplayField
                    label="Rush Adjustment"
                    value={formatCurrency(results.rushAdjustment)}
                    description="IF(Rush=Yes, Base Price * Rush Multiplier, 0)"
                  />
                </div>
                <div className="bg-green-50">
                  <DisplayField
                    label="Support Package Price"
                    value={formatCurrency(results.supportPackagePrice)}
                    description="Selected Support Tier Price"
                  />
                </div>
                <div className="bg-green-100 border-t-2 border-green-300">
                  <DisplayField
                    label="FINAL ESTIMATED PRICE"
                    value={formatCurrency(results.finalPrice)}
                    description="Base Price + Rush Adjustment + Support Package Price"
                    isTotal={true}
                  />
                </div>
              </div>
            </section>
            {/* === Duration Estimation Section === */}
            <div id="duration-estimation" className="h-16"></div>{' '}
            {/* Placeholder Div */}
            <section className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden mx-2 sm:mx-0">
              <h2 className="text-lg sm:text-xl font-semibold p-4 border-b bg-gray-50 text-gray-800">
                Duration Estimation
              </h2>
              <div className="divide-y divide-gray-200">
                {/* Orange Group */}
                <div className="bg-orange-50">
                  <DisplayField
                    label="Estimated Weeks"
                    value={results.estimatedWeeks.toFixed(1)}
                    description="Total Estimated Hours / Hours per Week"
                  />
                </div>
                <div className="bg-orange-50">
                  <DisplayField
                    label="Estimated Months"
                    value={results.estimatedMonths.toFixed(1)}
                    description="ROUNDUP(Estimated Weeks / 4, 1)"
                  />
                </div>
                <div className="bg-orange-50">
                  <DisplayField
                    label="Estimated Years"
                    value={results.estimatedYears.toFixed(1)}
                    description="ROUNDUP(Estimated Months / 12, 1)"
                  />
                </div>
              </div>
            </section>
            {/* === NEW: Notes and Email Button Section (Conditionally Rendered) === */}
            <div id="notes-actions" className="h-16"></div>
            <section className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden mx-2 sm:mx-0">
              <h2 className="text-lg sm:text-xl font-semibold p-4 border-b bg-gray-50 text-gray-800">
                Notes & Actions
              </h2>

              {/* --- Conditional Rendering --- */}
              {showOwnerEmailConfirmation ? (
                /* --- Confirmation Message --- */
                <div className="p-6 bg-green-100 border-t border-green-200 text-center space-y-4">
                  <p className="text-lg font-semibold text-green-800">
                    ✅ Quote details emailed to owner successfully!
                  </p>
                  <button
                    onClick={() => setShowOwnerEmailConfirmation(false)}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline text-sm"
                  >
                    Send Another?
                  </button>
                </div>
              ) : (
                /* --- Notes and Send Button --- */
                <div className="p-4 space-y-4">
                  <div>
                    <label
                      htmlFor="calculator-notes"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Notes (Optional)
                    </label>
                    <textarea
                      id="calculator-notes"
                      placeholder="Add any relevant notes about this calculation..."
                      value={notes}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setNotes(e.target.value)
                      }
                      className="mt-1 block w-full text-sm border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      rows={4}
                      disabled={isSubmitting} // Disable textarea while submitting
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSendToOwner}
                    disabled={isSubmitting || results.finalPrice <= 0}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting
                      ? 'Sending Email...'
                      : 'Email Quote Details to Owner'}
                  </button>
                  {/* Show validation error inline if calculation is incomplete */}
                  {results.finalPrice <= 0 && !isSubmitting && (
                    <p className="text-xs text-red-600 text-center mt-1">
                      Calculation must complete with a valid result before
                      sending.
                    </p>
                  )}
                </div>
              )}
              {/* --- End Conditional Rendering --- */}
            </section>
            {/* End of Notes Section */}
          </div>
        )}
      </main>
    </div>
  );
}
