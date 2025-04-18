// src/app/calculator/page.test.tsx
// import React from 'react'; // Comment out if React import is unused
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CalculatorPage from './page'; // Import the component

// Mock Next.js router if needed by the component
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    // Provide a basic mock implementation
    push: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    // Add any other methods your component might use
  }),
  // Mock other exports from next/navigation if necessary
}));

// Mock the sendEmail actions
vi.mock('@/actions/sendEmail', () => ({
  // Mock specific exports used by the component
  sendCalculatorQuoteToOwner: vi.fn(() => Promise.resolve({ success: true })), // Mock a successful response by default
  sendEstimateEmail: vi.fn(() => Promise.resolve({ success: true })), // Mock other actions if indirectly imported/used
  sendEmail: vi.fn(() => Promise.resolve({ data: { id: 'mock_id' } })), // Mock contact form email if needed
}));

// Mock fetch API as it's used for auth checks
global.fetch = vi.fn(
  () =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ isAuthenticated: false }), // Default mock response
    }) as Promise<Response>
);

// --- Test Helper: Calculation Logic (Mirrors the logic in CalculatorPage useEffect) ---
// Define Input and Result types/interfaces based on state structure
interface TestCalculatorInputs {
  baseHourlyRate: string | number;
  hoursPerWeek: string | number;
  minPrice: string | number;
  contingencyBuffer: string | number;
  rushFeeMultiplier: string | number;
  cypressHrsBase: string | number;
  playwrightHrsBase: string | number;
  jestHrsBase: string | number;
  testRailHrsBase: string | number;
  howToHrsPerDoc: string | number;
  gwtHrsPerDoc: string | number;
  accessibilityFactorT1: string | number;
  accessibilityFactorT2: string | number;
  performanceFactorT1: string | number;
  performanceFactorT2: string | number;
  soc2FactorT1: string | number;
  soc2FactorT2: string | number;
  supportRateAdjT1: string | number;
  supportRateAdjT2: string | number;
  supportRateAdjT3: string | number;
  supportHoursT1: string | number;
  supportHoursT2: string | number;
  supportHoursT3: string | number;
  numFeatures: string | number;
  complexity: string | number;
  browsers: string | number;
  cypressCoverage: string | number;
  playwrightCoverage: string | number;
  jestCoverage: string | number;
  testRailCoverage: string | number;
  howToDocsCount: string | number;
  gwtDocsCount: string | number;
  isAccessibilityT1: boolean;
  isAccessibilityT2: boolean;
  isPerformanceT1: boolean;
  isPerformanceT2: boolean;
  isSoc2T1: boolean;
  isSoc2T2: boolean;
  isSupportT1: boolean;
  isSupportT2: boolean;
  isSupportT3: boolean;
  isRush: boolean;
  // Add projectName if needed by any logic, though it's mostly display
  projectName?: string;
}

interface TestCalculatorResults {
  cypressHours: number;
  playwrightHours: number;
  jestHours: number;
  testRailHours: number;
  howToHours: number;
  gwtHours: number;
  accessibilityHours: number; // Corresponds to 'Accessibility Hours Calc'
  performanceHours: number; // Corresponds to 'Performance Hours Calc'
  soc2Hours: number; // Corresponds to 'SOC2 Hours Calc'
  accessibilityPrice: number;
  performancePrice: number;
  soc2Price: number;
  supportPackageHours: number; // Corresponds to 'Selected Support Package Hours'
  supportPackagePrice: number; // Corresponds to 'Selected Support Package Price'
  totalBaseHours: number;
  contingencyHours: number;
  finalHours: number; // Corresponds to 'Final Total Hours'
  basePrice: number; // Corresponds to 'Base Price (excl. Rush)'
  rushAdjustment: number;
  finalPrice: number; // Corresponds to 'FINAL PRICE (incl. Rush)'
  estimatedWeeks: number;
  estimatedMonths: number;
  estimatedYears: number;
  // Add intermediate prices if needed for testing specific steps easily
  intermediateSupportPriceT1?: number;
  intermediateSupportPriceT2?: number;
  intermediateSupportPriceT3?: number;
}

// Helper Parsing Functions (mirroring component's logic)
const parseCurrency = (value: string | number): number => {
  if (typeof value === 'number') return value;
  return parseFloat(String(value).replace(/[$,]/g, '')) || 0;
};
const parsePercent = (value: string | number): number => {
  return (parseFloat(String(value).replace(/%/g, '')) || 0) / 100;
};
const parseIntStrict = (value: string | number): number => {
  return parseInt(String(value)) || 0;
};
const parseFloatStrict = (value: string | number): number => {
  return parseFloat(String(value)) || 0;
};

