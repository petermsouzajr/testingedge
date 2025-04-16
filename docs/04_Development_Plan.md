# 04: Development Plan - Testing for Hire Website

## 1. Setup & Configuration

- Initialize Git repository (e.g., on GitHub, GitLab). (Done by `create-next-app`)
- Set up the chosen SSG project (Astro, Eleventy, Next.js). (Next.js chosen and set up)
- Configure build tools, CSS framework (Tailwind), linters (ESLint, Prettier), and formatters. (Tailwind, ESLint configured by `create-next-app`; Prettier added and configured)
- [ ] Connect repository to hosting provider (Netlify, Vercel) for CI/CD. (Future Step)
- Set up local development environment (`npm install`, `npm run dev`). (Done)

## 2. Frontend Development (Component-Based)

- **Structure:** Organize code logically (e.g., `src/components`, `src/layouts`, `src/pages`, `src/styles`, `src/assets`). (`components` dir created)
- **Develop Reusable Components:** Based on mockups and style guide, create reusable UI components:
  - Header (with responsive navigation) (Basic version created)
  - Footer (Basic version created)
  - Buttons (Primary, Secondary)
  - Cards (for services, packages, blog posts)
  - Form elements (Input, Textarea, Select - if needed)
  - Hero sections (Placeholder structure on homepage)
  - Icon components
  - [ ] Accordion/Tabs (if needed for complex content)
- **Develop Layouts:** Create base page layouts (e.g., default page, blog post layout) that components will populate. (Root layout `app/layout.tsx` created)
- **Build Pages:** Assemble pages using layouts and components, populating with content (initially placeholder, then final).
  - Homepage (`app/page.tsx`) structure created.
  - Services page (`app/services/page.tsx`) structure created.
  - About page (`app/about/page.tsx`) structure created.
  - Contact page (`app/contact/page.tsx`) structure created.
  - Privacy Policy / Terms pages.
  - Implement responsive adaptations using media queries (or utility classes like Tailwind). _(Homepage, Services, About, Contact reviewed)_.
  - Ensure semantic HTML structure. _(Homepage, Services, About, Contact reviewed)_.
  - Implement basic animations/transitions subtly for polish (CSS-based preferred). _(Hover effects added)_.

## 3. Content Integration

- Integrate actual page content provided by the client/copywriter (referencing `02_Information_Architecture_and_Content.md`, `01_Landing_Page_Strategy.md`, `02_Landing_Page_Content_Sections.md`). _(Homepage, Services, About, Contact pages structured/aligned - Further content TBD)_.
- For SSGs, content might come from Markdown files, data files (JSON, YAML), or a headless CMS (optional). _(Implemented data file for services)_.
- Ensure content flows correctly within responsive layouts. _(Homepage, Services, About, Contact reviewed)_.

## 4. Backend / Serverless Functions (If Needed)

- **Contact Form:** _(Implemented via Server Action)_.
  - [N/A] Implement using hosting provider's built-in form handling OR
  - Create a serverless function to process form data. _(Using Server Action)_.
- **Calculator Authentication:**
  - Implement serverless functions (`/api/login`, `/api/check-auth`, `/api/logout`) as detailed in `08_Implementation_Calculator_Page_Login_Form.md`.
- **Customer Estimate Feature:** _(Email template TBD)_.
  - Implement serverless function (`sendConsultancyEstimateEmail`) as detailed in `09_Customer_Pricing_Estimate_Feature.md`. _(Implemented via Server Action)_.
- [ ] **Other Dynamic Needs:** Define and implement any other minor dynamic functionalities if required.

## 5. Integrations

- **Analytics:** Integrate analytics tracking code. _(Placeholder added - Requires Follow Up)_.
- **Other:** Integrate any other required third-party scripts. _(None identified yet)_.

## 6. Accessibility Implementation

- Continuously check for accessibility during development:
  - Use semantic HTML. _(Initial review complete)_.
  - Ensure keyboard navigability and visible focus states. _(Requires thorough testing - Handled in QA Phase)_.
  - Add appropriate ARIA attributes. _(Minimal needed currently, review as components evolve - Check in QA Phase)_.
  - Test color contrast. _(Check theme colors - Check in QA Phase)_.
  - Provide text alternatives for images (`alt` text). _(Add for future images - Check in QA Phase)_.
  - Run automated checks. _(Recommended periodically - Perform in QA Phase)_.

## 7. SEO Implementation

- Programmatically generate correct `<title>` tags and `<meta name="description">` for each page based on content. (Basic metadata added to layout and pages)
- Generate `sitemap.xml` during the build process.
- Configure `robots.txt`.
- Implement Open Graph / Twitter Card meta tags.
- Add basic Schema.org markup (Organization, Service).

## 8. QA Testing & Launch Prep

- Perform QA testing based on `05_Testing_Deployment_Launch.md`.
- Address items in the Pre-Launch Checklist from `05_Testing_Deployment_Launch.md`.
- [TODO] Prepare for launch.
