// src/config/pricingConfig.ts
/**
 * HOW TO USE THIS FILE:
 *
 * This file centralizes all configurable parameters, default values,
 * and assumptions used by both the Internal Calculator (`CalculatorPage`)
 * and the Customer Estimate (`EstimatePage`).
 *
 * WHEN TO MODIFY:
 * - Update CORE_CONFIG, BASE_EFFORT, SPECIALIZED_FACTORS, or SUPPORT_DEFAULTS
 *   if your fundamental pricing, effort estimates, or package structures change.
 *   These changes will affect BOTH calculators where applicable.
 * - Update ESTIMATE_CONFIG or ESTIMATE_ASSUMPTIONS if you want to change how the
 *   *customer-facing preliminary estimate* is calculated (e.g., change the
 *   default complexity assumption or the +/- range factor) WITHOUT affecting
 *   the internal tool's defaults.
 * - Update CALCULATOR_INITIAL_STATE to change the *default starting values*
 *   shown in the input fields of the *internal* calculator UI. This does NOT
 *   change the core calculation logic itself, only what the employee sees initially.
 *
 * IMPACT:
 * - Changes here can significantly affect calculated prices and hours.
 * - Always test thoroughly after making modifications.
 * - Ensure consistency (e.g., if you change BASE_HOURLY_RATE, the dependent
 *   support package prices should likely be reviewed, although the current
 *   formula calculates them dynamically).
 */

// --- Core Configuration (Used by Both Calculators where applicable) ---
export const CORE_CONFIG = {
  /**
   * BASE_HOURLY_RATE: Your standard billing rate per hour ($).
   * - Affects: All price calculations (Specialized, Support, Base Project Price, Final Price)
   *            in both the Internal Calculator and the Estimate Page helper.
   * - How to Update: Change the numeric value.
   * - Impact: Directly scales all calculated prices up or down.
   */
  BASE_HOURLY_RATE: 125.0,

  /**
   * HOURS_PER_WEEK_STANDARD: Estimated average hours worked per week for standard projects.
   * - Affects: Duration Estimation (Weeks, Months, Years) in the Internal Calculator
   *            when 'Rush Project' is NOT selected.
   * - How to Update: Change the numeric value (integer).
   * - Impact: Higher value decreases estimated duration; lower value increases it.
   */
  HOURS_PER_WEEK_STANDARD: 25,

  /**
   * HOURS_PER_WEEK_RUSH: Target average hours worked per week for rush projects.
   * - Affects: Duration Estimation (Weeks, Months, Years) in the Internal Calculator
   *            when 'Rush Project' IS selected.
   * - How to Update: Change the numeric value (integer), should ideally be > HOURS_PER_WEEK_STANDARD.
   * - Impact: Higher value significantly decreases estimated duration for rush projects.
   */
  HOURS_PER_WEEK_RUSH: 35,

  /**
   * MIN_PRICE: The absolute minimum price charged for any project estimate.
   * - Affects: 'Base Price (excl. Rush)' and consequently 'FINAL ESTIMATED PRICE'
   *            in both calculators. The calculated base price will not go below this value.
   * - How to Update: Change the numeric value.
   * - Impact: Acts as a price floor for smaller projects.
   */
  MIN_PRICE: 10000.0,

  /**
   * CONTINGENCY_BUFFER: Decimal percentage added to Total Base Hours for unforeseen issues.
   * - Affects: 'Contingency Hours', 'Final Total Hours', 'Base Price', 'FINAL PRICE'
   *            in both calculators. Also used implicitly in the Estimate Page range factor
   *            unless ESTIMATE_CONFIG.ESTIMATE_RANGE_FACTOR overrides it explicitly.
   * - How to Update: Change the decimal value (e.g., 0.15 for 15%).
   * - Impact: Increases estimated hours and price to account for risk.
   */
  CONTINGENCY_BUFFER: 0.15,

  /**
   * RUSH_FEE_MULTIPLIER: Decimal percentage increase applied to the Base Price if Rush=yes.
   * - Affects: 'Rush Adjustment' and 'FINAL PRICE' in both calculators.
   *            Also affects the 'assumptions.rushFactorUsed' in the Estimate Page helper.
   * - How to Update: Change the decimal value (e.g., 0.2 for 20%).
   * - Impact: Increases the final price for rush projects. Does NOT affect hours directly.
   */
  RUSH_FEE_MULTIPLIER: 0.2,
};