// The core calculation logic extracted/mirrored
const runCalculations = (
  inputs: TestCalculatorInputs
): TestCalculatorResults => {
  // --- 1. Parse ALL Inputs ---
  const baseHourlyRate = parseCurrency(inputs.baseHourlyRate);
  const hoursPerWeek = parseIntStrict(inputs.hoursPerWeek);
  const minPrice = parseCurrency(inputs.minPrice);
  const contingencyBuffer = parseFloatStrict(inputs.contingencyBuffer);
  const rushFeeMultiplier = parseFloatStrict(inputs.rushFeeMultiplier);
  const cypressHrsBase = parseFloatStrict(inputs.cypressHrsBase);
  const playwrightHrsBase = parseFloatStrict(inputs.playwrightHrsBase);
  const jestHrsBase = parseFloatStrict(inputs.jestHrsBase);
  const testRailHrsBase = parseFloatStrict(inputs.testRailHrsBase);
  const howToHrsPerDoc = parseFloatStrict(inputs.howToHrsPerDoc);
  const gwtHrsPerDoc = parseFloatStrict(inputs.gwtHrsPerDoc);
  const accessibilityFactorT1 = parseFloatStrict(inputs.accessibilityFactorT1);
  const accessibilityFactorT2 = parseFloatStrict(inputs.accessibilityFactorT2);
  const performanceFactorT1 = parseFloatStrict(inputs.performanceFactorT1);
  const performanceFactorT2 = parseFloatStrict(inputs.performanceFactorT2);
  const soc2FactorT1 = parseFloatStrict(inputs.soc2FactorT1);
  const soc2FactorT2 = parseFloatStrict(inputs.soc2FactorT2);
  const supportHoursT1 = parseIntStrict(inputs.supportHoursT1);
  const supportHoursT2 = parseIntStrict(inputs.supportHoursT2);
  const supportHoursT3 = parseIntStrict(inputs.supportHoursT3);
  const supportRateAdjT1 = parseFloatStrict(inputs.supportRateAdjT1);
  const supportRateAdjT2 = parseFloatStrict(inputs.supportRateAdjT2);
  const supportRateAdjT3 = parseFloatStrict(inputs.supportRateAdjT3);
  const numFeatures = parseIntStrict(inputs.numFeatures);
  const complexity = parseFloatStrict(inputs.complexity);
  const browsers = parseIntStrict(inputs.browsers);
  const cypressCov = parsePercent(inputs.cypressCoverage);
  const playwrightCov = parsePercent(inputs.playwrightCoverage);
  const jestCov = parsePercent(inputs.jestCoverage);
  const testRailCov = parsePercent(inputs.testRailCoverage);
  const howToCount = parseIntStrict(inputs.howToDocsCount);
  const gwtCount = parseIntStrict(inputs.gwtDocsCount);

  // --- (A) Calculated Hours Breakdown ---
  const result_cypressHours =
    numFeatures * cypressHrsBase * cypressCov * complexity;
  const result_playwrightHours =
    numFeatures * playwrightHrsBase * playwrightCov * complexity * browsers;
  const result_jestHours = numFeatures * jestHrsBase * jestCov * complexity;
  const result_testRailHours =
    numFeatures * testRailHrsBase * testRailCov * complexity;
  const result_howToHours = howToCount * howToHrsPerDoc;
  const result_gwtHours = gwtCount * gwtHrsPerDoc;

  // --- (B) Specialized Estimations (Hours & Price) ---
  // Corrected Base: Use result_cypressHours per user spec
  const baseForSpecialized = result_cypressHours;

  let calculatedAccessibilityHours = 0;
  // ACCUMULATE: Use separate IFs
  if (inputs.isAccessibilityT1) {
    calculatedAccessibilityHours += baseForSpecialized * accessibilityFactorT1;
  }
  if (inputs.isAccessibilityT2) {
    calculatedAccessibilityHours += baseForSpecialized * accessibilityFactorT2;
  }
  const result_accessibilityHours = calculatedAccessibilityHours;
  const result_accessibilityPrice = result_accessibilityHours * baseHourlyRate;

  let calculatedPerformanceHours = 0;
  // ACCUMULATE: Use separate IFs
  if (inputs.isPerformanceT1) {
    calculatedPerformanceHours += baseForSpecialized * performanceFactorT1;
  }
  if (inputs.isPerformanceT2) {
    calculatedPerformanceHours += baseForSpecialized * performanceFactorT2;
  }
  const result_performanceHours = calculatedPerformanceHours;
  const result_performancePrice = result_performanceHours * baseHourlyRate;

  let calculatedSoc2Hours = 0;
  // ACCUMULATE: Use separate IFs
  if (inputs.isSoc2T1) {
    calculatedSoc2Hours += baseForSpecialized * soc2FactorT1;
  }
  if (inputs.isSoc2T2) {
    calculatedSoc2Hours += baseForSpecialized * soc2FactorT2;
  }
  const result_soc2Hours = calculatedSoc2Hours;
  const result_soc2Price = result_soc2Hours * baseHourlyRate;

  // --- (C) Support Package Calculation ---
  // Pre-calculate prices
  const calculatedSupportPriceT1 =
    baseHourlyRate * supportHoursT1 * supportRateAdjT1;
  const calculatedSupportPriceT2 =
    baseHourlyRate * supportHoursT2 * supportRateAdjT2;
  const calculatedSupportPriceT3 =
    baseHourlyRate * supportHoursT3 * supportRateAdjT3;

  let calculatedSupportPackageHours = 0;
  let calculatedSupportPackagePrice = 0;
  // ACCUMULATE: Use separate IFs
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
    result_soc2Hours;
  const result_contingencyHours = result_totalBaseHours * contingencyBuffer;
  const result_finalHours =
    result_totalBaseHours +
    result_contingencyHours +
    result_supportPackageHours;

  // --- (E) Pricing Summary ---
  // Using B68 (result_finalHours) as base per strict sheet formula B71
  // Correction: Test spec says use final hours * rate. Let's stick to that first.
  const intermediatePrice = result_finalHours * baseHourlyRate;
  const result_basePrice = Math.max(intermediatePrice, minPrice);
  const result_rushAdjustment = inputs.isRush
    ? result_basePrice * rushFeeMultiplier
    : 0;
  const result_finalPrice =
    result_basePrice + result_rushAdjustment + result_supportPackagePrice;

  // --- (F) Duration Estimation ---
  const result_estimatedWeeks =
    hoursPerWeek > 0 ? result_finalHours / hoursPerWeek : 0;
  const result_estimatedMonths =
    Math.ceil((result_estimatedWeeks / 4) * 10) / 10;
  const result_estimatedYears =
    Math.ceil((result_estimatedMonths / 12) * 10) / 10;

  // --- Final Step: Return Results Object ---
  return {
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
    supportPackageHours: result_supportPackageHours,
    supportPackagePrice: result_supportPackagePrice,
    totalBaseHours: result_totalBaseHours,
    contingencyHours: result_contingencyHours,
    finalHours: result_finalHours,
    basePrice: result_basePrice,
    rushAdjustment: result_rushAdjustment,
    finalPrice: result_finalPrice,
    estimatedWeeks: result_estimatedWeeks,
    estimatedMonths: result_estimatedMonths,
    estimatedYears: result_estimatedYears,
    // Optional intermediate results for easier testing if needed later
    intermediateSupportPriceT1: calculatedSupportPriceT1,
    intermediateSupportPriceT2: calculatedSupportPriceT2,
    intermediateSupportPriceT3: calculatedSupportPriceT3,
  };
};
// --- End Test Helper ---

// --- Default Mock Inputs ---
const defaultInputs: TestCalculatorInputs = {
  baseHourlyRate: '125.00',
  hoursPerWeek: '25',
  minPrice: '10000.00',
  contingencyBuffer: '0.15',
  rushFeeMultiplier: '0.20',
  cypressHrsBase: '3',
  playwrightHrsBase: '3',
  jestHrsBase: '1',
  testRailHrsBase: '1.5',
  howToHrsPerDoc: '2',
  gwtHrsPerDoc: '1.5',
  accessibilityFactorT1: '1',
  accessibilityFactorT2: '1.5',
  performanceFactorT1: '1',
  performanceFactorT2: '1.8',
  soc2FactorT1: '1.2',
  soc2FactorT2: '2',
  supportRateAdjT1: '1.2',
  supportRateAdjT2: '0.85',
  supportRateAdjT3: '0.85',
  supportHoursT1: '10',
  supportHoursT2: '40',
  supportHoursT3: '90',
  numFeatures: '10',
  complexity: '1.5',
  browsers: '2',
  cypressCoverage: '75',
  playwrightCoverage: '50',
  jestCoverage: '90',
  testRailCoverage: '90',
  howToDocsCount: '5',
  gwtDocsCount: '10',
  isAccessibilityT1: false,
  isAccessibilityT2: false,
  isPerformanceT1: false,
  isPerformanceT2: false,
  isSoc2T1: false,
  isSoc2T2: false,
  isSupportT1: false,
  isSupportT2: false,
  isSupportT3: false,
  isRush: false,
};
// --- End Default Mock Inputs ---

