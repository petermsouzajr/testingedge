# Configuration Guide: Updating Placeholders

This guide explains where to update placeholder values added during the setup of SEO metadata, sitemaps, and other configurations.

## Update Placeholder Values

**Why:** This ensures your sitemap, robots file, SEO metadata (Open Graph, Twitter Cards), and Schema information point to the correct live domain and represent your brand accurately.

**Where to Update:**

1.  **`public/robots.txt`**

    - **What:** Update the `Sitemap:` URL.
    - **How:** Replace `https://www.yourdomain.com` with your actual production website URL.

2.  **`app/sitemap.ts`**

    - **What:** Update the base URL used for generating sitemap links.
    - **How:**
      - **Option A (Recommended):** Set the `NEXT_PUBLIC_BASE_URL` environment variable in your deployment environment (e.g., Vercel, Netlify Settings) to your full production URL (e.g., `https://www.yourdomain.com`).
      - **Option B (Alternative):** If you don't use environment variables, directly replace `https://www.yourdomain.com` in the `BASE_URL` constant within the `app/sitemap.ts` file.

3.  **`src/app/layout.tsx`**
    - **What:** Update base URL, Twitter handle, and Organization Schema details used for metadata.
    - **How:**
      - **`BASE_URL` Constant:** Ensure this uses the `NEXT_PUBLIC_BASE_URL` environment variable (like `sitemap.ts`) or update the placeholder `https://www.yourdomain.com` if not using environment variables.
      - **`TWITTER_HANDLE` Constant:** Replace `@YourTwitterHandle` with your actual Twitter handle (including the `@`).
      - **`organizationSchema` Object:** Update the `name`, `url`, and `logo` properties with your actual organization name, production URL, and the correct path to your logo image (e.g., `/images/logo.png`). Optionally, add `contactPoint` and `sameAs` (social media links) details.

**Remember to also:**

- Create the actual image files referenced in `src/app/layout.tsx` (e.g., `public/images/og-image.png`, `public/images/logo.png`).
- Configure and uncomment your chosen analytics script in `src/app/layout.tsx`.
- Set up dependency monitoring (e.g., Dependabot in GitHub settings).
- Refine the Content Security Policy in `next.config.mjs` after adding analytics or other third-party scripts.
