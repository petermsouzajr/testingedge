'use server';

import React from 'react';
import { Resend } from 'resend';
import type { CreateEmailResponse } from 'resend'; // Import the type
import { validateString, getErrorMessage } from '@/lib/utils'; // Assuming you have or will create validation utils
import ContactFormEmail from '@/components/emails/contact-form-email';
// Placeholder imports for new email components
import EstimateEmailToUser from '@/components/emails/estimate-email-to-user';
import EstimateEmailToOwner from '@/components/emails/estimate-email-to-owner';
import CalculatorQuoteToOwner from '@/components/emails/calculator-quote-to-owner'; // Import the new template

const resend = new Resend(process.env.RESEND_API_KEY);
// Define owner email from environment variable with a fallback
const OWNER_EMAIL = process.env.OWNER_EMAIL || 'petermsouzajr@gmail.com';

// Remove the custom type definition
// type ResendSuccessResponse = {
//   id: string;
// };

// Update the return type interface using the imported type
interface SendEmailResult {
  data?: CreateEmailResponse; // Use the type from the library
  error?: string;
}

export const sendEmail = async (
  formData: FormData
): Promise<SendEmailResult> => {
  const senderEmail = formData.get('senderEmail');
  const message = formData.get('message');

  // Simple server-side validation
  if (!validateString(senderEmail, 500)) {
    return {
      error: 'Invalid sender email',
    };
  }
  if (!validateString(message, 5000)) {
    return {
      error: 'Invalid message',
    };
  }

  let data;
  try {
    data = await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>', // Use a verified domain in production!
      to: OWNER_EMAIL, // Use variable for owner email
      subject: 'Message from Contact Form - testing-edge', // Customize subject
      replyTo: senderEmail as string,
      react: React.createElement(ContactFormEmail, {
        message: message as string,
        senderEmail: senderEmail as string,
      }),
      // Alternatively, use `html` or `text` for non-React templates
      // text: message as string,
    });
  } catch (error: unknown) {
    return {
      error: getErrorMessage(error), // Use a helper to parse error
    };
  }

  // Success
  return {
    data,
  };
};

// --- NEW: sendEstimateEmail Action ---

// Interface for the payload expected from the estimate form frontend (EXPANDED)
interface EstimatePayload {
  // Customer Info
  userName: string;
  userEmail: string;

  // Customer Inputs (Nested Object)
  customerInputs: {
    projectName?: string; // Optional
    numFeatures: string; // Keep as string from form
    isE2E: boolean;
    isUnitIntegration: boolean;
    needsDocsTestCaseManagement: boolean;
    needsDocsHowTo: boolean;
    needsAccessibility: boolean;
    needsPerformance: boolean;
    needsSoc2: boolean;
    isRush: boolean;
    notes?: string; // Optional
  };

  // Estimate Provided (Nested Object)
  estimateProvided: {
    finalHoursMin: number;
    finalHoursMax: number;
    finalPriceMin: number;
    finalPriceMax: number;
  };

  // Assumptions Made (Nested Object) - Updated to match calculator output
  assumptionsMade: {
    baseHourlyRateUsed: number;
    contingencyBufferUsed: number; // Added
    complexityFactorUsed: number; // Renamed from complexity
    documentationFactorUsed: number; // New based on doc counts
    specializedFactorUsed: number; // New based on specialized needs
    rushFactorUsed: number; // New based on rush toggle
    // Removed: browsers, cypressCoverage, jestCoverage, testRailCoverage, howToCount, gwtCount, accessibilityTier, performanceTier, soc2Tier, supportIncluded, baseHourlyRate
  };
}

// Interface for the result of the new action (Remains the same)
interface SendEstimateEmailResult {
  success?: boolean;
  error?: string;
}