describe('CalculatorPage Component Rendering', () => {
  // Reset mocks before each test in this suite if needed
  beforeEach(() => {
    vi.resetAllMocks(); // Reset calls/implementations of mocks

    // Reset global fetch mock for auth check specifically
    global.fetch = vi.fn(
      () =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ isAuthenticated: false }),
        }) as Promise<Response>
    );

    // Re-apply mocks that should persist if resetAllMocks clears them
    vi.mock('next/navigation', () => ({
      useRouter: () => ({ push: vi.fn() }),
    }));
    vi.mock('@/actions/sendEmail', () => ({
      sendCalculatorQuoteToOwner: vi.fn(() =>
        Promise.resolve({ success: true })
      ),
    }));
  });

  it('renders the login form when not authenticated', async () => {
    render(<CalculatorPage />);
    expect(
      await screen.findByRole('heading', { name: /Login Required/i })
    ).toBeInTheDocument();
    // ... other login form assertions ...
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  // Add other rendering tests here (e.g., authenticated view)
});

describe('Calculator Logic - (A) Hours Breakdown', () => {
  it('calculates Cypress Hours correctly', () => {
    const inputs = {
      ...defaultInputs,
      numFeatures: 10,
      cypressHrsBase: 3,
      cypressCoverage: 75,
      complexity: 1.5,
    };
    // Expected: 10 * 3 * 0.75 * 1.5 = 33.75
    const results = runCalculations(inputs);
    expect(results.cypressHours).toBeCloseTo(33.75);
  });

  it('calculates Playwright Hours correctly', () => {
    const inputs = {
      ...defaultInputs,
      numFeatures: 8,
      playwrightHrsBase: 4,
      playwrightCoverage: 50,
      complexity: 1.2,
      browsers: 3,
    };
    // Expected: 8 * 4 * 0.50 * 1.2 * 3 = 57.6
    const results = runCalculations(inputs);
    expect(results.playwrightHours).toBeCloseTo(57.6);
  });

  it('calculates Jest/Vitest Hours correctly', () => {
    const inputs = {
      ...defaultInputs,
      numFeatures: 15,
      jestHrsBase: 1,
      jestCoverage: 90,
      complexity: 1.0,
    };
    // Expected: 15 * 1 * 0.90 * 1.0 = 13.5
    const results = runCalculations(inputs);
    expect(results.jestHours).toBeCloseTo(13.5);
  });

  it('calculates TestRail Hours correctly', () => {
    const inputs = {
      ...defaultInputs,
      numFeatures: 20,
      testRailHrsBase: 1.5,
      testRailCoverage: 80,
      complexity: 2.0,
    };
    // Expected: 20 * 1.5 * 0.80 * 2.0 = 48
    const results = runCalculations(inputs);
    expect(results.testRailHours).toBeCloseTo(48);
  });

  it('calculates How-To Hours correctly', () => {
    const inputs = { ...defaultInputs, howToDocsCount: 7, howToHrsPerDoc: 2.5 };
    // Expected: 7 * 2.5 = 17.5
    const results = runCalculations(inputs);
    expect(results.howToHours).toBeCloseTo(17.5);
  });

  it('calculates GWT Hours correctly', () => {
    const inputs = { ...defaultInputs, gwtDocsCount: 12, gwtHrsPerDoc: 1.75 };
    // Expected: 12 * 1.75 = 21
    const results = runCalculations(inputs);
    expect(results.gwtHours).toBeCloseTo(21);
  });

  it('handles zero inputs for hours breakdown', () => {
    const inputs = {
      ...defaultInputs,
      numFeatures: 0,
      cypressCoverage: 0,
      playwrightCoverage: 0,
      jestCoverage: 0,
      testRailCoverage: 0,
      howToDocsCount: 0,
      gwtDocsCount: 0,
    };
    const results = runCalculations(inputs);
    expect(results.cypressHours).toBe(0);
    expect(results.playwrightHours).toBe(0);
    expect(results.jestHours).toBe(0);
    expect(results.testRailHours).toBe(0);
    expect(results.howToHours).toBe(0);
    expect(results.gwtHours).toBe(0);
  });
});