// --- Base Effort Per Unit (Used by Both Calculators) ---
// These represent the estimated time (in hours) for ONE unit of work at 100% coverage
// and base complexity (1.0), before scaling.
export const BASE_EFFORT = {
  /**
   * CYPRESS_HRS_PER_FEATURE: Base hours for E2E testing (Cypress) per feature.
   * - Affects: 'Cypress Hours' calculation in both calculators. Also the basis for
   *            Specialized Service hour calculations (Accessibility, Performance, SOC2)
   *            in the currently implemented logic.
   * - How to Update: Change numeric value based on your typical E2E effort.
   * - Impact: Major driver of total hours and price.
   */
  CYPRESS_HRS_PER_FEATURE: 3,

  /**
   * PLAYWRIGHT_HRS_PER_FEATURE: Base hours for cross-browser testing (Playwright) per feature.
   * - Affects: 'Playwright Hours' calculation in the Internal Calculator. (Currently unused
   *            in Estimate Page as Playwright coverage defaults to 0 there).
   * - How to Update: Change numeric value based on typical cross-browser effort.
   * - Impact: Affects hours/price in Internal Calc if Playwright Coverage > 0.
   */
  PLAYWRIGHT_HRS_PER_FEATURE: 3,

  /**
   * JEST_HRS_PER_FEATURE: Base hours for Unit/Integration testing (Jest/Vitest) per feature.
   * - Affects: 'Jest/Vitest Hours' calculation in both calculators.
   * - How to Update: Change numeric value based on typical unit/integration effort.
   * - Impact: Drives hours/price related to code-level testing.
   */
  JEST_HRS_PER_FEATURE: 1,

  /**
   * TESTRAIL_HRS_PER_FEATURE: Base hours for creating Test Cases (TestRail/Xray) per feature.
   * - Affects: 'TestRail Hours' calculation in both calculators.
   * - How to Update: Change numeric value based on typical test case writing effort.
   * - Impact: Drives hours/price related to formal test documentation.
   */
  TESTRAIL_HRS_PER_FEATURE: 1.5,

  /**
   * HOWTO_HRS_PER_DOC: Average hours to write one 'How-To' guide.
   * - Affects: 'How-To Hours' calculation in both calculators (based on doc count).
   * - How to Update: Change numeric value.
   * - Impact: Scales documentation effort based on the number of guides.
   */
  HOWTO_HRS_PER_DOC: 2,

  /**
   * GWT_HRS_PER_DOC: Average hours to write one Gherkin (Given-When-Then) file.
   * - Affects: 'GWT Hours' calculation in both calculators (based on doc count).
   * - How to Update: Change numeric value.
   * - Impact: Scales documentation effort based on the number of GWT files.
   */
  GWT_HRS_PER_DOC: 1.5,
};

// --- Specialized Service Factors (Effort multiplier relative to Base Calc) ---
// These factors scale the effort for specialized services. The current logic bases
// this scaling on the calculated 'Cypress Hours' (Internal Calc) or a strict
// sheet formula base (Features*Complexity*Browsers - Internal Calc).
// The Estimate Page uses Cypress Hours as base and only T1 factors.
export const SPECIALIZED_FACTORS = {
  /**
   * ACCESSIBILITY_T1/T2: Multiplier applied to base hours for Tier 1 / Tier 2 effort.
   * - Affects: 'Accessibility Hours Calc' & 'Accessibility Price' in Internal Calc.
   *            Estimate Page logic currently only uses ACCESSIBILITY_T1 via ESTIMATE_CONFIG.
   * - How to Update: Change numeric value (1 = same effort as base, 1.5 = 50% more).
   * - Impact: Scales the estimated effort/cost for accessibility testing.
   */
  ACCESSIBILITY_T1: 1,
  ACCESSIBILITY_T2: 1.5,

  /**
   * PERFORMANCE_T1/T2: Multiplier applied to base hours for Tier 1 / Tier 2 effort.
   * - Affects: 'Performance Hours Calc' & 'Performance Price' in Internal Calc.
   *            Estimate Page logic currently only uses PERFORMANCE_T1 via ESTIMATE_CONFIG.
   * - How to Update: Change numeric value.
   * - Impact: Scales the estimated effort/cost for performance testing.
   */
  PERFORMANCE_T1: 1,
  PERFORMANCE_T2: 1.8,

  /**
   * SOC2_T1/T2: Multiplier applied to base hours for Tier 1 / Tier 2 effort.
   * - Affects: 'SOC2 Hours Calc' & 'SOC2 Price' in Internal Calc.
   *            Estimate Page logic currently only uses SOC2_T1 via ESTIMATE_CONFIG.
   * - How to Update: Change numeric value.
   * - Impact: Scales the estimated effort/cost for SOC2 prep testing.
   */
  SOC2_T1: 1.2,
  SOC2_T2: 2,
};

