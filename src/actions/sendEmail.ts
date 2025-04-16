'use server';

import React from 'react';
import { Resend } from 'resend';
import type { CreateEmailResponse } from 'resend'; // Import the type
import { validateString, getErrorMessage } from '@/lib/utils'; // Assuming you have or will create validation utils
import ContactFormEmail from '@/components/emails/contact-form-email';

const resend = new Resend(process.env.RESEND_API_KEY);

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
      to: 'petermsouzajr@gmail.com', // Your receiving email address
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