describe('Calculator Logic - (B) Specialized Estimations', () => {
  // Need cypressHours result for these tests
  // const baseCypressHours = 33.75; // Unused variable

  it('calculates Accessibility Hours Calc (Tier 1)', () => {
    const inputs = {
      ...defaultInputs,
      numFeatures: 10,
      cypressHrsBase: 3,
      cypressCoverage: 75,
      complexity: 1.5,
      isAccessibilityT1: true,
      isAccessibilityT2: false,
      accessibilityFactorT1: 1.1,
    };
    // Base cypress hours = 33.75
    // Expected: 33.75 * 1.1 = 37.125
    const results = runCalculations(inputs);
    expect(results.accessibilityHours).toBeCloseTo(37.125);
  });

  it('calculates Accessibility Hours Calc (Tier 2)', () => {
    // Define inputs for individual tiers and combined
    const inputsT1 = {
      ...defaultInputs,
      isAccessibilityT1: true,
      isAccessibilityT2: false,
    };
    const inputsT2 = {
      ...defaultInputs,
      isAccessibilityT1: false,
      isAccessibilityT2: true,
    };
    const inputsBoth = {
      ...defaultInputs,
      isAccessibilityT1: true,
      isAccessibilityT2: true,
    };
    // Calculate results dynamically based on current defaultInputs
    const resultsT1 = runCalculations(inputsT1);
    const resultsT2 = runCalculations(inputsT2);
    const resultsBoth = runCalculations(inputsBoth);

    // Assert accumulation against dynamically calculated individual results
    expect(resultsBoth.accessibilityHours).toBeCloseTo(
      resultsT1.accessibilityHours + resultsT2.accessibilityHours
    );
  });

  it('calculates Accessibility Hours Calc (None)', () => {
    const inputs = {
      ...defaultInputs,
      numFeatures: 10,
      cypressHrsBase: 3,
      cypressCoverage: 75,
      complexity: 1.5,
      isAccessibilityT1: false,
      isAccessibilityT2: false,
    };
    // Expected: 0
    const results = runCalculations(inputs);
    expect(results.accessibilityHours).toBe(0);
  });

  it('calculates Accessibility Price correctly', () => {
    const inputs = {
      ...defaultInputs,
      baseHourlyRate: 150,
      numFeatures: 10,
      cypressHrsBase: 3,
      cypressCoverage: 75,
      complexity: 1.5,
      isAccessibilityT1: true,
      isAccessibilityT2: false,
      accessibilityFactorT1: 1.1,
    };
    // Hours = 37.125
    // Expected Price: 37.125 * 150 = 5568.75
    const results = runCalculations(inputs);
    expect(results.accessibilityPrice).toBeCloseTo(5568.75);
  });

  // --- Add similar tests for Performance (Hours T1/T2/None, Price) ---
  it('calculates Performance Hours Calc (Tier 1)', () => {
    const inputs = {
      ...defaultInputs,
      numFeatures: 10,
      cypressHrsBase: 3,
      cypressCoverage: 75,
      complexity: 1.5,
      isPerformanceT1: true,
      isPerformanceT2: false,
      performanceFactorT1: 1.2,
    };
    // Base = 33.75. Expected: 33.75 * 1.2 = 40.5
    const results = runCalculations(inputs);
    expect(results.performanceHours).toBeCloseTo(40.5);
  });
  it('calculates Performance Hours Calc (Tier 2)', () => {
    const inputsT1 = {
      ...defaultInputs,
      isPerformanceT1: true,
      isPerformanceT2: false,
    };
    const inputsT2 = {
      ...defaultInputs,
      isPerformanceT1: false,
      isPerformanceT2: true,
    };
    const inputsBoth = {
      ...defaultInputs,
      isPerformanceT1: true,
      isPerformanceT2: true,
    };
    const resultsT1 = runCalculations(inputsT1);
    const resultsT2 = runCalculations(inputsT2);
    const resultsBoth = runCalculations(inputsBoth);

    // Assert accumulation against dynamically calculated individual results
    expect(resultsBoth.performanceHours).toBeCloseTo(
      resultsT1.performanceHours + resultsT2.performanceHours
    );
  });
  it('calculates Performance Price correctly', () => {
    const inputs = {
      ...defaultInputs,
      baseHourlyRate: 150,
      numFeatures: 10,
      cypressHrsBase: 3,
      cypressCoverage: 75,
      complexity: 1.5,
      isPerformanceT1: true,
      isPerformanceT2: false,
      performanceFactorT1: 1.2,
    };
    // Hours = 40.5. Expected: 40.5 * 150 = 6075
    const results = runCalculations(inputs);
    expect(results.performancePrice).toBeCloseTo(6075);
  });

  // --- Add similar tests for SOC2 (Hours T1/T2/None, Price) ---
  it('calculates SOC2 Hours Calc (Tier 1)', () => {
    const inputs = {
      ...defaultInputs,
      numFeatures: 10,
      cypressHrsBase: 3,
      cypressCoverage: 75,
      complexity: 1.5,
      isSoc2T1: true,
      isSoc2T2: false,
      soc2FactorT1: 1.3,
    };
    // Base = 33.75. Expected: 33.75 * 1.3 = 43.875
    const results = runCalculations(inputs);
    expect(results.soc2Hours).toBeCloseTo(43.875);
  });
  it('calculates SOC2 Hours Calc (Tier 2)', () => {
    const inputsT1 = { ...defaultInputs, isSoc2T1: true, isSoc2T2: false };
    const inputsT2 = { ...defaultInputs, isSoc2T1: false, isSoc2T2: true };
    const inputsBoth = { ...defaultInputs, isSoc2T1: true, isSoc2T2: true };
    const resultsT1 = runCalculations(inputsT1);
    const resultsT2 = runCalculations(inputsT2);
    const resultsBoth = runCalculations(inputsBoth);

    // Assert accumulation against dynamically calculated individual results
    expect(resultsBoth.soc2Hours).toBeCloseTo(
      resultsT1.soc2Hours + resultsT2.soc2Hours
    );
  });
  it('calculates SOC2 Price correctly', () => {
    const inputs = {
      ...defaultInputs,
      baseHourlyRate: 150,
      numFeatures: 10,
      cypressHrsBase: 3,
      cypressCoverage: 75,
      complexity: 1.5,
      isSoc2T1: true,
      isSoc2T2: false,
      soc2FactorT1: 1.3,
    };
    // Hours = 43.875. Expected: 43.875 * 150 = 6581.25
    const results = runCalculations(inputs);
    expect(results.soc2Price).toBeCloseTo(6581.25);
  });
});

