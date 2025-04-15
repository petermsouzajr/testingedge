# Documentation: Customer Pricing Estimate Feature (Testing Edge)

## 1. Overview

This document details the plan for an interactive service selection and estimate emailing feature for the Testing Edge consultancy website.

**Purpose:**

- Allow potential clients to browse the primary service packages (Core, Comprehensive, Accessibility, Performance) and the Compliance Add-On.
- Enable users to select a primary package and optionally the add-on, potentially indicating interest in specific tiers for specialized services.
- Display an _estimated starting price range_ based on the selected package(s), clarifying that a formal quote requires consultation.
- Provide fields for users to add project details, questions, or notes.
- Allow users to enter their email address.
- Enable users to send themselves an email summarizing their selections, notes, and the estimated starting price range.
- Capture the user's email and selections as a qualified lead for the consultancy.

**User Flow:**

1.  User navigates to a dedicated "Services & Estimate" page or section.
2.  User interacts with components representing the service packages (e.g., `PackageItem`):
    - Selects one primary package (e.g., using radio buttons or clickable cards).
    - Optionally selects the Compliance Add-On (e.g., using a checkbox).
    - If selecting Accessibility or Performance packages, potentially indicates interest in Tier 1 vs. Tier 2 (e.g., via simple selectors, details clarified in consultation).
3.  The "Email Your Estimate" section dynamically updates to reflect the selected package and its estimated starting price range (based on data from `07_Business_Model_Pricing_Strategy.md`).
4.  User enters project details/notes and their email address.
5.  User clicks the "Email Estimate Summary" button.
6.  A Server Action processes the data, validates inputs, and uses Resend (or similar) to send a formatted HTML email to the user.
7.  User receives feedback (e.g., success/error toast message).

## 2. Core Concepts

- **Client-Side Interactivity:** React (`useState`, event handlers) in client components (`'use client'`) manage user selections, notes, and email input without page reloads.
- **Dynamic Display:** UI updates in real-time to show the selected package and its corresponding estimated price range.
- **Server Actions:** Next.js Server Actions (`'use server'`) handle form submission, securely process data, retrieve appropriate price range info, and trigger email sending.
- **State Management:** The main page/component managing this feature holds the state for selections, notes, email, and the displayed estimate range.
- **Component Structure:** UI broken into reusable components (e.g., `PackageItem`, `EstimateSection`).
- **Transactional Email Service:** Resend used for reliable email delivery.
- **Pricing Data:** Relies on base pricing ranges and tier information defined in `07_Business_Model_Pricing_Strategy.md`.

## 3. Implementation Details (Plan)

### 3.1. Data Definition (`lib/consultancyServicesData.ts` or similar)

- Define interface(s) for service packages and add-ons.
- Include fields like `id`, `name`, `description`, `bestFor`, `basePriceRange` (e.g., "$15k-$25k"), `typicalDuration`, `isSpecialized` (boolean), `hasTiers` (boolean).
- Export an array containing the definitions for Core, Comprehensive, Accessibility (T1/T2 indicated), Performance (T1/T2 indicated), and the Compliance Add-On.

### 3.2. Main Page/Section State & Logic (`app/services/page.tsx` or relevant component)

- Use `'use client'`.
- **State Hooks:**
  - `useState<string | null>(null)`: Manages the ID of the selected primary package.
  - `useState<boolean>(false)`: Manages selection state of the Compliance Add-On.
  - `useState<string>('Tier 1')` / `useState<string>('Tier 1')`: Potentially manage selected tier preference for Accessibility/Performance if chosen.
  - `useState<string>('')`: Manages notes input.
  - `useState<string>('')`: Manages user email input.
- **Event Handlers:**
  - `handlePackageSelect`: Updates the selected primary package ID.
  - `handleAddOnToggle`: Toggles the compliance add-on state.
  - `handleTierSelect`: Updates tier preference state.
- **Estimate Display Logic (`useMemo` or similar):**
  - Based on selected package ID and add-on state, determine the relevant `basePriceRange` and `typicalDuration` to display.
  - Clearly label the displayed price as an "Estimated Starting Range" and state that complexity/scope affects the final quote.
- **Rendering:** Render package components, passing selection state and handlers. Render the estimate section, passing displayed estimate info, notes/email state, and setters.

### 3.3. Package Item Display (`components/sections/PackageItem.tsx` or similar)

- Receives package data, selection state (`isSelected`), and selection handler (`onSelect`).
- Displays package `name`, `description`, `bestFor`, base price range, typical duration.
- Uses radio buttons or styled cards for selection, calling `onSelect`.
- If `package.hasTiers` is true, potentially show simple Tier 1/2 selectors (details explained elsewhere or in consultation).

