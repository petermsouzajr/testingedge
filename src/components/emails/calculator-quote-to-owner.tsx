import React from 'react';
import {
  Html,
  Body,
  Head,
  Heading,
  Hr,
  Container,
  Preview,
  Section,
  Text,
  Tailwind,
  Row,
  Column,
} from '@react-email/components';

// Interface for the props - Should match the EXPANDED CalculatorQuotePayload
interface CalculatorQuoteToOwnerProps {
  // Project Identification
  projectName: string;

  // Key Inputs
  baseHourlyRateInput: number;
  hoursPerWeekInput: number;
  numFeaturesInput: number;
  complexityInput: number;
  browsersInput: number;
  cypressCoverageInput: number;
  playwrightCoverageInput: number;
  jestCoverageInput: number;
  testRailCoverageInput: number;
  howToDocsCountInput: number;
  gwtDocsCountInput: number;

  // Selections (Booleans)
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

  // Calculated Results - Summaries
  finalPrice: number;
  finalHours: number;
  estimatedWeeks: number;
  estimatedMonths: number;
  effectiveRate: number;

  // Calculated Results - Cost Breakdown
  basePrice: number;
  accessibilityPrice: number;
  performancePrice: number;
  soc2Price: number;
  supportPackagePrice: number;
  rushAdjustment: number;

  // Calculated Results - Hours Breakdown
  cypressHours: number;
  playwrightHours: number;
  jestHours: number;
  testRailHours: number;
  howToHours: number;
  gwtHours: number;
  accessibilityHours: number;
  performanceHours: number;
  soc2Hours: number;
  totalBaseHours: number;
  contingencyHours: number;
  supportPackageHours: number;

  // Configuration Used
  contingencyBufferUsed: number;
  rushFeeMultiplierUsed: number;

  // Notes
  notes?: string;
}