// --- Placeholder for further test suites ---
describe('Calculator Logic - (C) Support Package', () => {
  it('calculates Intermediate Tier 1 Support Price', () => {
    const inputs = {
      ...defaultInputs,
      baseHourlyRate: 100,
      supportHoursT1: 10,
      supportRateAdjT1: 1.2,
    };
    // Expected: 100 * 10 * 1.2 = 1200
    const results = runCalculations(inputs);
    // Check the intermediate result if available, otherwise calculate here
    const expected =
      parseCurrency(inputs.baseHourlyRate) *
      parseIntStrict(inputs.supportHoursT1) *
      parseFloatStrict(inputs.supportRateAdjT1);
    expect(results.intermediateSupportPriceT1).toBeCloseTo(expected);
    expect(results.intermediateSupportPriceT1).toBeCloseTo(1200);
  });

  it('calculates Intermediate Tier 2 Support Price', () => {
    const inputs = {
      ...defaultInputs,
      baseHourlyRate: 150,
      supportHoursT2: 40,
      supportRateAdjT2: 0.85,
    };
    // Expected: 150 * 40 * 0.85 = 5100
    const results = runCalculations(inputs);
    const expected =
      parseCurrency(inputs.baseHourlyRate) *
      parseIntStrict(inputs.supportHoursT2) *
      parseFloatStrict(inputs.supportRateAdjT2);
    expect(results.intermediateSupportPriceT2).toBeCloseTo(expected);
    expect(results.intermediateSupportPriceT2).toBeCloseTo(5100);
  });

  it('calculates Intermediate Tier 3 Support Price', () => {
    const inputs = {
      ...defaultInputs,
      baseHourlyRate: 200,
      supportHoursT3: 90,
      supportRateAdjT3: 0.8,
    }; // Using 0.80 for test variation
    // Expected: 200 * 90 * 0.80 = 14400
    const results = runCalculations(inputs);
    const expected =
      parseCurrency(inputs.baseHourlyRate) *
      parseIntStrict(inputs.supportHoursT3) *
      parseFloatStrict(inputs.supportRateAdjT3);
    expect(results.intermediateSupportPriceT3).toBeCloseTo(expected);
    expect(results.intermediateSupportPriceT3).toBeCloseTo(14400);
  });

  it('determines Selected Support Package Hours (Tier 1)', () => {
    const inputs = {
      ...defaultInputs,
      isSupportT1: true,
      isSupportT2: false,
      isSupportT3: false,
      supportHoursT1: 10,
    };
    const results = runCalculations(inputs);
    expect(results.supportPackageHours).toBe(10);
  });

  it('determines Selected Support Package Hours (Tier 2)', () => {
    const inputs = {
      ...defaultInputs,
      isSupportT1: false,
      isSupportT2: true,
      isSupportT3: false,
      supportHoursT2: 40,
    };
    const results = runCalculations(inputs);
    expect(results.supportPackageHours).toBe(40);
  });

  it('determines Selected Support Package Hours (Tier 3)', () => {
    const inputs = {
      ...defaultInputs,
      isSupportT1: false,
      isSupportT2: false,
      isSupportT3: true,
      supportHoursT3: 90,
    };
    const results = runCalculations(inputs);
    expect(results.supportPackageHours).toBe(90);
  });

  it('determines Selected Support Package Hours (Tier 3 overrides T1/T2)', () => {
    // Inputs have T1, T2, T3 all true
    const inputs = {
      ...defaultInputs,
      isSupportT1: true,
      isSupportT2: true,
      isSupportT3: true,
    };
    // Expected: T1(10) + T2(40) + T3(90) = 140
    const results = runCalculations(inputs);
    // Update assertion to expect the SUM
    expect(results.supportPackageHours).toBe(10 + 40 + 90); // Expect accumulation
  });

  it('determines Selected Support Package Hours (Tier 2 overrides T1)', () => {
    // Inputs have T1, T2 true, T3 false
    const inputs = {
      ...defaultInputs,
      isSupportT1: true,
      isSupportT2: true,
      isSupportT3: false,
    };
    // Expected: T1(10) + T2(40) = 50
    const results = runCalculations(inputs);
    // Update assertion to expect the SUM
    expect(results.supportPackageHours).toBe(10 + 40); // Expect accumulation
  });

  it('determines Selected Support Package Hours (None)', () => {
    const inputs = {
      ...defaultInputs,
      isSupportT1: false,
      isSupportT2: false,
      isSupportT3: false,
    };
    const results = runCalculations(inputs);
    expect(results.supportPackageHours).toBe(0);
  });

  it('determines Selected Support Package Price (Tier 1)', () => {
    const inputs = {
      ...defaultInputs,
      baseHourlyRate: 100,
      supportHoursT1: 10,
      supportRateAdjT1: 1.2,
      isSupportT1: true,
      isSupportT2: false,
      isSupportT3: false,
    };
    // Expected price: 100 * 10 * 1.2 = 1200
    const results = runCalculations(inputs);
    expect(results.supportPackagePrice).toBeCloseTo(1200);
  });

  it('determines Selected Support Package Price (Tier 2)', () => {
    const inputs = {
      ...defaultInputs,
      baseHourlyRate: 150,
      supportHoursT2: 40,
      supportRateAdjT2: 0.85,
      isSupportT1: false,
      isSupportT2: true,
      isSupportT3: false,
    };
    // Expected price: 150 * 40 * 0.85 = 5100
    const results = runCalculations(inputs);
    expect(results.supportPackagePrice).toBeCloseTo(5100);
  });

  it('determines Selected Support Package Price (Tier 3)', () => {
    const inputs = {
      ...defaultInputs,
      baseHourlyRate: 200,
      supportHoursT3: 90,
      supportRateAdjT3: 0.8,
      isSupportT1: false,
      isSupportT2: false,
      isSupportT3: true,
    };
    // Expected price: 200 * 90 * 0.80 = 14400
    const results = runCalculations(inputs);
    expect(results.supportPackagePrice).toBeCloseTo(14400);
  });

  it('determines Selected Support Package Price (T1+T2+T3 Accumulation)', () => {
    // Inputs have T1, T2, T3 all true
    const inputsT1 = {
      ...defaultInputs,
      isSupportT1: true,
      isSupportT2: false,
      isSupportT3: false,
    };
    const inputsT2 = {
      ...defaultInputs,
      isSupportT1: false,
      isSupportT2: true,
      isSupportT3: false,
    };
    const inputsT3 = {
      ...defaultInputs,
      isSupportT1: false,
      isSupportT2: false,
      isSupportT3: true,
    };
    const inputsAll = {
      ...defaultInputs,
      isSupportT1: true,
      isSupportT2: true,
      isSupportT3: true,
    };
    // Calculate results dynamically
    const resultsT1 = runCalculations(inputsT1);
    const resultsT2 = runCalculations(inputsT2);
    const resultsT3 = runCalculations(inputsT3);
    const resultsAll = runCalculations(inputsAll);

    // Assert price accumulation against dynamically calculated individual results
    expect(resultsAll.supportPackagePrice).toBeCloseTo(
      resultsT1.supportPackagePrice +
        resultsT2.supportPackagePrice +
        resultsT3.supportPackagePrice
    );
  });

  it('determines Selected Support Package Price (T1+T2 Accumulation)', () => {
    // Inputs have T1, T2 true, T3 false
    const inputsT1 = {
      ...defaultInputs,
      isSupportT1: true,
      isSupportT2: false,
      isSupportT3: false,
    };
    const inputsT2 = {
      ...defaultInputs,
      isSupportT1: false,
      isSupportT2: true,
      isSupportT3: false,
    };
    const inputsBoth = {
      ...defaultInputs,
      isSupportT1: true,
      isSupportT2: true,
      isSupportT3: false,
    };
    // Calculate results dynamically
    const resultsT1 = runCalculations(inputsT1);
    const resultsT2 = runCalculations(inputsT2);
    const resultsBoth = runCalculations(inputsBoth);

    // Assert price accumulation against dynamically calculated individual results
    expect(resultsBoth.supportPackagePrice).toBeCloseTo(
      resultsT1.supportPackagePrice + resultsT2.supportPackagePrice
    );
  });

  it('determines Selected Support Package Price (None)', () => {
    const inputs = {
      ...defaultInputs,
      isSupportT1: false,
      isSupportT2: false,
      isSupportT3: false,
    };
    const results = runCalculations(inputs);
    expect(results.supportPackagePrice).toBe(0);
  });
});

