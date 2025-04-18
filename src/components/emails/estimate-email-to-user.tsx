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
  Link,
  Tailwind,
} from '@react-email/components';

// Define specific types for props
interface EstimateEmailToUserProps {
  userName: string;
  estimate: {
    priceMin: number;
    priceMax: number;
    hoursMin: number;
    hoursMax: number;
  };
  selections: {
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
}

const EstimateEmailToUser: React.FC<EstimateEmailToUserProps> = ({
  userName,
  estimate,
  selections,
}) => {
  const previewText = `Your Testing Edge Project Estimate`;
  const bookingLink = process.env.NEXT_PUBLIC_BOOKING_URL || '#'; // Add your booking URL to env

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        {' '}
        {/* Allows using Tailwind classes */}
        <Body className="bg-gray-100 text-black">
          <Container>
            <Section className="bg-white border border-gray-200 my-10 px-10 py-4 rounded-md">
              <Heading className="leading-tight">Hello {userName},</Heading>
              <Text>
                Thank you for requesting a project estimate from Testing Edge!
              </Text>
              <Text>
                Based on your selections, here is your preliminary estimate:
              </Text>
              <Hr />
              <Heading as="h2" className="text-lg font-semibold">
                Preliminary Estimate Range:
              </Heading>
              <Text>
                <strong>Hours:</strong> {estimate.hoursMin} -{' '}
                {estimate.hoursMax}
              </Text>
              <Text>
                <strong>Price:</strong> ${estimate.priceMin.toLocaleString()} -
                ${estimate.priceMax.toLocaleString()}
              </Text>
              <Text className="text-sm italic text-gray-600">
                Note: This is a preliminary estimate. A detailed consultation is
                recommended for a precise quote.
              </Text>
              <Hr />
              <Heading as="h2" className="text-lg font-semibold">
                Your Selections:
              </Heading>
              <ul className="list-disc list-inside ml-4">
                {selections.projectName && (
                  <li>Project Name: {selections.projectName}</li>
                )}
                <li>Key Features/Flows: {selections.numFeatures}</li>
                {selections.isE2E && <li>Primary Need: E2E Testing</li>}
                {selections.isUnitIntegration && (
                  <li>Primary Need: Unit/Integration Testing</li>
                )}
                {selections.needsDocsTestCaseManagement && (
                  <li>Add-on: Test Case Management Setup</li>
                )}
                {selections.needsDocsHowTo && (
                  <li>Add-on: How-To Guides / Team Docs</li>
                )}
                {selections.needsAccessibility && (
                  <li>Add-on: Accessibility Testing (WCAG)</li>
                )}
                {selections.needsPerformance && (
                  <li>Add-on: Performance Testing</li>
                )}
                {selections.needsSoc2 && (
                  <li>Add-on: SOC2 Preparation Support</li>
                )}
                {selections.isRush && <li>Timeline: Rush Project</li>}
                {selections.notes && <li>Notes: {selections.notes}</li>}
              </ul>
              <Hr />
              <Text>
                We will review your request and follow up shortly. You can also
                schedule a free consultation directly using the link below:
              </Text>
              <Section className="text-center mt-[32px] mb-[32px]">
                <Link
                  href={bookingLink}
                  className="bg-blue-600 text-white rounded-md px-5 py-3 text-sm font-medium"
                >
                  Schedule Consultation
                </Link>
              </Section>
              <Text>Best regards,</Text>
              <Text>The Testing Edge Team</Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default EstimateEmailToUser;
