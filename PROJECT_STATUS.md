# Project Status — fix-mobile-seo-accessibility-pixel

Branch: `fix-mobile-seo-accessibility-pixel` (based on `main` @ `96df2fb`)

## ✅ Completed in this pass

### 1. Critical bug fix — mobile blank screen
**Root cause:** the scroll-reveal script in `index.html` set `opacity:0` inline on
every `<section>` (including the hero) at load time, then relied solely on
`IntersectionObserver` to reveal it. On some mobile browsers (in-app webviews,
bfcache restores) the observer can fail to fire on first load, leaving the
entire page invisible except the off-screen skip link — explaining why
focusing/tapping the skip link (which forces a scroll/layout event) was the
only way content ever appeared.

**Fix (`index.html`):**
- The hero section is now fully excluded from the hide/reveal mechanism and
  always renders immediately, unconditionally.
- The reveal effect now only applies to individual below-the-fold cards
  (services/results/steps/testimonials/problems), never whole `<section>`
  wrappers — so nothing can blank the full page again.
- Respects `prefers-reduced-motion` (skips the animation entirely).
- Added a hard timeout (1.2s / 2s) + a `pageshow` listener that force-reveals
  every card regardless of whether `IntersectionObserver` ever fired.

### 2. Accessibility
- Mobile menu now traps `Tab` focus inside the panel, closes on `Escape`, and
  returns focus to the toggle button on close.
- Skip link, `:focus-visible` outlines, single `<h1>`, and heading hierarchy
  were already correct and are unchanged.

### 3. Meta Pixel event tracking (no ID required yet)
- `js/analytics-config.js` now exposes `window.omarTrackPixel(eventName)` —
  a safe no-op until a real Pixel ID is set (see below).
- A single delegated click listener fires tracking once per click for any
  element with `data-track="Lead" | "Schedule" | "ViewContent"`.
- Applied `data-track="Lead"` to all WhatsApp CTAs and the contact form's
  success handler; `data-track="ViewContent"` to portfolio links.
- No dedicated "booking" CTA exists on this homepage yet, so `Schedule` isn't
  wired anywhere here — add `data-track="Schedule"` to a real booking button
  if/when one is added (e.g. on a client sub-site).

### 4. New homepage sections (content — please review before publishing)
- **"مشاكل شائعة" (Common Problems)** — new section between Trust strip and
  Services. Four short, relatable pain points (no invented stats).
- **FAQ** — new section between Testimonials and the contact form. Six
  objection-handling questions specifically framed around the fear of being
  scammed by a media buyer, ending in a WhatsApp CTA.
  ⚠️ **Please double-check the specific claims in the FAQ answers match how
  you actually work** — particularly: running campaigns on the client's own
  Business Manager (not a middleman account), being able to start with a
  small test budget, and sending a first report within the first week. These
  were drafted as standard trustworthy practice to reassure a scam-wary
  owner, but I can't confirm they match your actual process — edit anything
  that doesn't.
- Both sections have full English translations wired into the existing
  AR/EN toggle dictionary.
- Sitemap `lastmod` bumped to today.

## 📌 Proposed section order (implemented for review, not yet reordered further)
Hero → Trust → **Problems (new)** → Services → Results → How I Work → About →
Testimonials → **FAQ (new)** → Contact/Final CTA → Footer

This matches the requested conversion sequence. The two new sections were
inserted in place; no existing sections were removed, reordered, or rewritten.

## 🔜 Not yet done in this pass
- Reordering/rewriting existing sections (About, Services, Results, How I
  Work) for conversion-focused copy — flagged separately, pending your
  go-ahead on tone/claims.
- Same audit/fixes applied to `portfolio.html`, `media-buying-course.html`,
  and the client sub-sites (`dr-reda-sobhy/`, `dr-ahmed-nassar-landing`,
  `dr-samar-almulla`) — outside this pass's scope (homepage only).
- Full Lighthouse/PageSpeed pass, image compression audit, and Google Search
  Console verification.

## How to add your Meta Pixel ID (safe, no code changes needed)
1. Open `js/analytics-config.js`.
2. Paste your ID into `META_PIXEL_ID: ''` (e.g. `META_PIXEL_ID: '1234567890123'`).
3. Commit and push. That's it — the Pixel base code, PageView, and all
   Lead/ViewContent event hooks activate automatically. Nothing loads before
   this ID is set.
4. Do the same for `GA4_MEASUREMENT_ID`, `GTM_CONTAINER_ID`, or
   `CLARITY_PROJECT_ID` if you use them.

## Manual follow-ups
- Google Search Console: verify the property, submit `sitemap.xml`.

---

## Update — merged to `main` and content/conversion audit (2026-07-07)

### Merged
PR #1 was reviewed and merged into `main` via squash merge (commit `a391b89`).
The mobile blank-screen fix, accessibility fixes, Meta Pixel hooks, and
Problems/FAQ sections are now **live** on the production site.

### FAQ claims — confirmed accurate
Owner confirmed both flagged claims are accurate as written:
- Campaigns run on the client's own Business Manager (not a middleman account)
- First performance report within the first week

No copy changes were needed here.

### Content/structure audit result
Reviewed the homepage against the requested conversion sequence (hero → trust
→ problems → services → results → how-I-work → about → testimonials → FAQ →
contact). **The existing content already matches this structure closely** —
this was implemented well in the previous pass, including specific CTAs
(e.g. "اطلب مراجعة لحساب الإعلانات بتاعك" instead of generic "تواصل معي"),
real un-inflated result numbers, and real testimonials only. No section
reordering or copy rewrite was needed.

One additional claim was checked: `portfolio.html`'s meta description states
"أكتر من 50 مشروع ناجح." Owner confirmed this is accurate — left as-is.

### New: floating WhatsApp button
The original brief asked for a floating WhatsApp button, but none existed
anywhere on the site (only inline links). Added one to `index.html`,
`portfolio.html`, and `media-buying-course.html`:
- Bottom-corner, brand-colored (#25D366), 56px (50px on ≤480px) circular
  tap target — meets the 44px minimum touch-size requirement.
- Respects `env(safe-area-inset-bottom)` for notched devices.
- On the homepage only: auto-hides via `IntersectionObserver` while the
  contact/lead form is in view, so it can never sit on top of the submit
  button — directly satisfies the "WhatsApp button never covers form
  controls" requirement.
- Wired into the existing `data-track="Lead"` Meta Pixel hook — fires
  correctly once a Pixel ID is set.
- Committed and pushed directly to `main` (commit `ba5c357`) since this was
  a small, low-risk, additive change with no open questions.

### Files changed this pass
- `index.html` — wa-float CSS, button markup, show/hide script
- `portfolio.html` — wa-float CSS, button markup
- `media-buying-course.html` — wa-float CSS, button markup
- `PROJECT_STATUS.md` — this update

### Not yet done (unchanged from previous pass)
- Reordering/rewriting existing sections (not needed — see above)
- Same technical/accessibility audit pass applied to the client sub-sites
  (`dr-reda-sobhy/`, and the standalone `dr-samar-almulla-website (1).html`
  file, which isn't linked from the main site or sitemap)
- Full Lighthouse/PageSpeed performance pass and image compression audit
- Google Search Console verification (requires site owner's Google account)

### Security note
This pass was executed using a **Classic** personal access token (broader
scope than a fine-grained one restricted to this repo). Please revoke it now
from GitHub → Settings → Developer settings → Personal access tokens, since
its job here is done.