describe('Calculator Logic - (D) Hours Summary', () => {
  it('calculates Total Base Hours correctly', () => {
    // Use inputs that generate known hours for A & B components
    const inputs = {
      ...defaultInputs,
      numFeatures: 10,
      cypressHrsBase: 3,
      cypressCoverage: 75,
      complexity: 1.5, // Cypress = 33.75
      playwrightCoverage: 0, // Playwright = 0
      jestHrsBase: 1,
      jestCoverage: 90, // Jest = 10 * 1 * 0.9 * 1.5 = 13.5
      testRailCoverage: 0, // TestRail = 0
      howToDocsCount: 5,
      howToHrsPerDoc: 2, // HowTo = 10
      gwtDocsCount: 0, // GWT = 0
      isAccessibilityT1: true,
      accessibilityFactorT1: 1.1, // Access = 33.75 * 1.1 = 37.125
      isPerformanceT1: true,
      performanceFactorT1: 1.2, // Perf = 33.75 * 1.2 = 40.5
      isSoc2T1: false, // SOC2 = 0
    };
    // Expected Sum: 33.75 + 0 + 13.5 + 0 + 10 + 0 + 37.125 + 40.5 + 0 = 134.875
    const results = runCalculations(inputs);
    expect(results.totalBaseHours).toBeCloseTo(134.875);
  });

  it('calculates Contingency Hours correctly', () => {
    // Use inputs that generate known Total Base Hours
    const inputs = {
      ...defaultInputs,
      contingencyBuffer: 0.2, // Use 20% buffer
      // Inputs to generate Total Base Hours = 134.875 (from previous test)
      numFeatures: 10,
      cypressHrsBase: 3,
      cypressCoverage: 75,
      complexity: 1.5,
      playwrightCoverage: 0,
      jestHrsBase: 1,
      jestCoverage: 90,
      testRailCoverage: 0,
      howToDocsCount: 5,
      howToHrsPerDoc: 2,
      gwtDocsCount: 0,
      isAccessibilityT1: true,
      accessibilityFactorT1: 1.1,
      isPerformanceT1: true,
      performanceFactorT1: 1.2,
      isSoc2T1: false,
    };
    // Expected: 134.875 * 0.20 = 26.975
    const results = runCalculations(inputs);
    expect(results.contingencyHours).toBeCloseTo(26.975);
  });

  it('calculates Final Total Hours correctly', () => {
    // Use inputs that generate known Base, Contingency, and Support Hours
    const inputs = {
      ...defaultInputs,
      // Inputs to generate Total Base Hours = 134.875
      numFeatures: 10,
      cypressHrsBase: 3,
      cypressCoverage: 75,
      complexity: 1.5,
      playwrightCoverage: 0,
      jestHrsBase: 1,
      jestCoverage: 90,
      testRailCoverage: 0,
      howToDocsCount: 5,
      howToHrsPerDoc: 2,
      gwtDocsCount: 0,
      isAccessibilityT1: true,
      accessibilityFactorT1: 1.1,
      isPerformanceT1: true,
      performanceFactorT1: 1.2,
      isSoc2T1: false,
      // Inputs for Contingency Hours = 26.975
      contingencyBuffer: 0.2,
      // Inputs for Support Hours (Tier 1 = 10 hrs)
      isSupportT1: true,
      isSupportT2: false,
      isSupportT3: false,
      supportHoursT1: 10,
    };
    // Expected: 134.875 (Base) + 26.975 (Contingency) + 10 (Support) = 171.85
    const results = runCalculations(inputs);
    expect(results.finalHours).toBeCloseTo(171.85);
  });
});

describe('Calculator Logic - (E) Pricing Summary', () => {
  it('calculates Base Price (when > Min Price)', () => {
    // Use inputs that generate known Final Hours and high enough price
    const inputs = {
      ...defaultInputs,
      baseHourlyRate: 100,
      minPrice: 5000,
      // Inputs to generate Final Hours = 171.85 (from previous test)
      numFeatures: 10,
      cypressHrsBase: 3,
      cypressCoverage: 75,
      complexity: 1.5,
      playwrightCoverage: 0,
      jestHrsBase: 1,
      jestCoverage: 90,
      testRailCoverage: 0,
      howToDocsCount: 5,
      howToHrsPerDoc: 2,
      gwtDocsCount: 0,
      isAccessibilityT1: true,
      accessibilityFactorT1: 1.1,
      isPerformanceT1: true,
      performanceFactorT1: 1.2,
      isSoc2T1: false,
      contingencyBuffer: 0.2,
      isSupportT1: true,
      isSupportT2: false,
      isSupportT3: false,
      supportHoursT1: 10,
    };
    // Intermediate Price = 171.85 * 100 = 17185
    // Expected Base Price = MAX(17185, 5000) = 17185
    const results = runCalculations(inputs);
    expect(results.basePrice).toBeCloseTo(17185);
  });

  it('calculates Base Price (when < Min Price, should use Min Price)', () => {
    const inputs = {
      ...defaultInputs,
      baseHourlyRate: 100,
      minPrice: 5000,
      // Inputs to generate low Final Hours (e.g., 30 hrs)
      numFeatures: 2,
      cypressHrsBase: 3,
      cypressCoverage: 50,
      complexity: 1.0, // Cypress = 2*3*0.5*1 = 3
      playwrightCoverage: 0,
      jestHrsBase: 1,
      jestCoverage: 50, // Jest = 2*1*0.5*1 = 1
      testRailCoverage: 0,
      howToDocsCount: 0,
      gwtDocsCount: 0,
      isAccessibilityT1: false,
      isPerformanceT1: false,
      isSoc2T1: false,
      contingencyBuffer: 0.1, // Contingency = (3+1)*0.1 = 0.4
      isSupportT1: false,
      isSupportT2: false,
      isSupportT3: false, // Support = 0
      // Final Hours = 3 + 1 + 0.4 + 0 = 4.4
    };
    // Intermediate Price = 4.4 * 100 = 440
    // Expected Base Price = MAX(440, 5000) = 5000
    const results = runCalculations(inputs);
    expect(results.basePrice).toBeCloseTo(5000);
  });

  it('calculates Rush Adjustment (when isRush=true)', () => {
    const inputs = {
      ...defaultInputs,
      isRush: true,
      rushFeeMultiplier: 0.25,
      // Inputs to generate Base Price = 17185 (from above test)
      baseHourlyRate: 100,
      minPrice: 5000,
      numFeatures: 10,
      cypressHrsBase: 3,
      cypressCoverage: 75,
      complexity: 1.5,
      playwrightCoverage: 0,
      jestHrsBase: 1,
      jestCoverage: 90,
      testRailCoverage: 0,
      howToDocsCount: 5,
      howToHrsPerDoc: 2,
      gwtDocsCount: 0,
      isAccessibilityT1: true,
      accessibilityFactorT1: 1.1,
      isPerformanceT1: true,
      performanceFactorT1: 1.2,
      isSoc2T1: false,
      contingencyBuffer: 0.2,
      isSupportT1: true,
      isSupportT2: false,
      isSupportT3: false,
      supportHoursT1: 10,
    };
    // Expected Adjustment = 17185 * 0.25 = 4296.25
    const results = runCalculations(inputs);
    expect(results.rushAdjustment).toBeCloseTo(4296.25);
  });

  it('calculates Rush Adjustment (when isRush=false)', () => {
    const inputs = {
      ...defaultInputs,
      isRush: false, // Rush is false
      rushFeeMultiplier: 0.25,
      // Inputs to generate Base Price = 17185
      baseHourlyRate: 100,
      minPrice: 5000,
      numFeatures: 10,
      cypressHrsBase: 3,
      cypressCoverage: 75,
      complexity: 1.5,
      playwrightCoverage: 0,
      jestHrsBase: 1,
      jestCoverage: 90,
      testRailCoverage: 0,
      howToDocsCount: 5,
      howToHrsPerDoc: 2,
      gwtDocsCount: 0,
      isAccessibilityT1: true,
      accessibilityFactorT1: 1.1,
      isPerformanceT1: true,
      performanceFactorT1: 1.2,
      isSoc2T1: false,
      contingencyBuffer: 0.2,
      isSupportT1: true,
      isSupportT2: false,
      isSupportT3: false,
      supportHoursT1: 10,
    };
    // Expected Adjustment = 0
    const results = runCalculations(inputs);
    expect(results.rushAdjustment).toBe(0);
  });

  it('calculates FINAL PRICE correctly', () => {
    const inputs = {
      ...defaultInputs,
      // Inputs to generate Base Price = 17185
      baseHourlyRate: 100,
      minPrice: 5000,
      numFeatures: 10,
      cypressHrsBase: 3,
      cypressCoverage: 75,
      complexity: 1.5,
      playwrightCoverage: 0,
      jestHrsBase: 1,
      jestCoverage: 90,
      testRailCoverage: 0,
      howToDocsCount: 5,
      howToHrsPerDoc: 2,
      gwtDocsCount: 0,
      isAccessibilityT1: true,
      accessibilityFactorT1: 1.1,
      isPerformanceT1: true,
      performanceFactorT1: 1.2,
      isSoc2T1: false,
      contingencyBuffer: 0.2,
      // Inputs to generate Rush Adjustment = 4296.25
      isRush: true,
      rushFeeMultiplier: 0.25,
      // Inputs to generate Support Price (Tier 1 = 1200)
      isSupportT1: true,
      isSupportT2: false,
      isSupportT3: false,
      supportHoursT1: 10,
      supportRateAdjT1: 1.2,
    };
    // Expected Final Price = 17185 (Base) + 4296.25 (Rush) + 1200 (Support) = 22681.25
    const results = runCalculations(inputs);
    expect(results.finalPrice).toBeCloseTo(22681.25);
  });
});

