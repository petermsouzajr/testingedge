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
} from '@react-email/components';

// --- Helper Functions (Copied from Calculator Template - adjust if needed) ---
const formatCurrency = (amount: number | undefined) => {
  if (amount === undefined || !Number.isFinite(amount)) return '$ -';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const formatHours = (hours: number | undefined) => {
  if (hours === undefined || !Number.isFinite(hours)) return '- hrs';
  return hours === 0 ? '0 hrs' : `${Math.round(hours)} hrs`; // Round hours for display
};

const formatPercent = (value: number | undefined) => {
  if (value === undefined || !Number.isFinite(value)) return '- %';
  return `${value.toFixed(0)}%`; // Already in % format from frontend
};

const formatBoolean = (value: boolean | undefined) => (value ? 'Yes' : 'No');
// --- End Helper Functions ---

// Define the expanded props interface
interface EstimateEmailToOwnerProps {
  userName: string;
  userEmail: string;
  customerInputs: {
    projectName?: string;
    numFeatures: string;
    isE2E: boolean;
    isUnitIntegration: boolean;
    needsDocsTestCaseManagement: boolean;
    needsDocsHowTo: boolean;
    needsAccessibility: boolean;
    needsPerformance: boolean;
    needsSoc2: boolean;
    isRush: boolean;
    notes?: string;
  };
  estimateProvided: {
    finalHoursMin: number;
    finalHoursMax: number;
    finalPriceMin: number;
    finalPriceMax: number;
  };
  assumptionsMade: {
    baseHourlyRateUsed: number;
    contingencyBufferUsed: number;
    complexityFactorUsed: number;
    documentationFactorUsed: number;
    specializedFactorUsed: number;
    rushFactorUsed: number;
  };
}

export const EstimateEmailToOwner: React.FC<EstimateEmailToOwnerProps> = (
  props
) => {
  const {
    userName,
    userEmail,
    customerInputs,
    estimateProvided,
    assumptionsMade,
  } = props;

  const previewText = `Estimate Request from ${userName}`;
  const generatedDate = new Date().toLocaleString();
  const projectNameDisplay = customerInputs.projectName || 'Not Provided';

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[20px] max-w-[700px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Heading className="mx-0 my-[20px] p-0 text-center text-[24px] font-normal text-black">
              New Estimate Request Received
            </Heading>
            <Text className="text-center text-[14px] leading-[24px]">
              Customer Name: <strong>{userName}</strong>
              <br />
              Customer Email: <strong>{userEmail}</strong>
              <br />
              Project Name/Type Provided: <strong>{projectNameDisplay}</strong>
              <br />
              Timestamp: {generatedDate}
            </Text>

            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />

            {/* --- Estimate Provided to Customer --- */}
            <Section>
              <Heading
                as="h2"
                className="text-[20px] font-medium text-gray-800"
              >
                Estimate Range Provided to Customer
              </Heading>
              <Text className="text-[14px] leading-[20px] text-black">
                - Estimated Price Range:{' '}
                <strong>
                  {formatCurrency(estimateProvided.finalPriceMin)} -{' '}
                  {formatCurrency(estimateProvided.finalPriceMax)}
                </strong>
                <br />- Estimated Hours Range:{' '}
                <strong>
                  {formatHours(estimateProvided.finalHoursMin)} -{' '}
                  {formatHours(estimateProvided.finalHoursMax)}
                </strong>
              </Text>
            </Section>

            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />

            {/* --- Customer's Key Scope Inputs --- */}
            <Section>
              <Heading
                as="h2"
                className="text-[20px] font-medium text-gray-800"
              >
                Customer Inputs
              </Heading>
              <Text className="text-[14px] leading-[20px] text-black">
                - Number of Key Features/Flows: {customerInputs.numFeatures}
                <br />
                <strong>Primary Automation Need(s):</strong>
                <br />
                &nbsp;&nbsp;- E2E Testing: {formatBoolean(customerInputs.isE2E)}
                <br />
                &nbsp;&nbsp;- Unit/Integration Testing:{' '}
                {formatBoolean(customerInputs.isUnitIntegration)}
                <br />
                <strong>Documentation Add-ons:</strong>
                <br />
                &nbsp;&nbsp;- Test Case Management:{' '}
                {formatBoolean(customerInputs.needsDocsTestCaseManagement)}
                <br />
                &nbsp;&nbsp;- How-To Guides/Team Docs:{' '}
                {formatBoolean(customerInputs.needsDocsHowTo)}
                <br />
                <strong>Specialized Testing Add-ons:</strong>
                <br />
                &nbsp;&nbsp;- Accessibility:{' '}
                {formatBoolean(customerInputs.needsAccessibility)}
                <br />
                &nbsp;&nbsp;- Performance:{' '}
                {formatBoolean(customerInputs.needsPerformance)}
                <br />
                &nbsp;&nbsp;- SOC2 Prep:{' '}
                {formatBoolean(customerInputs.needsSoc2)}
                <br />
                <strong>Timeline:</strong>
                <br />
                &nbsp;&nbsp;- Rush Project:{' '}
                {formatBoolean(customerInputs.isRush)}
              </Text>
            </Section>

            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />

            {/* --- Assumptions Made for Estimate --- */}
            <Section>
              <Heading
                as="h2"
                className="text-[20px] font-medium text-gray-800"
              >
                Estimate Calculation Assumptions
              </Heading>
              <Text className="text-[14px] leading-[20px] text-black">
                - Base Hourly Rate Used:{' '}
                {formatCurrency(assumptionsMade.baseHourlyRateUsed)}
                <br />- Complexity Factor Applied:{' '}
                {assumptionsMade.complexityFactorUsed.toFixed(2)}
                <br />- Documentation Factor Applied:{' '}
                {assumptionsMade.documentationFactorUsed.toFixed(2)}
                <br />- Specialized Needs Factor Applied:{' '}
                {assumptionsMade.specializedFactorUsed.toFixed(2)}
                <br />- Rush Project Factor Applied:{' '}
                {assumptionsMade.rushFactorUsed.toFixed(2)}
                <br />- Contingency Buffer Applied:{' '}
                {formatPercent(assumptionsMade.contingencyBufferUsed * 100)}
              </Text>
            </Section>

            {/* --- Customer Notes --- */}
            {customerInputs.notes && customerInputs.notes.trim() !== '' && (
              <>
                <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
                <Section>
                  <Heading
                    as="h2"
                    className="text-[20px] font-medium text-gray-800"
                  >
                    Additional Notes from Customer
                  </Heading>
                  <Text className="text-[14px] leading-[24px] text-black">
                    {customerInputs.notes}
                  </Text>
                </Section>
              </>
            )}

            {/* --- Footer --- */}
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Text className="text-[12px] leading-[24px] text-[#666666]">
              Generated by Testing Edge Estimate Tool | {generatedDate}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default EstimateEmailToOwner;