export const sendEstimateEmail = async (
  payload: EstimatePayload // Type uses the new expanded interface
): Promise<SendEstimateEmailResult> => {
  // Destructure the new payload structure
  const {
    userName,
    userEmail,
    customerInputs,
    estimateProvided,
    assumptionsMade,
  } = payload;

  // --- Server-side validation ---
  if (!validateString(userName, 100)) {
    return { error: 'Invalid user name' };
  }
  if (!validateString(userEmail, 100)) {
    return { error: 'Invalid user email' };
  }
  // Add validation for nested objects if needed
  if (!customerInputs || !estimateProvided || !assumptionsMade) {
    return { error: 'Incomplete estimate data received.' };
  }
  if (
    customerInputs.notes &&
    typeof customerInputs.notes === 'string' &&
    customerInputs.notes.length > 5000
  ) {
    return { error: 'Notes cannot exceed 5000 characters.' };
  }

  try {
    // --- Email to User (Map payload to match existing template props) ---
    // const userEmailResult = // Comment out assignment if result not used
    await resend.emails.send({
      from: 'Testing Edge Estimates <onboarding@resend.dev>',
      to: userEmail,
      subject: 'Your Test Automation Project Estimate',
      replyTo: OWNER_EMAIL,
      react: React.createElement(EstimateEmailToUser, {
        userName: userName,
        // Map estimateProvided to the expected 'estimate' structure
        estimate: {
          priceMin: estimateProvided.finalPriceMin,
          priceMax: estimateProvided.finalPriceMax,
          hoursMin: estimateProvided.finalHoursMin,
          hoursMax: estimateProvided.finalHoursMax,
        },
        // Map customerInputs to the expected 'selections' structure
        selections: {
          projectName: customerInputs.projectName,
          numFeatures: customerInputs.numFeatures,
          isE2E: customerInputs.isE2E,
          isUnitIntegration: customerInputs.isUnitIntegration,
          needsDocsTestCaseManagement:
            customerInputs.needsDocsTestCaseManagement,
          needsDocsHowTo: customerInputs.needsDocsHowTo,
          needsAccessibility: customerInputs.needsAccessibility,
          needsPerformance: customerInputs.needsPerformance,
          needsSoc2: customerInputs.needsSoc2,
          isRush: customerInputs.isRush,
          notes: customerInputs.notes,
        },
      }),
    });

    // --- Email to Owner (Uses the expanded payload) ---
    const ownerEmailResult = await resend.emails.send({
      from: 'Estimate Notification <onboarding@resend.dev>',
      to: OWNER_EMAIL,
      subject: customerInputs.projectName
        ? `Customer Estimate Request: ${customerInputs.projectName}`
        : 'New Customer Estimate Request',
      replyTo: userEmail,
      // This part still expects EstimateEmailToOwnerProps to be updated
      react: React.createElement(EstimateEmailToOwner, {
        userName: userName,
        userEmail: userEmail,
        customerInputs: customerInputs,
        estimateProvided: estimateProvided,
        assumptionsMade: assumptionsMade, // This now aligns with the updated payload
      }),
    });
    console.log(
      '[sendEstimateEmail] Owner email send result:',
      JSON.stringify(ownerEmailResult, null, 2)
    );
    // Add handling for userEmailResult if needed, or remove if truly unused
    // console.log('[sendEstimateEmail] User email send result:', JSON.stringify(userEmailResult, null, 2));

    return { success: true };
  } catch (error: unknown) {
    console.error('Error sending estimate email(s): ', error);
    return {
      error: getErrorMessage(error),
    };
  }
};

// --- NEW: sendCalculatorQuoteToOwner Action ---

// Interface for the payload expected from the calculator page frontend (EXPANDED)
interface CalculatorQuotePayload {
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
  notes?: string; // Keep optional
}

// Interface for the result of the new action (Remains the same)
interface SendCalculatorQuoteResult {
  success?: boolean;
  error?: string;
}

export const sendCalculatorQuoteToOwner = async (
  payload: CalculatorQuotePayload // Type signature now uses the expanded interface
): Promise<SendCalculatorQuoteResult> => {
  // No need to extract notes separately anymore if validation is minimal
  // const { notes, ...restOfPayload } = payload;

  // --- Server-side validation (simplified for now) ---
  if (
    payload.notes &&
    typeof payload.notes === 'string' &&
    payload.notes.length > 5000
  ) {
    return { error: 'Notes cannot exceed 5000 characters.' };
  }
  if (!payload.projectName || payload.projectName.trim() === '') {
    return { error: 'Project Name is required.' };
  }
  if (payload.finalPrice <= 0 || !Number.isFinite(payload.finalPrice)) {
    return { error: 'Invalid calculation results provided (Final Price).' };
  }

  try {
    // --- Email to Owner Only ---
    const ownerEmailResult = await resend.emails.send({
      // IMPORTANT: Replace with your verified domain for production
      from: 'Testing Edge Field Quote <onboarding@resend.dev>',
      to: OWNER_EMAIL,
      // Update subject line to include project name
      subject: `Testing Edge Field Quote: ${payload.projectName}`,
      react: React.createElement(CalculatorQuoteToOwner, {
        ...payload, // Pass the entire expanded payload to the template
      }),
    });

    // Check for Resend API errors in the result
    if (ownerEmailResult.error) {
      console.error(
        '[sendCalculatorQuoteToOwner] Resend API Error:',
        ownerEmailResult.error
      );
      return {
        error: `Email sending failed: ${ownerEmailResult.error.message}`,
      };
    }

    console.log(
      '[sendCalculatorQuoteToOwner] Email sent successfully to owner.'
    );
    return { success: true };
  } catch (error: unknown) {
    console.error('[sendCalculatorQuoteToOwner] Error sending email:', error);
    return {
      error: getErrorMessage(error),
    };
  }
};