// --- Support Package Defaults (Used for Internal Calculator Inputs & Price Calculation) ---
export const SUPPORT_DEFAULTS = {
  /**
   * T1_HOURS: Included hours per month for Tier 1 support.
   * - Affects: Default value in Internal Calculator UI ('Support T1 Hours' input).
   *            Used in 'Selected Support Package Hours' calculation (Internal Calc).
   *            Used in 'Calculated Tier 1 Price' calculation (Internal Calc).
   * - How to Update: Change numeric value.
   * - Impact: Changes default hours & price for Tier 1.
   */
  T1_HOURS: 10,

  /**
   * T1_RATE_ADJ: Multiplier for Tier 1 effective hourly rate vs Base Rate.
   * - Affects: Default value in Internal Calculator UI ('Support T1 Rate Adj.' input).
   *            Used in 'Calculated Tier 1 Price' calculation (Internal Calc).
   * - How to Update: Change numeric value (1 = same as Base Rate, 1.2 = 20% higher).
   * - Impact: Adjusts Tier 1 price relative to standard rate.
   */
  T1_RATE_ADJ: 1.2,

  /**
   * T2_HOURS: TOTAL included hours for Tier 2 support (typically over 3 months).
   * - Affects: Default value in Internal Calculator UI ('Support T2 Hours' input).
   *            Used in 'Selected Support Package Hours' calculation (Internal Calc).
   *            Used in 'Calculated Tier 2 Price' calculation (Internal Calc).
   * - How to Update: Change numeric value (total hours for package).
   * - Impact: Changes default hours & price for Tier 2.
   */
  T2_HOURS: 40,

  /**
   * T2_RATE_ADJ: Multiplier for Tier 2 effective hourly rate vs Base Rate.
   * - Affects: Default value in Internal Calculator UI ('Support T2 Rate Adj.' input).
   *            Used in 'Calculated Tier 2 Price' calculation (Internal Calc).
   * - How to Update: Change numeric value (e.g., 0.85 = 15% lower effective rate).
   * - Impact: Adjusts Tier 2 price relative to standard rate.
   */
  T2_RATE_ADJ: 0.85,

  /**
   * T3_HOURS: TOTAL included hours for Tier 3 support (typically over 6 months).
   * - Affects: Default value in Internal Calculator UI ('Support T3 Hours' input).
   *            Used in 'Selected Support Package Hours' calculation (Internal Calc).
   *            Used in 'Calculated Tier 3 Price' calculation (Internal Calc).
   * - How to Update: Change numeric value (total hours for package).
   * - Impact: Changes default hours & price for Tier 3.
   */
  T3_HOURS: 90,

  /**
   * T3_RATE_ADJ: Multiplier for Tier 3 effective hourly rate vs Base Rate.
   * - Affects: Default value in Internal Calculator UI ('Support T3 Rate Adj.' input).
   *            Used in 'Calculated Tier 3 Price' calculation (Internal Calc).
   * - How to Update: Change numeric value.
   * - Impact: Adjusts Tier 3 price relative to standard rate.
   */
  T3_RATE_ADJ: 0.85,
};