describe('Calculator Logic - (F) Duration Estimation', () => {
  it('calculates Estimated Weeks correctly', () => {
    const inputs = {
      ...defaultInputs,
      hoursPerWeek: 20,
      // Inputs to generate Final Hours = 171.85
      numFeatures: 10,
      cypressHrsBase: 3,
      cypressCoverage: 75,
      complexity: 1.5,
      playwrightCoverage: 0,
      jestHrsBase: 1,
      jestCoverage: 90,
      testRailCoverage: 0,
      howToDocsCount: 5,
      howToHrsPerDoc: 2,
      gwtDocsCount: 0,
      isAccessibilityT1: true,
      accessibilityFactorT1: 1.1,
      isPerformanceT1: true,
      performanceFactorT1: 1.2,
      isSoc2T1: false,
      contingencyBuffer: 0.2,
      isSupportT1: true,
      isSupportT2: false,
      isSupportT3: false,
      supportHoursT1: 10,
    };
    // Expected: 171.85 / 20 = 8.5925
    const results = runCalculations(inputs);
    expect(results.estimatedWeeks).toBeCloseTo(8.5925);
  });

  it('calculates Estimated Weeks (when hoursPerWeek=0)', () => {
    const inputs = {
      ...defaultInputs,
      hoursPerWeek: 0, // Zero hours per week
      // Inputs to generate Final Hours = 171.85
      numFeatures: 10,
      cypressHrsBase: 3,
      cypressCoverage: 75,
      complexity: 1.5,
      playwrightCoverage: 0,
      jestHrsBase: 1,
      jestCoverage: 90,
      testRailCoverage: 0,
      howToDocsCount: 5,
      howToHrsPerDoc: 2,
      gwtDocsCount: 0,
      isAccessibilityT1: true,
      accessibilityFactorT1: 1.1,
      isPerformanceT1: true,
      performanceFactorT1: 1.2,
      isSoc2T1: false,
      contingencyBuffer: 0.2,
      isSupportT1: true,
      isSupportT2: false,
      isSupportT3: false,
      supportHoursT1: 10,
    };
    // Expected: 0
    const results = runCalculations(inputs);
    expect(results.estimatedWeeks).toBe(0);
  });

  it('calculates Estimated Months (check rounding)', () => {
    const inputs = {
      ...defaultInputs,
      hoursPerWeek: 20, // Results in 8.5925 weeks
      // Inputs to generate Final Hours = 171.85
      numFeatures: 10,
      cypressHrsBase: 3,
      cypressCoverage: 75,
      complexity: 1.5,
      playwrightCoverage: 0,
      jestHrsBase: 1,
      jestCoverage: 90,
      testRailCoverage: 0,
      howToDocsCount: 5,
      howToHrsPerDoc: 2,
      gwtDocsCount: 0,
      isAccessibilityT1: true,
      accessibilityFactorT1: 1.1,
      isPerformanceT1: true,
      performanceFactorT1: 1.2,
      isSoc2T1: false,
      contingencyBuffer: 0.2,
      isSupportT1: true,
      isSupportT2: false,
      isSupportT3: false,
      supportHoursT1: 10,
    };
    // IntermediateMonths = 8.5925 / 4 = 2.148125
    // Expected: CEIL(2.148125 * 10) / 10 = CEIL(21.48125) / 10 = 22 / 10 = 2.2
    const results = runCalculations(inputs);
    expect(results.estimatedMonths).toBeCloseTo(2.2);
  });

  it('calculates Estimated Years (check rounding)', () => {
    const inputs = {
      ...defaultInputs,
      hoursPerWeek: 5, // Low hours/week results in 34.37 weeks -> 8.6 months
      // Inputs to generate Final Hours = 171.85
      numFeatures: 10,
      cypressHrsBase: 3,
      cypressCoverage: 75,
      complexity: 1.5,
      playwrightCoverage: 0,
      jestHrsBase: 1,
      jestCoverage: 90,
      testRailCoverage: 0,
      howToDocsCount: 5,
      howToHrsPerDoc: 2,
      gwtDocsCount: 0,
      isAccessibilityT1: true,
      accessibilityFactorT1: 1.1,
      isPerformanceT1: true,
      performanceFactorT1: 1.2,
      isSoc2T1: false,
      contingencyBuffer: 0.2,
      isSupportT1: true,
      isSupportT2: false,
      isSupportT3: false,
      supportHoursT1: 10,
    };
    // IntermediateMonths = 8.6 (from previous step logic)
    // IntermediateYears = 8.6 / 12 = 0.7166...
    // Expected: CEIL(0.7166... * 10) / 10 = CEIL(7.166...) / 10 = 8 / 10 = 0.8
    const results = runCalculations(inputs);
    // Need to ensure estimatedMonths is calculated first if not testing sequentially
    // const intermediateMonths = // Unused variable
    //   Math.ceil(
    //     (results.finalHours / parseFloatStrict(inputs.hoursPerWeek) / 4) * 10
    //   ) / 10;
    expect(results.estimatedYears).toBeCloseTo(0.8);
  });
});

// --- NEW Tests for Multiple Tier Accumulation ---

it('Accumulates Specialized hours/price for Accessibility T1 + T2', () => {
  const inputsT1 = {
    ...defaultInputs,
    isAccessibilityT1: true,
    isAccessibilityT2: false,
  };
  const inputsT2 = {
    ...defaultInputs,
    isAccessibilityT1: false,
    isAccessibilityT2: true,
  };
  const inputsBoth = {
    ...defaultInputs,
    isAccessibilityT1: true,
    isAccessibilityT2: true,
  };
  const resultsT1 = runCalculations(inputsT1);
  const resultsT2 = runCalculations(inputsT2);
  const resultsBoth = runCalculations(inputsBoth);

  // Expect accumulated hours to be sum of individual tier hours
  expect(resultsBoth.accessibilityHours).toBeCloseTo(
    resultsT1.accessibilityHours + resultsT2.accessibilityHours
  );
  // Expect accumulated price to be sum of individual tier prices
  expect(resultsBoth.accessibilityPrice).toBeCloseTo(
    resultsT1.accessibilityPrice + resultsT2.accessibilityPrice
  );
  // Expect final price to reflect the combined specialized cost
  expect(resultsBoth.finalPrice).toBeGreaterThan(resultsT1.finalPrice);
  expect(resultsBoth.finalPrice).toBeGreaterThan(resultsT2.finalPrice);
});

