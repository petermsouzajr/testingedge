# Analytics Setup and Content Security Policy (CSP) Guide

This guide explains how to integrate a web analytics solution into the project and how to adjust the Content Security Policy (CSP) to ensure it works correctly.

## 1. Configure and Enable Analytics

**Why:** To track website traffic and user behaviour, allowing you to measure the success metrics defined in `docs/00_Project_Overview_and_Goals.md` and understand how users interact with your site.

**Steps:**

1.  **Choose an Analytics Provider:** Select a provider that meets your needs. Popular options include:

    - **Plausible Analytics:** Privacy-focused, simple.
    - **Fathom Analytics:** Privacy-focused, simple.
    - **Google Analytics (GA4):** Feature-rich, free, but requires careful consideration of privacy regulations (GDPR, CCPA).

2.  **Sign Up & Get Tracking Info:** Register with your chosen provider and follow their instructions to get your site-specific tracking code snippet or configuration details (e.g., a measurement ID for GA4, a `data-domain` for Plausible/Fathom).

3.  **Add Script to Layout:**

    - Navigate to the root layout file: `src/app/layout.tsx`.
    - Locate the commented-out `<Script>` tag placeholder within the `<head>` section.
    - Uncomment the `<Script>` tag.
    - **Modify the attributes** based on your provider. Examples:

      - **Plausible/Fathom Example:**

        ```jsx
        <Script
          defer
          data-domain="yourdomain.com" // <-- Replace with YOUR domain registered with Plausible/Fathom
          src="https://plausible.io/js/script.js" // <-- Or Fathom's script URL
        />
        ```

      - **Google Analytics (GA4) Example (using `next/script`):**
        ```jsx
        const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // <-- Replace with your GA4 Measurement ID
        // ...
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        ```

    - Ensure you use the correct script URL and configuration attributes (`data-domain`, measurement ID, etc.) provided by your chosen analytics service.

4.  **Update Content Security Policy (CSP):** Proceed to the next section. Analytics scripts almost always require CSP adjustments.

## 2. Refine Content Security Policy (CSP)

**Why:** The project includes a basic, restrictive CSP in `next.config.mjs` for security. This default policy will likely block external resources like analytics scripts from loading or sending data. You need to explicitly allow the domains used by your analytics provider.

**Steps:**

1.  **Identify Blocked Resources:**

    - Deploy your changes (including the added analytics script).
    - Open your website in a browser.
    - Open the browser's **Developer Tools** (usually by pressing F12).
    - Navigate to the **Console** tab.
    - Look for error messages related to `Content Security Policy` or `CSP`. These messages will typically state which directive (e.g., `script-src`, `connect-src`) blocked which resource URL.

2.  **Modify `next.config.mjs`:**

    - Open the `next.config.mjs` file in your project root.
    - Locate the `headers` function and the `Content-Security-Policy` header within it.
    - Edit the `value` string of the `Content-Security-Policy` header.
    - Based on the console errors, add the necessary domain(s) to the appropriate directives. You often need to modify:
      - `script-src`: Add the domain where the analytics script is hosted (e.g., `www.googletagmanager.com`, `plausible.io`).
      - `connect-src`: Add the domain where the analytics script sends data to (e.g., `www.google-analytics.com`, `plausible.io`).
    - **Example (adding Plausible):**
      ```js
      // Inside next.config.mjs -> headers function -> Content-Security-Policy value
      value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' plausible.io; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; object-src 'none'; frame-ancestors 'self'; form-action 'self'; base-uri 'self'; connect-src 'self' plausible.io;";
      // Note: Added plausible.io to script-src and connect-src
      ```
    - **Example (adding Google Analytics GA4):**
      ```js
      // Inside next.config.mjs -> headers function -> Content-Security-Policy value
      value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; object-src 'none'; frame-ancestors 'self'; form-action 'self'; base-uri 'self'; connect-src 'self' www.google-analytics.com;";
      // Note: Added domains to script-src and connect-src
      ```

3.  **Redeploy and Test:**
    - Save the changes to `next.config.mjs`.
    - Redeploy your application.
    - Clear your browser cache and revisit the site.
    - Check the developer console again to ensure the CSP errors related to your analytics provider are gone.
    - Verify in your analytics provider's dashboard that data is being received.

**Important:** Be precise when adding domains to the CSP. Only allow domains that are strictly necessary. Repeat the process if you add other third-party scripts, fonts, or resources later.