// --- Customer Estimate Page Specific Assumptions & Config ---
// These values are used DIRECTLY by the calculateEstimateDetails function
// in the EstimatePage component. They define the fixed assumptions and
// parameters for the *simplified customer estimate*.
export const ESTIMATE_CONFIG = {
  /**
   * BASE_HOURLY_RATE: Rate used for customer estimate price range calculation.
   * - Affects: Estimate Page price range calculation.
   * - How to Update: Change value. Consider if it should differ from CORE_CONFIG.
   * - Impact: Scales estimate price range.
   */
  BASE_HOURLY_RATE: CORE_CONFIG.BASE_HOURLY_RATE, // Currently uses core value

  /**
   * CONTINGENCY_BUFFER: Buffer used for customer estimate hour/price range calculation.
   * - Affects: Estimate Page hour/price range calculation.
   * - How to Update: Change value.
   * - Impact: Scales estimate hours/price range.
   */
  CONTINGENCY_BUFFER: CORE_CONFIG.CONTINGENCY_BUFFER, // Currently uses core value

  /**
   * RUSH_FEE_MULTIPLIER: Multiplier used for customer estimate price range if Rush=yes.
   * - Affects: Estimate Page price range calculation when Rush is selected.
   * - How to Update: Change value.
   * - Impact: Increases estimate price range for rush requests.
   */
  RUSH_FEE_MULTIPLIER: CORE_CONFIG.RUSH_FEE_MULTIPLIER, // Currently uses core value

  /**
   * MIN_PRICE: Minimum price floor applied to the customer estimate price range.
   * - Affects: Estimate Page price range calculation (lower bound).
   * - How to Update: Change value.
   * - Impact: Sets minimum price shown, potentially collapsing range if calculated max is lower.
   */
  MIN_PRICE: CORE_CONFIG.MIN_PRICE, // Currently uses core value

  /**
   * ACCESSIBILITY_FACTOR: Factor used for customer estimate (assumes Tier 1).
   * - Affects: Estimate Page specialized hours/price calculation if Accessibility selected.
   * - How to Update: Change value (references T1 factor by default).
   * - Impact: Scales Accessibility portion of estimate.
   */
  ACCESSIBILITY_FACTOR: SPECIALIZED_FACTORS.ACCESSIBILITY_T1,

  /**
   * PERFORMANCE_FACTOR: Factor used for customer estimate (assumes Tier 1).
   * - Affects: Estimate Page specialized hours/price calculation if Performance selected.
   * - How to Update: Change value (references T1 factor by default).
   * - Impact: Scales Performance portion of estimate.
   */
  PERFORMANCE_FACTOR: SPECIALIZED_FACTORS.PERFORMANCE_T1,

  /**
   * SOC2_FACTOR: Factor used for customer estimate (assumes Tier 1).
   * - Affects: Estimate Page specialized hours/price calculation if SOC2 selected.
   * - How to Update: Change value (references T1 factor by default).
   * - Impact: Scales SOC2 portion of estimate.
   */
  SOC2_FACTOR: SPECIALIZED_FACTORS.SOC2_T1,

  /**
   * ESTIMATE_RANGE_FACTOR: The +/- percentage applied to the calculated center point
   *                        to generate the displayed min/max range for price and hours.
   * - Affects: The width of the Hour Range and Price Range displayed on Estimate Page.
   * - How to Update: Change decimal value (e.g., 0.2 = +/- 20%).
   * - Impact: Wider range accounts for more uncertainty; narrower range seems more precise.
   */
  ESTIMATE_RANGE_FACTOR: 0.2, // +/- 20% range
};

// These define the default assumptions made by the Estimate Page calculator
// when specific inputs aren't provided by the user or are simplified.
export const ESTIMATE_ASSUMPTIONS = {
  /**
   * COMPLEXITY: Default complexity multiplier assumed for customer estimates.
   * - Affects: All hour calculations on Estimate Page based on features.
   * - How to Update: Change numeric value (e.g., 1, 1.5, 2).
   * - Impact: Higher value increases all feature-based hour estimates.
   */
  COMPLEXITY: 1.5, // Assume Medium

  /**
   * BROWSERS_E2E: Assumed browser count if E2E testing is selected by customer.
   * - Affects: Specialized hours base calculation on Estimate Page if E2E selected.
   * - How to Update: Change integer value.
   * - Impact: May indirectly affect specialized hours estimate if using strict sheet base logic.
   */
  BROWSERS_E2E: 2,

  /**
   * BROWSERS_DEFAULT: Assumed browser count if E2E testing is NOT selected.
   * - Affects: Specialized hours base calculation on Estimate Page if E2E not selected.
   * - How to Update: Change integer value.
   * - Impact: See above.
   */
  BROWSERS_DEFAULT: 1,

  /**
   * CYPRESS_COVERAGE: Assumed E2E coverage % if E2E is selected by customer.
   * - Affects: Cypress hour calculation on Estimate Page.
   * - How to Update: Change decimal value (e.g., 0.75 for 75%).
   * - Impact: Directly scales Cypress hours estimate.
   */
  CYPRESS_COVERAGE: 0.75,

  /**
   * JEST_COVERAGE: Assumed Unit/Int coverage % if Unit/Integration is selected.
   * - Affects: Jest/Vitest hour calculation on Estimate Page.
   * - How to Update: Change decimal value.
   * - Impact: Directly scales Jest/Vitest hours estimate.
   */
  JEST_COVERAGE: 0.8,

  /**
   * TESTRAIL_COVERAGE: Assumed Test Case coverage % if Docs TCM is selected.
   * - Affects: TestRail hour calculation on Estimate Page.
   * - How to Update: Change decimal value.
   * - Impact: Directly scales TestRail hours estimate.
   */
  TESTRAIL_COVERAGE: 0.8,

  /**
   * DOCS_BASE_COUNT: Base number of How-To/GWT docs assumed if *any* doc option selected.
   * - Affects: How-To/GWT hour calculation on Estimate Page.
   * - How to Update: Change integer value.
   * - Impact: Sets a minimum documentation effort if docs are needed.
   */
  DOCS_BASE_COUNT: 2,

  /**
   * DOCS_PER_FEATURE_RATE: Additional docs per feature assumed if *any* doc option selected.
   * - Affects: How-To/GWT hour calculation on Estimate Page.
   * - How to Update: Change decimal value (e.g., 0.15 = 15% of features get a doc).
   * - Impact: Scales documentation effort based on project size.
   */
  DOCS_PER_FEATURE_RATE: 0.15,
};