it('Accumulates Specialized hours/price for Performance T1 + T2', () => {
  const inputsT1 = {
    ...defaultInputs,
    isPerformanceT1: true,
    isPerformanceT2: false,
  };
  const inputsT2 = {
    ...defaultInputs,
    isPerformanceT1: false,
    isPerformanceT2: true,
  };
  const inputsBoth = {
    ...defaultInputs,
    isPerformanceT1: true,
    isPerformanceT2: true,
  };
  const resultsT1 = runCalculations(inputsT1);
  const resultsT2 = runCalculations(inputsT2);
  const resultsBoth = runCalculations(inputsBoth);

  expect(resultsBoth.performanceHours).toBeCloseTo(
    resultsT1.performanceHours + resultsT2.performanceHours
  );
  expect(resultsBoth.performancePrice).toBeCloseTo(
    resultsT1.performancePrice + resultsT2.performancePrice
  );
  expect(resultsBoth.finalPrice).toBeGreaterThan(resultsT1.finalPrice);
  expect(resultsBoth.finalPrice).toBeGreaterThan(resultsT2.finalPrice);
});

it('Accumulates Specialized hours/price for SOC2 T1 + T2', () => {
  const inputsT1 = { ...defaultInputs, isSoc2T1: true, isSoc2T2: false };
  const inputsT2 = { ...defaultInputs, isSoc2T1: false, isSoc2T2: true };
  const inputsBoth = { ...defaultInputs, isSoc2T1: true, isSoc2T2: true };
  const resultsT1 = runCalculations(inputsT1);
  const resultsT2 = runCalculations(inputsT2);
  const resultsBoth = runCalculations(inputsBoth);

  expect(resultsBoth.soc2Hours).toBeCloseTo(
    resultsT1.soc2Hours + resultsT2.soc2Hours
  );
  expect(resultsBoth.soc2Price).toBeCloseTo(
    resultsT1.soc2Price + resultsT2.soc2Price
  );
  expect(resultsBoth.finalPrice).toBeGreaterThan(resultsT1.finalPrice);
  expect(resultsBoth.finalPrice).toBeGreaterThan(resultsT2.finalPrice);
});

it('Accumulates Support hours/price for Support T1 + T2', () => {
  const inputsT1 = {
    ...defaultInputs,
    isSupportT1: true,
    isSupportT2: false,
    isSupportT3: false,
  };
  const inputsT2 = {
    ...defaultInputs,
    isSupportT1: false,
    isSupportT2: true,
    isSupportT3: false,
  };
  const inputsBoth = {
    ...defaultInputs,
    isSupportT1: true,
    isSupportT2: true,
    isSupportT3: false,
  };
  const resultsT1 = runCalculations(inputsT1);
  const resultsT2 = runCalculations(inputsT2);
  const resultsBoth = runCalculations(inputsBoth);

  // Expect accumulated hours to be sum of individual tier hours
  expect(resultsBoth.supportPackageHours).toBeCloseTo(
    resultsT1.supportPackageHours + resultsT2.supportPackageHours
  );
  // Expect accumulated price to be sum of individual tier prices
  expect(resultsBoth.supportPackagePrice).toBeCloseTo(
    resultsT1.supportPackagePrice + resultsT2.supportPackagePrice
  );
  // Expect final price to reflect the combined support cost
  expect(resultsBoth.finalPrice).toBeGreaterThan(resultsT1.finalPrice);
  expect(resultsBoth.finalPrice).toBeGreaterThan(resultsT2.finalPrice);
});

it('Accumulates Support hours/price for Support T2 + T3', () => {
  const inputsT2 = {
    ...defaultInputs,
    isSupportT1: false,
    isSupportT2: true,
    isSupportT3: false,
  };
  const inputsT3 = {
    ...defaultInputs,
    isSupportT1: false,
    isSupportT2: false,
    isSupportT3: true,
  };
  const inputsBoth = {
    ...defaultInputs,
    isSupportT1: false,
    isSupportT2: true,
    isSupportT3: true,
  };
  const resultsT1 = runCalculations(inputsT2); // T1 represents T2 here
  const resultsT2 = runCalculations(inputsT3); // T2 represents T3 here
  const resultsBoth = runCalculations(inputsBoth);

  expect(resultsBoth.supportPackageHours).toBeCloseTo(
    resultsT1.supportPackageHours + resultsT2.supportPackageHours
  );
  expect(resultsBoth.supportPackagePrice).toBeCloseTo(
    resultsT1.supportPackagePrice + resultsT2.supportPackagePrice
  );
  expect(resultsBoth.finalPrice).toBeGreaterThan(resultsT1.finalPrice);
  expect(resultsBoth.finalPrice).toBeGreaterThan(resultsT2.finalPrice);
});

it('Accumulates Support hours/price for Support T1 + T2 + T3', () => {
  const inputsT1 = {
    ...defaultInputs,
    isSupportT1: true,
    isSupportT2: false,
    isSupportT3: false,
  };
  const inputsT2 = {
    ...defaultInputs,
    isSupportT1: false,
    isSupportT2: true,
    isSupportT3: false,
  };
  const inputsT3 = {
    ...defaultInputs,
    isSupportT1: false,
    isSupportT2: false,
    isSupportT3: true,
  };
  const inputsAll = {
    ...defaultInputs,
    isSupportT1: true,
    isSupportT2: true,
    isSupportT3: true,
  };
  const resultsT1 = runCalculations(inputsT1);
  const resultsT2 = runCalculations(inputsT2);
  const resultsT3 = runCalculations(inputsT3);
  const resultsAll = runCalculations(inputsAll);
  const expectedHours =
    resultsT1.supportPackageHours +
    resultsT2.supportPackageHours +
    resultsT3.supportPackageHours;
  const expectedPrice =
    resultsT1.supportPackagePrice +
    resultsT2.supportPackagePrice +
    resultsT3.supportPackagePrice;

  expect(resultsAll.supportPackageHours).toBeCloseTo(expectedHours);
  expect(resultsAll.supportPackagePrice).toBeCloseTo(expectedPrice);
  // Check final price increase against individual tiers
  expect(resultsAll.finalPrice).toBeGreaterThan(resultsT1.finalPrice);
  expect(resultsAll.finalPrice).toBeGreaterThan(resultsT2.finalPrice);
  expect(resultsAll.finalPrice).toBeGreaterThan(resultsT3.finalPrice);
});
