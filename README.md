# Omar Growth Hub — Personal & Business Website

Live site: https://3omarmagdy.github.io/omarmagdy/

## Overview
Personal branding and lead-generation website for Omar Magdy (Media Buyer & Performance Marketing Specialist), including a results portfolio, a media buying course landing page, and client case-study pages. Hosted on GitHub Pages, no backend required.

## Pages
- `index.html` — main landing page (hero, services, results, about, contact form)
- `portfolio.html` — real Meta Ads campaign results by industry, testimonials, web project case studies
- `media-buying-course.html` — course landing page with registration form
- `dr-reda-sobhy/` — client sub-site
- `offline.html` — offline fallback page (used by the service worker)

## Technologies
- Static HTML / CSS / vanilla JavaScript (no build step, no framework)
- FormSubmit.co for contact/registration forms (no backend needed)
- Progressive Web App: `manifest.json`, `service-worker.js`, full icon set in `icons/`
- JSON-LD structured data (ProfessionalService, Person, WebSite, CollectionPage, Course, BreadcrumbList)

## Performance & PWA
- Service worker: network-first for HTML pages (always fresh content), cache-first for images/icons, with an offline fallback page
- Manifest with full icon set (16px–512px, maskable icon, Apple touch icon, Safari pinned tab, Windows tile)
- Removed a large embedded base64 image from the course page in favor of a shared, cacheable file (~110KB saved per load)
- `rel="noopener noreferrer"` on all external links
- `loading="lazy"` + explicit `width`/`height` on below-the-fold images to prevent layout shift

## Accessibility
- Skip-to-content link on every page
- `aria-label`, `aria-expanded`, `aria-controls` on the mobile menu toggle
- Visible `:focus-visible` outline on interactive elements
- `prefers-reduced-motion` respected: animations and smooth-scroll are disabled site-wide when the user has this OS/browser setting on

## SEO
- Per-page title, meta description, canonical URL, Open Graph, and Twitter Card tags
- `robots.txt` and `sitemap.xml` (includes `lastmod` dates)
- Structured data kept factual — no fabricated ratings/review counts

## Analytics (opt-in, not yet active)
All tracking lives in one file: `js/analytics-config.js`. Nothing loads until you fill in a real ID.

```js
window.OMAR_ANALYTICS_CONFIG = {
  GA4_MEASUREMENT_ID: '',      // Google Analytics 4
  GTM_CONTAINER_ID: '',        // Google Tag Manager
  CLARITY_PROJECT_ID: '',      // Microsoft Clarity
  META_PIXEL_ID: ''            // Meta Pixel
};
```
Fill in whichever IDs you use, commit, done — no other file needs to change.

## Deployment (GitHub Pages)
This repo is already configured for GitHub Pages at the `omarmagdy` project path. Any push to the default branch redeploys automatically. All asset paths are relative, so the site also works correctly if moved to a custom domain.

### Moving to a custom domain later
1. Add a `CNAME` file to the repo root containing your domain (e.g. `omargrowthhub.com`).
2. Point your domain's DNS at GitHub Pages (A records to GitHub's IPs, or a CNAME record to `3omarmagdy.github.io`).
3. Update the `canonical`, `og:url`, `sitemap.xml`, `robots.txt`, and `manifest.json` `start_url`/`scope` to the new domain.
4. Enable "Enforce HTTPS" in the repo's Pages settings once the custom domain is verified.

## Known manual follow-ups
- **Google Search Console**: add and verify the property, submit `sitemap.xml`.
- **Analytics IDs**: fill in `js/analytics-config.js` with real GA4/GTM/Clarity/Pixel IDs when ready.
- **Dr. Samar Elmalla project repo**: the portfolio case card links to the live Vercel deployment; add a GitHub repo link if/when one exists.
- Two client sub-sites (`dr-ahmed-nassar-landing`, `dr-reda-sobhy`) are hosted separately (GitHub Pages / Cloudflare Pages) and are outside this repo's optimization pass.

## Folder structure
```
/
├── index.html
├── portfolio.html
├── media-buying-course.html
├── manifest.json
├── service-worker.js
├── offline.html
├── browserconfig.xml
├── robots.txt
├── sitemap.xml
├── js/
│   └── analytics-config.js
├── icons/                  (favicons + PWA icon set)
├── images/                 (photos used across pages)
└── dr-reda-sobhy/           (client sub-site)
```