### 3.4. Estimate Section UI (`components/sections/EstimateSection.tsx` or similar)

- Uses `'use client'`.
- Receives displayed estimate range/duration, notes, email, setters, and potentially the selected package details.
- Uses `useTransition` for form submission pending state.
- Displays the estimated starting price range and duration.
- Includes a clear disclaimer: "This is an estimate based on typical scope. A formal quote requires a consultation to discuss your specific project needs."
- Renders `Textarea` for `notes` and `Input` for `userEmail`, bound to state.
- Contains the `<form>` with `onSubmit` handler (`handleSendEstimate`).
- Includes "Email Estimate Summary" `Button`, disabled when pending or email is missing.
- **`handleSendEstimate` Function:**
  - Prevents default submission.
  - Calls `startTransition`.
  - Gathers selected package ID, add-on status, tier preferences, notes, email.
  - Calls the `sendConsultancyEstimateEmail` server action.
  - Displays success/error toast messages.
  - Resets notes/email on success.

### 3.5. Server Action (`app/actions.ts` - `sendConsultancyEstimateEmail`)

- Uses `'use server'`.
- Imports Resend, email template, service data from `lib/consultancyServicesData.ts`.
- Defines `sendConsultancyEstimateEmail` async function accepting selections, notes, email.
- **Input Validation:** Check API key, valid email format, etc.
- **Data Retrieval:** Look up the full details (name, description, base range, tier info) for the selected package ID and add-on from the server-side service data.
- **Resend API Call:**
  - Initialize Resend client.
  - Call `resend.emails.send({...})`.
  - `from`: Verified sending address (e.g., `Testing Edge Estimate <estimate@your-domain.com>`).
  - `to`: User's provided email.
  - `replyTo`: Consultancy contact email.
  - `subject`: "Your Testing Edge Service Estimate Summary".
  - `react`: Render the `EstimateEmailTemplate` component, passing user email, notes, and the _retrieved details_ of the selected package/add-on/tiers (including base price range).
- **Response Handling:** Return success/error status.

### 3.6. Email Template (`email/EstimateEmailTemplate.tsx`)

- React component for email HTML.
- Receives user email, notes, selected package details (name, description, base range), add-on status/details, tier preference.
- Clearly displays the selected package name and description.
- Shows the selected add-on if applicable.
- Indicates the selected Tier preference if relevant.
- Displays the **Estimated Starting Price Range** for the selection.
- **Crucially includes a disclaimer:** "This estimate is based on typical project scopes. The final price depends on factors like feature count, complexity, and specific requirements. Please schedule a consultation to receive a formal quote tailored to your project."
- Displays the user's notes.
- Includes a clear Call To Action (e.g., a button/link to the consultation scheduling page/contact form).
- Uses inline styles for compatibility.

### 3.7. Environment Variables

- `RESEND_API_KEY` needed locally and in production.

## 4. Reproducing in Testing Edge Project (Summary)

1.  **Define Data:** Create `lib/consultancyServicesData.ts` with packages, add-ons, base price ranges, tier info (referencing `07_Business_Model_Pricing_Strategy.md`).
2.  **Manage State:** Use `useState` in the relevant page/component for selected package ID, add-on status, tier preference, notes, email.
3.  **Build UI:** Create `PackageItem` and `EstimateSection` components.
4.  **Implement Handlers:** Write functions to update state on user interaction.
5.  **Display Estimate:** Show the _base price range_ and duration dynamically based on selections.
6.  **Create Server Action:** Handle form submission, validate, look up package details server-side, call Resend, render email template, return status.
7.  **Design Email Template:** Create a React component displaying selected package details, base price range, notes, disclaimer, and consultation CTA.
8.  **Handle Form:** Use `useTransition`, call server action `onSubmit`, show feedback.
9.  **Set Env Vars:** Configure `RESEND_API_KEY`.

## 5. Key Technologies

- Next.js (App Router), React (Hooks), TypeScript
- Next.js Server Actions
- Resend (or similar email service)
- Tailwind CSS / Shadcn/UI (Optional)
- React Hot Toast (Optional)

## 6. Considerations

- **Clarity is Key:** Emphasize that this tool provides a _starting estimate range_ and a formal quote requires consultation. Avoid presenting it as a precise calculator.
- **Lead Quality:** This feature helps capture leads who have actively engaged with service offerings.
- **Complexity vs. Simplicity:** Keep the user interaction simple (select package, maybe add-on/tier preference). Avoid asking for complex inputs like feature count or complexity on this public-facing tool.
- **Data Source:** Ensure the base price ranges displayed are kept consistent with the internal strategy defined in `07_Business_Model_Pricing_Strategy.md`.