// --- Helper Functions ---
const formatCurrency = (amount: number | undefined) => {
  if (amount === undefined || !Number.isFinite(amount)) return '$ -';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const formatHours = (hours: number | undefined) => {
  if (hours === undefined || !Number.isFinite(hours)) return '- hrs';
  // Show 1 decimal place, unless it's 0
  return hours === 0 ? '0 hrs' : `${hours.toFixed(1)} hrs`;
};

const formatPercent = (value: number | undefined) => {
  if (value === undefined || !Number.isFinite(value)) return '- %';
  return `${(value * 100).toFixed(0)}%`;
};

const formatBoolean = (value: boolean | undefined) => (value ? 'Yes' : 'No');

const getTier = (isT1: boolean, isT2: boolean) => {
  if (isT2) return 'Tier 2';
  if (isT1) return 'Tier 1';
  return 'No';
};

const getSupportTier = (isT1: boolean, isT2: boolean, isT3: boolean) => {
  if (isT3) return 'Tier 3 (Strategic)';
  if (isT2) return 'Tier 2 (Growth)';
  if (isT1) return 'Tier 1 (Essential)';
  return 'None Selected';
};
// --- End Helper Functions ---

export const CalculatorQuoteToOwner: React.FC<CalculatorQuoteToOwnerProps> = (
  props
) => {
  const {
    projectName,
    baseHourlyRateInput,
    hoursPerWeekInput,
    numFeaturesInput,
    complexityInput,
    browsersInput,
    cypressCoverageInput,
    playwrightCoverageInput,
    jestCoverageInput,
    testRailCoverageInput,
    howToDocsCountInput,
    gwtDocsCountInput,
    isAccessibilityT1,
    isAccessibilityT2,
    isPerformanceT1,
    isPerformanceT2,
    isSoc2T1,
    isSoc2T2,
    isSupportT1,
    isSupportT2,
    isSupportT3,
    isRush,
    finalPrice,
    finalHours,
    estimatedWeeks,
    estimatedMonths,
    effectiveRate,
    basePrice,
    accessibilityPrice,
    performancePrice,
    soc2Price,
    supportPackagePrice,
    rushAdjustment,
    cypressHours,
    playwrightHours,
    jestHours,
    testRailHours,
    howToHours,
    gwtHours,
    accessibilityHours,
    performanceHours,
    soc2Hours,
    totalBaseHours,
    contingencyHours,
    supportPackageHours,
    contingencyBufferUsed,
    rushFeeMultiplierUsed,
    notes,
  } = props;

  const previewText = `Estimate Details for ${projectName}`;
  const generatedDate = new Date().toLocaleString();

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[20px] max-w-[700px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Heading className="mx-0 my-[20px] p-0 text-center text-[24px] font-normal text-black">
              Project Estimate Details
            </Heading>
            <Text className="text-[14px] leading-[24px] text-center text-gray-600">
              Project Name: <strong>{projectName}</strong>
              <br />
              Date Generated: {generatedDate}
            </Text>

            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />

            {/* --- Executive Summary --- */}
            <Section>
              <Heading
                as="h2"
                className="text-[20px] font-medium text-gray-800"
              >
                Overall Estimate Summary
              </Heading>
              <Text className="text-[14px] leading-[20px] text-black">
                - FINAL ESTIMATED PRICE:{' '}
                <strong>{formatCurrency(finalPrice)}</strong>
                <br />- TOTAL ESTIMATED HOURS:{' '}
                <strong>{formatHours(finalHours)}</strong>
                <br />- ESTIMATED DURATION: {estimatedMonths?.toFixed(1)} months
                ({estimatedWeeks?.toFixed(1)} weeks) @ {hoursPerWeekInput}{' '}
                hrs/week
                <br />- Effective Hourly Rate: {formatCurrency(effectiveRate)}
                /hr
              </Text>
            </Section>

            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />

            {/* --- Cost Breakdown --- */}
            <Section>
              <Heading
                as="h2"
                className="text-[20px] font-medium text-gray-800"
              >
                Cost Breakdown
              </Heading>
              <Text className="text-[14px] leading-[20px] text-black">
                - Base Project Price (incl. Contingency):{' '}
                {formatCurrency(basePrice)}
                <br />
                &nbsp;&nbsp;
                <em>
                  (Includes Contingency Buffer:{' '}
                  {formatPercent(contingencyBufferUsed)})
                </em>
                <br />
                {accessibilityPrice > 0 && (
                  <>
                    - Accessibility Cost: {formatCurrency(accessibilityPrice)}
                    <br />
                  </>
                )}
                {performancePrice > 0 && (
                  <>
                    - Performance Cost: {formatCurrency(performancePrice)}
                    <br />
                  </>
                )}
                {soc2Price > 0 && (
                  <>
                    - SOC2 Prep Cost: {formatCurrency(soc2Price)}
                    <br />
                  </>
                )}
                {supportPackagePrice > 0 && (
                  <>
                    - Support Package Cost:{' '}
                    {formatCurrency(supportPackagePrice)}
                    <br />
                  </>
                )}
                {rushAdjustment > 0 && (
                  <>
                    - Rush Fee Adjustment: {formatCurrency(rushAdjustment)}
                    <br />
                  </>
                )}
                --------------------
                <br />
                <strong>
                  TOTAL ESTIMATED PRICE: {formatCurrency(finalPrice)}
                </strong>
              </Text>
            </Section>

            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />

            {/* --- Hours Breakdown --- */}
            <Section>
              <Heading
                as="h2"
                className="text-[20px] font-medium text-gray-800"
              >
                Hours Breakdown
              </Heading>
              <Text className="text-[14px] leading-[20px] text-black">
                <strong>Core Automation & Documentation:</strong>
                <br />
                &nbsp;&nbsp;- Cypress E2E: {formatHours(cypressHours)}
                <br />
                &nbsp;&nbsp;- Playwright Cross-Browser:{' '}
                {formatHours(playwrightHours)}
                <br />
                &nbsp;&nbsp;- Jest/Vitest Unit/Int: {formatHours(jestHours)}
                <br />
                &nbsp;&nbsp;- TestRail Cases: {formatHours(testRailHours)}
                <br />
                &nbsp;&nbsp;- How-To Docs: {formatHours(howToHours)}
                <br />
                &nbsp;&nbsp;- GWT Scenarios: {formatHours(gwtHours)}
                <br />
                {(accessibilityHours > 0 ||
                  performanceHours > 0 ||
                  soc2Hours > 0) && (
                  <>
                    <strong>Specialized Services:</strong>
                    <br />
                    {accessibilityHours > 0 && (
                      <>
                        &nbsp;&nbsp;- Accessibility:{' '}
                        {formatHours(accessibilityHours)}
                        <br />
                      </>
                    )}
                    {performanceHours > 0 && (
                      <>
                        &nbsp;&nbsp;- Performance:{' '}
                        {formatHours(performanceHours)}
                        <br />
                      </>
                    )}
                    {soc2Hours > 0 && (
                      <>
                        &nbsp;&nbsp;- SOC2 Prep: {formatHours(soc2Hours)}
                        <br />
                      </>
                    )}
                  </>
                )}
                --------------------
                <br />
                Subtotal (Base Project Hours): {formatHours(totalBaseHours)}
                <br />
                Contingency Hours: {formatHours(contingencyHours)}
                <br />
                {supportPackageHours > 0 && (
                  <>
                    Support Package Hours: {formatHours(supportPackageHours)}
                    <br />
                  </>
                )}
                --------------------
                <br />
                <strong>
                  TOTAL ESTIMATED HOURS: {formatHours(finalHours)}
                </strong>
              </Text>
            </Section>

            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />

            {/* --- Key Scope Inputs & Selections --- */}
            <Section>
              <Heading
                as="h2"
                className="text-[20px] font-medium text-gray-800"
              >
                Based On These Inputs
              </Heading>
              <Row>
                <Column className="pr-4">
                  <Text className="text-[14px] leading-[20px] text-black">
                    - Number of Features/Flows: {numFeaturesInput}
                    <br />- Project Complexity Multiplier: {complexityInput}
                    <br />- Target Browsers/Devices: {browsersInput}
                    <br />
                    <strong>Coverage Targets:</strong>
                    <br />
                    &nbsp;&nbsp;- Cypress E2E:{' '}
                    {formatPercent(cypressCoverageInput / 100)}
                    <br />
                    &nbsp;&nbsp;- Playwright:{' '}
                    {formatPercent(playwrightCoverageInput / 100)}
                    <br />
                    &nbsp;&nbsp;- Jest/Vitest:{' '}
                    {formatPercent(jestCoverageInput / 100)}
                    <br />
                    &nbsp;&nbsp;- TestRail:{' '}
                    {formatPercent(testRailCoverageInput / 100)}
                    <br />
                  </Text>
                </Column>
                <Column>
                  <Text className="text-[14px] leading-[20px] text-black">
                    <strong>Documentation Count:</strong>
                    <br />
                    &nbsp;&nbsp;- How-To Guides: {howToDocsCountInput}
                    <br />
                    &nbsp;&nbsp;- GWT Scenarios: {gwtDocsCountInput}
                    <br />
                    <strong>Specialized Services Included:</strong>
                    <br />
                    &nbsp;&nbsp;- Accessibility:{' '}
                    {getTier(isAccessibilityT1, isAccessibilityT2)}
                    <br />
                    &nbsp;&nbsp;- Performance:{' '}
                    {getTier(isPerformanceT1, isPerformanceT2)}
                    <br />
                    &nbsp;&nbsp;- SOC2 Prep: {getTier(isSoc2T1, isSoc2T2)}
                    <br />
                    <strong>Selected Support Package:</strong>
                    <br />
                    &nbsp;&nbsp;-{' '}
                    {getSupportTier(isSupportT1, isSupportT2, isSupportT3)}
                    <br />
                    <strong>Rush Project:</strong> {formatBoolean(isRush)}
                    <br />
                  </Text>
                </Column>
              </Row>
            </Section>

            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />

            {/* --- Configuration Snapshot --- */}
            <Section>
              <Heading
                as="h2"
                className="text-[20px] font-medium text-gray-800"
              >
                Configuration Snapshot
              </Heading>
              <Text className="text-[14px] leading-[20px] text-black">
                - Base Hourly Rate Used: {formatCurrency(baseHourlyRateInput)}
                /hr
                <br />- Contingency Buffer Used:{' '}
                {formatPercent(contingencyBufferUsed)}
                <br />- Rush Fee Multiplier Used:{' '}
                {formatPercent(rushFeeMultiplierUsed)}
              </Text>
            </Section>

            {/* --- Notes --- */}
            {notes && notes.trim() !== '' && (
              <>
                <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
                <Section>
                  <Heading
                    as="h2"
                    className="text-[20px] font-medium text-gray-800"
                  >
                    Notes
                  </Heading>
                  <Text className="text-[14px] leading-[24px] text-black">
                    {notes}
                  </Text>
                </Section>
              </>
            )}

            {/* --- Footer --- */}
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Text className="text-[12px] leading-[24px] text-[#666666]">
              © Testing Edge | Generated: {generatedDate}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default CalculatorQuoteToOwner;