// --- Internal Calculator Initial State Defaults ---
// These values ONLY set the *initial display* of the internal calculator form fields.
// They are read once when the component mounts. Subsequent calculations use the
// values stored in the component's `inputs` state, which the user can edit.
// Changing these WILL NOT change the core calculation logic, only the starting point for the user.
export const CALCULATOR_INITIAL_STATE = {
  baseHourlyRate: String(CORE_CONFIG.BASE_HOURLY_RATE.toFixed(2)),
  hoursPerWeek: String(CORE_CONFIG.HOURS_PER_WEEK_STANDARD),
  rushHoursPerWeek: String(CORE_CONFIG.HOURS_PER_WEEK_RUSH),
  minPrice: String(CORE_CONFIG.MIN_PRICE.toFixed(2)),
  contingencyBuffer: String(CORE_CONFIG.CONTINGENCY_BUFFER),
  rushFeeMultiplier: String(CORE_CONFIG.RUSH_FEE_MULTIPLIER),
  cypressHrsBase: String(BASE_EFFORT.CYPRESS_HRS_PER_FEATURE),
  playwrightHrsBase: String(BASE_EFFORT.PLAYWRIGHT_HRS_PER_FEATURE),
  jestHrsBase: String(BASE_EFFORT.JEST_HRS_PER_FEATURE),
  testRailHrsBase: String(BASE_EFFORT.TESTRAIL_HRS_PER_FEATURE),
  howToHrsPerDoc: String(BASE_EFFORT.HOWTO_HRS_PER_DOC),
  gwtHrsPerDoc: String(BASE_EFFORT.GWT_HRS_PER_DOC),
  accessibilityFactorT1: String(SPECIALIZED_FACTORS.ACCESSIBILITY_T1),
  accessibilityFactorT2: String(SPECIALIZED_FACTORS.ACCESSIBILITY_T2),
  performanceFactorT1: String(SPECIALIZED_FACTORS.PERFORMANCE_T1),
  performanceFactorT2: String(SPECIALIZED_FACTORS.PERFORMANCE_T2),
  soc2FactorT1: String(SPECIALIZED_FACTORS.SOC2_T1),
  soc2FactorT2: String(SPECIALIZED_FACTORS.SOC2_T2),
  supportRateAdjT1: String(SUPPORT_DEFAULTS.T1_RATE_ADJ),
  supportRateAdjT2: String(SUPPORT_DEFAULTS.T2_RATE_ADJ),
  supportRateAdjT3: String(SUPPORT_DEFAULTS.T3_RATE_ADJ),
  supportHoursT1: String(SUPPORT_DEFAULTS.T1_HOURS),
  supportHoursT2: String(SUPPORT_DEFAULTS.T2_HOURS),
  supportHoursT3: String(SUPPORT_DEFAULTS.T3_HOURS),
  // Default project scope values (can be empty or representative)
  projectName: '',
  numFeatures: '10',
  complexity: '1.5',
  browsers: '1',
  cypressCoverage: '75',
  playwrightCoverage: '',
  jestCoverage: '80',
  testRailCoverage: '80',
  howToDocsCount: '2',
  gwtDocsCount: '5',
  // Default selections
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
