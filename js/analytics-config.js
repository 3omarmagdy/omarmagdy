/* ==========================================================================
   ANALYTICS CONFIGURATION — single place to plug in real IDs.
   Nothing loads until you fill in an ID below with your real value.
   Loaded with `defer` from every page, after all critical content.
   ========================================================================== */

window.OMAR_ANALYTICS_CONFIG = {
  GA4_MEASUREMENT_ID: '',      // e.g. 'G-XXXXXXXXXX'  — Google Analytics 4
  GTM_CONTAINER_ID: '',        // e.g. 'GTM-XXXXXXX'    — Google Tag Manager
  CLARITY_PROJECT_ID: '',      // e.g. 'abcd1234ef'     — Microsoft Clarity
  META_PIXEL_ID: '909844348052988'  // e.g. '1234567890123'  — Meta (Facebook) Pixel
};

(function loadAnalytics(cfg) {
  // Google Tag Manager
  if (cfg.GTM_CONTAINER_ID) {
    (function (w, d, s, l, i) {
      w[l] = w[l] || [];
      w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
      var f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l !== 'dataLayer' ? '&l=' + l : '';
      j.async = true;
      j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
      f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', cfg.GTM_CONTAINER_ID);
  }

  // Google Analytics 4 (only if GTM isn't already handling it)
  if (cfg.GA4_MEASUREMENT_ID && !cfg.GTM_CONTAINER_ID) {
    var gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + cfg.GA4_MEASUREMENT_ID;
    document.head.appendChild(gaScript);
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', cfg.GA4_MEASUREMENT_ID);
  }

  // Microsoft Clarity
  if (cfg.CLARITY_PROJECT_ID) {
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', cfg.CLARITY_PROJECT_ID);
  }

  // Meta Pixel
  if (cfg.META_PIXEL_ID) {
    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', cfg.META_PIXEL_ID);
    fbq('track', 'PageView');
  }
})(window.OMAR_ANALYTICS_CONFIG);

/* ==========================================================================
   EVENT TRACKING HELPER — safe to call even when META_PIXEL_ID is empty
   (fbq simply won't exist yet, so this becomes a harmless no-op).
   Usage from any page: window.omarTrackPixel('Lead');
   ========================================================================== */
window.omarTrackPixel = function (eventName, params) {
  if (typeof window.fbq === 'function') {
    window.fbq('track', eventName, params || {});
  }
};

/* Delegated click tracking: add data-track="Lead" | "Schedule" | "ViewContent"
   to any link/button across the site and it will fire automatically, once per
   click, with no extra wiring needed on each page. */
document.addEventListener('click', function (e) {
  const el = e.target.closest('[data-track]');
  if (!el) return;
  window.omarTrackPixel(el.getAttribute('data-track'));
}, { passive: true });
