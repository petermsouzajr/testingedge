# 05: Website Testing, Deployment & Launch Plan - Testing for Hire Website

_(Note: This document covers testing of the website itself, not the consultancy's client services.)_

## 1. Website Testing Strategy (QA)

- **Functional Testing:**
  - Verify all links (internal, external) work correctly.
  - Test navigation menus on all device sizes.
  - Test contact form submission and notification delivery.
  - Test calculator login and conditional display functionality.
  - Verify any interactive elements (accordions, modals) function as expected.
- **Cross-Browser Testing:**
  - Test on latest versions of major browsers: Chrome, Firefox, Safari, Edge.
  - Check layout, functionality, and styling consistency.
- **Cross-Device / Responsive Testing:**
  - Test on various physical devices (iOS phone, Android phone, tablet).
  - Use browser developer tools for simulating different screen sizes and orientations.
  - Verify layout integrity, readability, and usability across breakpoints.
- **Performance Testing:**
  - Use Google PageSpeed Insights, Lighthouse, and WebPageTest.
  - Analyze Core Web Vitals (LCP, FID, CLS). Target >85 mobile score.
  - Check load times on simulated mobile networks (e.g., Fast 3G).
  - Verify image optimization and asset loading efficiency.
- **Accessibility Testing (Validation):**
  - Adhere to WCAG 2.1/2.2 Level AA guidelines.
  - Run automated scans (axe-core, WAVE tool).
  - Perform manual checks:
    - Keyboard-only navigation (tabbing order, focus visibility).
    - Screen reader testing (e.g., NVDA, VoiceOver) for key pages/flows (Homepage, Services, Contact, Calculator).
    - Color contrast checks.
    - Zoom testing (up to 200%).
- **Content Review:**
  - Proofread all text content for typos, grammatical errors.
  - Verify accuracy of service descriptions, pricing info, contact details.
  - Check image quality and appropriateness.
- **SEO Checks:**
  - Verify title tags and meta descriptions are present and unique for each page.
  - Check `robots.txt` allows crawling of necessary pages.
  - Validate `sitemap.xml` structure and content.
  - Check for broken links.
- **Security Checks (Basic):**
  - Verify contact form doesn't expose sensitive info and has spam protection.
  - Verify calculator authentication protects content as expected.
  - Confirm HTTPS is enforced.
  - Check security headers are present.

## 2. Deployment Pipeline

- **Environment:** Staging/Preview environment automatically built by hosting provider (Netlify/Vercel) for each Pull Request or push to a staging branch.
- **Process:**
  1.  Developer pushes code to a feature branch.
  2.  Creates Pull Request (PR) against `main` (or `develop`) branch.
  3.  CI pipeline runs (linting, build checks).
  4.  Hosting provider creates a unique preview URL for the PR.
  5.  QA (or designated reviewer) performs checks based on Section 1 above on the preview deployment.
  6.  If approved, PR is merged into `main`.
  7.  CI/CD pipeline triggers production build and deployment.

## 3. Pre-Launch Checklist

- [ ] Final QA testing cycle completed on staging/preview environment (all checks from Section 1 passed).
- [ ] All critical/major bugs fixed.
- [ ] Final content review and approval from client.
- [ ] Domain DNS configured to point to the hosting provider.
- [ ] HTTPS certificate provisioned and active.
- [ ] Analytics tracking code installed and verified.
- [ ] `robots.txt` configured for production (allow indexing).
- [ ] `sitemap.xml` generated and accessible.
- [ ] Security headers configured.
- [ ] Production environment variables set (e.g., `INTERNAL_USER`, `INTERNAL_PASS`, `JWT_SECRET`).
- [ ] Backup plan confirmed (Git + Hosting).
- [ ] 301 redirects set up (if replacing an old site or changing URLs).

## 4. Launch

- Schedule launch during a low-traffic period if possible.
- Merge final approved code into the `main` branch.
- Monitor the production deployment via hosting provider dashboard.
- Perform smoke tests on the live site immediately after deployment:
  - Check Homepage loads correctly.
  - Verify navigation works.
  - Test contact form submission.
  - Test calculator login/access.
  - Check key pages render correctly on mobile and desktop.
- Submit `sitemap.xml` to Google Search Console.

## 5. Post-Launch Monitoring

- Monitor analytics for unexpected behaviour (e.g., high bounce rates, 404 errors).
- Monitor hosting platform for build/runtime errors.
- Check Google Search Console for indexing status and errors.
