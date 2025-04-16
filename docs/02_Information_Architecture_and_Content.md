# 02: Information Architecture and Content - Testing for Hire Website

## 1. Sitemap

```
/ (Homepage)
├── /services/
│   ├── /services/core-quality-suite/ (Package Detail)
│   ├── /services/comprehensive-testing-bundle/ (Package Detail)
│   ├── /services/accessibility-assurance/ (Package Detail)
│   ├── /services/performance-load-optimization/ (Package Detail)
│   └── /services/enterprise-compliance-add-on/ (Package Detail / Section)
├── /specializations/ (Overview of Tools/Areas)
│   ├── /specializations/cypress-testing/
│   ├── /specializations/playwright-testing/
│   ├── /specializations/jest-vitest-testing/
│   ├── /specializations/test-documentation/ (TestRail, How-To, GWT)
│   ├── /specializations/accessibility-testing/ (WCAG)
│   ├── /specializations/performance-load-testing/
│   └── /specializations/soc2-compliance-support/
├── /about/ (Experience, Approach, Values)
├── /portfolio/ (Optional - Case Studies/Examples - Anonymized)
├── /blog/ (Optional - For thought leadership, SEO)
│   └── /blog/{slug}/
├── /contact/ (Contact Form, Email, Phone?)
├── /privacy-policy/
└── /terms-of-service/ (If applicable)
```

## 2. Content Strategy

- **Tone of Voice:** Professional, confident, expert, reliable, clear, outcome-focused. Avoid jargon where possible, but use technical terms accurately when describing services.
- **Key Messaging:**
  - Focus on solving client problems (reducing bugs, meeting compliance, enabling teams).
  - Highlight the value of 10+ years of experience and niche expertise (especially Cypress).
  - Emphasize measurable outcomes and deliverables (80% coverage, specific documentation types).
  - Clearly differentiate the packages and their target use cases.
  - Build trust through transparency (clear pricing philosophy, process explanations).
- **Calls to Action (CTAs):** Use clear, action-oriented CTAs throughout the site (e.g., "Request a Consultation," "Discuss Your Project," "Learn More About [Package Name]," "Get a Quote").

## 3. Page Content Requirements

- **Homepage (`/`)**: (See also `01_Landing_Page_Strategy.md` and `02_Landing_Page_Content_Sections.md` for detailed landing page planning)
  - Compelling headline summarizing the core value proposition.
  - Brief intro to the consultancy and expertise.
  - Overview of key service areas/packages with links.
  - Highlight key differentiators.
  - Testimonials (if available) or logos.
  - Clear primary CTA.
- **Services Overview (`/services/`)**: (Consider integrating package details directly or ensuring clear navigation)
  - Introduction to the packaged service offerings.
  - Brief summary of each package (Core, Comprehensive, Accessibility, Performance) with links to detail pages/sections.
  - Mention the Enterprise Compliance Add-On.
  - Visual comparison table (optional but helpful).
  - CTA to discuss specific needs.
- **Package Detail Pages/Sections (`/services/{package-name}/`)**: (Can be individual pages or sections on the main services page)
  - Clear Package Name.
  - Detailed Description (from provided text).
  - List of Components Included.
  - "Best For" section (target client/scenario).
  - Estimated Pricing: Indicate that pricing is tailored based on scope (e.g., "Pricing based on project scope - Request a Consultation"). Refer internally to `07_Business_Model_Pricing_Strategy.md` for calculation logic.
  - Estimated Duration: Indicate duration is scope-dependent (e.g., "Typically 2-3 months for standard scope").
  - Rationale/Value Proposition for this package.
  - Relevant CTAs (e.g., "Inquire About This Package").
- **Specializations Overview (`/specializations/`)**: (Could be combined with Services or About, or kept separate)
  - Brief overview of the core technical skills and focus areas.
  - Mention that specialized services like Accessibility, Performance, and SOC2 Prep are offered in tiers (e.g., Tier 1, Tier 2) to match different needs.
  - Links to individual specialization pages/sections.
- **Specialization Detail Pages/Sections (`/specializations/{area}/`)**: (Can be individual pages or sections)
  - Detailed explanation of the specific service/tool (e.g., Cypress Testing, WCAG Compliance).
  - If applicable (Accessibility, Performance, SOC2), briefly describe the difference between Tier 1 and Tier 2 offerings (details in `07_Business_Model_Pricing_Strategy.md`).
  - Approach and methodology (e.g., 80% coverage goal for Cypress).
  - Benefits for the client.
  - How it integrates with packages.
  - Relevant tools mentioned (Cypress, Playwright, Jest, Vitest, TestRail, k6, axe-core).
- **About (`/about/`)**:
  - Founder's background/experience (10+ years).
  - Consultancy's mission/values (reliability, quality, clear communication).
  - Approach to testing and client collaboration.
  - Mention key achievements or philosophies (e.g., Cypress Ambassador mention, focus on reusable assets).
- **Portfolio (`/portfolio/`)**: (Optional, build later if needed)
  - Anonymized case studies or project examples.
  - Problem -> Solution -> Outcome format.
  - Highlight specific tools used and results achieved.
- **Blog (`/blog/`)**: (Optional, build later if needed)
  - Articles on testing best practices, tool comparisons, industry trends.
  - Good for SEO and establishing thought leadership.
- **Contact (`/contact/`)**:
  - Contact form (Name, Email, Company, Message, Service Interest?).
  - Direct email address.
  - Optional: Phone number, LinkedIn profile link.
  - Brief statement on response time expectations.
- **Privacy Policy / Terms (`/privacy-policy/`, `/terms-of-service/`)**: Standard legal pages. Use a generator or consult legal counsel.
- **Calculator (`/calculator`)**: (See `08_Implementation_Calculator_Page_Login_Form.md`)
  - Page requiring authentication to view specific internal tool (likely related to pricing estimation based on `07_Business_Model_Pricing_Strategy.md`).

## 4. Content Sourcing

- Initial content will be adapted from the business plan (`07_Business_Model_Pricing_Strategy.md`), landing page documents (`01*`, `02*`), and calculator plan (`08*`).
- Client (Consultancy Owner) to review, refine, and provide additional details (e.g., specific portfolio examples, About section narrative).
- Images/graphics need to be sourced (stock photos, custom graphics).
